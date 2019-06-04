import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'
import Link from './Link'
import React from 'react'
import styled from 'styled-components'

const ExperimentalLink = styled(Link)`
  text-decoration: none;
  background-size: 100% 0.5em;
  background-repeat: no-repeat;

  :link {
    background-image: linear-gradient(
      ${p => p.theme.colors.callToAction},
      ${p => p.theme.colors.callToAction}
    );
    background-position: left 0 bottom -40%;
  }

  :visited {
    color: ${p => p.theme.colors.base};
    background-image: linear-gradient(${p => p.theme.colors.base}, ${p => p.theme.colors.base});
    background-position: left 0 bottom -40%;
  }

  :hover {
    color: ${p => p.theme.colors.base};
    background-image: linear-gradient(${p => p.theme.colors.base}, ${p => p.theme.colors.base});
    background-position: left 0 bottom -40%;
  }

  :focus {
    color: ${p => p.theme.colors.base};
    background-image: linear-gradient(${p => p.theme.colors.base}, ${p => p.theme.colors.base});
    background-position: left 0 bottom -30%
    ::after {
      display: none;
    }
  }
`

storiesOf('Link', module)
  .add('Basic Usage', () => (
    <Link to={text('to', 'https://repaygithub.github.io/cactus/')}>
      {text('text', 'Click me!')}
    </Link>
  ))
  .add('Within a block of text', () => (
    <span>
      To review the cactus documentation site, click{' '}
      <Link to="https://repaygithub.github.io/cactus/">here</Link>.
    </span>
  ))
  .add('Multi-line link', () => (
    <span style={{ width: '375px' }}>
      To review the cactus documentation site,{' '}
      <Link to="https://repaygithub.github.io/cactus/">click here</Link>.
    </span>
  ))
  .add('Experimental Solution', () => (
    <ExperimentalLink to={text('to', 'https://repaygithub.github.io/cactus/')}>
      Click me!
    </ExperimentalLink>
  ))
