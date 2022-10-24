import React from 'react'

export default function CurrencyRow(props) {
    const {
        currencyOptions
    } = props

  return (
    <div>
        <input type="number" />
        <select>
            {currencyOptions.map(option => (
                <option value={option.name}>{option.name}</option>
            ))}
        </select>
    </div>
  )
}
