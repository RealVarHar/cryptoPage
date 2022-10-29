export default function CurrencyRow(props) {
    const {
        currencyOptions
    } = props

  return (
    <div>
        <input type="number" />
        <select>
            {currencyOptions.map(option => (
                <option key={option.name} value={option.name}>{option.name}</option>
            ))}
        </select>
    </div>
  )
}