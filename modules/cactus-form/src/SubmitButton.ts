import { Button } from '@repay/cactus-web'
import { formSubscriptionItems } from 'final-form'
import React from 'react'

import FormSpy from './FormSpy'

export default FormSpy.withDefaults({
  component: (props) => {
    const propsCopy = { ...props }
    delete propsCopy.form
    formSubscriptionItems.forEach((sub) => {
      delete propsCopy[sub]
    })
    return React.createElement(Button, propsCopy)
  },
  type: 'submit',
  variant: 'action',
  children: 'Submit',
  subscription: { hasValidationErrors: true, submitting: true, pristine: true },
  processState: (props, state) => {
    props.disabled = state.hasValidationErrors || state.pristine
    props.loading = state.submitting
  },
})
