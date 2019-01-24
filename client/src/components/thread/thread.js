import React from 'react'

import classNames from 'classnames/bind'

import Comment from '../comment/comment'
import SubmitField from '../submit-field/submit-field'

import styles from './thread.scss'

const css = classNames.bind(styles)

class Thread extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isExpanded: false,
      buttonText: this.props.comments.length > 1 ? 'Expand' : 'Reply',
    }

    this.handleClick = this.handleClick.bind(this)
    this.expandedThread = this.expandedThread.bind(this)
  }

  handleClick() {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded,
      buttonText: prevState.isExpanded ? 'Reply' : 'Collapse',
    }))
    console.log('Expanding thread is expanded: ', this.state.isExpanded)
  }

  expandedThread() {
    if (!this.state.isExpanded) { return }
    const threadComments = this.props.comments.slice(1)
    return (
      <>
        {threadComments.map(
          comment => <Comment key={comment.id} comment={comment} id={comment.id} />,
        )}
        <SubmitField
          onSubmit={this.props.onSubmit}
          onChange={this.props.onChange}
        />
      </>
    )
  }

  render() {
    const comment = this.props.comments[0]
    const { buttonText } = this.state
    return (
      <div className={css('thread')}>
        <Comment key={comment.id} comment={comment} id={comment.id} />
        <button
          className={css('show-thread')}
          type="button"
          onClick={this.handleClick}
        >
          { buttonText }
        </button>
        { this.expandedThread() }
      </div>
    )
  }
}

export default Thread

