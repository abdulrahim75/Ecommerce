import React from 'react'
import './input.css'


const Input = ({placeholder,required,onChange,value}) => {
  return (
    <div>
        <input onChange={onChange} value={value} placeholder={placeholder} required={required} className='ui_input'/>
    </div>
  )
}

export default Input;