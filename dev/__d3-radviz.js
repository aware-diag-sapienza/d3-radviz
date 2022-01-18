// https://github.com/aware-diag-sapienza/d3-radviz v0.0.2 Copyright 2021 A.WA.RE Research Group (http://aware.diag.uniroma1.it/)
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-transition'), require('d3-array'), require('d3-scale'), require('d3-scale-chromatic'), require('d3-drag'), require('d3-shape')) :
typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-transition', 'd3-array', 'd3-scale', 'd3-scale-chromatic', 'd3-drag', 'd3-shape'], factory) :
(global = global || self, factory(global.d3 = global.d3 || {}, global.d3, global.d3, global.d3, global.d3, global.d3, global.d3, global.d3));
}(this, (function (exports, d3Selection, d3Transition, d3Array, d3Scale, d3ScaleChromatic, d3Drag, d3Shape) { 'use strict';

const getDimensionValues = (dimension, entries) => {
    const values = entries.map(e => +e[dimension]);
    return {
        numeric: !values.some(isNaN),
        values: !values.some(isNaN) ? values : entries.map(e => e[dimension])
    };
};

const minMaxNormalization = (values) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    let checkDivision = function(v, mi, ma) {
        if ((v - mi) == 0 || (ma - mi) == 0) return 0;
        else return (v - mi) / (ma - mi);
    };
    return values.map(v => checkDivision(v, min, max));
};

function checkData(data) {
    // TODO: update checkData
    return 'entries' in data && 'dimensions' in data && 'attributes' in data;
}

function checkDataset(dataset) {
    // TODO: update checkDataset
    return Array.isArray(dataset);
}

function loadDataset(dataset, name) {
    let classification = null;
    if (arguments.length == 2) classification = name;
    if (!checkDataset(dataset)) throw new TypeError('Invalid input');
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
    if (!data.dimensions.length) throw new Error('At least one numerical attribute is required');

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
    return data;
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
    const container = d3Selection.select(svg.node().parentNode);
    svg.call(resize);
    d3Selection.select(window).on(`resize.${container.attr('id')}`, resize);
    function resize() {
        const w = parseInt(container.node().getBoundingClientRect().width),
            h = parseInt(container.node().getBoundingClientRect().height),
            s = Math.min(w, h);
        svg.attr('width', s);
        svg.attr('height', s);
    }
}

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
    let scale_x1 = d3Scale.scaleLinear().domain([-1, 1]).range([radius, -radius]);
    let scale_x2 = d3Scale.scaleLinear().domain([-1, 1]).range([-radius, radius]);

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
        return d3ScaleChromatic.interpolateWarm(d3Scale.scaleLinear().domain([0, 1]).range([1, 0])(x));
    };

    let scale_classification = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10)
        .domain(new Set(data.attributes
            .filter(function(pilot) { return pilot.id === attribute_color; })
            .map(d => d.values)[0]));
    //
    let updateData = function() {

        d3Selection.select('#points-g-' + index_radviz).selectAll("circle.data_point-" + index_radviz)
            .data(data.entries, (d, i) => i)
            .join(
                enter => enter.append("circle")
                    .attr('class', 'data_point-' + index_radviz)
                    .attr("id", (d, i) => { return "p_" + i + '-' + index_radviz; })
                    .attr("r", r)
                    .style("fill", function(d) {
                        if (quality) return scale_color(d.errorE);
                        else if (attribute_color == null) return '#1f78b4';
                        else {
                            return scale_classification(d.attributes[attribute_color]);
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
                    .attr("cx", function(d) { return scale_x2(d.x2); })
                    .attr("cy", function(d) { return scale_x1(d.x1); })
                    .on("contextmenu", function(event, d) {
                        event.preventDefault();
                        d3Selection.select('#points-g-' + index_radviz).selectAll("circle.data_point-" + index_radviz).style("stroke-width", 0.2);
                        d3Selection.select(this).style("stroke-width", 0.5);
                        data.angles = assignAnglestoDimensions(calculateSinglePointHeuristic(d));
                        d3Selection.selectAll(".AP_points" + index_radviz).remove();
                        drawAnchorPoints(true);
                        calculatePointPosition();
                        d3Selection.select('#points-g-' + index_radviz).selectAll("circle.data_point-" + index_radviz).data(data.entries, (d, i) => i);
                        updateData();
                        if (function_context_menu != null)
                            function_context_menu(data.angles);
                    })
                    .on("click", function(d) {
                        if (function_click != null)
                            function_click(data.angles, d, d3Selection.select(this));
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
                            if (quality) return scale_color(d.errorE);
                            else if (attribute_color == null) return '#1f78b4';
                            else {
                                data.attributes;
                                return scale_classification(d.attributes[attribute_color]);
                            }
                        })
                        .style("stroke-width", (d) => {
                            if (d.selected) {
                                return 0.5;
                            } else {
                                return 0.2;
                            }
                        })
                        .attr("cx", (d) => { return scale_x2(d.x2); })
                        .attr("cy", (d) => { return scale_x1(d.x1); }),
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
        return Math.sqrt(Math.pow((P.x1 - AP.x1), 2) + Math.pow((P.x2 - AP.x2), 2));
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

            distances = distances.slice().sort((a, b) => d3Array.descending(a.value, b.value));


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
        return sum_error / data.entries.length;
    };
    //
    let dragstarted = function() {
        d3Selection.select(this).raise().classed("active", true);
    };
    //
    let dragged = function( d) {
        
        
        d3Selection.select(this).attr('cx', d.x = d3Selection.event.x).attr('cy', d.y = d3Selection.event.y);
        d.drag = true;
    };
    //
    let dragended = function(event, d) {
        if (d.drag == true) {
            d3Selection.select(this).classed("active", false);
            d.drag = false;
            const new_angle = dragendangle(d3Selection.select(this).attr("cx"), d3Selection.select(this).attr("cy"), d3Selection.select(this).attr("id"));
            data.angles = assignAnglestoDimensions(newOrderDimensions(new_angle, data.angles));

            d3Selection.selectAll('.AP_points-' + index_radviz).remove();
            drawAnchorPoints(true);
            calculatePointPosition();
            d3Selection.select('#points-g-' + index_radviz).selectAll("circle.data_point-" + index_radviz).data(data.entries, (d, i) => i);
            updateData();
            if (function_drag_end != null)
                function_drag_end(data.angles);

        }
    };
    //
    let dragendangle = function(x, y, id, d) {
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
        return [angle, id];
    };
    //
    let newOrderDimensions = function(angle, dimensions) {
        let new_dimensions = [];
        let dimension_changed = angle[1].replace("AP_", '');
        dimension_changed = dimension_changed.replace("-" + index_radviz, '');

        let founded = false;
        let founded_angle = false;
        let index_found = -1;
        let new_position = 0;
        let index_changed = -1;
        let i;

        for (i = 0; i < dimensions.length; i++) {
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
    
    const drawAnchorPoints = function(supportDrag = false) {
        if (!supportDrag) {
            d3Selection.select('#grid-g-' + index_radviz).selectAll("text.label-" + index_radviz)
                .data(data.angles)
                .enter().append("text")
                .attr("id", (d,i) => { return "T_" + d.value.replace(/ /g, "") + '-' + index_radviz; })
                .attr("class", "attr_label-" + index_radviz)
                .attr("x", (d, i) => { return ((radius + 8) * Math.cos(-Math.PI / 2 + (d.start))); })
                .attr("y", (d, i) => { return ((radius + 6) * Math.sin(-Math.PI / 2 + (d.start))); })
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
                    let tdelay = d3Transition.transition().duration(1000);
                    let label_text = dimensione_ordinata.value.replace(/ /g, "");
                    d3Selection.select("#T_" + label_text + '-' + index_radviz).transition(tdelay)
                        .attr("x", () => { return ((radius + 8) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))); })
                        .attr("y", () => { return ((radius + 6) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))); });
                }
            });
        }
        d3Selection.select('#grid-g-' + index_radviz).selectAll(".AP_points-" + index_radviz)
            .data(data.angles)
            .enter().append("circle")
            .attr("class", "AP_points-" + index_radviz)
            .attr("id", (d) => { return "AP_" + d.value.replace(/ /g, "") + '-' + index_radviz; })
            .attr("r", '0.7')
            .style("fill", '#660000')
            .attr("cx", (d, i) => { return ((radius + 1) * Math.cos(-Math.PI / 2 + (d.start))); })
            .attr("cy", (d, i) => { return ((radius + 1) * Math.sin(-Math.PI / 2 + (d.start))); })
            .on('mouseover', function() { d3Selection.select(this).attr("r", '1.5'); })
            .on('mouseout', function() { d3Selection.select(this).attr("r", '0.7'); })
            .call(d3Drag.drag()
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
        d3Selection.selectAll(".grid-" + index_radviz).remove();

        let l;
        for (l = 0; l < level_grid; l++) {
            const arcPath = d3Shape.arc()
                .innerRadius(function() {
                    if (l == 0) return 0;
                    else return ((((SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2) * l) / level_grid);
                })
                .outerRadius(() => {
                    if (l == 0) return ((SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2) / level_grid;
                    else return (((SVG_SIDE - ((SVG_SIDE * (margin_percentage / 100) * 2))) / 2 * (l + 1)) / level_grid);
                })
                .startAngle((d) => { return d.start; })
                .endAngle((d) => { return d.end; });

            d3Selection.select('#grid-g-' + index_radviz).selectAll('mySlices')
                .data(data.angles)
                .enter()
                .append('path')
                .attr('id', (d) => { return 'area_' + (l + 1) + '_' + (d.index + 1) + '-' + index_radviz; })
                .attr('class', 'grid-' + index_radviz)
                .attr('d', arcPath)
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

        return prova;

    };
    const radviz = function(selection) {
        selection.each(function() {
            const container = d3Selection.select(this)
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
        if (!arguments.length) return data;
        if (checkData(_)) data = _;
        else if (checkDataset(_)) data = loadDataset(_, cl);
        else throw new TypeError('Invalid data');
        if (typeof updateData === 'function') updateData();
        index_radviz = new Date().getTime();
        return radviz;
    };
    //
    radviz.getIndex = function() {
        return index_radviz;
    };
    //
    radviz.setColorClassification = function(_) {
        if (!arguments.length) return null;
        if (data.attributes.map((d) => d.id).includes(_)) {
            attribute_color = _;
            scale_classification = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10).domain(new Set(data.attributes.filter(function(pilot) { return pilot.id === attribute_color; }).map(d => d.values)[0]));
        } else
            attribute_color = null;
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

        d3Selection.select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).attr("r", r);
    };
    //
    radviz.increaseRadius = function() {
        if (r < 10) r = r + 0.25;
        d3Selection.select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).attr("r", r);
    };
    //
    radviz.decreaseRadius = function() {

        if (r > 0.25) r = r - 0.25;
        d3Selection.select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).attr("r", r);

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
        data.angles = assignAnglestoDimensions(mapping_dimension);
        d3Selection.selectAll('.AP_points-' + index_radviz).remove();
        drawAnchorPoints(true);
        calculatePointPosition();
        d3Selection.select('#points-g-' + index_radviz).selectAll('circle.data_point-' + index_radviz).data(data.entries, (d, i) => i);
        updateData();
    };
    //
    radviz.calculateRadvizMeanDistance = function(order_dimensions) { // order _dimensions is a list of index.
        let copy_data = Object.assign({}, data);
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
        return sum_mean_distance / copy_data.entries.length;


        };
        //
    radviz.single_point_procedure = function(d){
            
            d3.select('#points-g-' + index_radviz).selectAll("circle.data_point-" + index_radviz).style("stroke-width", 0.2);
            d3.select("#" +d).style("stroke-width", 0.5);
            data.angles = assignAnglestoDimensions(calculateSinglePointHeuristic(d3.select("#" +d).data()[0]));
            d3.selectAll(".AP_points" + index_radviz).remove();
            drawAnchorPoints(true);
            calculatePointPosition();
            d3.select('#points-g-' + index_radviz).selectAll("circle.data_point-" + index_radviz).data(data.entries, (d, i) => i);
            updateData();
            if (function_context_menu != null)
                function_context_menu(data.angles);
        };
        //

    radviz.remove = function(bool) {
        if (!arguments.length) return;
        else {
            if (bool) d3Selection.select('.radviz-svg-' + index_radviz).remove();
        }
    };

    radviz.getAttrColor = function() {
        if (!arguments.length) return;
        else {
            return attribute_color;
        }
    };

    radviz.scaleX = function(_) {
        if (!arguments.legnth) return scale_x2;
        scale_x2 = _;
        return radviz;
    };

    radviz.scaleY = function(_) {
        if (!arguments.legnth) return scale_x1;
        scale_x1 = _;
        return radviz;
    };

    radviz.center = function() {
        return {
            x: SVG_SIDE / 2,
            y: SVG_SIDE / 2
        };
    };

    return radviz;
}

