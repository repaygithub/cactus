import { Button } from '@repay/cactus-web'

import FormSpy from './FormSpy'

export default FormSpy.withDefaults({
  component: Button,
  type: 'submit',
  variant: 'action',
  children: 'Submit',
  subscription: { hasValidationErrors: true, submitting: true, pristine: true },
  processState: (props, state) => {
    props.disabled = props.disabled || state.hasValidationErrors || state.pristine
    props.loading = props.submitting || state.submitting
  },
})
