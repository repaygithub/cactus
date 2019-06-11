import { Link as GatsbyLink } from 'gatsby'
import { Link as RepayLink } from '@repay/cactus-web'

const Link = RepayLink.withComponent(GatsbyLink)

export default Link
