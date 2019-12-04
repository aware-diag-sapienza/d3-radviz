import { checkData, checkDataset, loadDataset, assignAnglestoDimensions } from './data'
import { responsiveSquare } from './utils'
import { type } from 'os'
//import { normalize } from 'path'

const SVG_SIDE = 100

export default function Radviz() {
  //
  let data = {
    entries: [],
    dimensions: [],
    attributes: [],
    angles: []
  }
  //
  let margin_percentage = 15
  let level_grid = 10
  let radius = (SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2
  //
  let scale_x1 = null
  let scale_x2 = null
  let r = 1
  let mean_error_e = 0
  let mean_distance = 0
  //let scale_color = d3.scaleSequential(d3.interpolateYlOrRd);
  let scale_color = function(x) { 
    return d3.interpolateWarm(d3.scaleLinear().domain([0,1]).range([1,0])(x))
    //return d3.interpolatePiYG(d3.scaleLinear().domain([0,1]).range([0.8,0.2])(x))
  }
  //
  let updateData = function () {
    
    d3.select('#points-g').selectAll("circle.data_point")
      .data(data.entries, (d, i) => i)
      .join(
        enter => enter.append("circle")
          .attr('class', 'data_point')
          .attr("id", (d, i) => { return "p_" + i; })
          .attr("r", r)
          .style("fill", (d)=> scale_color(d.errorE))
          .style("opacity", 1)
          .style("stroke", "black")
          .style("stroke-width", (d) => {
            if (d.selected) {
              return 1.5;
            } else {
              return 0.2;
            }
          })
          .attr("cx", (d) => { return scale_x2(d.x2) })
          .attr("cy", (d) => { return scale_x1(d.x1) })
          .on("contextmenu", function (d, i) {
            d3.event.preventDefault();
            d3.select('#points-g').selectAll("circle.data_point").style("stroke-width", 0.2)
            d3.select(this).style("stroke-width", 0.5)
            data.angles = assignAnglestoDimensions(calculateSinglePointHeuristic(d))
            d3.selectAll(".AP_points").remove();
            drawAnchorPoints(true)
            calculatePointPosition()
            d3.select('#points-g').selectAll("circle.data_point").data(data.entries, (d, i) => i)
            updateData()
          })
          .on("click",function(d){
            console.log("x1",d.x1);
            console.log("x2",d.x2);
            console.log("errorE",d.errorE);
          }),
        update => update
          .call(update => update
            .transition()
            .duration(2000)
            .style("fill", (d)=> scale_color(d.errorE))
            .style("stroke-width", (d) => {
              if (d.selected) {
                return 0.5;
              } else {
                return 0.2;
              }
            })
            .attr("cx", (d) => { return scale_x2(d.x2) })
            .attr("cy", (d) => { return scale_x1(d.x1) }),
          ),
        exit => exit
          .call(exit => exit
            .transition()
            .duration(650)
            .remove()
          )
      );
    updateResults()
  };
  
  //
  let updateResults = function (){
    document.getElementById('menu1').innerHTML =  '<b>Mean Distance</b>: '+ mean_distance.toFixed(4) + ' <b>ErrorE</b>: ' + mean_error_e.toFixed(4)
          
  }
  //
  const distance2points = function (P, AP) {
    return Math.sqrt(Math.pow((P.x1 - AP.x1), 2) + Math.pow((P.x2 - AP.x2), 2))
  }
  //
  let calculateErrorE = function () {
    
    let sum_error = 0
    data.entries.forEach(function (V, i) {
      let errorE = 0
      let E = 0
      let Z = 0
      let distances = []
      data.angles.forEach(function (dimension) {
        let entry = {}
        entry['id'] = dimension.value
        entry['value'] = distance2points(V, dimension)
        distances.push(entry)
      })
      console.log('distancesbefore', distances.map(d=>d.id))
      distances = distances.slice().sort((a, b) => d3.descending(a.value, b.value))
      console.log('distancesafter', distances.map(d=>d.id))
      
      let A = distances.map(d => d.id)
      console.log()
      for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A.length; j++) {
          if (j>i) {
            if (V.dimensions[A[i]] > V.dimensions[A[j]]){
              E = E + Math.abs(V.dimensions[A[i]] - V.dimensions[A[j]])
              
            }
          }
          Z = Z + Math.abs(V.dimensions[A[i]] - V.dimensions[A[j]])
        }
      }
      errorE = E / (Z / 2)
      if (isNaN(errorE)) errorE = 0
      console.log(E,(Z / 2),errorE)
      V.errorE = errorE
      sum_error = sum_error + errorE
    })

    return sum_error/data.entries.length
  }
  //
  let dragstarted = function (d) {
    d3.select(this).raise().classed("active", true);
  }
  //
  let dragged = function (d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    d.drag = true;
  }
  //
  let dragended = function (d) {
    if (d.drag == true) {
      d3.select(this).classed("active", false);
      d.drag = false;
      let new_angle = dragendangle(d3.select(this).attr("cx"), d3.select(this).attr("cy"), d3.select(this).attr("id"), d);
      data.angles = assignAnglestoDimensions(newOrderDimensions(new_angle, data.angles))
      d3.selectAll(".AP_points").remove();
      drawAnchorPoints(true)
      calculatePointPosition()
      d3.select('#points-g').selectAll("circle.data_point").data(data.entries, (d, i) => i)
      updateData()

    }
  }
  //
  let dragendangle = function (x, y, id, d) {
    let distance = Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2)));
    let cosangolo = x / distance
    let sinangolo = y / distance
    let angle;
    if (cosangolo >= 0 && sinangolo >= 0) {
      angle = Math.acos(cosangolo) + (Math.PI / 2);
    } else if (cosangolo >= 0 && sinangolo < 0) {
      angle = Math.abs((Math.acos(cosangolo) - (Math.PI / 2)));
    } else if (cosangolo < 0 && sinangolo < 0) {
      angle = ((2 * Math.PI) - (Math.acos(cosangolo))) + Math.PI / 2;
    } else {
      angle = Math.acos(cosangolo) + (Math.PI / 2);
    }
    return [angle, id];
  }
  //
  let newOrderDimensions = function (angle, dimensions) {
    console.log(angle, dimensions)
    let new_dimensions = [];
    let dimension_changed = angle[1].split("AP_")[1];

    let founded = false;
    let founded_angle = false;
    let index_found = -1;
    let new_position = 0;
    let index_changed = -1;
    let i;

    for (i = 0; i < dimensions.length; i++) {
      if (dimensions[i].value.replace(" ", "").replace(".", "") == dimension_changed) {
        index_changed = i;
        founded = true;

        if (founded_angle) {
          delete dimensions[index_changed].index;
          dimensions[index_changed].index = (dimensions[index_found].index) + 1;
          new_dimensions[index_found + 1] = dimensions[index_changed].value

        }
      }
      if (angle[0] >= dimensions[i].start && angle[0] < (dimensions[i].end)) {
        index_found = i;
        founded_angle = true;
        delete dimensions[i].index;
        dimensions[i].index = new_position;

        new_dimensions.push(dimensions[i].value);
        new_position++;
        if (founded) {
          delete dimensions[index_changed].index;
          dimensions[index_changed].index = new_position;
          new_dimensions.push(dimensions[index_changed].value);
          new_position++;
        } else {
          new_dimensions.push([]);
          new_position++;
        }
      }
      if (i != index_found && i != index_changed) {
        delete dimensions[i].index;
        dimensions[i].index = new_position;
        new_dimensions.push(dimensions[i].value);
        new_position++;

      }
    }

    if (index_changed == index_found) {
      return dimensions.map(function (d) { return d.value; });
    } else {
      return new_dimensions;
    }
  }
  //
  const drawAnchorPoints = function (drag = false) {

    //system.radviz.resetVisulization();
    if (!drag) {
      d3.select('#grid-g').selectAll("text.label")
        .data(data.angles)
        .enter().append("text")
        .attr("id", (d) => { return "T_" + d.value.replace(" ", "").replace(".", ""); })
        .attr("class", "attr_label")
        .attr("x", (d, i) => { return ((radius + 8) * Math.cos(-Math.PI / 2 + (d.start))) })
        .attr("y", (d, i) => { return ((radius + 6) * Math.sin(-Math.PI / 2 + (d.start))) })
        .attr("fill", "black")
        .style("font-size", "4px")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .text((d, i) => { return d.value.substring(0, 6) });
    } else {
      console.log("nuovi", data.angles)
      data.angles.forEach(function (dimensione_ordinata) {
        if (dimensione_ordinata.value.length != 0) {
          let tdelay = d3.transition().duration(2000)
          let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")
          d3.select("#T_" + label_text).transition(tdelay)
            .attr("x", () => { return ((radius + 8) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
            .attr("y", () => { return ((radius + 6) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })
        }
      })
    }
    d3.select('#grid-g').selectAll(".AP_points")
      .data(data.angles)
      .enter().append("circle")
      .attr("class", "AP_points")
      .attr("id", (d) => { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
      .attr("r", '1.5')
      .style("fill", '#660000')
      .attr("cx", (d, i) => { return ((radius + 1) * Math.cos(-Math.PI / 2 + (d.start))) })
      .attr("cy", (d, i) => { return ((radius + 1) * Math.sin(-Math.PI / 2 + (d.start))) })
      .on('mouseover', function () { d3.select(this).attr("r", '2') })
      .on('mouseout', function () { d3.select(this).attr("r", '1.5') })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))

  }
  //
  let initializeScale = function () {
    console.log('inizializzo le scale', radius);
    scale_x1 = d3.scaleLinear()
      .domain([-1, 1])
      .range([radius, -radius]);
    scale_x2 = d3.scaleLinear()
      .domain([-1, 1])
      .range([-radius, radius]);



  }
  //
  let calculatePointPosition = function () {
    let sum_mean_distance = 0
    data.entries.forEach(function (point) {
      let x_1_j = { 'denominator': 0, 'numerator': 0 };
      let x_2_j = { 'denominator': 0, 'numerator': 0 };
      data.angles.forEach(function (dim) {
        x_1_j.numerator = x_1_j.numerator + (point.dimensions[dim.value] * Math.cos(dim.start));
        x_1_j.denominator = x_1_j.denominator + point.dimensions[dim.value];
        x_2_j.numerator = x_2_j.numerator + (point.dimensions[dim.value] * Math.sin(dim.start));
        x_2_j.denominator = x_2_j.denominator + point.dimensions[dim.value];
      })
      if (x_1_j.numerator == 0 || x_1_j.denominator == 0) {
        point['x1'] = 0;
      } else {
        point['x1'] = x_1_j.numerator / x_1_j.denominator;
      }
      if (x_2_j.numerator == 0 || x_2_j.denominator == 0) {
        point['x2'] = 0;
      } else {
        point['x2'] = x_2_j.numerator / x_2_j.denominator;
      }

      sum_mean_distance = sum_mean_distance + Math.sqrt(Math.pow(point['x1'], 2) + Math.pow(point['x2'], 2))
    })
    mean_error_e=calculateErrorE()
    mean_distance = sum_mean_distance/data.entries.length
    
  }
let drawGrid = function (){
      d3.selectAll(".grid").remove()
     
      let l
      for (l = 0; l < level_grid; l++) {
        const arc = d3.arc()
          .innerRadius(function () {
            if (l == 0) return 0;
            else return ((((SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2) * l) / level_grid)
          })
          .outerRadius(() => { if (l == 0) return ((SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2) / level_grid; else return (((SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2 * (l + 1)) / level_grid); })
          .startAngle((d) => { return d.start; })
          .endAngle((d) => { return d.end; })

        d3.select('#grid-g').selectAll('mySlices')
          .data(data.angles)
          .enter()
          .append('path')
          .attr('id', (d) => { ; return 'area_' + (l + 1) + '_' + (d.index + 1) })
          .attr('class', 'grid')
          .attr('d', arc)
          .attr('fill', 'white')
          .attr("stroke", "black")
          .style("stroke-opacity", 0.4)
          .style("stroke-width", "0.25px")
          .style("opacity", 0.7)
      }
}
  //

  let calculateSinglePointHeuristic = function (point) {

    let element = {};
    data.angles.forEach(function (d) {
      element[d.value] = point.dimensions[d.value];
    })

    let result = Object.keys(element).sort(function (a, b) {
      return element[b] - element[a];
    });

    let i, s, e;
    s = 0;
    e = result.length - 1;
    let prova = new Array(result.length);

    for (i = 0; i < result.length; i++) {
      if (i % 2 == 0) {
        prova[s] = result[i];
        s++;
      }
      else {
        prova[e] = result[i];
        e--;
      }
    }
    return prova

  }
  const radviz = function (selection) {
    selection.each(function () {
      const container = d3.select(this)
        .attr('class', 'radviz-container')
      const svg = container.append('svg')
        .attr('class', 'radviz-svg')
        .attr('viewBox', `0 0 ${SVG_SIDE} ${SVG_SIDE}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .call(responsiveSquare)
      let g_radviz = svg.append('g')
        .attr('id', 'radviz-g')
        .attr('height', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
        .attr('width', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
        .attr("transform", "translate(" + SVG_SIDE / 2 + "," + SVG_SIDE / 2 + ")")
      g_radviz.append('circle')
        .attr('id', 'circumference')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radius)
        .style('stroke', "black")
        .style('stroke-width', '0.5px')
        .style('fill', "white")
      
      svg.append('g')
        .attr('id', 'grid-g')
        .attr('height', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
        .attr('width', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
        .attr("transform", "translate(" + SVG_SIDE / 2 + "," + SVG_SIDE / 2 + ")")
      svg.append('g')
        .attr('id', 'points-g')
        .attr('height', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
        .attr('width', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
        .attr("transform", "translate(" + SVG_SIDE / 2 + "," + SVG_SIDE / 2 + ")")

      drawGrid()
      drawAnchorPoints()
      calculatePointPosition()
      initializeScale()
      updateData()
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
  radviz.setScaleSequentialError = function(_){
    if (!arguments.length) scale_color = ramp(d3.scaleSequential(d3.interpolateRdYlGn))
    else {scale_color = d3.scaleSequential(_)
    }
  }
  //
  radviz.setScaleOrdinalError = function(_){
    scale_color = d3.scaleSequentialQuantile(d3.interpolateYlOrRd).domain([0.25, 0.5, 0.75, 0.9])
  }
  //
  radviz.increaseRadius = function(_){
    if (r < 10) r = r+0.25
    d3.select('#points-g').selectAll("circle.data_point").attr("r", r)
  }
  //
  radviz.decreaseRadius = function(){
    if (r > 0.25) r = r-0.25
     d3.select('#points-g').selectAll("circle.data_point").attr("r", r)

  }
  //
  radviz.increaseLevelGrid = function(){
    if (level_grid < 20) 
    {level_grid = level_grid+1
    
    drawGrid()}
  }
  //
  radviz.decreaseLevelGrid = function(){
    if (level_grid > 0) {
      level_grid = level_grid-1
      drawGrid()
    }
  }

  //
  radviz.updateRadviz = function(order_dimensions){
    
    let mapping_dimension = []
    if (!arguments.length){
      mapping_dimension = data.dimensions.map(d=>d.id)
    }
    else {
    order_dimensions.forEach(function(num){
      console.log(num)
      mapping_dimension.push(data.dimensions[num].id)
    })
  }
    console.log(mapping_dimension)

    data.angles = assignAnglestoDimensions(mapping_dimension)
    d3.selectAll(".AP_points").remove();
    drawAnchorPoints(true)
    calculatePointPosition()
    d3.select('#points-g').selectAll("circle.data_point").data(data.entries, (d, i) => i)
    updateData()
  }
  return radviz
}
