/**
 * Super simple omit instead of adding lodash or rambda etc.
 *
 * @param {string | number} keyToOmit
 * @returns {(data: {[key: string]: unknown}) => {[key: string]: unknown}}
 */
export const omit = (keyToOmit) => (data) => {
  const result = {}
  const omitKey = keyToOmit.toString()

  Object.keys(data).forEach(key => {
    if (key !== omitKey) {
      result[key] = data[key]
    }
  })

  return result
}

/**
 *
 * @param {string | number} key
 * @param {unknown} value
 * @returns {(data: {[key: string]: unknown}) => {[key: string]: unknown}}
 */
export const add = (key, value) => (data) => ({ ...data, [key]: value })
