if (window.system == undefined) window.system = {}
system.radviz = (function() {
    const that = this;
    /*
     */
    // variabili this.nome variabile.+
    this.circle_radius = 2;
    this.radius = null;
    this.level_grid = 3;
    this.g_grid = null;
    this.w = null;
    this.h = null;
    this.m = { top: 50, bottom: 50, left: 20, rigth: 20 };
    this.center = null;
    this.visual_mean = null;
    this.quantitativeValue = null;
    this.current_configuration = { changed: false };
    this.point_cluster = [];
    this.clusters = [];
    this.clusters_precedenti = [];
    //this.label_attribute = 'Wine'


    /*
     */

    // metodi this.nome_parametri = (variabili di input) => {}

    this.changeQuality = () => {
        
        if (d3.select('#effectiveness-radio').property('checked')){
            d3_radviz.setColorblindSafe(false)
            d3_radviz.showDefaultColor(false)
            d3_radviz.showOutliers(false)
            d3_radviz.setQuality(true)
            system.structure.createGradient();
            
        } 
        else if (d3.select('#cluster-radio').property('checked')) {
            d3_radviz.setColorblindSafe(false)
            d3_radviz.showDefaultColor(false)
            d3_radviz.showOutliers(false)
            d3_radviz.setQuality(false)
            
        }
        else if (d3.select('#colorblind-radio').property('checked')) {
            
            d3_radviz.setColorblindSafe(true)
            d3_radviz.showDefaultColor(false)
            d3_radviz.showOutliers(false)
            d3_radviz.setQuality(true)
            system.structure.createGradient();
        }
    }

    this.isEqual = (array1, array2) => {
        if (array1.length != array2.length) {
            return false;
        }

        array1.forEach(function(a, i) {
            if (a != array2[i]) {
                return false;
            }
        })
        return true;

    };


    this.globalQuality = (perfect, draged) => {
        let min_val = 1,
            max_val = 0;
        if (system.settings.quantile_selected) {
            let x1_value = system.settings.max_quantile_label;
            let x2_value = system.settings.max_quantile_label.substring(0, system.settings.max_quantile_label.length - 1) + "2";
            d3.selectAll(".data_point")
                .each((d) => {
                    let diff = Math.sqrt((Math.pow(d[x1_value], 2) + Math.pow(d[x2_value], 2))) / Math.sqrt((Math.pow(d.px1, 2) + Math.pow(d.px2, 2)));
                    if (diff > max_val) max_val = diff;
                    if (diff < min_val) min_val = diff;
                    system.data.points[d.index]['difference'] = diff;
                    this.quantitativeValue = [0, max_val];
                })

            //switchDomain()
            d3.selectAll(".data_point")
                .each(function(d) {
                    if (system.settings.color_selected) {
                        d3.select(this).style("fill", system.data.colorQuality(system.data.scale_set(d.difference)));
                    } else {
                        d3.select(this).style("fill", system.data.color(d[system.data.cluster_label[system.data.nameDataset]]))
                    }
                })
        } else if (system.settings.indipendent_selected) {

            d3.selectAll(".data_point")
                .each((d) => {

                    let diff = Math.sqrt((Math.pow(d['ix1'], 2) + Math.pow(d['ix2'], 2))) / Math.sqrt((Math.pow(d.px1, 2) + Math.pow(d.px2, 2)));
                    if (diff > max_val) max_val = diff;
                    if (diff < min_val) min_val = diff;

                    system.data.points[d.index]['difference'] = diff;
                    this.quantitativeValue = [0, max_val];
                })

            //switchDomain()
            d3.selectAll(".data_point")
                .each(function(d) {
                    if (system.settings.color_selected) {
                        d3.select(this).style("fill", system.data.colorQuality(system.data.scale_set(d.difference)));
                    } else {
                        d3.select(this).style("fill", system.data.color(d[system.data.cluster_label[system.data.nameDataset]]))
                    }
                })
        } else if (system.settings.radvizplusplus_selected) {

            d3.selectAll(".data_point")
                .each((d) => {

                    let diff = Math.sqrt((Math.pow(d['rx1'], 2) + Math.pow(d['rx2'], 2))) / Math.sqrt((Math.pow(d.px1, 2) + Math.pow(d.px2, 2)));
                    if (diff > max_val) max_val = diff;
                    if (diff < min_val) min_val = diff;

                    system.data.points[d.index]['difference'] = diff;
                    this.quantitativeValue = [0, max_val];
                })

            d3.selectAll(".data_point")
                .each(function(d) {
                    if (system.settings.color_selected) {
                        d3.select(this).style("fill", system.data.colorQuality(system.data.scale_set(p.difference)));
                    } else {
                        d3.select(this).style("fill", system.data.color(d[system.data.cluster_label[system.data.nameDataset]]))
                    }
                })
        } else if (system.settings.cluster_selected) {

            let x1_value = system.settings.max_cluster_quantile_label;
            let x2_value = system.settings.max_cluster_quantile_label.substring(0, system.settings.max_cluster_quantile_label.length - 1) + "2";



            d3.selectAll(".data_point")
                .each((d) => {

                    let diff = Math.sqrt((Math.pow(d[x1_value], 2) + Math.pow(d[x2_value], 2))) / Math.sqrt((Math.pow(d.px1, 2) + Math.pow(d.px2, 2)));
                    if (diff > max_val) max_val = diff;
                    if (diff < min_val) min_val = diff;
                    system.data.points[d.index]['difference'] = diff;
                    that.quantitativeValue = [0, max_val];
                })


            d3.selectAll(".data_point")
                .each(function(d) {
                    if (system.settings.color_selected) {
                        d3.select(this).style("fill", system.data.colorQuality(system.data.scale_set(d.difference)));
                    } else {
                        d3.select(this).style("fill", system.data.color(d[system.data.cluster_label[system.data.nameDataset]]))

                    }
                })

        } else {
            if (perfect) {
                d3.selectAll(".data_point")
                    .each((d) => {
                        let diff = Math.sqrt((Math.pow(d.relx1, 2) + Math.pow(d.relx2, 2))) / Math.sqrt((Math.pow(d.px1, 2) + Math.pow(d.px2, 2)));
                        if (diff > max_val) max_val = diff;
                        if (diff < min_val) min_val = diff;
                        system.data.points[d.index]['difference'] = diff;

                        that.quantitativeValue = [0, max_val];
                    })


                d3.selectAll(".data_point")
                    .each(function(d) {
                        if (system.settings.color_selected) {
                            d3.select(this).style("fill", system.data.colorQuality(system.data.scale_set(d.difference)));
                        } else {
                            d3.select(this).style("fill", system.data.color(d[system.data.cluster_label[system.data.nameDataset]]))
                        }
                    })

            } else if (draged) {

                d3.selectAll(".data_point")
                    .each((d) => {
                        let diff = Math.sqrt((Math.pow(d.chax1, 2) + Math.pow(d.chax2, 2))) / Math.sqrt((Math.pow(d.px1, 2) + Math.pow(d.px2, 2)));
                        if (diff > max_val) max_val = diff;
                        if (diff < min_val) min_val = diff;
                        system.data.points[d.index]['difference'] = diff;

                        that.quantitativeValue = [0, max_val];
                    })


                d3.selectAll(".data_point")
                    .each(function(d) {
                        if (system.settings.color_selected) {
                            d3.select(this).style("fill", system.data.colorQuality(system.data.scale_set(d.difference)));
                        } else {
                            d3.select(this).style("fill", system.data.color(d[system.data.cluster_label[system.data.nameDataset]]))
                        }
                    })

            } else {

                if (this.current_configuration.changed) {

                    d3.selectAll(".data_point")
                        .each((d) => {
                            let diff = Math.sqrt((Math.pow(d.chax1, 2) + Math.pow(d.chax2, 2))) / Math.sqrt((Math.pow(d.px1, 2) + Math.pow(d.px2, 2)));
                            if (diff > max_val) max_val = diff;
                            if (diff < min_val) min_val = diff;
                            system.data.points[d.index]['difference'] = diff;

                            that.quantitativeValue = [0, max_val];
                        })


                    d3.selectAll(".data_point")
                        .each(function(d) {
                            if (system.settings.color_selected) {
                                d3.select(this).style("fill", system.data.colorQuality(system.data.scale_set(d.difference)));
                            } else {
                                d3.select(this).style("fill", system.data.color(d[system.data.cluster_label[system.data.nameDataset]]))
                            }
                        })



                } else {
                    d3.selectAll(".data_point")
                        .each(function(d) {

                            let diff = Math.sqrt((Math.pow(d.x1, 2) + Math.pow(d.x2, 2))) / Math.sqrt((Math.pow(d.px1, 2) + Math.pow(d.px2, 2)));
                            if (diff > max_val) max_val = diff;
                            if (diff < min_val) min_val = diff;
                            system.data.points[d.index]['difference'] = diff;
                            that.quantitativeValue = [0, max_val];
                        })

                    d3.selectAll(".data_point")
                        .each(function(d) {

                            if (system.settings.color_selected) {
                                d3.select(this).style("fill", system.data.colorQuality(system.data.scale_set(d.difference)));
                            } else {

                                d3.select(this).style("fill", system.data.color(d[system.data.cluster_label[system.data.nameDataset]]))
                            }
                        })
                }
            }
        }
        //* PROBLEMA QUI!!!! */
        system.slider.aggiornaSlider();

    }

    this.resetVisulization = () => {
        d3.selectAll(".data_point").remove();
        d3.selectAll(".AP_points").remove();
        d3.selectAll(".attr_label").remove();
        d3.selectAll(".legend").remove();
        d3.selectAll(".radarlevel").remove();
        d3.selectAll(".grid")
            .each(function(d) {
                d3.select(this).attr("fill", "white")
            })
    }

    this.initializeDBI = () => {
        let x1_value = system.settings.max_quantile_label;
        let x2_value = system.settings.max_quantile_label.substring(0, system.settings.max_quantile_label.length - 1) + "2";

        system.settings.quantile_DBI = system.optimization.DaviesBouldinIndex(system.data.points, x2_value, x1_value, system.data.cluster_label[system.data.nameDataset]);
        system.settings.indipendent_DBI = system.optimization.DaviesBouldinIndex(system.data.points, 'ix2', 'ix1', system.data.cluster_label[system.data.nameDataset]);
        system.settings.radvizplusplus_DBI = system.optimization.DaviesBouldinIndex(system.data.points, 'rx2', 'rx1', system.data.cluster_label[system.data.nameDataset]);
        system.settings.value_DBI = system.optimization.DaviesBouldinIndex(system.data.points, 'x2', 'x1', system.data.cluster_label[system.data.nameDataset]);
    }

    this.calculateDBI = () => {
        if (system.settings.cluster_selected) {
            let x1_value = system.settings.max_cluster_quantile_label;
            let x2_value = system.settings.max_cluster_quantile_label.substring(0, system.settings.max_cluster_quantile_label.length - 1) + "2";
            system.settings.cluster_DBI = system.optimization.DaviesBouldinIndex(system.data.points, x2_value, x1_value, system.data.cluster_label[system.data.nameDataset]);
        } else if (system.settings.perfect_selected) {
            system.settings.perfect_DBI = system.optimization.DaviesBouldinIndex(system.data.points, 'relx2', 'relx1', system.data.cluster_label[system.data.nameDataset]);
        } else if (that.current_configuration.changed) {
            system.settings.value_DBI = system.optimization.DaviesBouldinIndex(system.data.points, 'chax2', 'chax1', system.data.cluster_label[system.data.nameDataset]);
        } else if (!system.settings.quantile_selected && !system.settings.indipendent_selected && !system.settings.radvisplusplus_selected) {
            //("SONO QUI; CALCOLO VALUE DBI")
            system.settings.value_DBI = system.optimization.DaviesBouldinIndex(system.data.points, 'x2', 'x1', system.data.cluster_label[system.data.nameDataset]);
        }

    }

    this.assignAnglesToDimensions = (list_dimensions) => {

        let indice_primo;
        if (system.data.dime.length == 0)
            indice_primo = 0;
        else {
            indice_primo = list_dimensions.indexOf(system.data.dime[0]);
        }
        let list_dimension_ordinata = [];

        let i;
        for (i = 0; i < list_dimensions.length; i++) {

            list_dimension_ordinata.push(list_dimensions[indice_primo]);

            if (indice_primo == list_dimensions.length - 1) {
                indice_primo = 0;
            } else {
                indice_primo++;
            }
        }

        let real_dimensions = [];
        list_dimension_ordinata.forEach(function(d, i) {
            let start_a = -1;
            let end_a = (((360 / list_dimension_ordinata.length) * Math.PI) / 180) * (i + 1);
            let y_value, x_value;
            if (i == 0) {
                start_a = 0
                x_value = 0

            } else {
                start_a = (((360 / list_dimension_ordinata.length) * Math.PI) / 180) * (i);
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


        return real_dimensions;
    }

    this.initializeGrid = () => {
        d3.selectAll(".grid").remove();
        if (this.g_grid == null) {
            this.g_grid = system.structure.svg.append('g')
                .attr('id', 'principal-g')
                .attr('height', this.h - this.m.top - this.m.bottom)
                .attr('width', this.w - this.m.left - this.m.rigth)
                .attr("transform", "translate(" + this.center.x + "," + this.center.y + ")");
        }

        let l;
        for (l = 0; l < this.level_grid; l++) {

            //function for arc
            const arc = d3.arc()
                .innerRadius(function() { //(l == 0); 
                    if (l == 0) { return 0; } else {

                        return ((that.radius * l) / that.level_grid);
                    }
                })
                .outerRadius(() => {
                    if (l == 0) return (that.radius) / that.level_grid;
                    else return ((that.radius * (l + 1)) / that.level_grid);
                })
                .startAngle((d) => { return d.start; })
                .endAngle((d) => { return d.end; })

            this.g_grid.selectAll('mySlices')
                .data(system.data.dimensions_current)
                .enter()
                .append('path')
                .attr('id', (d) => { return 'area_' + (l + 1) + '_' + (d.index + 1) })
                .attr('class', 'grid')
                .attr('d', arc)
                .attr('fill', 'white')
                .attr("stroke", "black")
                .style("stroke-opacity", 0.4)
                .style("stroke-width", "1px")
                .style("opacity", 0.7)
        }

    }

    this.updatePositionRelative = (D, angle) => {
        let punti = D
        let dimensioniangolinormalizzate = [];
        let data_normalized = D.slice()
        let dimensioni = system.data.dimensions_current.map((d) => d.value);
        let min_values = [];
        let max_values = [];
        let c;

        // J parte da 1, perchè la colonna 0 è quella della classificazione.
        for (c = 0; c < dimensioni.length; c++) {
            min_values.push(d3.min(data_normalized, (d) => { return +d[dimensioni[c]]; }));
            max_values.push(d3.max(data_normalized, (d) => { return +d[dimensioni[c]]; }));
        }

        data_normalized.forEach((d, j) => {
            dimensioni.forEach((dim, i) => {
                    if ((max_values[i] - min_values[i]) == 0)
                        d[dim] = 0
                    else
                        d[dim] = (d[dim] - min_values[i]) / (max_values[i] - min_values[i])
                    if (j == 0) dimensioniangolinormalizzate.push({ 'value': dim, 'min': min_values[i], 'max': max_values[i] });
                })
                // mi calcolo la posizione x e y
            let x_1_j = { 'denominator': 0, 'numerator': 0 };
            let x_2_j = { 'denominator': 0, 'numerator': 0 };
            angle.forEach(function(dim, i) {
                x_1_j.numerator = x_1_j.numerator + (d[dim.value] * Math.cos(dim.start));
                x_1_j.denominator = x_1_j.denominator + d[dim.value];
                x_2_j.numerator = x_2_j.numerator + (d[dim.value] * Math.sin(dim.start));
                x_2_j.denominator = x_2_j.denominator + d[dim.value];
                punti[j]["n" + dim.value] = d[dim.value];
            })

            if (x_1_j.denominator == 0) {
                punti[j]["relx1"] = 0
            } else {
                punti[j]["relx1"] = x_1_j.numerator / x_1_j.denominator;
            }

            if (x_2_j.denominator == 0) {
                punti[j]["relx2"] = 0
            } else {
                punti[j]["relx2"] = x_2_j.numerator / x_2_j.denominator;
            }
        })
        return punti
    }

    this.calculateDistancefromCenter = (points, l1, l2, label, max, array_label) => {

        let sumdistance = 0;

        points.forEach(function(p) {
            sumdistance = sumdistance + Math.sqrt(Math.pow(p[l1], 2) + Math.pow(p[l2], 2))
        })


        let mean = sumdistance / (points.length);
        if (max == "QUANTILE") {
            if (mean > system.settings.max_quantile_value) {
                system.settings.max_quantile_value = mean;
                system.settings.max_quantile_label = l1;
                system.settings.max_quantile_label_dimensions = array_label;
            }
        }

        if (max == "CLUSTER") {
            if (mean > system.settings.max_cluster_quantile_value) {
                system.settings.max_cluster_quantile_value = mean;
                system.settings.max_cluster_quantile_label = l1;
                system.settings.max_cluster_quantile_label_dimensions = array_label;
            }
        }
        return mean;
    }

    this.calculateDimensionsAngles = (list_dimensions) => {

        let indice_primo;
        if (system.data.dime.length == 0)
            indice_primo = 0;
        else {

            indice_primo = list_dimensions.indexOf(system.data.dime[0]);
        }
        let list_dimension_ordinata = [];

        let i;
        for (i = 0; i < list_dimensions.length; i++) {

            list_dimension_ordinata.push(list_dimensions[indice_primo]);

            if (indice_primo == list_dimensions.length - 1) {
                indice_primo = 0;
            } else {
                indice_primo++;
            }
        }

        let real_dimensions = [];
        list_dimension_ordinata.forEach(function(d, i) {
            let start_a = -1;
            let end_a = (((360 / list_dimension_ordinata.length) * Math.PI) / 180) * (i + 1);
            if (i == 0) {
                start_a = 0
            } else {
                start_a = (((360 / list_dimension_ordinata.length) * Math.PI) / 180) * (i);
            }
            real_dimensions.push({
                'value': d,
                'index': i,
                'start': start_a,
                'end': end_a,
                'drag': false,
            })
        });

        return real_dimensions;
    }

    this.calculateDistanceDimensions = (a, b) => {
        let distance = 0;
        a.forEach(function(dim, i) {
            let ia = i + 1;
            let ib = b.indexOf(dim.value) + 1;
            distance = distance + d3.min([Math.abs(ia - ib), Math.abs((ia + ib) - ib)])
        })
        return distance / a.length;
    }

    this.calculatePerfectPointDisposition = (punto, di) => {
        let element = {};
        di.forEach(function(d) {
            element[d.value] = punto[d.value];
        })

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
        punto["order"] = prova;
    }
    this.contextMenuFunction = (d, i) => {
        
        system.settings.perfect_selected = true;


        system.data.perfect_dimensions = system.radviz.calculateDimensionsAngles(d.order);
        system.data.points = system.radviz.updatePositionRelative(system.data.points, system.data.perfect_dimensions);
        let t = d3.transition().duration(2000);
        d3.selectAll(".data_point")
            .each((d, i) => {

                d3.select(this)
                    .transition(t)
                    .attr("cx", (d) => { return system.data.scale_x1(d.relx2) })
                    .attr("cy", (d) => { return system.data.scale_x2(d.relx1) })
            })

        system.data.perfect_dimensions.forEach(function(dimensione_ordinata) {
            let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")
            d3.select("#T_" + label_text).transition(t)
                .attr("x", function() { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                .attr("y", function() { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })
        })

        d3.selectAll(".AP_points").remove();

        g_grid.selectAll(".AP_points")
            .data(system.data.perfect_dimensions)
            .enter().append("circle")
            .attr("class", "AP_points")
            .attr("id", (d) => { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
            .attr("r", '4')
            .style("fill", '#660000')
            .attr("cx", (d, i) => { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
            .attr("cy", (d, i) => { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
            .on('mouseover', function() {
                d3.select(this).attr("r", '8')
            })
            .on('mouseout', function() {
                d3.select(this).attr("r", '4')
            })
            .call(d3.drag()
                .on("start", system.radviz.dragstarted)
                .on("drag", system.radviz.dragged)
                .on("end", system.radviz.dragended));

        that.visual_mean = system.radviz.calculateDistancefromCenter(system.data.points, "relx1", "relx2", "RELATIVE MEAN");


        system.spring.initializeForceAxes(system.data.perfect_dimensions);
        system.spring.initializeRadarAxes(system.data.perfect_dimensions);
        changeRadar(system.data.perfect_dimensions);

        if (system.settings.quantile_selected) {
            system.settings.quantile_selected = false;

        }
        if (system.settings.cluster_selected) {
            system.settings.cluster_selected = false;

        }

        system.radviz.globalQuality(system.settings.perfect_selected);
    }
    this.newOrderDimensions = (angle, dimensions) => {
        let new_dimensions = [];
        let dimension_changed = angle[1].split("AP_")[1];

        let trovata = false;
        let angolo_trovato = false;
        let index_found = -1;
        let new_position = 0;
        let index_changed = -1;
        let i;

        for (i = 0; i < dimensions.length; i++) {
            if (dimensions[i].value.replace(" ", "").replace(".", "") == dimension_changed) {
                index_changed = i;
                trovata = true;

                if (angolo_trovato) {
                    delete dimensions[index_changed].index;
                    dimensions[index_changed].index = (dimensions[index_found].index) + 1;
                    new_dimensions[index_found + 1] = dimensions[index_changed].value

                }
            }
            if (angle[0] >= dimensions[i].start && angle[0] < (dimensions[i].end)) {
                index_found = i;
                angolo_trovato = true;
                delete dimensions[i].index;
                dimensions[i].index = new_position;

                new_dimensions.push(dimensions[i].value);
                new_position++;
                if (trovata) {
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
    }

    this.updatePositionCHANGED = (D, angle) => {
        let points = D
        let dimensioniangolinormalizzate = [];
        let data_normalized = D.slice()
        let dimensioni = system.data.dimensions_current.map((d) => d.value);
        let min_values = [];
        let max_values = [];
        let c;
        this.current_configuration.changed = true;
        // J parte da 1, perchè la colonna 0 è quella della classificazione
        for (c = 0; c < dimensioni.length; c++) {
            min_values.push(d3.min(data_normalized, function(d) { return +d[dimensioni[c]]; }));
            max_values.push(d3.max(data_normalized, function(d) { return +d[dimensioni[c]]; }));
        }

        data_normalized.forEach(function(d, j) {
            dimensioni.forEach(function(dim, i) {
                    if ((max_values[i] - min_values[i]) == 0)
                        d[dim] = 0
                    else
                        d[dim] = (d[dim] - min_values[i]) / (max_values[i] - min_values[i])
                    if (j == 0) dimensioniangolinormalizzate.push({ 'value': dim, 'min': min_values[i], 'max': max_values[i] });
                })
                // mi calcolo la posizione x e y
            let x_1_j = { 'denominator': 0, 'numerator': 0 };
            let x_2_j = { 'denominator': 0, 'numerator': 0 };
            angle.forEach(function(dim, i) {
                x_1_j.numerator = x_1_j.numerator + (d[dim.value] * Math.cos(dim.start));
                x_1_j.denominator = x_1_j.denominator + d[dim.value];
                x_2_j.numerator = x_2_j.numerator + (d[dim.value] * Math.sin(dim.start));
                x_2_j.denominator = x_2_j.denominator + d[dim.value];
                points[j]["n" + dim.value] = d[dim.value];
            })

            if (x_1_j.numerator == 0 && x_1_j.denominator == 0) {
                points[j]["chax1"] = 0;
            } else {
                points[j]["chax1"] = x_1_j.numerator / x_1_j.denominator;
            }

            if (x_2_j.numerator == 0 && x_2_j.denominator == 0) {
                points[j]["chax2"] = 0;
            } else {
                points[j]["chax2"] = x_2_j.numerator / x_2_j.denominator;
            }
        })
        return points;
    }

    this.dragstarted = function(d) {
        d3.select(this).raise().classed("active", true);

    }

    this.dragged = function(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        d.drag = true;
    }

    this.dragended = function(d) {
        if (d.drag == true) {
            d3.select(this).classed("active", false);
            d.drag = false;
            let new_angle = system.radviz.dragendangle(d3.select(this).attr("cx"), d3.select(this).attr("cy"), d3.select(this).attr("id"), d);

            system.data.dimensions_current = system.radviz.calculateDimensionsAngles(system.radviz.newOrderDimensions(new_angle, system.data.dimensions_current));

            system.data.points = system.radviz.updatePositionCHANGED(system.data.points, system.data.dimensions_current);
            system.structure.updateSVGDimensions();

            let t = d3.transition().duration(2000);
            d3.selectAll(".data_point")
                .each(function(d, i) {
                    d3.select(this)
                        .transition(t)
                        .attr("cx", (d) => { return system.data.scale_x1(d.chax2) })
                        .attr("cy", (d) => { return system.data.scale_x2(d.chax1) })
                    d3.select(this).on("mouseover", (d) => {
                            if (system.settings.quantile_selected) {
                                let quantile_array = d[system.settings.max_quantile_label_dimensions];

                                let angle_ordered_dimension = system.radviz.calculateDimensionsAngles(quantile_array);
                                system.spring.drawForce(angle_ordered_dimension, d);
                            } else if (system.settings.cluster_selected) {
                                let quantile_array = d[system.settings.max_cluster_quantile_label_dimensions];

                                let angle_ordered_dimension = system.radviz.calculateDimensionsAngles(quantile_array);
                                system.spring.drawForce(angle_ordered_dimension, d);
                            } else {
                                if (system.settings.perfect_selected) {
                                    system.spring.drawForce(system.data.perfect_dimensions, d)
                                } else {
                                    system.spring.drawForce(system.data.dimensions_current, d);
                                }
                            }

                        })
                        .on("mouseout", (d) => {
                            d3.selectAll(".lineforce").remove();
                        })
                        .on("contextmenu", (d, i) => {
                            d3.event.preventDefault();
                            system.settings.perfect_selected = true;


                            system.data.perfect_dimensions = system.radviz.calculateDimensionsAngles(d.order);
                            system.data.points = system.radviz.updatePositionRelative(system.data.points, system.data.perfect_dimensions);
                            let t = d3.transition().duration(2000);
                            d3.selectAll(".data_point")
                                .each((d, i) => {

                                    d3.select(this)
                                        .transition(t)
                                        .attr("cx", (d) => { return system.data.scale_x1(d.relx2) })
                                        .attr("cy", (d) => { return system.data.scale_x2(d.relx1) })
                                })

                            system.data.perfect_dimensions.forEach(function(dimensione_ordinata) {
                                let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")
                                d3.select("#T_" + label_text).transition(t)
                                    .attr("x", function() { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                                    .attr("y", function() { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })
                            })

                            d3.selectAll(".AP_points").remove();

                            g_grid.selectAll(".AP_points")
                                .data(system.data.perfect_dimensions)
                                .enter().append("circle")
                                .attr("class", "AP_points")
                                .attr("id", (d) => { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
                                .attr("r", '4')
                                .style("fill", '#660000')
                                .attr("cx", (d, i) => { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
                                .attr("cy", (d, i) => { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
                                .on('mouseover', function() {
                                    d3.select(this).attr("r", '8')
                                })
                                .on('mouseout', function() {
                                    d3.select(this).attr("r", '4')
                                })
                                .call(d3.drag()
                                    .on("start", system.radviz.dragstarted)
                                    .on("drag", system.radviz.dragged)
                                    .on("end", system.radviz.dragended));

                            that.visual_mean = system.radviz.calculateDistancefromCenter(system.data.points, "relx1", "relx2", "RELATIVE MEAN");


                            system.spring.initializeForceAxes(system.data.perfect_dimensions);
                            system.spring.initializeRadarAxes(system.data.perfect_dimensions);
                            changeRadar(system.data.perfect_dimensions);

                            if (system.settings.quantile_selected) {
                                system.settings.quantile_selected = false;

                            }
                            if (system.settings.cluster_selected) {
                                system.settings.cluster_selected = false;

                            }

                            system.radviz.globalQuality(system.settings.perfect_selected);

                        })
                        .on("click", function(d) {

                            if (system.settings.quantile_selected) {
                                let quantile_array = d[system.settings.max_quantile_label_dimensions];
                                let angle_ordered_dimension = system.radviz.calculateDimensionsAngles(quantile_array);
                                system.radar.drawRadar(angle_ordered_dimension, d, d3.select(this));
                            } else if (system.settings.cluster_selected) {
                                let quantile_array = d[system.settings.max_cluster_quantile_label_dimensions];
                                let angle_ordered_dimension = system.radviz.calculateDimensionsAngles(quantile_array);
                                system.radar.drawRadar(angle_ordered_dimension, d, d3.select(this))
                            } else if (system.settings.perfect_selected) {
                                system.radar.drawRadar(system.data.perfect_dimensions, d, d3.select(this));
                            } else {
                                system.radar.drawRadar(system.data.dimensions_current, d, d3.select(this));
                            }

                        })
                })
            system.data.dimensions_current.forEach(function(dimensione_ordinata) {

                if (dimensione_ordinata.value.length != 0) {

                    let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")

                    d3.select("#T_" + label_text).transition(t)
                        .attr("x", () => { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                        .attr("y", () => { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })

                }

            })

            d3.selectAll(".AP_points").remove();
            that.g_grid.selectAll(".AP_points")
                .data(system.data.dimensions_current)
                .enter().append("circle")
                .attr("class", "AP_points")
                .attr("id", (d) => { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
                .attr("r", '4')
                .style("fill", '#660000')
                .attr("cx", (d, i) => { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
                .attr("cy", (d, i) => { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
                .on('mouseover', function() {
                    d3.select(this).attr("r", '8')
                })
                .on('mouseout', function() {
                    d3.select(this).attr("r", '4')
                })
                .call(d3.drag()
                    .on("start", system.radviz.dragstarted)
                    .on("drag", system.radviz.dragged)
                    .on("end", system.radviz.dragended));


            that.visual_mean = system.radviz.calculateDistancefromCenter(system.data.points, "chax1", "chax2", "changed MEAN");


            if (system.settings.quantile_selected) {
                system.settings.quantile_selected = false;
            }


            if (system.settings.cluster_selected) {
                system.settings.cluster_selected = false;
            }
            // forse qui set button

            system.radviz.globalQuality(system.settings.perfect_selected, true);
            system.structure.initializeForceAxes(system.data.dimensions_current);
            system.structure.initializeRadarAxes(system.data.dimensions_current);
            system.radar.changeRadar(system.data.dimensions_current);

            let tot_distance = 0;
            system.data.points.forEach(function(p) {
                tot_distance = tot_distance + system.radviz.calculateDistanceDimensions(system.data.dimensions_current, p.order);
            });

        }
    }

    this.dragendangle = (x, y, id, d) => {
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

    this.disegnapuntiedimensioni = () => {

        system.radviz.resetVisulization();
        this.g_grid.selectAll("text.label")
            .data(system.data.dimensions_current)
            .enter().append("text")
            .attr("id", (d) => { return "T_" + d.value.replace(" ", "").replace(".", ""); })
            .attr("class", "attr_label")
            .attr("x", (d, i) => { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (d.start))) })
            .attr("y", (d, i) => { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (d.start))) })
            .attr("fill", "black")
            .style("font-size", "17px")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "middle")
            .text((d, i) => { return d.value.substring(0, 6) });

        this.g_grid.selectAll(".AP_points")
            .data(system.data.dimensions_current)
            .enter().append("circle")
            .attr("class", "AP_points")
            .attr("id", (d) => { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
            .attr("r", '4')
            .style("fill", '#660000')
            .attr("cx", (d, i) => { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
            .attr("cy", (d, i) => { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
            .on('mouseover', function() { d3.select(this).attr("r", '8') })
            .on('mouseout', function() { d3.select(this).attr("r", '4') })

        .call(d3.drag()
            .on("start", system.radviz.dragstarted)
            .on("drag", system.radviz.dragged)
            .on("end", system.radviz.dragended));

        system.data.points = system.data.normalizeDataset(system.data.dataset, system.data.dimensions_current);

        let g_points = svg.append('g')
            .attr('height', this.h - this.m.top - this.m.bottom)
            .attr('width', this.w - this.m.left - this.m.rigth)
            .attr("transform", "translate(" + this.center.x + "," + this.center.y + ")");

        g_points.selectAll(".data_point")
            .data(system.data.points)
            .enter().append("circle")
            .attr("class", (d) => { return "data_point cluster_" + d[system.data.cluster_label[system.data.nameDataset]] })
            .attr("id", (d) => { return "p_" + d.index; })
            .attr("r", this.circle_radius)
            .style("fill", (d) => { return system.data.color(d[system.data.cluster_label[system.data.nameDataset]]); })
            .style("opacity", 1)
            .style("stroke", "black")
            .style("stroke-width", (d) => {
                if (d.selected) {
                    return 1.5;
                } else {
                    return 0.2;
                }
            })
            .attr("cx", (d) => { return system.data.scale_x1(d.x2) })
            .attr("cy", (d) => { return system.data.scale_x2(d.x1) })
            .on("mouseover", (d) => {
                if (system.settings.quantile_selected) {
                    let quantile_array = d[system.settings.max_quantile_label_dimensions];
                    let angle_ordered_dimension = system.radviz.assignAnglesToDimensions(quantile_array);
                    system.spring.drawForce(angle_ordered_dimension, d);
                } else if (system.settings.cluster_selected) {
                    let cluster_array = d[system.settings.max_cluster_quantile_label_dimensions];
                    let cluster_angle_ordered_dimension = system.radviz.assignAnglesToDimensions(cluster_array);
                    system.spring.drawForce(cluster_angle_ordered_dimension, d);
                } else {
                    if (system.settings.perfect_selected) {
                        system.spring.drawForce(system.data.perfect_dimensions, d)
                    } else {
                        system.spring.drawForce(system.data.dimensions_current, d);
                    }
                }

            })
            .on("mouseout", (d) => {
                d3.selectAll(".lineforce").remove();
            })
            .on("contextmenu", (d, i) => {

                system.settings.perfect_selected = true;
                d3.event.preventDefault();

                system.data.perfect_dimensions = this.assignAnglesToDimensions(d.order);
                system.data.points = this.updatePositionRelative(system.data.points, system.data.perfect_dimensions);


                let t = d3.transition().duration(2000);

                d3.selectAll(".data_point")
                    .each(function(d, i) {
                        d3.select(this)
                            .transition(t)
                            .attr("cx", () => { return system.data.scale_x1(d.relx2) })
                            .attr("cy", () => { return system.data.scale_x2(d.relx1) })
                    })

                system.data.perfect_dimensions.forEach((dimensione_ordinata) => {
                    let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")

                    d3.select("#T_" + label_text).transition(t).attr("x", () => { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) }).attr("y", () => { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })

                })
                d3.selectAll(".AP_points").remove();
                this.g_grid.selectAll(".AP_points")
                    .data(system.data.perfect_dimensions)
                    .enter().append("circle")
                    .attr("class", "AP_points")
                    .attr("id", function(d) { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
                    .attr("r", '4')
                    .style("fill", '#660000')
                    .attr("cx", function(d, i) { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
                    .attr("cy", function(d, i) { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
                    .on('mouseover', function(d) {
                        d3.select(this).attr("r", '8')
                    })
                    .on('mouseout', function() {
                        d3.select(this).attr("r", '4')
                    })
                    .call(d3.drag()
                        .on("start", system.radviz.dragstarted)
                        .on("drag", system.radviz.dragged)
                        .on("end", system.radviz.dragended));

                that.visual_mean = system.radviz.calculateDistancefromCenter(system.data.points, "relx1", "relx2", "RELATIVE MEAN");

                system.structure.initializeForceAxes(system.data.perfect_dimensions);
                system.structure.initializeRadarAxes(system.data.perfect_dimensions);
                // PERFECT_DIMENSIONS = system.data.perfect_dimensions
                system.radar.changeRadar(system.data.perfect_dimensions);


                if (system.settings.quantile_selected) {
                    system.settings.quantile_selected = false;

                }

                if (system.settings.cluster_selected) {
                    system.settings.cluster_selected = false;

                }
                system.radviz.globalQuality(system.settings.perfect_selected);
                //SONO ARRIVATA QUI
            })
            .on("click", function(d) {
                // QUI
                if (system.settings.quantile_selected) {
                    let quantile_array = d[system.settings.max_quantile_label_dimensions];
                    let angle_ordered_dimension = system.radviz.calculateDimensionsAngles(quantile_array);
                    system.data.dimensions_current = angle_ordered_dimension
                    system.radar.drawRadar(angle_ordered_dimension, d, d3.select(this));
                } else if (system.settings.cluster_selected) {
                    let quantile_array = d[system.settings.max_cluster_quantile_label_dimensions];
                    let angle_ordered_dimension = system.radviz.calculateDimensionsAngles(quantile_array);
                    system.data.dimensions_current = angle_ordered_dimension
                    system.radar.drawRadar(angle_ordered_dimension, d, d3.select(this));

                } else if (system.settings.perfect_selected) {
                    system.radar.drawRadar(system.data.perfect_dimensions, d, d3.select(this));
                } else {
                    system.radar.drawRadar(system.data.dimensions_current, d, d3.select(this));
                }

            })

        that.visual_mean = system.radviz.calculateDistancefromCenter(system.data.points, "x1", "x2", "NORMAL MEAN");
    }

    this.calculatePerfectPositionBoxPlot = (points, di, label, percentage) => {
        let element = {};

        di.forEach(function(d) {
            switch (label) {
                case "median":
                    element[d.value] = d3.median(points, function(p) { return p[d.value]; })
                    break;
                case "cluster":
                    let values_dimension_cluster = system.data.points.filter(function(d) { return d.selected == true; }).map(function(p) { return p[d.value] });
                    values_dimension_cluster.sort(function(a, b) { return a - b });
                    element[d.value] = d3.quantile(values_dimension_cluster, percentage);
                    break;
                case "quantile":
                    let values_dimension = points.map(p => p[d.value]);
                    values_dimension.sort(function(a, b) { return a - b });
                    element[d.value] = d3.quantile(values_dimension, percentage);
                    break;
                default:
                    break;
            }
        })

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


        system.data.points.forEach(function(p, i) {
            if (label == "median") {
                p["order median"] = prova;
            } else if (label == "cluster") {
                p["cluster order " + percentage] = prova; //cluster order quantile
            } else {
                p["order quantile " + percentage] = prova;
            }
        });
    }




    this.calculateInformation = (POINTS, DIMENSIONS) => {

        system.radviz.calculatePerfectPositionBoxPlot(POINTS, DIMENSIONS, "median");
        system.radviz.perfectPosition(POINTS, "order", "px1", "px2");
        system.radviz.calculateDistancefromCenter(POINTS, "px1", "px2", "PERFECT MEAN");
        let q;
        for (q = 1; q <= 100; q++) {
            system.radviz.calculatePerfectPositionBoxPlot(POINTS, DIMENSIONS, "quantile", q / 100);
            system.radviz.perfectPosition(POINTS, "order quantile " + q / 100, "q" + q + "x1", "q" + q + "x2");
            system.radviz.calculateDistancefromCenter(POINTS, "q" + q + "x1", "q" + q + "x2", "Q " + q / 100 + " MEAN", "QUANTILE", "order quantile " + q / 100);
        }
        system.radviz.globalQuality(system.settings.perfect_selected);
    }

    this.calcoloOttimoCluster = (d, risultato_selezione) => {

        if (risultato_selezione) {


            d3.selectAll('.data_point')
                .each(function(e) {
                    if (d3.select(this).attr('class').includes("cluster_" + d)) {
                        that.point_cluster.push(e); // inserisco il punto nella lista dei selezionati tra cluster
                        system.radar.drawRadar(system.data.dimensions_current, e, d3.select(this)) // disegno il radar per quel punto.
                    }
                });


        } else {
            d3.selectAll('.data_point')
                .each(function(e) {
                    if (d3.select(this).attr('class').includes("cluster_" + d)) {
                        system.radar.drawRadar(system.data.dimensions_current, e, d3.select(this))
                    }
                });

            that.point_cluster = that.point_cluster.filter((f) => { return f[system.data.cluster_label[system.data.nameDataset]] != d; })
        }
    }


    this.perfectPosition = (D, dimensione_label, l1, l2) => {


        let points = D
        let angle_ordered_dimension;
        let data_normalized = D.slice()
        let min_values = [];
        let max_values = [];


        points.forEach(function(d, j) {

            angle_ordered_dimension = system.radviz.calculateDimensionsAngles(d[dimensione_label]);

            // mi calcolo la posizione x e y
            let x_1_j = { 'denominator': 0, 'numerator': 0 };
            let x_2_j = { 'denominator': 0, 'numerator': 0 };
            angle_ordered_dimension.forEach(function(dim, i) {
                x_1_j.numerator = x_1_j.numerator + (d[dim.value] * Math.cos(dim.start));
                x_1_j.denominator = x_1_j.denominator + d[dim.value];
                x_2_j.numerator = x_2_j.numerator + (d[dim.value] * Math.sin(dim.start));
                x_2_j.denominator = x_2_j.denominator + d[dim.value];
            })

            if (x_1_j.numerator == 0 && x_1_j.denominator == 0) {
                points[j][l1] = 0;
            } else {
                points[j][l1] = x_1_j.numerator / x_1_j.denominator;
            }

            if (x_2_j.numerator == 0 && x_2_j.denominator == 0) {
                points[j][l2] = 0;
            } else {
                points[j][l2] = x_2_j.numerator / x_2_j.denominator;
            }
        })

        return points;
    }


    this.updateSVGDimensions = () => {
        let lista_dimensione_attuale = system.data.dimensions_current.map(function(d) { return d.value; });
        let indice_primo = null;
        if (system.data.dime.length == 0)
            indice_primo = 0;
        else {
            indice_primo = lista_dimensione_attuale.indexOf(system.data.dime[0]);
            let indice_primo_valore;
            d3.selectAll(".attr_label")
                .each(function(d, i) {
                    if (i == 0) {
                        indice_primo_valore = d.index;
                        d.index = d.index - indice_primo_valore;
                    } else {
                        if (d.index > indice_primo_valore)
                            d.index = d.index - indice_primo_valore
                        else
                            d.index = d.index + indice_primo_valore + 1
                    }
                })
        }
    }

    this.updatePerfect = () => {
        let t = d3.transition().duration(2000);

        system.settings.perfect_selected = false;
        if (!system.settings.quantile_selected) {
            system.settings.quantile_selected = true;
            //current_configuration.layout = 'quantile';
            let x1_value = system.settings.max_quantile_label;
            let x2_value = system.settings.max_quantile_label.substring(0, system.settings.max_quantile_label.length - 1) + "2";

            let quantile_array = [];
            d3.selectAll(".data_point")
                .each(function(d, i) {
                    if (i == 0) {
                        quantile_array = d[system.settings.max_cluster_quantile_label_dimensions];
                    }
                    d3.select(this)
                        .transition(t)
                        .attr("cx", system.data.scale_x1(d[x2_value]))
                        .attr("cy", system.data.scale_x2(d[x1_value]))
                })

            let angle_ordered_dimension = system.radviz.calculateDimensionsAngles(quantile_array);

            angle_ordered_dimension.forEach(function(dimensione_ordinata) {

                let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")

                d3.select("#T_" + label_text).transition(t)
                    .attr("x", function() { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                    .attr("y", function() { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })
            })

            d3.selectAll(".AP_points").remove();
            that.g_grid.selectAll(".AP_points")
                .data(angle_ordered_dimension)
                .enter().append("circle")
                .attr("class", "AP_points")
                .attr("id", function(d) { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
                .attr("r", '4')
                .style("fill", '#660000')
                .attr("cx", function(d, i) { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
                .attr("cy", function(d, i) { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
                .on('mouseover', function() {
                    d3.select(this).attr("r", '8')
                })
                .on('mouseout', function() {
                    d3.select(this).attr("r", '4')
                })
                .call(d3.drag()
                    .on("start", system.radviz.dragstarted)
                    .on("drag", system.radviz.dragged)
                    .on("end", system.radviz.dragended))
        } else {
            system.settings.quantile_selected = false;

            d3.selectAll(".data_point")
                .each(function() {
                    d3.select(this).transition(t)
                        .attr("cx", function(d) { return system.data.scale_x1(d.x2) })
                        .attr("cy", function(d) { return system.data.scale_x2(d.x1) })
                })
            d3.selectAll(".attr_label")
                .each(function() {
                    d3.select(this).transition(t)
                        .attr("x", function(d) { return ((that.radius + 25) * Math.cos(-Math.PI / 2 + (d.start))) })
                        .attr("y", function(d) { return ((that.radius + 25) * Math.sin(-Math.PI / 2 + (d.start))) })
                })
        }
    }

    this.updateQuantile = () => {
        var t = d3.transition().duration(2000);

        if (!system.settings.quantile_selected) {
            d3.select("#btn_quantile").attr("class", "btn_style_clicked")
            system.settings.quantile_selected = true;
            system.radviz.resetSelectedButton('quantile')

            let x1_value = system.settings.max_quantile_label;
            let x2_value = system.settings.max_quantile_label.substring(0, system.settings.max_quantile_label.length - 1) + "2";
            let quantile_array = [];

            d3.selectAll(".data_point")
                .each(function(d, i) {
                    if (i == 0) {
                        quantile_array = d[system.settings.max_quantile_label_dimensions];
                    }
                    d3.select(this)
                        .transition(t)
                        .attr("cx", function(d) { return system.data.scale_x1(d[x2_value]) })
                        .attr("cy", function(d) { return system.data.scale_x2(d[x1_value]) })
                })

            let angle_ordered_dimension = system.radviz.calculateDimensionsAngles(quantile_array);
            system.data.dimensions_current = angle_ordered_dimension;

            angle_ordered_dimension.forEach(function(dimensione_ordinata) {
                let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")

                d3.select("#T_" + label_text).transition(t)
                    .attr("x", function() { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                    .attr("y", function() { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })
            })
            d3.selectAll(".AP_points").remove();
            this.g_grid.selectAll(".AP_points")
                .data(angle_ordered_dimension)
                .enter().append("circle")
                .attr("class", "AP_points")
                .attr("id", function(d) { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
                .attr("r", '4')
                .style("fill", '#660000')
                .attr("cx", function(d, i) { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
                .attr("cy", function(d, i) { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
                .on('mouseover', function(d) {
                    d3.select(this).attr("r", '8')
                })
                .on('mouseout', function() {
                    d3.select(this).attr("r", '4')
                })
                .call(d3.drag()
                    .on("start", system.radviz.dragstarted)
                    .on("drag", system.radviz.dragged)
                    .on("end", system.radviz.dragended));

            system.structure.initializeForceAxes(angle_ordered_dimension);
            system.structure.initializeRadarAxes(angle_ordered_dimension);
            system.radar.changeRadar(angle_ordered_dimension);
        } else {

            system.settings.quantile_selected = false;
            d3.select("#btn_quantile").attr("class", "btn_style")

            if (system.settings.perfect_selected) {

                d3.selectAll(".data_point")
                    .each(function() {
                        d3.select(this)
                            .transition(t)
                            .attr("cx", function(d) { return system.data.scale_x1(d.relx2) })
                            .attr("cy", function(d) { return system.data.scale_x2(d.relx1) })
                    })

                system.data.perfect_dimensions.forEach(function(dimensione_ordinata) {
                    let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")
                    d3.select("#T_" + label_text).transition(t)
                        .attr("x", function() { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                        .attr("y", function() { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })

                })

                d3.selectAll(".AP_points").remove();
                that.g_grid.selectAll(".AP_points")
                    .data(system.data.perfect_dimensions)
                    .enter().append("circle")
                    .attr("class", "AP_points")
                    .attr("id", function(d) { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
                    .attr("r", '4')
                    .style("fill", '#660000')
                    .attr("cx", function(d, i) { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
                    .attr("cy", function(d, i) { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
                    .on('mouseover', function(d) {
                        d3.select(this).attr("r", '8')
                    })
                    .on('mouseout', function() {
                        d3.select(this).attr("r", '4')
                    })
                    .call(d3.drag()
                        .on("start", system.radviz.dragstarted)
                        .on("drag", system.radviz.dragged)
                        .on("end", system.radviz.dragended));
                system.structure.initializeForceAxes(system.data.dimensions_current);
                system.structure.initializeRadarAxes(system.data.dimensions_current);
                system.radar.changeRadar(system.data.dimensions_current);
            } else {
                if (this.current_configuration.changed) {

                    d3.selectAll(".data_point")
                        .each(function() {

                            d3.select(this).transition(t)
                                .attr("cx", function(d) { return system.data.scale_x1(d.chax2) })
                                .attr("cy", function(d) { return system.data.scale_x2(d.chax1) })
                        })
                    d3.selectAll(".attr_label")
                        .each(function(d, i) {
                            d3.select(this).transition(t)
                                .attr("x", function(d, i) { return ((that.radius + 25) * Math.cos(-Math.PI / 2 + (system.data.dimensions_current[d.index].start))) })
                                .attr("y", function(d, i) { return ((that.radius + 25) * Math.sin(-Math.PI / 2 + (system.data.dimensions_current[d.index].start))) })
                        })
                    system.structure.initializeForceAxes(system.data.dimensions_current);
                    system.structure.initializeRadarAxes(system.data.dimensions_current);
                    system.radar.changeRadar(system.data.dimensions_current);
                } else {
                    d3.selectAll(".data_point")
                        .each(function() {

                            d3.select(this).transition(t)
                                .attr("cx", function(d) { return system.data.scale_x1(d.x2) })
                                .attr("cy", function(d) { return system.data.scale_x2(d.x1) })
                        })
                    d3.selectAll(".attr_label")
                        .each(function(d, i) {
                            d3.select(this).transition(t)
                                .attr("x", function(d, i) { return ((that.radius + 25) * Math.cos(-Math.PI / 2 + (d.start))) })
                                .attr("y", function(d, i) { return ((that.radius + 25) * Math.sin(-Math.PI / 2 + (d.start))) })
                        })
                    system.structure.initializeForceAxes(system.data.dimensions_current);
                    system.structure.initializeRadarAxes(system.data.dimensions_current);
                    system.radar.changeRadar(system.data.dimensions_current);
                }
            }
        }

        system.radviz.globalQuality(system.settings.perfect_selected);

    }


    this.updateCluster = (cluster_ricevuti) => {
        let t = d3.transition().duration(2000);

        if (!system.settings.cluster_selected || !system.radviz.isEqual(that.clusters_precedenti, cluster_ricevuti)) {

            system.settings.cluster_selected = true;
            system.radviz.resetSelectedButton('cluster');
            that.clusters_precedenti = cluster_ricevuti;
            d3.select("#btn_cluster").attr("class", "btn_style_clicked")
            let x1_value = system.settings.max_cluster_quantile_label;
            let x2_value = system.settings.max_cluster_quantile_label.substring(0, system.settings.max_cluster_quantile_label.length - 1) + "2";

            let quantile_array = [];
            d3.selectAll(".data_point")
                .each(function(d, i) {
                    if (i == 0) {
                        quantile_array = d[system.settings.max_cluster_quantile_label_dimensions];
                    }
                    d3.select(this)
                        .transition(t)
                        .attr("cx", function(d) { return system.data.scale_x1(d[x2_value]) })
                        .attr("cy", function(d) { return system.data.scale_x2(d[x1_value]) })
                })


            let angle_ordered_dimension = system.radviz.calculateDimensionsAngles(quantile_array);

            angle_ordered_dimension.forEach(function(dimensione_ordinata) {

                let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")

                d3.select("#T_" + label_text)
                    .transition(t)
                    .attr("x", function() { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                    .attr("y", function() { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })
            })
            d3.selectAll(".AP_points").remove();
            that.g_grid.selectAll(".AP_points")
                .data(angle_ordered_dimension)
                .enter().append("circle")
                .attr("class", "AP_points")
                .attr("id", function(d) { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
                .attr("r", '4')
                .style("fill", '#660000')
                .attr("cx", function(d, i) { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
                .attr("cy", function(d, i) { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
                .on('mouseover', function(d) {
                    d3.select(this).attr("r", '8')
                })
                .on('mouseout', function() {
                    d3.select(this).attr("r", '4')
                })
                .call(d3.drag()
                    .on("start", system.radviz.dragstarted)
                    .on("drag", system.radviz.dragged)
                    .on("end", system.radviz.dragended));

            system.structure.initializeForceAxes(angle_ordered_dimension);
            system.structure.initializeRadarAxes(angle_ordered_dimension);
            system.radar.changeRadar(angle_ordered_dimension);
        } else {
            system.settings.cluster_selected = false;
            d3.select("#btn_cluster").attr("class", "btn_style")

            if (system.settings.perfect_selected) {


                d3.selectAll(".data_point")
                    .each(function() {
                        d3.select(this)
                            .transition(t)
                            .attr("cx", function(d) { return system.data.scale_x1(d.relx2) })
                            .attr("cy", function(d) { return system.data.scale_x2(d.relx1) })
                    })

                system.data.perfect_dimensions.forEach(function(dimensione_ordinata) {
                    let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")
                    d3.select("#T_" + label_text)
                        .transition(t)
                        .attr("x", function() { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                        .attr("y", function() { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })

                })

                d3.selectAll(".AP_points").remove();
                that.g_grid.selectAll(".AP_points")
                    .data(system.data.perfect_dimensions)
                    .enter().append("circle")
                    .attr("class", "AP_points")
                    .attr("id", function(d) { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
                    .attr("r", '4')
                    .style("fill", '#660000')
                    .attr("cx", function(d, i) { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
                    .attr("cy", function(d, i) { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
                    .on('mouseover', function(d) {
                        d3.select(this).attr("r", '8')
                    })
                    .on('mouseout', function() {
                        d3.select(this).attr("r", '4')
                    })
                    .call(d3.drag()
                        .on("start", system.radviz.dragstarted)
                        .on("drag", system.radviz.dragged)
                        .on("end", system.radviz.dragended));
                system.structure.initializeForceAxes(system.data.dimensions_current);
                system.structure.initializeRadarAxes(system.data.dimensions_current);
                system.radar.changeRadar(system.data.dimensions_current);
            } else {
                if (that.current_configuration.changed) {
                    d3.selectAll(".data_point")
                        .each(function() {
                            d3.select(this).transition(t)
                                .attr("cx", function(d) { return system.data.scale_x1(d.chax2) })
                                .attr("cy", function(d) { return system.data.scale_x2(d.chax1) })
                        })

                    d3.selectAll(".attr_label")
                        .each(function(d, i) {
                            d3.select(this).transition(t)
                                .attr("x", function(d, i) { return ((that.radius + 25) * Math.cos(-Math.PI / 2 + (system.data.dimensions_current[d.index].start))) })
                                .attr("y", function(d, i) { return ((that.radius + 25) * Math.sin(-Math.PI / 2 + (system.data.dimensions_current[d.index].start))) })
                        })
                    system.structure.initializeForceAxes(system.data.dimensions_current);
                    system.structure.initializeRadarAxes(system.data.dimensions_current);
                    system.radar.changeRadar(system.data.dimensions_current);

                } else {


                    d3.selectAll(".data_point")
                        .each(function() {

                            d3.select(this).transition(t)
                                .attr("cx", function(d) { return system.data.scale_x1(d.x2) })
                                .attr("cy", function(d) { return system.data.scale_x2(d.x1) })
                        })
                    d3.selectAll(".attr_label")
                        .each(function(d, i) {
                            d3.select(this).transition(t)
                                .attr("x", function(d, i) { return ((that.radius + 25) * Math.cos(-Math.PI / 2 + (d.start))) })
                                .attr("y", function(d, i) { return ((that.radius + 25) * Math.sin(-Math.PI / 2 + (d.start))) })
                        })
                    system.structure.initializeForceAxes(system.data.dimensions_current);
                    system.structure.initializeRadarAxes(system.data.dimensions_current);
                    system.radar.changeRadar(system.data.dimensions_current);
                }
            }
        }
        system.radviz.globalQuality(system.settings.perfect_selected);

    }

    this.updateDimensions = (array_dimensions) => {
        this.dimensions_current = system.radviz.calculateDimensionsAngles(array_dimensions);
    }

    this.colorChange = () => {
        if (system.settings.color_selected) {
            system.settings.color_selected = false;
            d3.select("#btn_quality").attr("class", "btn_style")
        } else {
            system.settings.color_selected = true;
            d3.select("#btn_quality").attr("class", "btn_style_clicked")
        }
        system.radviz.globalQuality(system.settings.perfect_selected);

    }

    this.optimizeCluster = () => {

        let points_selected = system.data.points.filter(function(d) { return d.selected == true; })

        let cluster_selected_labels = [];
        d3.selectAll('.sel_cluster')
            .each(function(l) {
                if (d3.select(this).style('fill') == 'black') { // quindi devo essere preso
                    cluster_selected_labels.push(l);
                }
            })

        if (cluster_selected_labels.length != 0 || points_selected.length != 0) {

            if (system.settings.quantile_selected) {
                system.settings.quantile_selected = false;
                d3.select("#btn_quantile").attr("class", "btn_style")
            }
            let q;
            for (q = 1; q <= 100; q++) {
                system.radviz.calculatePerfectPositionBoxPlot(system.data.points, system.data.dimensions_current, "cluster", q / 100);


                system.radviz.perfectPosition(system.data.points, "cluster order " + q / 100, "cq" + q + "x1", "cq" + q + "x2");


                system.radviz.calculateDistancefromCenter(system.data.points, "cq" + q + "x1", "cq" + q + "x2", "CQ " + q / 100 + " MEAN", "CLUSTER", "cluster order " + q / 100);
            }
            system.radviz.updateCluster(cluster_selected_labels);

        } else {
            alert("You must select points or choose clusters");
            d3.select("#btn_cluster").attr("class", "btn_style")
            system.settings.cluster_selected = false;
        }

    }

    this.optimizeSelectedPoints = () => {
        let selected_points = system.data.points.filter(function(d) { return d.selected == true; });



        if (selected_points.length != 0) {

            if (system.settings.quantile_selected) {
                system.settings.quantile_selected = false;
                d3.select("#btn_quantile").attr("class", "btn_style")
            }

            let q;
            for (q = 1; q <= 100; q++) {
                system.radviz.calculatePerfectPositionBoxPlot(selected_points, system.data.dimensions_current, "cluster", q / 100);

                system.radviz.perfectPosition(system.data.points, "cluster order " + q / 100, "cq" + q + "x1", "cq" + q + "x2");

                system.radviz.calculateDistancefromCenter(system.data.points, "cq" + q + "x1", "cq" + q + "x2", "CQ " + q / 100 + " MEAN", "CLUSTER", "cluster order " + q / 100);

            }
            system.radviz.updateCluster(selected_points);

        } else {
            alert("You must choose clusters");
            d3.select("#btn_cluster").attr("class", "btn_style")
            system.settings.cluster_selected = false;
        }

    }

    this.initialLayout = () => {
        system.data.dimensions_current = system.radviz.calculateDimensionsAngles(system.data.dimensions_original);
        var t = d3.transition()
            .duration(2000);

        // reinizializzo variabili
        system.settings.perfect_selected = false;
        system.settings.quantile_selected = false;
        d3.select("#btn_quantile").attr("class", "btn_style")
        system.settings.cluster_selected = false;
        d3.select("#btn_cluster").attr("class", "btn_style")
        that.current_configuration.changed = false;


        // resetto i punti dell radviz
        d3.selectAll(".data_point")
            .each(function(di) {
                if (di.selected) {
                    di.selected = false;
                    d3.select(this).style("stroke-width", 0.2);
                    d3.selectAll(".lineradar_" + di.index).remove();
                    d3.selectAll(".pointradar_" + di.index).remove();
                }
                d3.select(this).transition(t)
                    .attr("cx", function(d) { return system.data.scale_x1(d.x2) })
                    .attr("cy", function(d) { return system.data.scale_x2(d.x1) })
                d3.select(this).style("display", null);
            })
            // resetto le label
        d3.selectAll(".attr_label")
            .each(function(d, i) {
                d3.select(this).transition(t)
                    .attr("x", function(d, i) { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (d.start))) })
                    .attr("y", function(d, i) { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (d.start))) })
            })
            // resetto gli anchor point
        d3.selectAll(".AP_points").remove();
        that.g_grid.selectAll(".AP_points")
            .data(system.radviz.calculateDimensionsAngles(system.data.dime))
            .enter().append("circle")
            .attr("class", "AP_points")
            .attr("id", function(d) { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
            .attr("r", '4')
            .style("fill", '#660000')
            .attr("cx", function(d, i) { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
            .attr("cy", function(d, i) { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
            .on('mouseover', function(dì) {
                d3.select(this).attr("r", '8')
            })
            .on('mouseout', function() {
                d3.select(this).attr("r", '4')
            })
            .call(d3.drag()
                .on("start", system.radviz.dragstarted)
                .on("drag", system.radviz.dragged)
                .on("end", system.radviz.dragended));

        // resetto i bottoni
        d3.selectAll(".sel_cluster").style("fill", "white")
        d3.selectAll(".btn_style_clicked")
            .each(function(d) {
                var button_sel = d3.select(this)
                if (button_sel.attr("id") != "btn_quality") {
                    button_sel.attr("class", "btn_style")
                }

            })


        system.structure.initializeForceAxes(system.data.dimensions_current);
        system.structure.initializeRadarAxes(system.data.dimensions_current);
        system.radviz.globalQuality(system.settings.perfect_selected);
        system.slider.aggiornaSlider();

    }

    this.computeOptimization = () => {
        if (system.data.dimensions_current != null) {
            system.data.dimensions_indipendentDA = system.optimization.indipendentDA(system.data.points, system.data.dimensions_current.map((d) => d.value))
            system.data.dimensions_radvizPlusPlus = system.optimization.radvizPlusPlus(system.data.points, system.data.dimensions_current.map((d) => d.value))
        }
        system.data.points.forEach(function(p) {
            p["indipendentDA"] = system.data.dimensions_indipendentDA;
            p["radvixPlusPlus"] = system.data.dimensions_radvizPlusPlus;
        });

        system.radviz.perfectPosition(system.data.points, "indipendentDA", "ix1", "ix2");
        system.settings.indipendent_mean = system.radviz.calculateDistancefromCenter(system.data.points, "ix1", "ix2", "RELATIVE MEAN");
        system.radviz.perfectPosition(system.data.points, "radvixPlusPlus", "rx1", "rx2");
        system.settings.radvizplusplus_mean = system.radviz.calculateDistancefromCenter(system.data.points, "rx1", "rx2", "RELATIVE MEAN");

    }

    this.resetSelectedButton = (label) => {
        if (system.settings.cluster_selected && label != 'cluster') {
            system.settings.cluster_selected = false;
            d3.select("#btn_cluster").attr("class", "btn_style")
        }

        if (system.settings.quantile_selected && label != 'quantile') {
            system.settings.quantile_selected = false;
            d3.select("#btn_quantile").attr("class", "btn_style")
        }

        if (system.settings.indipendent_selected && label != 'indipendent') {
            system.settings.indipendent_selected = false;
            d3.select("#btn_indipendent").attr("class", "btn_style")
        }

        if (system.settings.radvisplusplus_selected && label != 'radvisplusplus') {
            system.settings.radvisplusplus_selected = false;
            d3.select("#btn_radvisplusplus").attr("class", "btn_style")
        }

    }

    this.updateIndipendentDA = () => {
        var t = d3.transition().duration(2000);

        if (!system.settings.indipendent_selected) {
            d3.select("#btn_indipendent").attr("class", "btn_style_clicked")
            system.settings.indipendent_selected = true;
            system.radviz.resetSelectedButton('indipendent')

            d3.selectAll(".data_point")
                .each(function(d, i) {
                    d3.select(this)
                        .transition(t)
                        .attr("cx", function(d) { return system.data.scale_x1(d.ix2) })
                        .attr("cy", function(d) { return system.data.scale_x2(d.ix1) })
                })

            let angle_ordered_dimension = system.radviz.calculateDimensionsAngles(system.data.dimensions_indipendentDA);
            system.data.dimensions_current = angle_ordered_dimension;


            angle_ordered_dimension.forEach(function(dimensione_ordinata) {
                let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")

                d3.select("#T_" + label_text).transition(t)
                    .attr("x", function() { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                    .attr("y", function() { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })
            })
            d3.selectAll(".AP_points").remove();
            this.g_grid.selectAll(".AP_points")
                .data(angle_ordered_dimension)
                .enter().append("circle")
                .attr("class", "AP_points")
                .attr("id", function(d) { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
                .attr("r", '4')
                .style("fill", '#660000')
                .attr("cx", function(d, i) { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
                .attr("cy", function(d, i) { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
                .on('mouseover', function(d) {
                    d3.select(this).attr("r", '8')
                })
                .on('mouseout', function() {
                    d3.select(this).attr("r", '4')
                })
                .call(d3.drag()
                    .on("start", system.radviz.dragstarted)
                    .on("drag", system.radviz.dragged)
                    .on("end", system.radviz.dragended));

            system.structure.initializeForceAxes(angle_ordered_dimension);
            system.structure.initializeRadarAxes(angle_ordered_dimension);
            system.radar.changeRadar(angle_ordered_dimension);
        } else {
            system.settings.indipendent_selected = false;
            d3.select("#btn_indipendent").attr("class", "btn_style")

            if (system.settings.perfect_selected) {
                d3.selectAll(".data_point")
                    .each(function() {
                        d3.select(this)
                            .transition(t)
                            .attr("cx", function(d) { return system.data.scale_x1(d.relx2) })
                            .attr("cy", function(d) { return system.data.scale_x2(d.relx1) })
                    })

                system.data.perfect_dimensions.forEach(function(dimensione_ordinata) {
                    let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")
                    d3.select("#T_" + label_text).transition(t)
                        .attr("x", function() { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                        .attr("y", function() { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })

                })

                d3.selectAll(".AP_points").remove();
                that.g_grid.selectAll(".AP_points")
                    .data(system.data.perfect_dimensions)
                    .enter().append("circle")
                    .attr("class", "AP_points")
                    .attr("id", function(d) { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
                    .attr("r", '4')
                    .style("fill", '#660000')
                    .attr("cx", function(d, i) { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
                    .attr("cy", function(d, i) { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
                    .on('mouseover', function(d) {
                        d3.select(this).attr("r", '8')
                    })
                    .on('mouseout', function() {
                        d3.select(this).attr("r", '4')
                    })
                    .call(d3.drag()
                        .on("start", system.radviz.dragstarted)
                        .on("drag", system.radviz.dragged)
                        .on("end", system.radviz.dragended));

                system.structure.initializeForceAxes(system.data.dimensions_current);
                system.structure.initializeRadarAxes(system.data.dimensions_current);
                system.radar.changeRadar(system.data.dimensions_current);
            } else {
                if (this.current_configuration.changed) {

                    d3.selectAll(".data_point")
                        .each(function() {


                            d3.select(this).transition(t)
                                .attr("cx", function(d) { return system.data.scale_x1(d.chax2) })
                                .attr("cy", function(d) { return systsem.data.scale_x2(d.chax1) })
                        })
                    d3.selectAll(".attr_label")
                        .each(function(d, i) {
                            d3.select(this).transition(t)
                                .attr("x", function(d, i) { return ((that.radius + 25) * Math.cos(-Math.PI / 2 + (system.data.dimensions_current[d.index].start))) })
                                .attr("y", function(d, i) { return ((that.radius + 25) * Math.sin(-Math.PI / 2 + (system.data.dimensions_current[d.index].start))) })
                        })
                    system.structure.initializeForceAxes(system.data.dimensions_current);
                    system.structure.initializeRadarAxes(system.data.dimensions_current);
                    system.radar.changeRadar(system.data.dimensions_current);
                } else {

                    d3.selectAll(".data_point")
                        .each(function() {


                            d3.select(this).transition(t)
                                .attr("cx", function(d) { return system.data.scale_x1(d.x2) })
                                .attr("cy", function(d) { return system.data.scale_x2(d.x1) })
                        })
                    d3.selectAll(".attr_label")
                        .each(function(d, i) {
                            d3.select(this).transition(t)
                                .attr("x", function(d, i) { return ((that.radius + 25) * Math.cos(-Math.PI / 2 + (d.start))) })
                                .attr("y", function(d, i) { return ((that.radius + 25) * Math.sin(-Math.PI / 2 + (d.start))) })
                        })

                    system.structure.initializeForceAxes(system.data.dimensions_current);
                    system.structure.initializeRadarAxes(system.data.dimensions_current);
                    system.radar.changeRadar(system.data.dimensions_current);
                }
            }
        }

        system.radviz.globalQuality(system.settings.perfect_selected);

    }

    this.updateRadvizPlusPlus = () => {
        var t = d3.transition().duration(2000);

        if (!system.settings.radvizplusplus_selected) {
            d3.select("#btn_radvizplusplus").attr("class", "btn_style_clicked")
            system.settings.radvizplusplus_selected = true;
            system.radviz.resetSelectedButton('radvizplusplus')

            d3.selectAll(".data_point")
                .each(function(d, i) {
                    d3.select(this)
                        .transition(t)
                        .attr("cx", function(d) { return system.data.scale_x1(d.rx2) })
                        .attr("cy", function(d) { return system.data.scale_x2(d.rx1) })
                })

            let angle_ordered_dimension = system.radviz.calculateDimensionsAngles(system.data.dimensions_radvizPlusPlus);
            system.data.dimensions_current = angle_ordered_dimension;

            angle_ordered_dimension.forEach(function(dimensione_ordinata) {
                let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")

                d3.select("#T_" + label_text).transition(t)
                    .attr("x", function() { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                    .attr("y", function() { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })
            })
            d3.selectAll(".AP_points").remove();
            this.g_grid.selectAll(".AP_points")
                .data(angle_ordered_dimension)
                .enter().append("circle")
                .attr("class", "AP_points")
                .attr("id", function(d) { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
                .attr("r", '4')
                .style("fill", '#660000')
                .attr("cx", function(d, i) { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
                .attr("cy", function(d, i) { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
                .on('mouseover', function(d) {
                    d3.select(this).attr("r", '8')
                })
                .on('mouseout', function() {
                    d3.select(this).attr("r", '4')
                })
                .call(d3.drag()
                    .on("start", system.radviz.dragstarted)
                    .on("drag", system.radviz.dragged)
                    .on("end", system.radviz.dragended));

            system.structure.initializeForceAxes(angle_ordered_dimension);
            system.structure.initializeRadarAxes(angle_ordered_dimension);
            system.radar.changeRadar(angle_ordered_dimension);
        } else {
            system.settings.radvizplusplus_selected = false;
            d3.select("#btn_radvizplusplus").attr("class", "btn_style")

            if (system.settings.perfect_selected) {
                d3.selectAll(".data_point")
                    .each(function() {
                        d3.select(this)
                            .transition(t)
                            .attr("cx", function(d) { return system.data.scale_x1(d.relx2) })
                            .attr("cy", function(d) { return system.data.scale_x2(d.relx1) })
                    })

                system.data.perfect_dimensions.forEach(function(dimensione_ordinata) {
                    let label_text = dimensione_ordinata.value.replace(" ", "").replace(".", "")
                    d3.select("#T_" + label_text).transition(t)
                        .attr("x", function() { return ((that.radius + 30) * Math.cos(-Math.PI / 2 + (dimensione_ordinata.start))) })
                        .attr("y", function() { return ((that.radius + 30) * Math.sin(-Math.PI / 2 + (dimensione_ordinata.start))) })

                })

                d3.selectAll(".AP_points").remove();
                that.g_grid.selectAll(".AP_points")
                    .data(system.data.perfect_dimensions)
                    .enter().append("circle")
                    .attr("class", "AP_points")
                    .attr("id", function(d) { return "AP_" + d.value.replace(" ", "").replace(".", ""); })
                    .attr("r", '4')
                    .style("fill", '#660000')
                    .attr("cx", function(d, i) { return ((that.radius + 5) * Math.cos(-Math.PI / 2 + (d.start))) })
                    .attr("cy", function(d, i) { return ((that.radius + 5) * Math.sin(-Math.PI / 2 + (d.start))) })
                    .on('mouseover', function(d) {
                        d3.select(this).attr("r", '8')
                    })
                    .on('mouseout', function() {
                        d3.select(this).attr("r", '4')
                    })
                    .call(d3.drag()
                        .on("start", system.radviz.dragstarted)
                        .on("drag", system.radviz.dragged)
                        .on("end", system.radviz.dragended));

                system.structure.initializeForceAxes(system.data.dimensions_current);
                system.structure.initializeRadarAxes(system.data.dimensions_current);
                system.radar.changeRadar(system.data.dimensions_current);
            } else {
                if (this.current_configuration.changed) {

                    d3.selectAll(".data_point")
                        .each(function() {

                            d3.select(this).transition(t)
                                .attr("cx", function(d) { return system.data.scale_x1(d.chax2) })
                                .attr("cy", function(d) { return systsem.data.scale_x2(d.chax1) })
                        })
                    d3.selectAll(".attr_label")
                        .each(function(d, i) {
                            d3.select(this).transition(t)
                                .attr("x", function(d, i) { return ((that.radius + 25) * Math.cos(-Math.PI / 2 + (system.data.dimensions_current[d.index].start))) })
                                .attr("y", function(d, i) { return ((that.radius + 25) * Math.sin(-Math.PI / 2 + (system.data.dimensions_current[d.index].start))) })
                        })
                    system.structure.initializeForceAxes(system.data.dimensions_current);
                    system.structure.initializeRadarAxes(system.data.dimensions_current);
                    system.radar.changeRadar(system.data.dimensions_current);
                } else {

                    d3.selectAll(".data_point")
                        .each(function() {

                            d3.select(this).transition(t)
                                .attr("cx", function(d) { return system.data.scale_x1(d.x2) })
                                .attr("cy", function(d) { return system.data.scale_x2(d.x1) })
                        })
                    d3.selectAll(".attr_label")
                        .each(function(d, i) {
                            d3.select(this).transition(t)
                                .attr("x", function(d, i) { return ((that.radius + 25) * Math.cos(-Math.PI / 2 + (d.start))) })
                                .attr("y", function(d, i) { return ((that.radius + 25) * Math.sin(-Math.PI / 2 + (d.start))) })
                        })

                    system.structure.initializeForceAxes(system.data.dimensions_current);
                    system.structure.initializeRadarAxes(system.data.dimensions_current);
                    system.radar.changeRadar(system.data.dimensions_current);
                }
            }
        }

        system.radviz.globalQuality(system.settings.perfect_selected);

    }

    this.dimensionChoice = (d) => {

        system.data.points.forEach(function(p) {
            p.selected = false;
        })
        if (!d.checked) { // quindi diventa false, devo eliminare la voce dal resto.
            for (var i = 0; i < system.data.dimensions_current.length; i++) {
                if (system.data.dime[i] === d.value) {

                    system.data.dime.splice(i, 1);


                }
            }
            system.data.dimensions_current = system.radviz.calculateDimensionsAngles(system.data.dime);

            system.radviz.initializeGrid();
            system.radviz.disegnapuntiedimensioni();
            system.structure.initializeForceAxes(system.data.dimensions_current);
            system.structure.initializeRadarAxes(system.data.dimensions_current);

        } else {
            system.data.dime.push(d.value);
            system.data.dimensions_current = system.radviz.calculateDimensionsAngles(system.data.dime);
            system.radviz.initializeGrid();
            system.radviz.disegnapuntiedimensioni();
            system.structure.initializeForceAxes(system.data.dimensions_current);
            system.structure.initializeRadarAxes(system.data.dimensions_current);

        }

        var tot_distance = 0;
        system.data.points.forEach(function(p) {
            system.radviz.calculatePerfectPointDisposition(p, system.data.dimensions_current);
            tot_distance = tot_distance + system.radviz.calculateDistanceDimensions(system.data.dimensions_current, p.order);
        });


        // FARE LE FUNZIONI QUI SOTTO 
        system.radviz.calculateInformation(system.data.points, system.data.dimensions_current);
        system.radviz.computeOptimization();
    }

    this.increaseRadius = () => {

        if (that.circle_radius < 10) {
            that.circle_radius = that.circle_radius + 0.25
            d3.selectAll(".data_point").attr('r', that.circle_radius)
        }
    }

    this.decreaseRadius = () => {
        if (that.circle_radius > 0.50) {
            that.circle_radius = that.circle_radius - 0.25
            d3.selectAll(".data_point").attr('r', that.circle_radius)
        }
    }

    this.increaseLevelGrid = () => {
        if (that.level_grid < 20) that.level_grid = that.level_grid + 1
        system.radviz.initializeGrid()

    }

    this.decreaseLevelGrid = () => {
            if (that.level_grid > 0) that.level_grid = that.level_grid - 1
            system.radviz.initializeGrid()

        }
        /* */
    this.updateDisposition = (butt, label) => {
        d3.json( system.data.LINK_SERVER + 'data/json/min_max_effectiveness.json').then(json_data => {
            let label_dataset = ''
            let namedataset = system.data.nameDataset
            let start_label = -1
            let end_label = -1


            label_dataset = namedataset
            if (label_dataset.indexOf('-') > 0) {
                start_label = label_dataset.indexOf('-') + 1
                label_dataset = label_dataset.substring(start_label)
            }

            if (label_dataset.indexOf('(') > 0) {
                end_label = label_dataset.indexOf('(')
                label_dataset = label_dataset.substring(0, end_label)
            } else if (label_dataset.indexOf('.') > 0) {
                end_label = label_dataset.indexOf('.')
                label_dataset = label_dataset.substring(0, end_label)
            }



            if (Object.keys(json_data).includes(label_dataset)) {
                system.settings.updateRadviz(butt, json_data[label_dataset][label]);
            } else {
                if (label == 'min')
                    alert('Minimum Effectiveness Error for ' + label_dataset + ' is not yet calculated')
                if (label == 'max')
                    alert('Maximum Effectiveness Error for ' + label_dataset + ' is not yet calculated')
            }

        })
    }

    this.updateDispositionCompetitor = (butt, label) => {
        d3.json(system.data.LINK_SERVER + 'data/json/competitors.json').then(json_data => {
            let label_dataset = ''
            let namedataset = system.data.nameDataset
            let start_label = -1
            let end_label = -1

            label_dataset = namedataset
            if (label_dataset.indexOf('-') > 0) {
                start_label = label_dataset.indexOf('-') + 1
                label_dataset = label_dataset.substring(start_label)
            }

            if (label_dataset.indexOf('(') > 0) {
                end_label = label_dataset.indexOf('(')
                label_dataset = label_dataset.substring(0, end_label)
            } else if (label_dataset.indexOf('.') > 0) {
                end_label = label_dataset.indexOf('.')
                label_dataset = label_dataset.substring(0, end_label)
            }


            if (Object.keys(json_data).includes(label_dataset)) {
                system.settings.updateRadviz(butt, json_data[label_dataset][label]);
            } else {
                alert('The ' + label + ' dimension arragmenet for ' + label_dataset + ' is not yet calculated')
            }

        })
    }

    this.updateShortHeuristic = function(data){

        var copy_data = Object.assign({}, data);

        let dimensions_values = copy_data.dimensions.slice();
        let dimensions_ordered = []
        dimensions_values.forEach((d) => {
            current_values = d.values.slice()            
            dimensions_ordered.push({'id': d.id, 'values': current_values.sort(function(a, b) { return a - b })})
        })
        console.log(data.dimensions)
        console.log(copy_data.dimensions)
        console.log(dimensions_values);
        let max_ind_val = [0,-1]
        let heuristic_dimensions = []

        for (var percentage = 1; percentage<=100; percentage++){
            let quantile_dim = {}
            dimensions_ordered.forEach((d)=>{   
                quantile_dim[d.id] = d3.quantile(d.values, percentage/100)
            })
            //console.log(quantile_dim);

            
            let quantile_ordered = Object.keys(quantile_dim).sort(function(a, b) {
                return quantile_dim[b] - quantile_dim[a];
            });


            let original_dim =copy_data.dimensions.map(d => d.id)
            quantile_ordered.forEach(function(dim,i){
                quantile_ordered[i] = original_dim.indexOf(dim);
            })

            let i, s, e;
            s = 0;
            e = quantile_ordered.length - 1;
            let prova = new Array(quantile_ordered.length);
            for (i = 0; i < quantile_ordered.length; i++) {
                if (i % 2 == 0) {
                    prova[s] = quantile_ordered[i];
                    s++;
                } else {
                    prova[e] = quantile_ordered[i];
                    e--;
                }
            }

            //console.log(prova)

            let current_md = d3_radviz.calculateRadvizMeanDistance(prova);
            if (current_md > max_ind_val[1]){
                console.log()
                max_ind_val[0] = percentage
                max_ind_val[1] = current_md
                heuristic_dimensions = prova.slice()
                console.log(percentage,current_md,heuristic_dimensions)
                console.log(quantile_dim);
            }
        }
            
    
    
            return heuristic_dimensions;
        
    
    
    }



    this.selectedHeuristic = function(butt) {
        let entries_selected = []

        let dimensions_set = []
        d3_radviz.data().dimensions.forEach(function() {
            dimensions_set.push([])
        })



        d3_radviz.data().entries.forEach(
            function(p, i) {

                if (p.selected) {
                    entries_selected.push(p)
                    d3_radviz.data().dimensions.forEach(
                        function(v, j) {

                            dimensions_set[j].push(p.dimensions[v.id])
                        }
                    )
                }
            }
        )

        let subset_selected = Object.assign({}, d3_radviz.data());
        subset_selected.entries = entries_selected

        system.radar.resetNumberChart();
        if (dimensions_set[0].length == 0)
            alert('"Selected" dimension arrangment cannot be applied without choosing a point or a cluster.');
        else if (dimensions_set[0].length == 1){
            // SINGLE POINT OPTIMAL
            d3_radviz.single_point_procedure(d3.selectAll('.data_point-'+ d3_radviz.getIndex()).filter(function(d) {return d.selected}).nodes()[0].id);        
        }
        else
            system.settings.updateRadviz(butt, d3.radvizDA.minEffectivenessErrorHeuristic(subset_selected))



    }
    return this;
}).call({})