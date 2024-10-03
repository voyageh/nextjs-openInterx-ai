export const chunkArray = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))
}

export const uniqueArray = (arr, uniId) => {
  const res = new Map()
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1))
}
