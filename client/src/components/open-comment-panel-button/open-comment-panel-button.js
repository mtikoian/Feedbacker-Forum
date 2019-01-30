import React from 'react'
// Helpers
import InlineSVG from 'svg-inline-react'
import classNames from 'classnames/bind'

// Styles
import styles from './open-comment-panel-button.scss'

const css = classNames.bind(styles)

const OpenCommentPanelButton = ({ hidden, onClick }) => (
  <button
    type="button"
    className={css('open-button', { hidden })}
    onClick={onClick}
    data-introduction-step="4"
  >Show comments
  </button>
)

export default OpenCommentPanelButton
