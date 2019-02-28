import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Toggle from 'react-toggle'

function getField({ fieldType, input, type, placeholder, disabled, options }) {
  if (fieldType === 'date') {
    return (
      <DatePicker
        className="br2 pa2 input-reset ba bg-transparent w-100 f6"
        placeholderText={placeholder}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        selected={input.value ? moment(input.value) : ''}
        maxDate={moment()}
        {...input}
      />
    )
  }
  if (fieldType === 'boolean') {
    return <Toggle {...input} defaultChecked={input.value} disabled={disabled} />
  }
  if (fieldType === 'select') {
    return <select {...input}>{renderOptions(options)}</select>
  }
  return (
    <input
      {...input}
      placeholder={placeholder}
      type={type}
      className="br2 pa2 input-reset ba bg-transparent w-100 f6"
    />
  )
}

const renderOptions = options => {
  if (options) {
    return options.map(option => (
      <option key={option.value} value={option.value}>
        {option.name}
      </option>
    ))
  }

  return []
}

export default function FormField(props) {
  const {
    label,
    meta: { touched, error, warning },
  } = props
  return (
    <div className="mb3">
      <label className="db fw6 lh-copy f6">
        {label}{' '}
        {touched &&
          ((error && <span className="red">{error}</span>) || (warning && <span>{warning}</span>))}
      </label>
      <div>{getField(props)}</div>
    </div>
  )
}
