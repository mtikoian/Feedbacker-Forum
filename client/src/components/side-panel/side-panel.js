import React from 'react'
import { connect } from 'react-redux'
import InlineSVG from 'svg-inline-react'
import classNames from 'classnames/bind'
import styles from './side-panel.scss'
import CloseIcon from '../../assets/svg/baseline-close-24px.svg'

const css = classNames.bind(styles)

const mapStateToProps = (state) => {
  const users = (state.persist || {}).users || {}
  const userKeys = Object.keys(users)
  let publicKey = ''
  if (userKeys.length >= 1) {
    publicKey = userKeys[0]
  }
  return {
    userPublic: publicKey,
  }
}

class SidePanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      isHidden: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({ value: '' })
    if (!this.props.userPublic) {
      console.error('User not found')
      return
    }

    fetch('/api/comments', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        text: this.state.value,
        userId: this.props.userPublic,
        container: '',
      }),
    })
  }

  handleClick() {
    this.setState(state => ({
      isHidden: !state.isHidden,
    }))
  }

  render() {
    return (
      <div className={this.state.isHidden ? css('side-panel', 'hidden') : css('side-panel')}>
        <div className={css('top')}>
          <button
            type="button"
            className={css('close-button')}
            onClick={this.handleClick}
          >
            <InlineSVG src={CloseIcon} />
          </button>
        </div>
          <form className={css('commment-form')} onSubmit={this.handleSubmit}>
            <textarea value={this.state.value} onChange={this.handleChange} />
            <input type="submit" value="Comment" />
          </form>
      </div>
    )
  }
}

export default connect(mapStateToProps)(SidePanel)
