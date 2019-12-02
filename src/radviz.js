import {checkData,checkDataset,loadDataset,assignAnglestoDimensions} from './data'
import {responsiveSquare} from './utils'
import { normalize } from 'path'

const SVG_SIDE = 100

export default function Radviz() {
  //
  let data = {
    entries: [],
    dimensions: [],
    attributes: [],
    angles:[]
  }
  //
  let margin_percentage = 15
  let level_grid = 10
  let radius = (SVG_SIDE- ((SVG_SIDE*(margin_percentage/100)*2)))/2
  //
  let scale_x1=null
  let scale_x2= null
  //
  let updateData = function() {
    console.log('provoqui')
    d3.select('#points-g').selectAll("circle.data_point")
      .data(data.entries, (d,i) => i)
      .join(
        enter => enter.append("circle")
        .attr('class', 'data_point')
      .attr("id",  (d,i) => { return "p_" + i; })
      .attr("r", '1')
      .style("fill",'blue')
      .style("opacity", 1)
      .style("stroke", "black")
      .style("stroke-width",  (d) => {
        if (d.selected) {
          return 1.5;
        } else {
          return 0.2;
        }
      })
      .attr("cx",(d) => { return scale_x2(d.x2) })
      .attr("cy",(d) => { return scale_x1(d.x1) }),
        update => update
          .call(update => update
            .transition()
            .duration(2000)
            .attr("cx",(d) => { return scale_x2(d.x2) })
            .attr("cy",(d) => { return scale_x1(d.x1) }),
          ),
        exit => exit
          .call(exit => exit
            .transition()
            .duration(650)
            .remove()
          )
      );
  };
  //
  let dragstarted = function(d){
    d3.select(this).raise().classed("active", true);
  }
  //
  let dragged = function(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    d.drag = true;
  }
  //
  let dragended = function(d) {
    if (d.drag == true) {
      d3.select(this).classed("active", false);
      d.drag = false;
      let new_angle = dragendangle(d3.select(this).attr("cx"), d3.select(this).attr("cy"), d3.select(this).attr("id"), d);
      
      data.angles = assignAnglestoDimensions(newOrderDimensions(new_angle,data.angles))
      d3.selectAll(".AP_points").remove();
      drawAnchorPoints(true)
      calculatePointPosition()
      d3.select('#points-g').selectAll("circle.data_point").data(data.entries, (d,i) => i)
      updateData()
      
    }
  }
  //
  let dragendangle = function(x, y, id, d){
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
  let newOrderDimensions = function(angle, dimensions){
    console.log(angle,dimensions)
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
  const drawAnchorPoints = function(drag = false){
    
    //system.radviz.resetVisulization();
    if (!drag){
      d3.select('#grid-g').selectAll("text.label")
        .data(data.angles)
        .enter().append("text")
        .attr("id",  (d) => { return "T_" + d.value.replace(" ", "").replace(".", ""); })
        .attr("class", "attr_label")
        .attr("x",  (d, i) => { return ((radius+8) * Math.cos(-Math.PI / 2 + (d.start))) })
        .attr("y",  (d, i) => { return ((radius+6) * Math.sin(-Math.PI / 2 + (d.start))) })
        .attr("fill", "black")
        .style("font-size", "4px")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .text( (d, i) =>  { return d.value.substring(0, 6) });
    } else {
      console.log("nuovi",data.angles)
      data.angles.forEach(function (dimensione_ordinata) {
        if (dimensione_ordinata.value.length != 0) {
          let tdelay = d3.transition().duration(2000)
          let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")
          d3.select("#T_" + label_text).transition(tdelay)
          .attr("x", () => { return ((radius+8)  * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
          .attr("y", () => { return ((radius+6)  * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })
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
      .attr("cx",  (d, i) => { return ((radius+1) * Math.cos(-Math.PI / 2 + (d.start))) })
      .attr("cy",  (d, i) => { return ((radius+1) * Math.sin(-Math.PI / 2 + (d.start))) })
      .on('mouseover',  function () {d3.select(this).attr("r", '2') })
      .on('mouseout', function () {d3.select(this).attr("r", '1.5')})
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
  let calculatePointPosition = function(){
    data.entries.forEach(function (point){
      let x_1_j = { 'denominator': 0, 'numerator': 0 };
      let x_2_j = { 'denominator': 0, 'numerator': 0 };
      data.angles.forEach(function(dim){
        x_1_j.numerator = x_1_j.numerator + (point.dimensions[dim.value] * Math.cos(dim.start));
        x_1_j.denominator = x_1_j.denominator + point.dimensions[dim.value];
        x_2_j.numerator = x_2_j.numerator + (point.dimensions[dim.value] * Math.sin(dim.start));
        x_2_j.denominator = x_2_j.denominator + point.dimensions[dim.value];
      })
      if ( x_1_j.numerator == 0 || x_1_j.denominator == 0){
        point['x1'] = 0;
      } else {
        point['x1'] = x_1_j.numerator / x_1_j.denominator;
      }
      if (x_2_j.numerator == 0 || x_2_j.denominator == 0){
        point['x2'] = 0;
      } else {
        point['x2'] = x_2_j.numerator / x_2_j.denominator;
      }
    })
  }
  //
  const drawPoints = function(){
    
        
    d3.select('#points-g').selectAll("circle.data_point")
      .data(data.entries, (d,i) => i)
      .join(
        enter => enter.append("circle")
        .attr('class', 'data_point')
      .attr("id",  (d,i) => { return "p_" + i; })
      .attr("r", '1')
      .style("fill",'blue')
      .style("opacity", 1)
      .style("stroke", "black")
      .style("stroke-width",  (d) => {
        if (d.selected) {
          return 1.5;
        } else {
          return 0.2;
        }
      })
      .attr("cx",(d) => { return scale_x2(d.x2) })
      .attr("cy",(d) => { return scale_x1(d.x1) })
      );
  }
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
      let g_radviz = svg.append('g')
        .attr('id', 'radviz-g')
        .attr('height', SVG_SIDE-((SVG_SIDE*(margin_percentage/100)*2)))
        .attr('width',SVG_SIDE-((SVG_SIDE*(margin_percentage/100)*2)))
        .attr("transform", "translate(" + SVG_SIDE/2+ "," +SVG_SIDE/2 + ")")
      g_radviz.append('circle')
        .attr('id', 'circumference')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radius)
        .style('stroke', "black" )
        .style('stroke-width', '0.5px')
        .style('fill', "white")
      

      d3.selectAll(".grid").remove()
      const g_grid = svg.append('g')
      .attr('id', 'grid-g')
      .attr('height', SVG_SIDE-((SVG_SIDE*(margin_percentage/100)*2)))
      .attr('width',SVG_SIDE-((SVG_SIDE*(margin_percentage/100)*2)))
      .attr("transform", "translate(" + SVG_SIDE/2+ "," +SVG_SIDE/2 + ")")
      let l
      for (l = 0; l < level_grid; l++) {
        const arc = d3.arc()
            .innerRadius(function () { 
                if (l == 0) return 0; 
                else return ((((SVG_SIDE-((SVG_SIDE*(margin_percentage/100)*2)))/2)*l)/level_grid)
              })
            .outerRadius( () => { if(l == 0) return ((SVG_SIDE- ((SVG_SIDE*(margin_percentage/100)*2)))/2) / level_grid; else return (((SVG_SIDE- ((SVG_SIDE*(margin_percentage/100)*2)))/2 * (l + 1)) / level_grid); })
            .startAngle( (d) => { return d.start; })
            .endAngle( (d) => { return d.end; })
          
            g_grid.selectAll('mySlices')
            .data(data.angles)
            .enter()
            .append('path')
            .attr('id', (d) => {;return 'area_' + (l + 1) + '_' + (d.index + 1) })
            .attr('class', 'grid')
            .attr('d', arc)
            .attr('fill', 'white')
            .attr("stroke", "black")
            .style("stroke-opacity", 0.4)
            .style("stroke-width", "0.25px")
            .style("opacity", 0.7)
        }
        drawAnchorPoints()
      
        const g_points = svg.append('g')
        .attr('id', 'points-g')
        .attr('height', SVG_SIDE-((SVG_SIDE*(margin_percentage/100)*2)))
        .attr('width',SVG_SIDE-((SVG_SIDE*(margin_percentage/100)*2)))
        .attr("transform", "translate(" + SVG_SIDE/2+ "," +SVG_SIDE/2 + ")")
        calculatePointPosition(data.angles.map(d => d.value))
        initializeScale()
        drawPoints()
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
    if ( _ > 15) margin_percentage = 15
    else margin_percentage = _
  }
  //
  radviz.setLevel = function (_) {
    if (!arguments.length) level_grid = 0
    if ( _ > 20) level_grid = 20
    else level_grid = _
  }
  //
  return radviz
}
