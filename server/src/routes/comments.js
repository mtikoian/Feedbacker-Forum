/* eslint-disable camelcase */
import express from 'express'
import {
  getComments, getThreadComments, addComment, addThread, deleteComment
} from '../database'
import { uuid, attempt, reqContainer, reqUser } from './helpers'
import { catchErrors } from '../handlers'

const router = express.Router()

// @api GET /api/comments
// Retrieve all comments of the current container instance.
//
// returns JSON array of all comments grouped with reactions in database @json {
//     "1bd8052b": {
//         "id": "1bd8052b",
//         "time": "2018-11-14 16:35:27",
//         "text": "skrattia",
//         "userId": "da776df3",
//         "username": "jaba",
//         "threadId": "3blkj3ad",
//         "blob": "",
//         "reactions": [
//             {
//                 "id": "1ddb07c8",
//                 "time": "2019-01-16 16:43:21",
//                 "userId": "da776df3",
//                 "emoji": "🍑",
//                 "commentId": "1bd8052b"
//             }
//          ]
//     },
//     "cb38e8f6": {
//         "id": "cb38e8f6",
//         "time": "2018-11-14 17:10:42",
//         "text": "tröttistä",
//         "userId": "da776df3",
//         "username": "jaba",
//         "threadId": "3blkj3ad",
//         "blob": "",
//         "reactions": []
//     }
// }
router.get('/', catchErrors(async (req, res) => {
  const { container } = await reqContainer(req)
  const groupedComments = {}
  const comments = await getComments(container)
  for (const comment of comments) {
    let result = groupedComments[comment.comment_id]
    if (!result) {
      result = {
        id: comment.comment_id,
        time: comment.comment_time,
        text: comment.comment_text,
        userId: comment.comment_user_id,
        username: comment.username,
        threadId: comment.comment_thread_id,
        blob: JSON.parse(comment.comment_blob) || {},
        reactions: [],
      }
      groupedComments[comment.comment_id] = result
    }
    if (comment.reaction_id !== null) {
      const reaction = {
        id: comment.reaction_id,
        time: comment.reaction_time,
        userId: comment.reaction_user_id,
        emoji: comment.reaction_emoji,
        commentId: comment.comment_id,
      }
      result.reactions.push(reaction)
    }
  }
  res.send(groupedComments)
}))

// @api POST /api/comments
// Adds comment to the current container instance.
//
// Example body for a root comment @json {
//   "text": "minttua",
//   "blob": {"path": "/path/to/element"}
// }
// comments can be linked to a thread with @json {
//   "text": "minttua",
//   "threadId": "1234",
//   "blob": {"path": "/path/to/element"}
// }
//
// Returns `{ id, threadId }` of the new comment
router.post('/', catchErrors(async (req, res) => {
  const { text, blob } = req.body
  const { container } = await reqContainer(req)
  const { userId } = await reqUser(req)

  const threadId = req.body.threadId || await attempt(async () => {
    const threadId = uuid()
    await addThread({
      id: threadId, container,
    })
    return threadId
  })

  await attempt(async () => {
    const id = uuid()
    await addComment({
      id, text, userId, threadId, blob: JSON.stringify(blob),
    })
    res.json({ id, threadId })
  })
}))

// @api GET /api/comments/:threadId
// Get comments by `threadId`
//
// returns JSON array of all comments in thread
router.get('/:threadId', catchErrors(async (req, res) => {
  const { threadId } = req.params
  const threads = await getThreadComments(threadId)
  res.send(threads.map(r => ({
    id: r.id,
    containerID: r.container_id,
    blob: JSON.parse(r.blob || '{}'),
  })))
}))

// @api DELETE /api/comments
// Tries to delete a comment. Only successful if the userId of the comment is the same
// as the user trying to delete the comment, or if the user is a dev.
//
// Returns the numbers of rows affected,
// one if the comment was deleted and 0 if it was not successful.
//
// e.g. @json {
//   "delRows": 1
// }
router.delete('/', catchErrors(async (req, res) => {
  const { commentId, commentUser } = req.body
  const { users } = await reqUser(req)
  const { owner } = await reqContainer(req)
  let delRows = {}
  if (users.hasOwnProperty(owner)) {
    try {
      delRows = await deleteComment({
        commentId,
        userId: commentUser,
      })
    } catch (err) { /* ignore */ }
  } else {
    for (const userId in users) {
      if (users.hasOwnProperty(userId)) {
        try {
          delRows = await deleteComment({
            commentId,
            userId,
          })
        } catch (err) { /* ignore */
        }
      }
    }
  }
  res.json({ delRows })
}))

module.exports = router
