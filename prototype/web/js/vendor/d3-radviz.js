// https://github.com/aware-diag-sapienza/d3-radviz v0.0.1 Copyright 2020 A.WA.RE Research Group (http://aware.diag.uniroma1.it/)
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('os')) :
typeof define === 'function' && define.amd ? define(['exports', 'os'], factory) :
(global = global || self, factory(global.d3 = global.d3 || {}, global.os));
}(this, (function (exports, os) { 'use strict';

const getDimensionValues = (dimension, entries) => {
    const values = entries.map(e => +e[dimension]);
    return {
        numeric: !values.some(isNaN),
        values: !values.some(isNaN) ? values : entries.map(e => e[dimension])
    }
};

const minMaxNormalization = (values) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    console.log("min", min, "max", max);
    let checkDivision = function(v, mi, ma) {
        if ((v - mi) == 0 || (ma - mi) == 0) return 0;
        else return (v - mi) / (ma - mi)
    };
    return values.map(v => checkDivision(v, min, max))
};

function checkData(data) {
    // TODO: update checkData
    return 'entries' in data && 'dimensions' in data && 'attributes' in data
}

function checkDataset(dataset) {
    // TODO: update checkDataset
    return Array.isArray(dataset)
}

function loadDataset(dataset, name) {
    let classification = null;
    if (arguments.length == 2) classification = name;
    if (!checkDataset(dataset)) throw new TypeError('Invalid input')
    const data = {
        entries: [],
        dimensions: [],
        attributes: [],
        original: [],
        angles: []
    };
    Object.keys(dataset[0]).forEach(k => {
        let { numeric, values } = getDimensionValues(k, dataset);
        data['original'].push({
            id: k,
            values: values
        });
        if (classification != k) {
            data[numeric ? 'dimensions' : 'attributes'].push({
                id: k,
                values: numeric ? minMaxNormalization(values) : values
            });
        } else {
            data['attributes'].push({
                id: k,
                values: values
            });
        }

    });
    if (!data.dimensions.length) throw new Error('At least one numerical attribute is required')

    for (let i = 0; i < dataset.length; i++) {
        let entry = {
            dimensions: {},
            attributes: {},
            original: {},
            x1: 0,
            x2: 0,
            selected: false,
            errorE: 0,
            index: i
        };
        for (const d of data.dimensions) entry.dimensions[d.id] = d.values[i];
        for (const a of data.attributes) entry.attributes[a.id] = a.values[i];
        for (const o of data.original) entry.original[o.id] = o.values[i];
        data.entries.push(entry);
    }

    data.angles = assignAnglestoDimensions(data.dimensions.map((d) => d.id));
    return data
}

function assignAnglestoDimensions(dimensions) {
    let real_dimensions = [];
    dimensions.forEach(function(d, i) {
        let start_a = -1;
        let end_a = (((360 / dimensions.length) * Math.PI) / 180) * (i + 1);
        let x2, x1;
        if (i == 0) {
            start_a = 0;
            x2 = 0;
            x1 = Math.sin((Math.PI / 2) + (start_a));
        } else {
            start_a = (((360 / dimensions.length) * Math.PI) / 180) * (i);
            if (start_a == 1.5707963267948966) {
                x1 = 0;
            } else {
                x1 = Math.sin((Math.PI / 2) + (start_a));
            }
            if (start_a == 3.141592653589793) {
                x2 = 0;
            } else {
                x2 = Math.cos((-Math.PI / 2) + (start_a));
            }
        }


        real_dimensions.push({
            'value': d,
            'index': i,
            'start': start_a,
            'end': end_a,
            'drag': false,
            'x1': x1,
            'x2': x2,
        });
    });

    return real_dimensions;
}

// Adapted from https://benclinkinbeard.com/d3tips/make-any-chart-responsive-with-one-function/

function responsiveSquare(svg) {
  const container = d3.select(svg.node().parentNode);
  svg.call(resize);
  d3.select(window).on(`resize.${container.attr('id')}`, resize);
  function resize() {
    const w = parseInt(container.node().getBoundingClientRect().width),
          h = parseInt(container.node().getBoundingClientRect().height),
          s = Math.min(w, h);
    svg.attr('width', s);
    svg.attr('height', s);
  }
}

//import { normalize } from 'path'

const SVG_SIDE = 100;

function Radviz() {
    //
    let data = {
            entries: [],
            dimensions: [],
            attributes: [],
            angles: []
        };
        //
    let index_radviz = 0;
    //
    let margin_percentage = 15;
    let level_grid = 10;
    let radius = (SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2;
        //
    let scale_x1 = d3.scaleLinear().domain([-1, 1]).range([radius, -radius]);
    let scale_x2 = d3.scaleLinear().domain([-1, 1]).range([-radius, radius]);

    let r = 1;
    let mean_error_e = 0;
    let mean_distance = 0;
    let attribute_color = null;
    let quality = true;
    let function_update_results = null;
    let function_click = null;
    let function_drag_end = null;
    let function_mouse_over = null;
    let function_mouse_out = null;
    let function_context_menu = null;
    let scale_color = function(x) {
        return d3.interpolateWarm(d3.scaleLinear().domain([0, 1]).range([1, 0])(x))
    };
    let scale_classification = d3.scaleOrdinal(d3.schemeCategory10).domain(new Set(data.attributes.filter(function(pilot) { return pilot.id === attribute_color }).map(d => d.values)[0]));
        //
    let updateData = function() {

        d3.select('#points-g-' + index_radviz).selectAll("circle.data_point-" + index_radviz)
            .data(data.entries, (d, i) => i)
            .join(
                enter => enter.append("circle")
                .attr('class', 'data_point-' + index_radviz)
                .attr("id", (d, i) => { return "p_" + i + '-' + index_radviz; })
                .attr("r", r)
                .style("fill", function(d) {
                    if (quality) return scale_color(d.errorE)
                    else if (attribute_color == null) return '#1f78b4';
                    else {
                        return scale_classification(d.attributes[attribute_color])
                    }
                })
                .style("opacity", 1)
                .style("stroke", "black")
                .style("stroke-width", (d) => {
                    if (d.selected) {
                        return 0.5;
                    } else {
                        return 0.2;
                    }
                })
                .attr("cx", function(d) { return scale_x2(d.x2) })
                .attr("cy", function(d) { return scale_x1(d.x1) })
                .on("contextmenu", function(d, i) {
                    d3.event.preventDefault();
                    d3.select('#points-g-' + index_radviz).selectAll("circle.data_point-" + index_radviz).style("stroke-width", 0.2);
                    d3.select(this).style("stroke-width", 0.5);
                    data.angles = assignAnglestoDimensions(calculateSinglePointHeuristic(d));
                    d3.selectAll(".AP_points" + index_radviz).remove();
                    drawAnchorPoints(true);
                    calculatePointPosition();
                    d3.select('#points-g-' + index_radviz).selectAll("circle.data_point-" + index_radviz).data(data.entries, (d, i) => i);
                    updateData();
                    if (function_context_menu != null)
                        function_context_menu(data.angles);
                })
                .on("click", function(d) {
                    if (function_click != null)
                        function_click(data.angles, d, d3.select(this));

                    console.log("x1", d.x1);
                    console.log("x2", d.x2);
                    console.log("errorE", d.errorE);
                })
                .on('mouseover', function(d) {
                    if (function_mouse_over != null)
                        function_mouse_over(data.angles, d);
                })
                .on('mouseout', function(d) {
                    if (function_mouse_out != null)
                        function_mouse_out(d);
                }),
                update => update
                .call(update => update
                    .transition()
                    .duration(1000)
                    .style("fill", function(d) {
                        if (quality) return scale_color(d.errorE)
                        else if (attribute_color == null) return '#1f78b4';
                        else {
                            data.attributes;
                            return scale_classification(d.attributes[attribute_color])
                        }
                    })
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
        //updateResults()
        if (function_update_results != null)
            function_update_results(mean_error_e);
    };

    //

    const distance2points = function(P, AP) {
            return Math.sqrt(Math.pow((P.x1 - AP.x1), 2) + Math.pow((P.x2 - AP.x2), 2))
        };
        //
    let calculateErrorE = function() {
            let sum_error = 0;
            data.entries.forEach(function(V, i) {
                let errorE = 0;
                let E = 0;
                let Z = 0;
                let distances = [];
                data.angles.forEach(function(dimension) {
                    let entry = {};
                    entry['id'] = dimension.value;
                    entry['value'] = distance2points(V, dimension);
                    distances.push(entry);
                });

                distances = distances.slice().sort((a, b) => d3.descending(a.value, b.value));


                let A = distances.map(d => d.id);

                for (let i = 0; i < A.length; i++) {
                    for (let j = 0; j < A.length; j++) {
                        if (j > i) {
                            if (V.dimensions[A[i]] > V.dimensions[A[j]]) {
                                E = E + Math.abs(V.dimensions[A[i]] - V.dimensions[A[j]]);
                            }
                        }
                        Z = Z + Math.abs(V.dimensions[A[i]] - V.dimensions[A[j]]);
                    }
                }
                errorE = E / (Z / 2);
                if (isNaN(errorE)) errorE = 0;

                V.errorE = errorE;
                sum_error = sum_error + errorE;
            });

            console.log('***ERROR', sum_error / data.entries.length);
            return sum_error / data.entries.length
        };
        //
    let dragstarted = function(d) {
            d3.select(this).raise().classed("active", true);
        };
        //
    let dragged = function(d) {
            d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
            d.drag = true;
        };
        //
    let dragended = function(d) {
            if (d.drag == true) {
                d3.select(this).classed("active", false);
                d.drag = false;
                let new_angle = dragendangle(d3.select(this).attr("cx"), d3.select(this).attr("cy"), d3.select(this).attr("id"), d);
                data.angles = assignAnglestoDimensions(newOrderDimensions(new_angle, data.angles));

                d3.selectAll('.AP_points-' + index_radviz).remove();
                drawAnchorPoints(true);
                calculatePointPosition();
                d3.select('#points-g-' + index_radviz).selectAll("circle.data_point-" + index_radviz).data(data.entries, (d, i) => i);
                updateData();
                if (function_drag_end != null)
                    function_drag_end(data.angles);

            }
        };
        //
    let dragendangle = function(x, y, id, d) {
            console.log('x', x);
            console.log('y', y);
            console.log('id', id);
            console.log('d', d);
            let distance = Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2)));
            let cosangolo = x / distance;
            let sinangolo = y / distance;
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
            console.log('angle', angle);
            console.log('id', id);
            return [angle, id];
        };
        //
    let newOrderDimensions = function(angle, dimensions) {
            console.log(angle, dimensions);
            let new_dimensions = [];
            let dimension_changed = angle[1].replace("AP_", '');
            dimension_changed = dimension_changed.replace("-" + index_radviz, '');
            console.log('dimension_changed', dimension_changed);
            console.log('dimensions', dimensions);

            let founded = false;
            let founded_angle = false;
            let index_found = -1;
            let new_position = 0;
            let index_changed = -1;
            let i;

            for (i = 0; i < dimensions.length; i++) {
                console.log(i, ')', dimensions[i].value.replace(/ /g, ""), dimension_changed);
                if (dimensions[i].value.replace(/ /g, "") == dimension_changed) {

                    index_changed = i;
                    founded = true;

                    if (founded_angle) {
                        delete dimensions[index_changed].index;
                        dimensions[index_changed].index = (dimensions[index_found].index) + 1;
                        new_dimensions[index_found + 1] = dimensions[index_changed].value;

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

                return dimensions.map(function(d) { return d.value; });
            } else {

                return new_dimensions;
            }
        };
        //
    const drawAnchorPoints = function(drag = false) {
            if (!drag) {
                d3.select('#grid-g-' + index_radviz).selectAll("text.label-" + index_radviz)
                    .data(data.angles)
                    .enter().append("text")
                    .attr("id", (d) => { return "T_" + d.value.replace(/ /g, "") + '-' + index_radviz; })
                    .attr("class", "attr_label-" + index_radviz)
                    .attr("x", (d, i) => { return ((radius + 8) * Math.cos(-Math.PI / 2 + (d.start))) })
                    .attr("y", (d, i) => { return ((radius + 6) * Math.sin(-Math.PI / 2 + (d.start))) })
                    .attr("fill", "black")
                    .style("font-size", "3px")
                    .attr("alignment-baseline", "middle")
                    .attr("text-anchor", "middle")
                    .text((d, i) => {
                        if (d.value.includes(' ')) return d.value.substring(0, d.value.indexOf(' '));
                        else return d.value;
                    });
            } else {
                data.angles.forEach(function(dimensione_ordinata) {
                    if (dimensione_ordinata.value.length != 0) {
                        let tdelay = d3.transition().duration(1000);
                        let label_text = dimensione_ordinata.value.replace(/ /g, "");
                        d3.select("#T_" + label_text + '-' + index_radviz).transition(tdelay)
                            .attr("x", () => { return ((radius + 8) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                            .attr("y", () => { return ((radius + 6) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) });
                    }
                });
            }
            d3.select('#grid-g-' + index_radviz).selectAll(".AP_points-" + index_radviz)
                .data(data.angles)
                .enter().append("circle")
                .attr("class", "AP_points-" + index_radviz)
                .attr("id", (d) => { return "AP_" + d.value.replace(/ /g, "") + '-' + index_radviz; })
                .attr("r", '0.7')
                .style("fill", '#660000')
                .attr("cx", (d, i) => { return ((radius + 1) * Math.cos(-Math.PI / 2 + (d.start))) })
                .attr("cy", (d, i) => { return ((radius + 1) * Math.sin(-Math.PI / 2 + (d.start))) })
                .on('mouseover', function() { d3.select(this).attr("r", '1.5'); })
                .on('mouseout', function() { d3.select(this).attr("r", '0.7'); })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
        };
        //
    let calculatePointPosition = function() {
        let sum_mean_distance = 0;
        data.entries.forEach(function(point) {
            let x_1_j = { 'denominator': 0, 'numerator': 0 };
            let x_2_j = { 'denominator': 0, 'numerator': 0 };
            data.angles.forEach(function(dim) {
                x_1_j.numerator = x_1_j.numerator + (point.dimensions[dim.value] * Math.cos(dim.start));
                x_1_j.denominator = x_1_j.denominator + point.dimensions[dim.value];
                x_2_j.numerator = x_2_j.numerator + (point.dimensions[dim.value] * Math.sin(dim.start));
                x_2_j.denominator = x_2_j.denominator + point.dimensions[dim.value];
            });
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

            sum_mean_distance = sum_mean_distance + Math.sqrt(Math.pow(point['x1'], 2) + Math.pow(point['x2'], 2));
        });
        mean_error_e = calculateErrorE();
        mean_distance = sum_mean_distance / data.entries.length;
    };
    let drawGrid = function() {
            d3.selectAll(".grid-" + index_radviz).remove();

            let l;
            for (l = 0; l < level_grid; l++) {
                const arc = d3.arc()
                    .innerRadius(function() {
                        if (l == 0) return 0;
                        else return ((((SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2) * l) / level_grid)
                    })
                    .outerRadius(() => {
                        if (l == 0) return ((SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2) / level_grid;
                        else return (((SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2 * (l + 1)) / level_grid);
                    })
                    .startAngle((d) => { return d.start; })
                    .endAngle((d) => { return d.end; });

                d3.select('#grid-g-' + index_radviz).selectAll('mySlices')
                    .data(data.angles)
                    .enter()
                    .append('path')
                    .attr('id', (d) => { return 'area_' + (l + 1) + '_' + (d.index + 1) + '-' + index_radviz })
                    .attr('class', 'grid-' + index_radviz)
                    .attr('d', arc)
                    .attr('fill', 'white')
                    .attr("stroke", "black")
                    .style("stroke-opacity", 0.4)
                    .style("stroke-width", "0.25px")
                    .style("opacity", 0.7);
            }
        };
        //

    let calculateSinglePointHeuristic = function(point) {

        let element = {};
        data.angles.forEach(function(d) {
            element[d.value] = point.dimensions[d.value];
        });

        let result = Object.keys(element).sort(function(a, b) {
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
            } else {
                prova[e] = result[i];
                e--;
            }
        }

        return prova

    };
    const radviz = function(selection) {
            selection.each(function() {
                const container = d3.select(this)
                    .attr('class', 'radviz-container-' + index_radviz);
                const svg = container.append('svg')
                    .attr('class', 'radviz-svg-' + index_radviz)
                    .attr('viewBox', `0 0 ${SVG_SIDE} ${SVG_SIDE}`)
                    .attr('preserveAspectRatio', 'xMidYMid meet')
                    .call(responsiveSquare);
                let g_radviz = svg.append('g')
                    .attr('id', 'radviz-g-' + index_radviz)
                    .attr('height', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
                    .attr('width', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
                    .attr("transform", "translate(" + SVG_SIDE / 2 + "," + SVG_SIDE / 2 + ")");
                g_radviz.append('circle')
                    .attr('id', 'circumference-' + index_radviz)
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', radius)
                    .style('stroke', "black")
                    .style('stroke-width', '0.5px')
                    .style('fill', "white");

                svg.append('g')
                    .attr('id', 'grid-g-' + index_radviz)
                    .attr('height', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
                    .attr('width', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
                    .attr("transform", "translate(" + SVG_SIDE / 2 + "," + SVG_SIDE / 2 + ")");
                svg.append('g')
                    .attr('id', 'points-g-' + index_radviz)
                    .attr('height', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
                    .attr('width', SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2)))
                    .attr("transform", "translate(" + SVG_SIDE / 2 + "," + SVG_SIDE / 2 + ")");

                drawGrid();
                drawAnchorPoints();
                calculatePointPosition();
                updateData();
            });
        };
        //
    radviz.data = function(_, cl) {
            if (!arguments.length) return data
            if (checkData(_)) data = _;
            else if (checkDataset(_)) data = loadDataset(_, cl);
            else throw new TypeError('Invalid data')
            if (typeof updateData === 'function') updateData();
            index_radviz = new Date().getTime();
            return radviz
        };
        //
    radviz.getIndex = function() {
            return index_radviz;
        };
        //
    radviz.setColorClassification = function(_) {
            if (!arguments.length) return null
            if (data.attributes.map((d) => d.id).includes(_)) {
                attribute_color = _;
                scale_classification = d3.scaleOrdinal(d3.schemeCategory10).domain(new Set(data.attributes.filter(function(pilot) { return pilot.id === attribute_color }).map(d => d.values)[0]));
            } else
                attribute_color = null;
            console.log(data.attributes, data.dimensions);
        };
        //
    radviz.setMargin = function(_) {
            if (!arguments.length) margin_percentage = 0;
            if (_ > 15) margin_percentage = 15;
            else margin_percentage = _;
        };
        //
    radviz.setLevel = function(_) {
            if (!arguments.length) level_grid = 0;
            if (_ > 20) level_grid = 20;
            else level_grid = _;
        };
        //
    radviz.setRadiusPoints = function(_) {
            if (!arguments.length) r = 1;
            if (_ > 10) r = 10;
            else r = _;

            d3.select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).attr("r", r);
        };
        //
    radviz.increaseRadius = function() {
            if (r < 10) r = r + 0.25;
            d3.select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).attr("r", r);
        };
        //
    radviz.decreaseRadius = function() {

            if (r > 0.25) r = r - 0.25;
            d3.select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).attr("r", r);

        };
        //
    radviz.increaseLevelGrid = function() {
            if (level_grid < 20) {
                level_grid = level_grid + 1;
                drawGrid();
            }
        };
        //
    radviz.decreaseLevelGrid = function() {
            if (level_grid > 0) {
                level_grid = level_grid - 1;
                drawGrid();
            }
        };
        //
    radviz.setQuality = function() {
            quality = !quality;
            updateData();
        }; 
        //
    radviz.getQuality = function() {
            return quality;
        };
        //
    radviz.setColorPoint = function(flag) {
            // flag: 
            // = 0 allora uso metrica
            // = 1 allora metto il blu
            // = 2 allora metto un altro
            switch (flag) {
                case (0):
                    quality = true;

                    break;
                case (1):
                    quality = false;
                    break;
                case (2):
                    quality = false;
                    break;
            }
            updateData();
        };
        //
    radviz.setFunctionDragEnd = function(ff) {
            function_drag_end = ff;
        };
        //
    radviz.setFunctionClick = function(ff) {
            function_click = ff;
        };
        //
    radviz.setFunctionMouseOver = function(ff) {
            function_mouse_over = ff;
        };
        //
    radviz.setFunctionMouseOut = function(ff) {
            function_mouse_out = ff;
        };
        //
    radviz.setFunctionContextMenu = function(ff) {
            function_context_menu = ff;
        };
        //
    radviz.setFunctionUpdateResults = function(ff) {
            function_update_results = ff;
        };
        //
    radviz.updateRadviz = function(order_dimensions) {
            let mapping_dimension = [];
            if (!arguments.length) {
                mapping_dimension = data.dimensions.map(d => d.id);
            } else {
                let new_order_dimensions = order_dimensions.slice();
                ///new_order_dimensions[0] = 0, new_order_dimensions[1] < new_order_dimensions[n-1]
                while (new_order_dimensions[0] != 0) {
                    let dim = new_order_dimensions.shift();
                    new_order_dimensions.push(dim);
                }
                if (new_order_dimensions[1] > new_order_dimensions[new_order_dimensions.length - 1]) {
                    let dim = new_order_dimensions.shift();
                    new_order_dimensions.reverse();
                    new_order_dimensions.unshift(dim);
                }
                new_order_dimensions.forEach(function(num) {
                    mapping_dimension.push(data.dimensions[num].id);
                });

            }
            // sono arrivata qui ad inserire -' + index_radviz) 
            console.log('******');
            data.angles = assignAnglestoDimensions(mapping_dimension);
            d3.selectAll('.AP_points-' + index_radviz).remove();
            drawAnchorPoints(true);
            calculatePointPosition();
            d3.select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).data(data.entries, (d, i) => i);
            updateData();
        };
        //
        radviz.calculateRadvizMeanDistance = function(order_dimensions) { // order _dimensions is a list of index.

            console.log('entro qui');
            let copy_data = Object.assign({}, data);
            console.log(copy_data);
            let mapping_dimension = [];
            if (!arguments.length) {
                mapping_dimension = copy_data.dimensions.map(d => d.id);
            } else {
                let new_order_dimensions = order_dimensions.slice();
                ///new_order_dimensions[0] = 0, new_order_dimensions[1] < new_order_dimensions[n-1]
                while (new_order_dimensions[0] != 0) {
                    let dim = new_order_dimensions.shift();
                    new_order_dimensions.push(dim);
                }
                if (new_order_dimensions[1] > new_order_dimensions[new_order_dimensions.length - 1]) {
                    let dim = new_order_dimensions.shift();
                    new_order_dimensions.reverse();
                    new_order_dimensions.unshift(dim);
                }
                new_order_dimensions.forEach(function(num) {
                    mapping_dimension.push(copy_data.dimensions[num].id);
                });

            }
            ì;
            
            copy_data.angles = assignAnglestoDimensions(mapping_dimension);
            let sum_mean_distance = 0;
            copy_data.entries.forEach(function(point) {
            let x_1_j = { 'denominator': 0, 'numerator': 0 };
            let x_2_j = { 'denominator': 0, 'numerator': 0 };
            copy_data.angles.forEach(function(dim) {
                x_1_j.numerator = x_1_j.numerator + (point.dimensions[dim.value] * Math.cos(dim.start));
                x_1_j.denominator = x_1_j.denominator + point.dimensions[dim.value];
                x_2_j.numerator = x_2_j.numerator + (point.dimensions[dim.value] * Math.sin(dim.start));
                x_2_j.denominator = x_2_j.denominator + point.dimensions[dim.value];
            });
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

            sum_mean_distance = sum_mean_distance + Math.sqrt(Math.pow(point['x1'], 2) + Math.pow(point['x2'], 2));
        });
        console.log(copy_data);
            return sum_mean_distance / copy_data.entries.length;

        };
        //
    radviz.remove = function(bool) {
        if (!arguments.length) return
        else {
            if (bool) d3.select('.radviz-svg-' + index_radviz).remove();
        }
    };

    radviz.getAttrColor = function() {
        if (!arguments.length) return
        else {
            return attribute_color
        }
    };

    return radviz
}

const radvizDA = (function(){
    /*
    *
    */
    this.maxMeanDistanceHeuristic = function(data){
        const set = data.dimensions.map(d => d.values);
        const entriesSum = set[0].map((_, entryIndex) => 
            [...new Array(set.length)].map((_, dimensionIndex) =>
            set[dimensionIndex][entryIndex]
            )
        ).map(valueDimensions => valueDimensions.reduce((sumValues, currentValue) => sumValues + currentValue));
        console.log('set', set);
        console.log('entriesSum', entriesSum);
        const dimensionsSum = set.map(dimension => dimension.reduce((a, b) => a + b, 0));
        const dimensionsByRank = dimensionsSum.map((sum, i) => ({i, sum})).sort((a,b) => a.sum <= b.sum ? 1 : -1).map(o => o.i);
        const normalizedSet = set.map(dimensionValues => dimensionValues.map((entryValue, entryIndex) => entriesSum[entryIndex] > 0 ? entryValue / entriesSum[entryIndex] : 0));
        let availablePositions = [...new Array(set.length)].map((_, i) => i);
        console.log('dimensionsSum', dimensionsSum);
        console.log('dimensionsByRank', dimensionsByRank);
        console.log('normalizedSet', normalizedSet);
        console.log('availablePositions', availablePositions);
        console.log('--- END INIT ---');
        let pointsAssignedPositions = [...new Array(set[0].length)].map(_ => [0, 0]);
        const arrangement = [...new Array(set.length)].fill(null);
        for (const [rankIndex, dimensionIndex] of dimensionsByRank.entries()) {
            let currentPosition;
            if (rankIndex === 0) {
            currentPosition = 0;
            }
            else if (rankIndex === dimensionsByRank.length - 1) {
            currentPosition = availablePositions[0];
            }
            else {
            let currentDimensionValues = normalizedSet[dimensionIndex];
            let othersDimensionsByRank = dimensionsByRank.slice(rankIndex + 1);
            let othersDimensionsValues = othersDimensionsByRank.map(otherDimensionIndex => normalizedSet[otherDimensionIndex]);
            let othersMeanValues = othersDimensionsValues[0].map((_, entryIndex) => 
                othersDimensionsByRank.map((_, otherDimensionIndex) => 
                othersDimensionsValues[otherDimensionIndex][entryIndex]
                )
            ).map(valueDimensions => valueDimensions.reduce((sumValues, currentValue) => 
                sumValues + currentValue) / othersDimensionsByRank.length
            );
            console.log('currentDimensionValues', currentDimensionValues);
            console.log('othersDimensionsByRank', othersDimensionsByRank);
            console.log('othersDimensionsValues', othersDimensionsValues);
            console.log('othersMeanValues', othersMeanValues);
            let currentMagnitude = -Infinity;
            for (const possiblePosition of availablePositions) {
                console.log('possiblePosition', possiblePosition);
                let otherPositions = availablePositions.filter(pos => pos !== possiblePosition);
                console.log('otherPositions', otherPositions);
                let pointsPossiblePositions = pointsAssignedPositions.map(point => point.slice());
                pointsPossiblePositions = pointsPossiblePositions.map(([x1, x2], entryIndex) => [
                x1 + normalizedSet[dimensionIndex][entryIndex] * Math.cos(2 * Math.PI * possiblePosition / set.length), 
                x2 + normalizedSet[dimensionIndex][entryIndex] * Math.sin(2 * Math.PI * possiblePosition / set.length)
                ]);
                for (const otherPosition of otherPositions) {
                pointsPossiblePositions = pointsPossiblePositions.map(([x1, x2], entryIndex) => [
                    x1 + othersMeanValues[entryIndex] * Math.cos(2 * Math.PI * otherPosition / set.length), 
                    x2 + othersMeanValues[entryIndex] * Math.sin(2 * Math.PI * otherPosition / set.length)
                ]);
                }
                console.log('pointsPossiblePositions', pointsPossiblePositions);
                let possibleMagnitude = pointsPossiblePositions.map(([x1, x2]) => Math.sqrt(Math.pow(x1, 2) + Math.pow(x2, 2))).reduce((p, c) => p + c, 0) / pointsPossiblePositions.length;
                console.log('possibleMagnitude', possibleMagnitude);
                if (possibleMagnitude > currentMagnitude) {
                currentPosition = possiblePosition;
                currentMagnitude = possibleMagnitude;
                }
            }
            console.log('currentPosition', currentPosition);
            }
            arrangement[currentPosition] = dimensionIndex;
            availablePositions.splice(availablePositions.indexOf(currentPosition), 1);
            pointsAssignedPositions = pointsAssignedPositions.map(([x1, x2], entryIndex) => [
            x1 + normalizedSet[dimensionIndex][entryIndex] * Math.cos(2 * Math.PI * currentPosition / set.length), 
            x2 + normalizedSet[dimensionIndex][entryIndex] * Math.sin(2 * Math.PI * currentPosition / set.length)
            ]);
            console.log('availablePositions', availablePositions);
            console.log('pointsAssignedPositions', pointsAssignedPositions);
            console.log('arrangement', arrangement);
        }
        return arrangement
    };
    /*
    *
    */
    this.minEffectivenessErrorHeuristic = function(data, k=null){
        function arrangementCost(costMatrix, arr){
            let cost = 0;
            for(let i=0; i<arr.length; i++){
                let j = (i+1)%arr.length;
                cost += costMatrix[arr[i]][arr[j]];
            }
            return cost;
        }
        function arrangementSwap(arr, i, j){
            let result = arr.slice(); //JSON.parse(JSON.stringify(arr));
            let tmp = result[i];
            result[i] = result[j];
            result[j] = tmp;
            return result; 
        }
        ///

        console.log(data);
        console.log(data.dimensions.map(d=> d.id));
        let m = data.entries.length;
        let n = data.dimensions.length;
        if(k == null) k = 10;
        let C = Array(n).fill(null).map(()=>Array(n).fill(0));
        for(let j=0; j<n; j++) C[j][j] = Infinity; //fill diagonal with infinity
        for(let i=0; i<m; i++){
            let delta = 0;
            for(let dim1=0; dim1<n; dim1++){
                for(let dim2=0; dim2<n; dim2++){
                    delta += Math.abs(data.dimensions[dim1].values[i] - data.dimensions[dim2].values[i]);
                }
            }
            for(let dim1=0; dim1<n; dim1++){
                for(let dim2=0; dim2<n; dim2++){
                    if(dim1 == dim2) continue;
                    if(delta != 0) C[dim1][dim2] += Math.abs(data.dimensions[dim1].values[i] - data.dimensions[dim2].values[i]) / delta;
                }
            }  
        }
        ////
        let resultArrangement = null;
        let resultArrangementCost = Infinity;
        for(let startDim=0; startDim<n; startDim++){
            let arrangement = [startDim];
            while(arrangement.length != n){ //add a dimension on each loop iteration
                let bestCost = Infinity;
                let bestDim = null;
                let bestPosition = null;
                for(let dim=0; dim<n; dim++){
                    if(arrangement.includes(dim)) continue;
                    let leftCost = C[arrangement[0]][dim];
                    let rightCost = C[arrangement[arrangement.length-1]][dim];
                    let currentBestCost = Math.min(leftCost, rightCost);
                    let currentBestPosition = leftCost < rightCost ? -1 : 1;
                    if(currentBestCost < bestCost){
                        bestDim = dim;
                        bestCost = currentBestCost;
                        bestPosition = currentBestPosition;
                    }
                }
                if(bestPosition == -1) arrangement.unshift(bestDim);
                else arrangement.push(bestDim);
                ///optimize
                if(arrangement.length > 2){
                    let A = arrangement.slice(); 
                    let steps = 0;
                    let improved = true;
                    while(improved && steps < k){
                        improved = false;
                        steps++;
                        let bestA = null;
                        let bestCost = arrangementCost(C, A);
                        for(let i=0; i<A.length; i++){
                            let j=(i+1)%A.length;
                            let tmpA = arrangementSwap(A, i, j);
                            let tmpCost = arrangementCost(C, tmpA);
                            if(tmpCost < bestCost){
                                bestA = tmpA;
                                bestCost = tmpCost;
                            }
                        }
                        if(bestA != null){
                            A = bestA;
                            improved = true;
                        }
                    }
                    arrangement = A;
                }
            }
            let currentCost = arrangementCost(C, arrangement);
            if(currentCost < resultArrangementCost){
                resultArrangement = arrangement;
                resultArrangementCost = currentCost;
            }
        }
        /// 0 as first dimension in the arrangement
        while(resultArrangement[0] != 0){
            let dim = resultArrangement.shift();
            resultArrangement.push(dim);
        }
        if(resultArrangement[1] > resultArrangement[resultArrangement.length-1]){
            let dim = resultArrangement.shift();
            resultArrangement.reverse();
            resultArrangement.unshift(dim);
        }
        return resultArrangement;
  
    };
    /*
    *
    */
   return this;
}).apply({});
/*
// lasciare, magari serve in futuro
function fractionalRanking(entry){
        ///faccio il rannking dell'array di valori passato
        //https://en.wikipedia.org/wiki/Ranking
        function round(value, decimals) {
            return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }
    
        let d = entry.map((v,i) => {
            return {
                value: round(v, 8), 
                index: i, 
                rank: null,
                multiple: false
            };
        }).sort((a,b) => a.value - b.value);
        
        for(let i=0; i<d.length; i++) d[i].rank = (i+1);
        let i = 0;
        while(i < d.length){
            if(i != d.length-1){
                let equalRanks = [d[i].rank];
                for(let j=i+1; j<d.length; j++){
                    if(d[i].value == d[j].value){
                        equalRanks.push(d[j].rank);
                    }
                    else break;
                }
                if(equalRanks.length > 1){
                    let r = d3.mean(equalRanks);
                    for(let j=i; j<i+equalRanks.length; j++){
                        d[j].rank = r;
                    }
                    i += equalRanks.length;
                }
                else i++;
            }
            else i++;
        }
        return d.sort((a,b) => a.index - b.index).map(el => el.rank);
    }
*/

exports.radviz = Radviz;
exports.radvizDA = radvizDA;

Object.defineProperty(exports, '__esModule', { value: true });

})));
