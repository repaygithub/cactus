import React from 'react'
import { Router } from '@reach/router'
import App from '../App'
import { Coffee, Snacks, Snack } from '../containers'

export default function getRoutes() {
  return (
    <Router>
      <App path="/" />
      <Coffee path="coffee" />
      <Snacks path="snacks" />
      <Snack path="snacks/:snack" />
    </Router>
  )
}
