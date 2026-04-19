// ⚠️ Unit IDs must exactly match backend enum values:
// LengthUnit:      FEET, INCHES, YARDS, CENTIMETRES
// WeightUnit:      KILOGRAM, GRAM, POUND
// VolumeUnit:      LITRE, MILLILITRE, GALLON
// TemperatureUnit: CELSIUS, FAHRENHEIT

export const categories = [
  { id: 'temperature', name: 'Temperature', icon: 'thermometer', units: 2 },
  { id: 'length',      name: 'Length',      icon: 'ruler',       units: 4 },
  { id: 'weight',      name: 'Weight',      icon: 'scale',       units: 3 },
  { id: 'volume',      name: 'Volume',      icon: 'beaker',      units: 3 },
]

export const units = {
  temperature: [
    { id: 'CELSIUS',    name: 'Celsius',    symbol: '°C' },
    { id: 'FAHRENHEIT', name: 'Fahrenheit', symbol: '°F' },
  ],
  length: [
    { id: 'FEET',        name: 'Feet',        symbol: 'ft' },
    { id: 'INCHES',      name: 'Inches',      symbol: 'in' },
    { id: 'YARDS',       name: 'Yards',       symbol: 'yd' },
    { id: 'CENTIMETRES', name: 'Centimetres', symbol: 'cm' },
  ],
  weight: [
    { id: 'KILOGRAM', name: 'Kilogram', symbol: 'kg' },
    { id: 'GRAM',     name: 'Gram',     symbol: 'g'  },
    { id: 'POUND',    name: 'Pound',    symbol: 'lb' },
  ],
  volume: [
    { id: 'LITRE',      name: 'Litre',      symbol: 'L'  },
    { id: 'MILLILITRE', name: 'Millilitre', symbol: 'mL' },
    { id: 'GALLON',     name: 'Gallon',     symbol: 'gal'},
  ],
}

export const operations = [
  { id: 'add',      name: 'Add',      symbol: '+' },
  { id: 'subtract', name: 'Subtract', symbol: '-' },
  { id: 'divide',   name: 'Divide',   symbol: '÷' },
  { id: 'convert',  name: 'Convert',  symbol: '→' },
  { id: 'compare',  name: 'Compare',  symbol: '≟' },
]
