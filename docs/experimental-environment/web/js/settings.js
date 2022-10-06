if (window.system == undefined) window.system = {}
system.settings = (function() {
    const that = this;


    this.perfect_selected = false;
    this.quantile_selected = false;
    this.cluster_selected = false;
    this.indipendent_selected = false;
    this.radvizplusplus_selected = false;

    this.color_selected = false;

    this.max_quantile_value = -1;
    this.max_cluster_quantile_value = -1;

    this.max_quantile_label = null;
    this.max_cluster_quantile_label = null;

    this.max_quantile_label_dimensions = null;
    this.max_cluster_quantile_label_dimensions = null;

    this.indipendent_mean = null;
    this.radvizplusplus_mean = null;

    this.quantile_DBI = null;
    this.cluster_DBI = null;
    this.indipendent_DBI = null;
    this.radvizplusplus_DBI = null;
    this.perfect_DBI = null;
    this.value_DBI = null;

    this.quantile_global_quality = null;
    this.indipendent_global_quality = null;
    this.radvix_plus_plus_global_quality = null;
    this.value_global_quality = null;

    this.selected_dataset_option = '';


    this.cleanVisualization = () => {
        system.structure.removeElementsByClass("checkbox_attributes");
        system.structure.removeElementsByClass("label_attributes");
        system.structure.removeElementsByClass("label_classification");
        system.structure.removeElementsByClass("checkbox_classification");
        system.structure.removeElementsByClass("axisforce");
        d3.select("#btn_quantile").attr("class", "btn_style");
        d3.select("#btn_cluster").attr("class", "btn_style");

    };

    this.resetVariables = () => {
        this.perfect_selected = false;
        this.quantile_selected = false;
        this.cluster_selected = false;
        this.max_quantile_value = -1;
        this.max_cluster_quantile_value = -1;

        $('button').removeClass('active');
        $('#effectiveness-radio').prop('checked', true)

    }

    this.updateClassificationAttribute = (attr) => {

        let classification = d3.select(attr).attr("value")
        classification_selected = d3.select(attr).attr("value")
        d3_radviz.setColorClassification(d3.select(attr).attr("value"))

        if (!ORIGINAL_CLASSIFIED) {
            system.data.dime.forEach(function(dim, i) {
                if (dim == classification) {
                    document.getElementById("check_attr" + i).checked = false;
                    document.getElementById("radio_attr" + i).checked = true;
                }
            })
            system.settings.removeDimDataset(d3.select("#check_attr" + system.data.dime.indexOf(classification))._groups[0][0], 'radio')
        }

        name_attr = classification_selected
    }

    this.updateClassificationAttributeUpload = (attr) => {

        let classification = d3.select(attr).attr("value")
        classification_selected = d3.select(attr).attr("value")
        d3_radviz.setColorClassification(d3.select(attr).attr("value"))

        if (!ORIGINAL_CLASSIFIED) {
            system.data.dime.forEach(function(dim, i) {
                if (dim == classification) {
                    document.getElementById("check_attr" + i).checked = false;
                    document.getElementById("radio_attr" + i).checked = true;
                }
            })
        }

        system.settings.removeDimDatasetUploaded(d3.select("#check_attr" + system.data.dime.indexOf(classification))._groups[0][0], 'radio')
        name_attr = classification_selected
    }

    this.newDataset = function(loadfile, nameDataset) {


        d3_radviz = d3.radviz()

        d3.csv(loadfile).then(dataset => {


            DATASET_NAME = nameDataset
            dimensions_removed = []
            attr_removed = []

            if (DATASET_NAME.indexOf('(') > 0) {
                name_attr = DATASET_NAME.substring(DATASET_NAME.indexOf('(') + 1, DATASET_NAME.indexOf(')'));
                ORIGINAL_CLASSIFIED = true
            }

            d3_radviz.data(dataset, name_attr)
            if (d3_radviz.data().attributes.length != 0) {
                name_attr = d3_radviz.data().attributes[0].id
                d3_radviz.setColorClassification()
                d3_radviz.setColorClassification(name_attr)
                ORIGINAL_CLASSIFIED = true

            } else if (DATASET_NAME.indexOf('(') > 0) {
                name_attr = DATASET_NAME.substring(DATASET_NAME.indexOf('(') + 1, DATASET_NAME.indexOf(')'));
                d3_radviz.setColorClassification(name_attr);
                ORIGINAL_CLASSIFIED = true

            } else {
                ORIGINAL_CLASSIFIED = false
            }

            system.data.load( system.data.LINK_SERVER + "data/" + nameDataset + ".csv", nameDataset);
            system.structure.initializeForce();
            system.structure.initializeRadar();
            system.structure.initializeForceAxes(d3_radviz.data().angles);
            system.structure.initializeRadarAxes(d3_radviz.data().angles);


            let f_context_menu = function(_) {
                system.structure.initializeForceAxes(_);
                system.structure.initializeRadarAxes(_);
                system.radar.changeRadar(_);
            }
            let f_click = function(a, b, c) {
                system.radar.drawRadar(a, b, c);
                system.structure.uploadProgressBar();

            }

            let f_drag_end = function(a) {
                system.structure.initializeForceAxes(a);
                system.structure.initializeRadarAxes(a);
                system.radar.changeRadar(a);
                system.structure.drawboxplot(d3_radviz.data().entries.map(d => d.errorE));

            }

            let f_mouse_over = function(a, b) {
                system.spring.drawForce(a, b);

                var div = d3.select(".tooltip")
                div.transition()
                    .duration(200)
                    .style("opacity", .9)

                .delay(500);
                div.html("(" + b.x1.toFixed(2) + "," + b.x2.toFixed(2) + ")<br> EE: " + b.errorE.toFixed(2))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 50) + "px")
                    .style("color", "white")
                    .style("background", "black")
            }

            let f_mouse_out = function() {
                d3.selectAll(".lineforce").remove();
                var div = d3.select(".tooltip")
                div.transition()
                    .duration(50)
                    .style("opacity", 0);

            }

            let results1 = function(error_value) {
                
                    document.getElementById('menu1').innerHTML = ' <b>Effectiveness Error</b>: ' + error_value.toFixed(4)

                    /* TEST FUNZIONI METRICHE*/
                    
                    system.settings.addOtherMetrics();
                   
                    /* --- */
                }
            d3_radviz.setFunctionUpdateResults(results1)
            d3_radviz.setFunctionClick(f_click)
            d3_radviz.setFunctionMouseOver(f_mouse_over)
            d3_radviz.setFunctionMouseOut(f_mouse_out)
            d3_radviz.setFunctionDragEnd(f_drag_end)
            d3_radviz.setFunctionContextMenu(f_context_menu)

            system.structure.legenda_cluster(Array.from(new Set(d3_radviz.data().attributes.filter(function(pilot) {
                return pilot.id === name_attr
            }).map(d => d.values)[0])))
            const set = d3_radviz.data().dimensions.map(d => d.values)
            d3.select('#container').call(d3_radviz);
            system.structure.drawboxplot(d3_radviz.data().entries.map(d => d.errorE));
            system.structure.uploadProgressBar();

        })
    }

    this.addOtherMetrics = function(){
        let metrics = new RadVizMetrics(d3_radviz)
        if (d3.select("#oth-metrics").property('checked')){
            if (isNaN(metrics.dbindex())){
            document.getElementById('metric-value').innerHTML = "  <b>Projection Error COS</b>: " + metrics.projectionError("cosine").toFixed(4)+
            "<br>  <b>Clumping50</b>: " + metrics.clumping50().toFixed(4)
            } else {
                document.getElementById('metric-value').innerHTML = "  <b>Projection Error COS</b>: " + metrics.projectionError("cosine").toFixed(4)+
            "<br>  <b>Clumping50</b>: " + metrics.clumping50().toFixed(4)+
            "<br>  <b>DB index</b>: " + metrics.dbindex().toFixed(4)
            }
        } else {
            document.getElementById('metric-value').innerHTML = ""
        }
    }

    this.deselectPoints = function(){
        
        d3.selectAll('.data_point-'+ d3_radviz.getIndex())
        .each(function(d){
            d.selected = false;
        })
        .style("stroke-width", '0.2')
        system.structure.uploadProgressBar();
        d3.selectAll(".radarlevel").remove();
    }

    this.newDataset_upload = function(loadfile, nameDataset) {
        d3_radviz = d3.radviz()



        let dataset = d3.csvParse(system.uploadedfile.readDataUploaded(nameDataset))
        DATASET_NAME = nameDataset
        dimensions_removed = []
        name_attr = ''

        d3_radviz.data(dataset)
        if (d3_radviz.data().attributes.length != 0) {
            name_attr = d3_radviz.data().attributes[0].id
            d3_radviz.setColorClassification(name_attr)
            ORIGINAL_CLASSIFIED = true
        } else {
            ORIGINAL_CLASSIFIED = false
        }


        system.data.load_upload(loadfile, nameDataset);
        system.structure.initializeForce();
        system.structure.initializeRadar();
        system.structure.initializeForceAxes(d3_radviz.data().angles);
        system.structure.initializeRadarAxes(d3_radviz.data().angles);

        let f_context_menu = function(_) {
            system.structure.initializeForceAxes(_);
            system.structure.initializeRadarAxes(_);
            system.radar.changeRadar(_);
        }
        let f_click = function(a, b, c) {
            system.radar.drawRadar(a, b, c);
            system.structure.uploadProgressBar();
            


        }

        let f_drag_end = function(a) {
            system.structure.initializeForceAxes(a);
            system.structure.initializeRadarAxes(a);
            system.radar.changeRadar(a);
            system.structure.drawboxplot(d3_radviz.data().entries.map(d => d.errorE));
        }

        let f_mouse_over = function(a, b) {
            system.spring.drawForce(a, b);

            var div = d3.select(".tooltip")
            div.transition()
                .duration(200)
                .style("opacity", .9)

            .delay(500);
            div.html("(" + b.x1.toFixed(2) + "," + b.x2.toFixed(2) + ")<br> EE: " + b.errorE.toFixed(2))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 50) + "px")
                .style("color", "white")
                .style("background", "black")
        }

        let f_mouse_out = function() {

            d3.selectAll(".lineforce").remove();
            var div = d3.select(".tooltip")
            div.transition()
                .duration(50)
                .style("opacity", 0);
        }

        let results1 = function(error_value) {
                
            document.getElementById('menu1').innerHTML = ' <b>Effectiveness Error</b>: ' + error_value.toFixed(4)

            /* TEST FUNZIONI METRICHE*/
            
            system.settings.addOtherMetrics();
           
            /* --- */
        }
        d3_radviz.setFunctionClick(f_click)
        d3_radviz.setFunctionMouseOver(f_mouse_over)
        d3_radviz.setFunctionMouseOut(f_mouse_out)
        d3_radviz.setFunctionDragEnd(f_drag_end)
        d3_radviz.setFunctionContextMenu(f_context_menu)
        d3_radviz.setFunctionUpdateResults(results1)

        system.structure.legenda_cluster(Array.from(new Set(d3_radviz.data().attributes.filter(function(pilot) {
            return pilot.id === name_attr
        }).map(d => d.values)[0])))
        const set = d3_radviz.data().dimensions.map(d => d.values)
        d3.select('#container').call(d3_radviz);
        system.structure.drawboxplot(d3_radviz.data().entries.map(d => d.errorE));
        system.structure.uploadProgressBar();
    }

    this.choiceDimensionsNewDataset = function(d, dat, but) {


        d3.csv(dat).then(currentdataset => {
            if (but == 'check') {
                if (!d.checked) {
                    if (dimensions_removed.indexOf(d.value) == -1) {
                        dimensions_removed.push(d.value);
                    }
                } else {

                    let indx = dimensions_removed.indexOf(d.value)
                    if (indx > -1)
                        dimensions_removed.splice(indx, 1)
                    else
                        attr_removed = []

                    let ind_clas = attr_removed.indexOf(d.value)
                    if (ind_clas > -1) {
                        attr_removed = []
                    }


                }


            }
            if (but == 'radio') {


                if (attr_removed.indexOf(d.value) > -1) attr_removed = []
                else attr_removed = [d.value]

            }

            currentdataset.forEach(element => {
                dimensions_removed.forEach(dd => {
                    if (attr_removed.indexOf(dd) == -1) {
                        delete currentdataset.columns[currentdataset.columns.indexOf(dd)]
                        delete element[dd];
                    }
                })
            });


            if (but == 'check') {


                if (DATASET_NAME.indexOf('(') != -1) {
                    name_attr = DATASET_NAME.substring(DATASET_NAME.indexOf('(') + 1, DATASET_NAME.length - 1)

                    d3_radviz.data(currentdataset, name_attr)
                    d3_radviz.setColorClassification(name_attr)
                    system.data.load(dat, DATASET_NAME);
                } else if (attr_removed != []) {
                    name_attr = attr_removed[0]
                    d3_radviz.data(currentdataset, name_attr)
                    d3_radviz.setColorClassification(name_attr)
                    system.data.load(dat, DATASET_NAME);

                } else if (d3_radviz.data().attributes.length != 0) {

                    name_attr = d3_radviz.data().attributes[0].id
                    d3_radviz.setColorClassification()
                    d3_radviz.setColorClassification(name_attr)
                    d3_radviz.data(currentdataset, name_attr)
                    system.data.load(dat, DATASET_NAME);
                } else {
                    d3_radviz.data(currentdataset)
                    system.data.load(dat, DATASET_NAME);
                }

            }
            if (but == 'radio') {

                name_attr = d.value

                d3_radviz.data(currentdataset, name_attr)
                d3_radviz.setColorClassification(name_attr)
                system.data.load(dat, DATASET_NAME);
            }



            system.structure.initializeForce();
            system.structure.initializeRadar();
            system.structure.initializeForceAxes(d3_radviz.data().angles);
            system.structure.initializeRadarAxes(d3_radviz.data().angles);


            let f_context_menu = function(_) {
                system.structure.initializeForceAxes(_);
                system.structure.initializeRadarAxes(_);
                system.radar.changeRadar(_);
            }
            let f_click = function(a, b, c) {
                system.radar.drawRadar(a, b, c);
                system.structure.uploadProgressBar();

            }

            let f_drag_end = function(a) {
                system.structure.initializeForceAxes(a);
                system.structure.initializeRadarAxes(a);
                system.radar.changeRadar(a);

            }

            let f_mouse_over = function(a, b) {
                system.spring.drawForce(a, b);

                var div = d3.select(".tooltip")
                div.transition()
                    .duration(200)
                    .style("opacity", .9)

                .delay(500);
                div.html("(" + b.x1.toFixed(2) + "," + b.x2.toFixed(2) + ")<br> EE: " + b.errorE.toFixed(2))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 50) + "px")
                    .style("color", "white")
                    .style("background", "black")
            }

            let f_mouse_out = function() {

                d3.selectAll(".lineforce").remove();
                var div = d3.select(".tooltip")
                div.transition()
                    .duration(50)
                    .style("opacity", 0);
            }
            d3_radviz.setFunctionClick(f_click);
            d3_radviz.setFunctionMouseOver(f_mouse_over);
            d3_radviz.setFunctionMouseOut(f_mouse_out);
            d3_radviz.setFunctionDragEnd(f_drag_end);
            d3_radviz.setFunctionContextMenu(f_context_menu);

            system.structure.legenda_cluster(Array.from(new Set(d3_radviz.data().attributes.filter(function(pilot) {
                return pilot.id === name_attr
            }).map(d => d.values)[0])))
            const set = d3_radviz.data().dimensions.map(d => d.values)
            d3.select('#container').call(d3_radviz);
            system.structure.uploadProgressBar();

        })
    }

    this.choiceDimensionsNewDataset_upload = function(d, dat, but) {


        let dataset = d3.csvParse(system.uploadedfile.readDataUploaded(dat))


        if (but == 'check') {
            if (!d.checked) {
                if (dimensions_removed.indexOf(d.value) == -1) {
                    dimensions_removed.push(d.value);
                }
            } else {

                let indx = dimensions_removed.indexOf(d.value)
                if (indx > -1)
                    dimensions_removed.splice(indx, 1)
                else
                    attr_removed = []

                let ind_clas = attr_removed.indexOf(d.value)
                if (ind_clas > -1) {
                    attr_removed = []
                }


            }


        }
        if (but == 'radio') {
            if (attr_removed.indexOf(d.value) > -1) attr_removed = []
            else attr_removed = [d.value]

        }

        dataset.forEach(element => {
            dimensions_removed.forEach(dd => {
                if (attr_removed.indexOf(dd) == -1) {
                    delete dataset.columns[dataset.columns.indexOf(dd)]
                    delete element[dd];
                }
            })
        });


        if (but == 'check') {


            if (attr_removed != []) {
                name_attr = attr_removed[0]
                d3_radviz.data(dataset, name_attr)
                d3_radviz.setColorClassification(name_attr)
                system.data.load(dat, DATASET_NAME);

            } else if (d3_radviz.data().attributes.length != 0) {

                name_attr = d3_radviz.data().attributes[0].id
                d3_radviz.setColorClassification()
                d3_radviz.setColorClassification(name_attr)
                d3_radviz.data(dataset, name_attr)
                system.data.load(dat, DATASET_NAME);
            } else {
                d3_radviz.data(dataset)
                system.data.load(dat, DATASET_NAME);
            }

        }
        if (but == 'radio') {

            name_attr = d.value

            d3_radviz.data(dataset, name_attr)
            d3_radviz.setColorClassification(name_attr)
            system.data.load(dat, DATASET_NAME);
        }


        name_attr = DATASET_NAME.substring(DATASET_NAME.indexOf('(') + 1, DATASET_NAME.length - 1)
        d3_radviz.setColorClassification(name_attr)
        system.data.load_upload(dat, DATASET_NAME);
        system.structure.initializeForce();
        system.structure.initializeRadar();
        system.structure.initializeForceAxes(d3_radviz.data().angles);
        system.structure.initializeRadarAxes(d3_radviz.data().angles);


        let f_context_menu = function(_) {
            system.structure.initializeForceAxes(_);
            system.structure.initializeRadarAxes(_);
            system.radar.changeRadar(_);
        }
        let f_click = function(a, b, c) {
            system.radar.drawRadar(a, b, c);
            system.structure.uploadProgressBar();

        }

        let f_drag_end = function(a) {
            system.structure.initializeForceAxes(a);
            system.structure.initializeRadarAxes(a);
            system.radar.changeRadar(a);

        }

        let f_mouse_over = function(a, b) {
            system.spring.drawForce(a, b);

            var div = d3.select(".tooltip")
            div.transition()
                .duration(200)
                .style("opacity", .9)

            .delay(500);
            div.html("(" + b.x1.toFixed(2) + "," + b.x2.toFixed(2) + ")<br> EE: " + b.errorE.toFixed(2))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 50) + "px")
                .style("color", "white")
                .style("background", "black")
        }

        let f_mouse_out = function() {
            d3.selectAll(".lineforce").remove();
            var div = d3.select(".tooltip")
            div.transition()
                .duration(50)
                .style("opacity", 0);
        }
        d3_radviz.setFunctionClick(f_click)
        d3_radviz.setFunctionMouseOver(f_mouse_over)
        d3_radviz.setFunctionMouseOut(f_mouse_out)
        d3_radviz.setFunctionDragEnd(f_drag_end)
        d3_radviz.setFunctionContextMenu(f_context_menu)

        system.structure.legenda_cluster(Array.from(new Set(d3_radviz.data().attributes.filter(function(pilot) {
            return pilot.id === name_attr
        }).map(d => d.values)[0])))
        const set = d3_radviz.data().dimensions.map(d => d.values)
        d3.select('#container').call(d3_radviz);
        system.structure.uploadProgressBar();
        document.getElementById("btn_min_disposition").style.display = "none";
        document.getElementById("btn_max_disposition").style.display = "none";
        document.getElementById("btn_dependent_da_disposition").style.display = "none";
        document.getElementById("btn_independent_da_disposition").style.display = "none";
        document.getElementById("btn_vizrank_disposition").style.display = "none";
        document.getElementById("btn_radviz_pp_disposition").style.display = "none";
        document.getElementById("btn_t_statistic_disposition").style.display = "none";



    }

    this.initializeDB = () => {
        system.data.original_dimensions = '';
        system.settings.cleanVisualization();
        system.settings.resetVariables();

        let name_dataset = document.querySelector('#select-dataset option:checked').value

        d3_radviz.remove(true);
        system.data.nameDataset = name_dataset
        
        system.settings.newDataset(system.data.LINK_SERVER +'data/' + name_dataset + '.csv', name_dataset);
        d3.json(system.data.LINK_SERVER + 'data/json/competitors.json').then(json_data => {
        
       
        let label_dataset = ''
            let namedataset = name_dataset
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
                document.getElementById("btn_dependent_da_disposition").style.display = "";
                document.getElementById("btn_independent_da_disposition").style.display = "";
                document.getElementById("btn_radviz_pp_disposition").style.display = "";

                if (d3_radviz.data().attributes.length != 0) {
                    document.getElementById("btn_vizrank_disposition").style.display = "";
                    document.getElementById("btn_t_statistic_disposition").style.display = "";
                } else {
                    document.getElementById("btn_vizrank_disposition").style.display = "none";
                    document.getElementById("btn_t_statistic_disposition").style.display = "none";
                }
            } else {
                document.getElementById("btn_dependent_da_disposition").style.display = "none";
                document.getElementById("btn_independent_da_disposition").style.display = "none";
                document.getElementById("btn_radviz_pp_disposition").style.display = "none";

                document.getElementById("btn_vizrank_disposition").style.display = "none";
                document.getElementById("btn_t_statistic_disposition").style.display = "none";

            }
        })

        d3.json(system.data.LINK_SERVER + 'data/json/min_max_effectiveness.json').then(json_data => {
            let label_dataset = ''
            let namedataset = name_dataset
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
                document.getElementById("btn_min_disposition").style.display = "";
                document.getElementById("btn_max_disposition").style.display = "";
            } else {
                document.getElementById("btn_min_disposition").style.display = "none";
                document.getElementById("btn_max_disposition").style.display = "none";

            }

        })
    }

    this.initializeDBUploaded = () => {
        system.data.original_dimensions = '';
        system.settings.cleanVisualization();
        system.settings.resetVariables();

        let name_dataset = document.querySelector('#uploaded-dataset option:checked').value

        d3_radviz.remove(true);

        system.data.nameDataset = name_dataset
        system.settings.newDataset_upload(name_dataset, name_dataset)

        document.getElementById("btn_min_disposition").style.display = "none";
        document.getElementById("btn_max_disposition").style.display = "none";
        document.getElementById("btn_dependent_da_disposition").style.display = "none";
        document.getElementById("btn_independent_da_disposition").style.display = "none";
        document.getElementById("btn_radviz_pp_disposition").style.display = "none";
        document.getElementById("btn_vizrank_disposition").style.display = "none";
        document.getElementById("btn_t_statistic_disposition").style.display = "none";

    }

    this.removeDimDataset = (d, but) => {
        system.data.original_dimensions = '';
        system.settings.cleanVisualization();
        system.settings.resetVariables();

        let name_dataset = document.querySelector('#select-dataset option:checked').value;
        d3_radviz.remove(true);
        system.data.nameDataset = name_dataset
        system.settings.choiceDimensionsNewDataset(d, system.data.LINK_SERVER + 'data/' + name_dataset + '.csv', but)
    }

    this.removeDimDatasetUploaded = (d, but) => {
        system.data.original_dimensions = '';
        system.settings.cleanVisualization();
        system.settings.resetVariables();

        let name_dataset = document.querySelector('#uploaded-dataset option:checked').value;
        d3_radviz.remove(true);

        system.data.nameDataset = name_dataset
        system.settings.choiceDimensionsNewDataset_upload(d, name_dataset, but)
    }


    this.start = () => {


        system.structure.initializeSVG();
        system.data.initializeScale();
        system.structure.initializeForce();
        system.structure.initializeRadar();


        system.radviz.initializeGrid();
        system.radviz.disegnapuntiedimensioni();
        let tot_distance = 0;

        system.data.points.forEach((p) => {
            system.radviz.calculatePerfectPointDisposition(p, system.data.dimensions_current);
            tot_distance = tot_distance + system.radviz.calculateDistanceDimensions(system.data.dimensions_current, p.order);
        });

        let clusters_array = system.data.points.map((d) => { return d[system.data.cluster_label[system.data.nameDataset]] });

        system.radviz.calculateInformation(system.data.points, system.data.dimensions_current);
        system.structure.initializeForceAxes(system.data.dimensions_current);
        system.structure.initializeRadarAxes(system.data.dimensions_current);
        system.structure.legenda_cluster(clusters_array);

        system.radviz.computeOptimization();

    }


    this.resetVisualization = function() {

        $('button').removeClass('active');
        if (document.querySelector('#select-dataset option:checked').value != '') {
            system.settings.initializeDB();
        } else {
            system.settings.initializeDBUploaded();
        }

        system.structure.uploadProgressBar();
    }

    this.updateRadviz = function(butt, _) {
        $('button').removeClass('active');
        $('#' + butt).addClass('active');

        if (_ == undefined)
            d3_radviz.updateRadviz();
        else
            d3_radviz.updateRadviz(_);

        system.structure.initializeForceAxes(d3_radviz.data().angles);
        system.structure.initializeRadarAxes(d3_radviz.data().angles);
        system.radar.changeRadar(d3_radviz.data().angles);
        system.structure.drawboxplot(d3_radviz.data().entries.map(d => d.errorE));
    }

    return this;
}).call({})