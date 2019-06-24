import FileInput from '../FileInput'
import React from 'react'
import ReactDOM from 'react-dom'
import StyleProvider from '../../StyleProvider/StyleProvider'

const container = document.createElement('div')
container.className = 'app-root'
document.body.appendChild(container)

const TestApp = () => {
  return (
    <StyleProvider global>
      <FileInput
        className="test-input"
        name="test-input"
        accept={['.txt']}
        labels={{ delete: 'delete', retry: 'retry' }}
        width="300px"
      />
    </StyleProvider>
  )
}

ReactDOM.render(<TestApp />, container)
