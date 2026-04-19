const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

// Maps frontend category names → backend measurementType values
const categoryToMeasurementType = {
  temperature: 'TemperatureUnit',
  length:      'LengthUnit',
  weight:      'WeightUnit',
  volume:      'VolumeUnit',
}

// Builds a QuantityDTO the backend expects
// unit IDs in units.js are already uppercase enum values (FEET, KILOGRAM, etc.)
function makeQuantityDTO(value, unit, category) {
  return {
    value: parseFloat(value),
    unit: unit,  // already uppercase: FEET, INCHES, CELSIUS, etc.
    measurementType: categoryToMeasurementType[category] || category,
  }
}

// Auth APIs
export const authAPI = {
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  forgotPassword: (email) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, newPassword) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  googleLogin: () => {
    window.location.href = `/oauth2/authorization/google`
  },
}

// Quantity APIs
export const quantityAPI = {
  add: (quantity1, quantity2) =>
    apiRequest('/quantities/add', {
      method: 'POST',
      body: JSON.stringify({
        thisQuantityDTO: makeQuantityDTO(quantity1.value, quantity1.unit, quantity1.type),
        thatQuantityDTO: makeQuantityDTO(quantity2.value, quantity2.unit, quantity2.type),
      }),
    }),

  subtract: (quantity1, quantity2) =>
    apiRequest('/quantities/subtract', {
      method: 'POST',
      body: JSON.stringify({
        thisQuantityDTO: makeQuantityDTO(quantity1.value, quantity1.unit, quantity1.type),
        thatQuantityDTO: makeQuantityDTO(quantity2.value, quantity2.unit, quantity2.type),
      }),
    }),

  divide: (quantity1, quantity2) =>
    apiRequest('/quantities/divide', {
      method: 'POST',
      body: JSON.stringify({
        thisQuantityDTO: makeQuantityDTO(quantity1.value, quantity1.unit, quantity1.type),
        thatQuantityDTO: makeQuantityDTO(quantity2.value, quantity2.unit, quantity2.type),
      }),
    }),

  // Convert: thatQuantityDTO carries the target unit (value 0 is ignored by backend)
  convert: (quantity, targetUnit) =>
    apiRequest('/quantities/convert', {
      method: 'POST',
      body: JSON.stringify({
        thisQuantityDTO: makeQuantityDTO(quantity.value, quantity.unit, quantity.type),
        thatQuantityDTO: {
          value: 0,
          unit: targetUnit,  // already uppercase
          measurementType: categoryToMeasurementType[quantity.type] || quantity.type,
        },
      }),
    }),

  compare: (quantity1, quantity2) =>
    apiRequest('/quantities/compare', {
      method: 'POST',
      body: JSON.stringify({
        thisQuantityDTO: makeQuantityDTO(quantity1.value, quantity1.unit, quantity1.type),
        thatQuantityDTO: makeQuantityDTO(quantity2.value, quantity2.unit, quantity2.type),
      }),
    }),
}
