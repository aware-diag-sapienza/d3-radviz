import { select, selectAll, event } from 'd3-selection'
import { transition } from 'd3-transition'
import { descending } from 'd3-array'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { interpolateWarm, schemeCategory10,interpolatePiYG } from 'd3-scale-chromatic'
import { drag } from 'd3-drag'
import { arc } from 'd3-shape'

import { checkData, checkDataset, loadDataset, assignAnglestoDimensions } from './data'
import { responsiveSquare } from './utils'

const SVG_SIDE = 100

export default function Radviz () {
  //
  let data = {
    entries: [],
    dimensions: [],
    attributes: [],
    angles: []
  }
  //
  let index_radviz = 0
  //
  let margin_percentage = 15
  let level_grid = 10
  const radius = (SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2
  //
  let scale_x1 = scaleLinear().domain([-1, 1]).range([radius, -radius])
  let scale_x2 = scaleLinear().domain([-1, 1]).range([-radius, radius])
  //
  let defaultPointColor = '#67a9cf'//'#56C766' // #1f78b4' // 'steelblue' //
  let outlierPointColor = '#ef8a62'

  let r = 1
  let mean_error_e = 0
  const mean_distance = 0
  let attribute_color = null

  let quality = true
  let bool_showOutliers = false
  let bool_showDefaultColor = false
  let bool_showRepresentativePoint = false

  let function_update_results = null
  let function_click = null
  let function_drag_end = null
  let function_mouse_over = null
  let function_mouse_out = null
  let function_context_menu = null

  let right_click = true 
  let disable_drag_anchor = false 
  let colorBlind = false

  const scale_color = function (x) {
    return interpolateWarm(scaleLinear().domain([0, 1]).range([1, 0])(x))
  }

  let scale_color_blind = function (x) {
    return interpolatePiYG(scaleLinear().domain([0, 1]).range([1,0])(x))
  }

  let scale_classification = scaleOrdinal(schemeCategory10)
    .domain(new Set(data.attributes
      .filter(function (pilot) { return pilot.id === attribute_color })
      .map(d => d.values)[0]))
    //
  const updateData = function () {
    select('#points-g-' + index_radviz).selectAll(`circle.data_point-${index_radviz}`)
      .data(data.entries, d => d.id)
      .join(
        enter => enter.append('circle')
          .attr('class', d => d.outlier ? `data_point data_point-${index_radviz} data_point_outlier` : `data_point data_point-${index_radviz}`)
          .attr('id', (d, i) => { return 'p_' + i + '-' + index_radviz })
          .attr('r', r)
          .style('fill', function (d) {
            if (colorBlind) return scale_color_blind(d.errorE)
            else if (bool_showDefaultColor) return defaultPointColor
            else if (bool_showOutliers) return d.outlier ? outlierPointColor : defaultPointColor
            else if (quality) return scale_color(d.errorE)
            else if (attribute_color == null) return defaultPointColor
            else {
              return scale_classification(d.attributes[attribute_color])
            }
          })
          .style('opacity', 1)
          .style('stroke', 'black')
          .style('stroke-width', (d) => {
            if (d.selected) {
              return 0.5
            } else {
              return 0.2
            }
          })
          .attr('cx', function (d) { return scale_x2(d.x2) })
          .attr('cy', function (d) { return scale_x1(d.x1) })
          .on('contextmenu', function (d) {
            if (right_click){
            event.preventDefault()
            select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).style('stroke-width', 0.2)
            select(this).style('stroke-width', 0.5)
            data.angles = assignAnglestoDimensions(calculateSinglePointHeuristic(d), data)
            selectAll('.AP_points' + index_radviz).remove()
            drawAnchorPoints(true)
            calculatePointPosition()
            select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).data(data.entries, (d, i) => i)
            updateData()
            if (function_context_menu != null) { function_context_menu(data.angles) }
          }
          })
          .on('click', function (d) {
            if (function_click != null) { function_click(data.angles, d, select(this)) }

            console.log('x1', d.x1)
            console.log('x2', d.x2)
            console.log('errorE', d.errorE)
          })
          .on('mouseover', function (d) {
            if (function_mouse_over != null) { function_mouse_over(data.angles, d) }
          })
          .on('mouseout', function (d) {
            if (function_mouse_out != null) { function_mouse_out(d) }
          }),
        update => update
          .call(update => update
            .transition()
            .duration(1000)
            .style('fill', function (d) {
              if (colorBlind) return scale_color_blind(d.errorE)
              else if (bool_showDefaultColor) return defaultPointColor
              else if (bool_showOutliers) return d.outlier ? outlierPointColor : defaultPointColor
              else if (quality) return scale_color(d.errorE)
              else if (attribute_color == null) return defaultPointColor
              else {
                data.attributes
                return scale_classification(d.attributes[attribute_color])
              }
            })
            .style('stroke-width', (d) => {
              if (d.selected) {
                return 0.5
              } else {
                return 0.2
              }
            })
            .attr('cx', (d) => { return scale_x2(d.x2) })
            .attr('cy', (d) => { return scale_x1(d.x1) })
          ),
        exit => exit
          .call(exit => exit
            .transition()
            .duration(650)
            .remove()
          )
      )

    select('#points-g-' + index_radviz).selectAll(`circle.repr_point-${index_radviz}`)
      .data([data.representativeEntry], d => d.id)
      .join(
        enter => enter.append('circle')
          .attr('class', `repr_point repr_point-${index_radviz}`)
          .attr('id', 'repr_point-' + index_radviz)
          .attr('r', r * 2)
          .style('display', bool_showRepresentativePoint ? null : 'none')
          .style('fill', 'red')
          .style('opacity', 1)
          .style('stroke', 'black')
          .style('stroke-width', 0.2)
          .attr('cx', function (d) { return scale_x2(d.x2) })
          .attr('cy', function (d) { return scale_x1(d.x1) }),

        update => update
          .call(update => update
            .transition()
            .duration(1000)
            .style('display', bool_showRepresentativePoint ? null : 'none')
            .attr('cx', (d) => { return scale_x2(d.x2) })
            .attr('cy', (d) => { return scale_x1(d.x1) })
          ),
        exit => exit
          .call(exit => exit
            .transition()
            .duration(650)
            .remove()
          )
      )
    // updateResults()
    if (function_update_results != null) { function_update_results(mean_error_e) }
  }
  //
  const distance2points = function (P, AP) {
    return Math.sqrt(Math.pow((P.x1 - AP.x1), 2) + Math.pow((P.x2 - AP.x2), 2))
  }
  //
  const calculateErrorE = function () {
    let sum_error = 0
    data.entries.forEach(function (V, i) {
      let errorE = 0
      let E = 0
      let Z = 0
      let distances = []
      data.angles.forEach(function (dimension) {
        const entry = {}
        entry.id = dimension.value
        entry.value = distance2points(V, dimension)
        distances.push(entry)
      })

      distances = distances.slice().sort((a, b) => descending(a.value, b.value))

      const A = distances.map(d => d.id)

      for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A.length; j++) {
          if (j > i) {
            if (V.dimensions[A[i]] > V.dimensions[A[j]]) {
              E = E + Math.abs(V.dimensions[A[i]] - V.dimensions[A[j]])
            }
          }
          Z = Z + Math.abs(V.dimensions[A[i]] - V.dimensions[A[j]])
        }
      }
      errorE = E / (Z / 2)
      if (isNaN(errorE)) errorE = 0

      V.errorE = errorE
      sum_error = sum_error + errorE
    })

    // console.log('*** EE', sum_error / data.entries.length);
    return sum_error / data.entries.length
  }
  //
  const dragstarted = function () {
    select(this).raise().classed('active', true)
  }
  //
  const dragged = function (d) {
    select(this).attr('cx', d.x = event.x).attr('cy', d.y = event.y)
    d.drag = true
  }
  //
  const dragended = function (d) {
    if (d.drag == true) {
      select(this).classed('active', false)
      d.drag = false
      const new_angle = dragendangle(select(this).attr('cx'), select(this).attr('cy'), select(this).attr('id'), d)
      data.angles = assignAnglestoDimensions(newOrderDimensions(new_angle, data.angles), data)

      selectAll('.AP_points-' + index_radviz).remove()
      drawAnchorPoints(true)
      calculatePointPosition()
      select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).data(data.entries, (d, i) => i)
      updateData()
      if (function_drag_end != null) { function_drag_end(data.angles) }
    }
  }
  //
  const dragendangle = function (x, y, id, d) {
    console.log('x', x)
    console.log('y', y)
    console.log('id', id)
    console.log('d', d)
    const distance = Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2)))
    const cosangolo = x / distance
    const sinangolo = y / distance
    let angle
    if (cosangolo >= 0 && sinangolo >= 0) {
      angle = Math.acos(cosangolo) + (Math.PI / 2)
    } else if (cosangolo >= 0 && sinangolo < 0) {
      angle = Math.abs((Math.acos(cosangolo) - (Math.PI / 2)))
    } else if (cosangolo < 0 && sinangolo < 0) {
      angle = ((2 * Math.PI) - (Math.acos(cosangolo))) + Math.PI / 2
    } else {
      angle = Math.acos(cosangolo) + (Math.PI / 2)
    }
    console.log('angle', angle)
    console.log('id', id)
    return [angle, id]
  }
  //
  const newOrderDimensions = function (angle, dimensions) {
    console.log(angle, dimensions)
    const new_dimensions = []
    let dimension_changed = angle[1].replace('AP_', '')
    dimension_changed = dimension_changed.replace('-' + index_radviz, '')
    console.log('dimension_changed', dimension_changed)
    console.log('dimensions', dimensions)

    let founded = false
    let founded_angle = false
    let index_found = -1
    let new_position = 0
    let index_changed = -1
    let i

    for (i = 0; i < dimensions.length; i++) {
      console.log(i, ')', dimensions[i].value.replace(/ /g, ''), dimension_changed)
      if (dimensions[i].value.replace(/ /g, '') == dimension_changed) {
        index_changed = i
        founded = true

        if (founded_angle) {
          delete dimensions[index_changed].index
          dimensions[index_changed].index = (dimensions[index_found].index) + 1
          new_dimensions[index_found + 1] = dimensions[index_changed].value
        }
      }

      if (angle[0] >= dimensions[i].start && angle[0] < (dimensions[i].end)) {
        index_found = i
        founded_angle = true
        delete dimensions[i].index
        dimensions[i].index = new_position

        new_dimensions.push(dimensions[i].value)
        new_position++
        if (founded) {
          delete dimensions[index_changed].index
          dimensions[index_changed].index = new_position
          new_dimensions.push(dimensions[index_changed].value)
          new_position++
        } else {
          new_dimensions.push([])
          new_position++
        }
      }
      if (i != index_found && i != index_changed) {
        delete dimensions[i].index
        dimensions[i].index = new_position
        new_dimensions.push(dimensions[i].value)
        new_position++
      }
    }

    if (index_changed == index_found) {
      return dimensions.map(function (d) { return d.value })
    } else {
      return new_dimensions
    }
  }
  //
  const drawAnchorPoints = function (supportDrag = false) {
    if (!supportDrag) {
      select('#grid-g-' + index_radviz).selectAll('text.label-' + index_radviz)
        .data(data.angles)
        .enter().append('text')
        .attr('id', (d) => { return 'T_' + d.value.replace(/ /g, '') + '-' + index_radviz })
        .attr('class', 'anchor-points attr_label-' + index_radviz)
        .attr('x', (d, i) => { return ((radius + 8) * Math.cos(-Math.PI / 2 + (d.start))) })
        .attr('y', (d, i) => { return ((radius + 6) * Math.sin(-Math.PI / 2 + (d.start))) })
        .attr('fill', 'black')
        .style('font-size', '3px')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .text((d, i) => {
          if (d.value.includes(' ')) return d.value.substring(0, d.value.indexOf(' '))
          else return d.value
        })
    } else {
      data.angles.forEach(function (dimensione_ordinata) {
        if (dimensione_ordinata.value.length != 0) {
          const tdelay = transition().duration(1000)
          const label_text = dimensione_ordinata.value.replace(/ /g, '')
          select('#T_' + label_text + '-' + index_radviz).transition(tdelay)
            .attr('x', () => { return ((radius + 8) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
            .attr('y', () => { return ((radius + 6) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })
        }
      })
    }
    let anchors_sel = select('#grid-g-' + index_radviz).selectAll('.AP_points-' + index_radviz)
      .data(data.angles)
      .enter().append('circle')
      .attr('class', 'anchor-points AP_points-' + index_radviz)
      .attr('id', (d) => { return 'AP_' + d.value.replace(/ /g, '') + '-' + index_radviz })
      .attr('r', '0.7')
      .style('fill', '#660000')
      .attr('cx', (d, i) => { return ((radius + 1) * Math.cos(-Math.PI / 2 + (d.start))) })
      .attr('cy', (d, i) => { return ((radius + 1) * Math.sin(-Math.PI / 2 + (d.start))) })
      .on('mouseover', function () { select(this).attr('r', '1.5') })
      .on('mouseout', function () { select(this).attr('r', '0.7') })

      if (!disable_drag_anchor){
        anchors_sel.call(drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      }
      
  }
  //
  const calculatePointPosition = function () {
    function position (point) {
      const x_1_j = { denominator: 0, numerator: 0 }
      const x_2_j = { denominator: 0, numerator: 0 }
      const pos = { x1: null, x2: null }
      data.angles.forEach(function (dim) {
        x_1_j.numerator = x_1_j.numerator + (point.dimensions[dim.value] * Math.cos(dim.start))
        x_1_j.denominator = x_1_j.denominator + point.dimensions[dim.value]
        x_2_j.numerator = x_2_j.numerator + (point.dimensions[dim.value] * Math.sin(dim.start))
        x_2_j.denominator = x_2_j.denominator + point.dimensions[dim.value]
      })
      if (x_1_j.numerator == 0 || x_1_j.denominator == 0) {
        pos.x1 = 0
      } else {
        pos.x1 = x_1_j.numerator / x_1_j.denominator
      }
      if (x_2_j.numerator == 0 || x_2_j.denominator == 0) {
        pos.x2 = 0
      } else {
        pos.x2 = x_2_j.numerator / x_2_j.denominator
      }
      return pos
    }
    //
    data.entries.forEach(point => {
      const pos = position(point)
      point.x1 = pos.x1
      point.x2 = pos.x2
    })
    mean_error_e = calculateErrorE()
    data.representativeEntry.x1 = position(data.representativeEntry).x1
    data.representativeEntry.x2 = position(data.representativeEntry).x2
  }

  const drawGrid = function () {
    selectAll('.grid-' + index_radviz).remove()

    let l
    for (l = 0; l < level_grid; l++) {
      const arcPath = arc()
        .innerRadius(function () {
          if (l == 0) return 0
          else return ((((SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2) * l) / level_grid)
        })
        .outerRadius(() => {
          if (l == 0) return ((SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2) / level_grid
          else return (((SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2 * (l + 1)) / level_grid)
        })
        .startAngle((d) => { return d.start })
        .endAngle((d) => { return d.end })

      select('#grid-g-' + index_radviz).selectAll('mySlices')
        .data(data.angles)
        .enter()
        .append('path')
        .attr('id', (d) => { return 'area_' + (l + 1) + '_' + (d.index + 1) + '-' + index_radviz })
        .attr('class', 'grid-' + index_radviz)
        .attr('d', arcPath)
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .style('stroke-opacity', 0.4)
        .style('stroke-width', '0.25px')
        .style('opacity', 0.7)
    }
  }
  //

  const calculateSinglePointHeuristic = function (point) {
    const element = {}
    data.angles.forEach(function (d) {
      element[d.value] = point.dimensions[d.value]
    })

    const result = Object.keys(element).sort(function (a, b) {
      return element[b] - element[a]
    })

    let i, s, e
    s = 0
    e = result.length - 1
    const prova = new Array(result.length)

    for (i = 0; i < result.length; i++) {
      if (i % 2 == 0) {
        prova[s] = result[i]
        s++
      } else {
        prova[e] = result[i]
        e--
      }
    }

    return prova
  }
  const radviz = function (selection) {
    selection.each(function () {
      const container = select(this)
        .attr('class', 'radviz-container-' + index_radviz)
      const svg = container.append('svg')
        .attr('class', 'radviz-svg-' + index_radviz)
        .attr('viewBox', `0 0 ${SVG_SIDE} ${SVG_SIDE}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .call(responsiveSquare)
      const g_radviz = svg.append('g')
        .attr('id', 'radviz-g-' + index_radviz)
        .attr('height', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
        .attr('width', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
        .attr('transform', 'translate(' + SVG_SIDE / 2 + ',' + SVG_SIDE / 2 + ')')
      g_radviz.append('circle')
        .attr('id', 'circumference-' + index_radviz)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radius)
        .style('stroke', 'black')
        .style('stroke-width', '0.5px')
        .style('fill', 'white')

      svg.append('g')
        .attr('id', 'grid-g-' + index_radviz)
        .attr('height', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
        .attr('width', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
        .attr('transform', 'translate(' + SVG_SIDE / 2 + ',' + SVG_SIDE / 2 + ')')
      svg.append('g')
        .attr('id', 'points-g-' + index_radviz)
        .attr('height', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
        .attr('width', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
        .attr('transform', 'translate(' + SVG_SIDE / 2 + ',' + SVG_SIDE / 2 + ')')

      drawGrid()
      drawAnchorPoints()
      calculatePointPosition()
      updateData()
    })
  }
  //
  radviz.data = function (_, cl) {
    if (!arguments.length) return data
    if (checkData(_)) data = _
    else if (checkDataset(_)) data = loadDataset(_, cl)
    else throw new TypeError('Invalid data')
    if (typeof updateData === 'function') updateData()
    index_radviz = new Date().getTime()
    return radviz
  }
  //
  radviz.getIndex = function () {
    return index_radviz
  }
  //
  radviz.setColorClassification = function (_) {
    if (!arguments.length) return null
    if (data.attributes.map((d) => d.id).includes(_)) {
      attribute_color = _
      scale_classification = scaleOrdinal(schemeCategory10).domain(new Set(data.attributes.filter(function (pilot) { return pilot.id === attribute_color }).map(d => d.values)[0]))
    } else { attribute_color = null }
    console.log(data.attributes, data.dimensions)
  }
  //
  radviz.setMargin = function (_) {
    if (!arguments.length) margin_percentage = 0
    if (_ > 15) margin_percentage = 15
    else margin_percentage = _
  }
  //
  radviz.setLevel = function (_) {
    if (!arguments.length) level_grid = 0
    if (_ > 20) level_grid = 20
    else level_grid = _
  }
  //
  radviz.setRadiusPoints = function (_) {
    if (!arguments.length) r = 1
    if (_ > 10) r = 10
    else r = _
    select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).attr('r', r)
  }
  //
  radviz.increaseRadius = function () {
    if (r < 10) r = r + 0.25
    select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).attr('r', r)
  }
  //
  radviz.decreaseRadius = function () {
    if (r > 0.25) r = r - 0.25
    select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).attr('r', r)
  }
  //
  radviz.increaseLevelGrid = function () {
    if (level_grid < 20) {
      level_grid = level_grid + 1
      drawGrid()
    }
  }
  //
  radviz.decreaseLevelGrid = function () {
    if (level_grid > 0) {
      level_grid = level_grid - 1
      drawGrid()
    }
  }
  //
  radviz.setQuality = function (bool=true) {
    quality = bool
    updateData()
  }
  radviz.showOutliers = function (bool = true) {
    bool_showOutliers = bool
    updateData()
  }
  radviz.showDefaultColor = function (bool = true) {
    bool_showDefaultColor = bool
    updateData()
  }
  radviz.showRepresentativePoint = function (bool = true) {
    bool_showRepresentativePoint = bool
    updateData()
  }
  //
  radviz.getQuality = function () {
    return quality
  }
  //
  radviz.setColorPoint = function (flag) {
    // flag:
    // = 0 allora uso metrica
    // = 1 allora metto il blu
    // = 2 allora metto un altro
    colorBlind = false
    switch (flag) {
      case (0):
        quality = true
        break
      case (1):
        quality = false
        break
      case (2):
        quality = false
        break
    }
    updateData()
  }
  // 
  radviz.setColorblindSafe = function(bool){
    colorBlind = bool
    updateData() 
  }
  //
  radviz.getColorblindSafe = function(){
    return colorBlind
  }
  //
  radviz.setFunctionDragEnd = function (ff) {
    function_drag_end = ff
  }
  //
  radviz.setFunctionClick = function (ff) {
    function_click = ff
  }
  //
  radviz.setFunctionMouseOver = function (ff) {
    function_mouse_over = ff
  }
  //
  radviz.setFunctionMouseOut = function (ff) {
    function_mouse_out = ff
  }
  //
  radviz.setFunctionContextMenu = function (ff) {
    function_context_menu = ff
  }
  //
  radviz.setFunctionUpdateResults = function (ff) {
    function_update_results = ff
  }
  //
  radviz.setRightClick = function (bool) {
    right_click = bool
  }
  //
  radviz.updateRadviz = function (order_dimensions) {
    let mapping_dimension = []
    if (!arguments.length) {
      mapping_dimension = data.dimensions.map(d => d.id)
    } else {
      const new_order_dimensions = order_dimensions.slice()
      /// new_order_dimensions[0] = 0, new_order_dimensions[1] < new_order_dimensions[n-1]
      while (new_order_dimensions[0] != 0) {
        const dim = new_order_dimensions.shift()
        new_order_dimensions.push(dim)
      }
      if (new_order_dimensions[1] > new_order_dimensions[new_order_dimensions.length - 1]) {
        const dim = new_order_dimensions.shift()
        new_order_dimensions.reverse()
        new_order_dimensions.unshift(dim)
      }
      new_order_dimensions.forEach(function (num) {
        mapping_dimension.push(data.dimensions[num].id)
      })
    }
    // sono arrivata qui ad inserire -' + index_radviz)
    data.angles = assignAnglestoDimensions(mapping_dimension, data)
    selectAll('.AP_points-' + index_radviz).remove()
    drawAnchorPoints(true)
    calculatePointPosition()
    select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).data(data.entries, (d, i) => i)
    updateData()
  }
  //
  radviz.calculateRadvizMeanDistance = function (order_dimensions) { // order _dimensions is a list of index.
    console.log('entro qui')
    const copy_data = Object.assign({}, data)
    console.log(copy_data)
    let mapping_dimension = []
    if (!arguments.length) {
      mapping_dimension = copy_data.dimensions.map(d => d.id)
    } else {
      const new_order_dimensions = order_dimensions.slice()
      /// new_order_dimensions[0] = 0, new_order_dimensions[1] < new_order_dimensions[n-1]
      while (new_order_dimensions[0] != 0) {
        const dim = new_order_dimensions.shift()
        new_order_dimensions.push(dim)
      }
      if (new_order_dimensions[1] > new_order_dimensions[new_order_dimensions.length - 1]) {
        const dim = new_order_dimensions.shift()
        new_order_dimensions.reverse()
        new_order_dimensions.unshift(dim)
      }
      new_order_dimensions.forEach(function (num) {
        mapping_dimension.push(copy_data.dimensions[num].id)
      })
    }

    copy_data.angles = assignAnglestoDimensions(mapping_dimension, copy_data)
    let sum_mean_distance = 0
    copy_data.entries.forEach(function (point) {
      const x_1_j = { denominator: 0, numerator: 0 }
      const x_2_j = { denominator: 0, numerator: 0 }
      copy_data.angles.forEach(function (dim) {
        x_1_j.numerator = x_1_j.numerator + (point.dimensions[dim.value] * Math.cos(dim.start))
        x_1_j.denominator = x_1_j.denominator + point.dimensions[dim.value]
        x_2_j.numerator = x_2_j.numerator + (point.dimensions[dim.value] * Math.sin(dim.start))
        x_2_j.denominator = x_2_j.denominator + point.dimensions[dim.value]
      })
      if (x_1_j.numerator == 0 || x_1_j.denominator == 0) {
        point.x1 = 0
      } else {
        point.x1 = x_1_j.numerator / x_1_j.denominator
      }
      if (x_2_j.numerator == 0 || x_2_j.denominator == 0) {
        point.x2 = 0
      } else {
        point.x2 = x_2_j.numerator / x_2_j.denominator
      }

      sum_mean_distance = sum_mean_distance + Math.sqrt(Math.pow(point.x1, 2) + Math.pow(point.x2, 2))
    })
    console.log(copy_data)
    return sum_mean_distance / copy_data.entries.length
  }
  //
  radviz.single_point_procedure = function (d) {
    d3.select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).style('stroke-width', 0.2)
    d3.select('#' + d).style('stroke-width', 0.5)
    data.angles = assignAnglestoDimensions(calculateSinglePointHeuristic(d3.select('#' + d).data()[0]), data)
    d3.selectAll('.AP_points' + index_radviz).remove()
    drawAnchorPoints(true)
    calculatePointPosition()
    d3.select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).data(data.entries, (d, i) => i)
    updateData()
    if (function_context_menu != null) { function_context_menu(data.angles) }
  }
  //
  radviz.remove = function (bool) {
    if (!arguments.length) return
    else {
      if (bool) select('.radviz-svg-' + index_radviz).remove()
    }
  }
  //
  radviz.setDefaultColorPoints = function (_) {
    if (!arguments.length) {
      defaultPointColor = '#67a9cf'
      return
    }
    else {
      defaultPointColor = _
    }
  }
  //
  radviz.getAttrColor = function () {
    if (!arguments.length) return
    else {
      return attribute_color
    }
  }
  //
  radviz.scaleX = function (_) {
    if (!arguments.legnth) return scale_x2
    scale_x2 = _
    return radviz
  }
  //
  radviz.scaleY = function (_) {
    if (!arguments.legnth) return scale_x1
    scale_x1 = _
    return radviz
  }
  //
  radviz.center = function () {
    return {
      x: SVG_SIDE / 2,
      y: SVG_SIDE / 2
    }
  }
  //
  radviz.disableDraggableAnchors = function (bool) {
    disable_drag_anchor = bool
  }

  return radviz
}
