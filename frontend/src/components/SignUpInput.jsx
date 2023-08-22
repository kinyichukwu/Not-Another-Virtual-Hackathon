import React from 'react'

const SignUpInput = ({children, label, name, type, placeholder, value, onChange}) => {
  return (
    <div className="input--item">
        <label htmlFor={label}>{label}</label>
        <div>
          {children}
          <input 
          name={name}
          type={type} 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          />
        </div>
    </div>
  )
}

export default SignUpInput