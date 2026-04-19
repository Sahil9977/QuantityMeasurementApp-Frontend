import { useState, useEffect } from 'react'
import { units, operations } from '../data/units.js'
import { quantityAPI } from '../services/api.js'

function MeasurementCalculator({ category }) {
  const [operation, setOperation] = useState('convert')
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [unit1, setUnit1] = useState('')
  const [unit2, setUnit2] = useState('')
  const [targetUnit, setTargetUnit] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categoryUnits = units[category] || []

  useEffect(() => {
    if (categoryUnits.length > 0) {
      setUnit1(categoryUnits[0].id)
      setUnit2(categoryUnits[0].id)
      setTargetUnit(categoryUnits.length > 1 ? categoryUnits[1].id : categoryUnits[0].id)
    }
    setResult(null)
    setValue1('')
    setValue2('')
    setError('')
  }, [category])

  const getUnitSymbol = (unitId) => {
    const unit = categoryUnits.find(u => u.id === unitId)
    return unit ? unit.symbol : ''
  }

  const calculateLocally = () => {
    const v1 = parseFloat(value1)
    const v2 = parseFloat(value2)

    switch (operation) {
      case 'convert':
        return {
          type: 'convert',
          value: convertValue(v1, unit1, targetUnit, category),
          fromUnit: getUnitSymbol(unit1),
          toUnit: getUnitSymbol(targetUnit),
        }
      case 'add': {
        const base1 = convertToBase(v1, unit1, category)
        const base2 = convertToBase(v2, unit2, category)
        const resultBase = base1 + base2
        return {
          type: 'add',
          value: convertFromBase(resultBase, unit1, category),
          unit: getUnitSymbol(unit1),
        }
      }
      case 'subtract': {
        const base1 = convertToBase(v1, unit1, category)
        const base2 = convertToBase(v2, unit2, category)
        const resultBase = base1 - base2
        return {
          type: 'subtract',
          value: convertFromBase(resultBase, unit1, category),
          unit: getUnitSymbol(unit1),
        }
      }
      case 'divide': {
        const base1 = convertToBase(v1, unit1, category)
        const base2 = convertToBase(v2, unit2, category)
        if (base2 === 0) throw new Error('Cannot divide by zero')
        return {
          type: 'divide',
          value: base1 / base2,
          unit: 'ratio',
        }
      }
      case 'compare': {
        const base1 = convertToBase(v1, unit1, category)
        const base2 = convertToBase(v2, unit2, category)
        let comparison
        if (base1 > base2) comparison = 'greater'
        else if (base1 < base2) comparison = 'less'
        else comparison = 'equal'
        return {
          type: 'compare',
          comparison,
          value1: v1,
          unit1: getUnitSymbol(unit1),
          value2: v2,
          unit2: getUnitSymbol(unit2),
        }
      }
      default:
        throw new Error('Unknown operation')
    }
  }

  // Converts backend QuantityMeasurementDTO → local result format used by formatResult()
  const normalizeApiResult = (apiResult) => {
    if (apiResult.error) {
      throw new Error(apiResult.errorMessage || 'Calculation failed')
    }
    if (operation === 'convert') {
      return {
        type: 'convert',
        value: apiResult.resultValue,
        fromUnit: getUnitSymbol(unit1),
        toUnit: getUnitSymbol(targetUnit),
      }
    }
    if (operation === 'compare') {
      const s = apiResult.resultString || ''
      let comparison = 'equal'
      if (s.toLowerCase().includes('greater')) comparison = 'greater'
      else if (s.toLowerCase().includes('less')) comparison = 'less'
      return {
        type: 'compare',
        comparison,
        value1: parseFloat(value1),
        unit1: getUnitSymbol(unit1),
        value2: parseFloat(value2),
        unit2: getUnitSymbol(unit2),
      }
    }
    return {
      type: operation,
      value: apiResult.resultValue,
      unit: getUnitSymbol(unit1),
    }
  }

  const handleCalculate = async () => {
    setError('')
    setResult(null)
    setLoading(true)

    try {
      let apiResult
      const quantity1 = { value: parseFloat(value1), unit: unit1, type: category }
      const quantity2 = { value: parseFloat(value2), unit: unit2, type: category }

      switch (operation) {
        case 'convert':
          apiResult = await quantityAPI.convert(quantity1, targetUnit)
          break
        case 'add':
          apiResult = await quantityAPI.add(quantity1, quantity2)
          break
        case 'subtract':
          apiResult = await quantityAPI.subtract(quantity1, quantity2)
          break
        case 'divide':
          apiResult = await quantityAPI.divide(quantity1, quantity2)
          break
        case 'compare':
          apiResult = await quantityAPI.compare(quantity1, quantity2)
          break
      }
      setResult(normalizeApiResult(apiResult))
    } catch (err) {
      setError(err.message || 'Calculation failed. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const needsSecondValue = ['add', 'subtract', 'divide', 'compare'].includes(operation)

  const getOperationIcon = (opId) => {
    const icons = {
      convert: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      add: <span className="text-lg font-bold">+</span>,
      subtract: <span className="text-lg font-bold">-</span>,
      divide: <span className="text-lg font-bold">/</span>,
      compare: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    }
    return icons[opId]
  }

  const formatResult = () => {
    if (!result) return null

    if (result.type === 'convert') {
      return (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm mb-2 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Conversion Result
          </p>
          <p className="text-4xl font-bold gradient-text mb-2">
            {result.value.toFixed(4)}
          </p>
          <p className="text-xl text-gray-300">{result.toUnit}</p>
          <div className="mt-4 inline-flex items-center gap-2 glass-light rounded-full px-4 py-2 text-sm text-gray-400">
            <span>{value1} {result.fromUnit}</span>
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span>{result.value.toFixed(4)} {result.toUnit}</span>
          </div>
        </div>
      )
    }

    if (result.type === 'compare') {
      const comparisonText = {
        greater: 'is greater than',
        less: 'is less than',
        equal: 'is equal to',
      }
      const comparisonIcon = {
        greater: '>',
        less: '<',
        equal: '=',
      }
      return (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm mb-4">Comparison Result</p>
          <div className="flex items-center justify-center gap-4">
            <div className="glass-light rounded-xl px-4 py-3">
              <p className="text-2xl font-bold text-white">{result.value1}</p>
              <p className="text-sm text-gray-400">{result.unit1}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-400">{comparisonIcon[result.comparison]}</span>
            </div>
            <div className="glass-light rounded-xl px-4 py-3">
              <p className="text-2xl font-bold text-white">{result.value2}</p>
              <p className="text-sm text-gray-400">{result.unit2}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-300">
            {result.value1} {result.unit1}{' '}
            <span className="text-primary-400 font-medium">{comparisonText[result.comparison]}</span>{' '}
            {result.value2} {result.unit2}
          </p>
        </div>
      )
    }

    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm mb-2">
          {operation.charAt(0).toUpperCase() + operation.slice(1)} Result
        </p>
        <p className="text-4xl font-bold gradient-text mb-2">
          {result.value.toFixed(4)}
        </p>
        <p className="text-xl text-gray-300">{result.unit}</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-3xl p-6 md:p-8 glow-sm">
      {/* Operation Selector */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Select Operation
        </label>
        <div className="flex flex-wrap gap-2">
          {operations.map((op) => (
            <button
              key={op.id}
              onClick={() => {
                setOperation(op.id)
                setResult(null)
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                operation === op.id
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white glow-sm'
                  : 'glass-light text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-dark-400'
              }`}
            >
              {getOperationIcon(op.id)}
              <span>{op.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* First Value */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {operation === 'convert' ? 'Value to Convert' : 'First Value'}
            </label>
            <div className="relative group">
              <input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                className="w-full bg-dark-700/50 border border-dark-500 text-white text-lg rounded-xl px-4 py-4 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 placeholder-gray-500"
                placeholder="Enter value"
              />
              {value1 && (
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <span className="text-sm text-primary-400 font-medium">{getUnitSymbol(unit1)}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {operation === 'convert' ? 'From Unit' : 'Unit'}
            </label>
            <div className="relative">
              <select
                value={unit1}
                onChange={(e) => setUnit1(e.target.value)}
                className="w-full bg-dark-700/50 border border-dark-500 text-white rounded-xl px-4 py-4 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 appearance-none cursor-pointer"
              >
                {categoryUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Second Value or Target Unit */}
        <div className="space-y-4">
          {needsSecondValue ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Second Value</label>
                <div className="relative">
                  <input
                    type="number"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    className="w-full bg-dark-700/50 border border-dark-500 text-white text-lg rounded-xl px-4 py-4 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 placeholder-gray-500"
                    placeholder="Enter value"
                  />
                  {value2 && (
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <span className="text-sm text-primary-400 font-medium">{getUnitSymbol(unit2)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Unit</label>
                <div className="relative">
                  <select
                    value={unit2}
                    onChange={(e) => setUnit2(e.target.value)}
                    className="w-full bg-dark-700/50 border border-dark-500 text-white rounded-xl px-4 py-4 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    {categoryUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Arrow indicator for conversion */}
              <div className="flex items-center justify-center h-[76px]">
                <div className="hidden lg:flex items-center gap-2 text-gray-500">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">To Unit</label>
                <div className="relative">
                  <select
                    value={targetUnit}
                    onChange={(e) => setTargetUnit(e.target.value)}
                    className="w-full bg-dark-700/50 border border-dark-500 text-white rounded-xl px-4 py-4 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    {categoryUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={loading || !value1 || (needsSecondValue && !value2)}
        className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl btn-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 transition-all duration-300"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Calculating...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Calculate
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mt-6 glass-light rounded-2xl p-6 border border-primary-500/20 animate-pulse-glow">
          {formatResult()}
        </div>
      )}
    </div>
  )
}

export default MeasurementCalculator