const radvizDA = (function(){
    /*
    *
    */
    this.normalizeArrangement = function (arrangement) {
        // arrangement is in the form of array of dimension index eg. [0,3,1,4]
        // the function rotates and reflect the arrangement to have (arrangement[0] = 0 && arrangement[1] < arrangement[-1])
        const res = arrangement.map(d => d);
        while(res[0] != 0){
            let dim = res.shift();
            res.push(dim);
        }
        if(res[1] > res[res.length-1]){
            let dim = res.shift();
            res.reverse();
            res.unshift(dim);
        }
        return res;
    };
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
        const dimensionsSum = set.map(dimension => dimension.reduce((a, b) => a + b, 0));
        const dimensionsByRank = dimensionsSum.map((sum, i) => ({i, sum})).sort((a,b) => a.sum <= b.sum ? 1 : -1).map(o => o.i);
        const normalizedSet = set.map(dimensionValues => dimensionValues.map((entryValue, entryIndex) => entriesSum[entryIndex] > 0 ? entryValue / entriesSum[entryIndex] : 0));
        let availablePositions = [...new Array(set.length)].map((_, i) => i);
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
                let currentMagnitude = -Infinity;
                for (const possiblePosition of availablePositions) {
                    let otherPositions = availablePositions.filter(pos => pos !== possiblePosition);
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
                    let possibleMagnitude = pointsPossiblePositions.map(([x1, x2]) => Math.sqrt(Math.pow(x1, 2) + Math.pow(x2, 2))).reduce((p, c) => p + c, 0) / pointsPossiblePositions.length;
                    if (possibleMagnitude > currentMagnitude) {
                        currentPosition = possiblePosition;
                        currentMagnitude = possibleMagnitude;
                    }
                }
            }
            arrangement[currentPosition] = dimensionIndex;
            availablePositions.splice(availablePositions.indexOf(currentPosition), 1);
            pointsAssignedPositions = pointsAssignedPositions.map(([x1, x2], entryIndex) => [
                x1 + normalizedSet[dimensionIndex][entryIndex] * Math.cos(2 * Math.PI * currentPosition / set.length),
                x2 + normalizedSet[dimensionIndex][entryIndex] * Math.sin(2 * Math.PI * currentPosition / set.length)
            ]);
        }
        return arrangement;
    };
    /*
    *
    */
    this.minEffectivenessErrorHeuristic = function(data, fast=false){
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
        let m = data.entries.length;
        let n = data.dimensions.length;
        //if(k == null) k = 10;
        const k = n*2; //max number of iterations of optimization step
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
                ///optimize if not fast version
                if(!fast && arrangement.length > 2){
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
        return this.normalizeArrangement(resultArrangement);
    };
    /*
    *
    */
    this.minEffectivenessErrorHeuristicFast = function(data){
        return this.minEffectivenessErrorHeuristic(data, true)
    };
    /*
    *
    */
    this.clockHeuristic = function(data){
        const dimensions = data.dimensions; //array [ {id: "x", values:[]} ] già normalizzate minmax e somma1
        const representativePoint = dimensions.map((d,i) => {
            return {
                dimensionId: d.id, 
                dimensionIndex: i,
                value: d3.sum(d.values) 
            }
        }).sort((a,b) => b.value - a.value);
        
        const arrangement = [];
        // clock
        representativePoint.forEach((d, i) => {
            if(i%2 == 0) arrangement.push(d.dimensionIndex);
            else arrangement.unshift(d.dimensionIndex);
        });
        return this.normalizeArrangement(arrangement)
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
