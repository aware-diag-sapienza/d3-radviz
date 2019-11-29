const getDimensionValues = (dimension, entries) => {
  const values = entries.map(e => +e[dimension])
  return {
    numeric: !values.some(isNaN),
    values: !values.some(isNaN) ? values : entries.map(e => e[dimension])
  }
}

const minMaxNormalization = (values) => {
  const min = Math.min(...values)
  const max = Math.max(...values)
  return values.map(v => (v-min)/(max-min))
}

export function checkData (data) {
  // TODO: update checkData
  return 'entries' in data && 'dimensions' in data && 'attributes' in data
}

export function checkDataset (dataset) {
  // TODO: update checkDataset
  return Array.isArray(dataset)
}

export function loadDataset (dataset) {
  if (!checkDataset(dataset)) throw new TypeError('Invalid input')
  const data = {
    entries: [],
    dimensions: [],
    attributes: []
  }
  Object.keys(dataset[0]).forEach(k => {
    let {numeric, values} = getDimensionValues(k, dataset)
    data[numeric ? 'dimensions' : 'attributes'].push({
      id: k,
      values: numeric ? minMaxNormalization(values) : values
    })
  })
  if (!data.dimensions.length) throw new Error('At least one numerical attribute is required')
  for (let i=0; i<dataset.length; i++) {
    let entry = {
      dimensions: {},
      attributes: {}
    }
    for (const d of data.dimensions) entry.dimensions[d.id] = d.values[i]
    for (const a of data.attributes) entry.attributes[a.id] = a.values[i]
    data.entries.push(entry)
  }
  return data
}
