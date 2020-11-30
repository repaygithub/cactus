import styled from 'styled-components'
import { margin, width } from 'styled-system'

import FieldWrapper from '../FieldWrapper/FieldWrapper'
import { border } from '../helpers/theme'
import StatusMessage from '../StatusMessage/StatusMessage'
import Tooltip from '../Tooltip/Tooltip'

// The `legend` is floated to get it to position the border correctly.
const Fieldset = styled(FieldWrapper)<{ disabled?: boolean }>`
  position: relative;
  border: 0;
  margin: 0;
  padding: 0;
  ${margin}
  ${width}

  legend {
    box-sizing: border-box;
    border-bottom: ${(p) => border(p.theme, 'currentcolor')};
    padding-left: 16px;
    width: 100%;
    float: left;
    + * {
      clear: both;
    }
    color: ${(p) => (p.disabled ? p.theme.colors.mediumGray : 'currentcolor')};
  }

  ${Tooltip} {
    position: absolute;
    right: 8px;
    top: 2px;
    font-size: 16px;
  }

  ${StatusMessage} {
    margin-top: 4px;
  }
`.withComponent('fieldset')

export default Fieldset
