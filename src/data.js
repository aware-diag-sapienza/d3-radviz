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
  console.log("min",min,"max",max)
  let checkDivision = function(v,mi,ma){
    if ((v-mi) == 0||(ma-mi)==0) return 0;
    else return (v-mi)/(ma-mi)
  }
  return values.map(v => checkDivision(v,min,max))
  //return values.map(v => (v-min)/(max-min))
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
    attributes: [],
    angles:[]
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

  data.angles = assignAnglestoDimensions(data.dimensions.map((d)=>d.id))
  return data
}

export function assignAnglestoDimensions(dimensions){
  let real_dimensions = [];
  dimensions.forEach(function (d, i) {
      let start_a = -1;
      let end_a = (((360 / dimensions.length) * Math.PI) / 180) * (i + 1);
      let y_value,x_value;
      if (i == 0) {
        start_a = 0
        x_value = 0

      } else {
        start_a = (((360 / dimensions.length) * Math.PI) / 180) * (i);
        x_value = Math.cos(-Math.PI / 2 + (start_a))
      }
      y_value = Math.sin(-Math.PI / 2 + (start_a))
      
      real_dimensions.push({
        'value': d,
        'index': i,
        'start': start_a,
        'end': end_a,
        'drag': false,
        'x_value': x_value,
        'y_value': y_value,
      })
    });

    console.log("real",real_dimensions);
    return real_dimensions;
}

