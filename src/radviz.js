import {checkData,checkDataset,loadDataset} from './data'
import {responsiveSquare} from './utils'

const SVG_SIDE = 100

export default function Radviz() {
  //
  let data = {
    entries: [],
    dimensions: [],
    attributes: []
  }
  //
  let updateData
  //
  const radviz = function(selection) {
    selection.each(function() {
      const container = d3.select(this)
        .attr('class', 'radviz-container')
      const svg = container.append('svg')
        .attr('class', 'radviz-svg')
        .attr('viewBox', `0 0 ${SVG_SIDE} ${SVG_SIDE}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .call(responsiveSquare)
      updateData = function() {}
    })
  }
  //
  radviz.data = function (_) {
    if (!arguments.length) return data
    if (checkData(_)) data = _
    else if (checkDataset(_)) data = loadDataset(_)
    else throw new TypeError('Invalid data')
    if (typeof updateData === 'function') updateData()
    return radviz
  }
  //
  return radviz
}
