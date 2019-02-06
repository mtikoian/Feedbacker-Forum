import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
// Helpers
import InlineSVG from 'svg-inline-react'
import classNames from 'classnames/bind'
import { shadowDocument } from '../../shadowDomHelper'
import * as DomTagging from '../../dom-tagging'
import { loadComments } from '../../actions'
import UsernameModal from '../add-username-modal/add-username-modal'

// Components
import Comment from '../comment/comment'
import apiCall from '../../api-call'
// Styles
import commentPanelStyles from './comment-panel.scss'
// Assets
import CloseIcon from '../../assets/svg/baseline-close-24px.svg'



const css = classNames.bind(commentPanelStyles)

const mapStateToProps = state => ({
  comments: state.comments,
  users: (state.persist || {}).users || {},
  role: state.role,
})

class CommentPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      usernameModalIsOpen: false,
      value: '',
      isHidden: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.toggleUsernameModal = this.toggleUsernameModal.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.fetchComments = this.fetchComments.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  async handleSubmit(event) {
    event.preventDefault()
    event.nativeEvent.stopImmediatePropagation()

    const getBlob = () => {
      const xPath = this.props.taggedElementXPath
      if (xPath) {
        return { xPath }
      }
      return {}
    }

    const unhighlightTaggedElement = () => {
      const { xPath } = getBlob()
      if (xPath) DomTagging.toggleHighlightElement(DomTagging.getElementByXPath(xPath))
    }

    await apiCall('POST', '/comments', {
      text: this.state.value,
      blob: getBlob(),
    })

    unhighlightTaggedElement()
    this.props.unsetTaggedElement()
    this.setState({ value: '' })

    if (!this.props.users.name) {
      await this.toggleUsernameModal()
    } else {
      await this.fetchComments()
    }
  }

  async toggleUsernameModal() {
    if (this.state.usernameModalIsOpen) await this.fetchComments()
    this.setState(prevState => ({ usernameModalIsOpen: !prevState.usernameModalIsOpen }))
  }

  handleClick() {
    this.setState(state => ({
      isHidden: !state.isHidden,
    }))
  }

  async fetchComments() {
    const comments = await apiCall('GET', '/comments')
    this.props.dispatch(loadComments(comments))
    this.scrollToBottom()
  }

  scrollToBottom() {
    const el = shadowDocument().getElementById('comment-container')
    if (el) el.scrollTop = el.scrollHeight
  }

  commentContainer() {
    if (R.isEmpty(this.props.comments)) return (<p>No comments fetched.</p>)
    const { role } = this.props
    const sortByTime = R.sortBy(arr => arr[1].time)
    const sortedCommentArray = sortByTime(R.toPairs(this.props.comments))
    return (
      <div className={css('comment-container')} id="comment-container">
        {
          R.map(
            ([id, comment]) => (
              <Comment
                key={id}
                comment={comment}
                id={id}
                role={role}
              />),
            sortedCommentArray
          )
        }
      </div>
    )
  }

  render() {
    return (
      <div className={css('panel-container', 'comment-panel', { hidden: this.state.isHidden })}>
        <div className={css('panel-header')}>
          <h5 className={css('heading')}>Comments</h5>
          <button
            type="button"
            className={css('close-button')}
            onClick={this.handleClick}
          >
            <InlineSVG src={CloseIcon} />
          </button>
        </div>
        <div className={css('panel-body')}>
          { this.commentContainer() }
          <form className={css('comment-form')} onSubmit={this.handleSubmit}>
            <textarea
              value={this.state.value}
              onChange={this.handleChange}
              placeholder="Write comment..."
            />
            <input className={css('submit-comment')} type="submit" value="Comment" />
          </form>
          {!this.props.users.name
            ? (
              <UsernameModal
                isOpen={this.state.usernameModalIsOpen}
                toggle={this.toggleUsernameModal}
              />
            )
            : null}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(CommentPanel)
