import React from 'react'
import classNames from 'classnames/bind'
import apiCall from '../../api-call'
import styles from './sign-in-slack.scss'

const css = classNames.bind(styles)

const startOauth = async () => {
  const { url } = await apiCall('POST', '/slack/oauth/connect')
  window.location.replace(url)
}

const SlackSignButton = () => (
  <button
    onClick={startOauth}
    type="button"
    className={css('slack-sign-button')}
  >
    <img
      src="/slack/sign_in_with_slack.png"
      alt="Sign in with Slack"
    />
  </button>
)

export default SlackSignButton
