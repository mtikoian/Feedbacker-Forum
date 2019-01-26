import React from 'react'

const Question = ({ question, current }) => (
  <div>
    <h1>QUESTION {current + 1}</h1>
    {question.text}
  </div>
)

export default Question
