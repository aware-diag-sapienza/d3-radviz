if (window.system == undefined) window.system = {}
system.settings = (function() {
    const that = this;
    /*
     */
    // variabili this.nome variabile.
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




    /*
     */

    // metodi this.nome_parametri = (variabili di input) => {}

    this.cleanVisualization = () => {
        system.structure.removeElementsByClass("checkbox_attributes");
        system.structure.removeElementsByClass("label_attributes");
        system.structure.removeElementsByClass("label_classification");
        system.structure.removeElementsByClass("checkbox_classification");
        system.structure.removeElementsByClass("axisforce");
        //document.getElementById("infovalues").innerHTML = "";
        //document.getElementById('menu1').innerHTML = '<i class="fas fa-cog dropbtn"></i> ';
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

        //let checked_value_color = document.querySelector('input[name="color-quality"]:checked').value;
        //if
        $('#effectiveness-radio').prop('checked', true)

    }

    this.updateClassificationAttribute = (attr) => {

        let classification = d3.select(attr).attr("value")
        classification_selected = d3.select(attr).attr("value")
        d3_radviz.setColorClassification(d3.select(attr).attr("value"))

        if (!ORIGINAL_CLASSIFIED) {
            console.log("quicambio le cose")
            system.data.dime.forEach(function(dim, i) {
                if (dim == classification) {
                    document.getElementById("check_attr" + i).checked = false;
                    document.getElementById("radio_attr" + i).checked = true;
                }
            })
        }
        //if (document.getElementById("check_attr" + system.data.dime.indexOf(classification)).checked)
        //    document.getElementById("check_attr" + system.data.dime.indexOf(classification)).checked = false;
        //document.getElementById("radio_attr" + system.data.dime.indexOf(classification)).checked = true;
        system.settings.removeDimDataset(d3.select("#check_attr" + system.data.dime.indexOf(classification))._groups[0][0], 'radio')
        name_attr = classification_selected
    }

    this.updateClassificationAttributeUpload = (attr) => {

        let classification = d3.select(attr).attr("value")
        classification_selected = d3.select(attr).attr("value")
        d3_radviz.setColorClassification(d3.select(attr).attr("value"))

        if (!ORIGINAL_CLASSIFIED) {
            console.log("quicambio le cose")
            system.data.dime.forEach(function(dim, i) {
                if (dim == classification) {
                    document.getElementById("check_attr" + i).checked = false;
                    document.getElementById("radio_attr" + i).checked = true;
                }
            })
        }
        //if (document.getElementById("check_attr" + system.data.dime.indexOf(classification)).checked)
        //    document.getElementById("check_attr" + system.data.dime.indexOf(classification)).checked = false;
        //document.getElementById("radio_attr" + system.data.dime.indexOf(classification)).checked = true;
        system.settings.removeDimDatasetUploaded(d3.select("#check_attr" + system.data.dime.indexOf(classification))._groups[0][0], 'radio')
        name_attr = classification_selected
    }

    this.initializeDB = () => {
        system.data.original_dimensions = '';
        system.settings.cleanVisualization();
        system.settings.resetVariables();

        let name_dataset = document.querySelector('#select-dataset option:checked').value //document.querySelector('input[name="dataset"]:checked').value;

        d3_radviz.remove(true);
        system.data.nameDataset = name_dataset
            //newDataset(name_dataset);
        newDataset('./data/' + name_dataset + '.csv', name_dataset);
        console.log("DATA", name_dataset)
        d3.json('./data/json/competitors.json').then(json_data => {
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
                //document.getElementById("btn_distance_disposition").style.display = "";

                if (d3_radviz.data().attributes.length != 0) {
                    //    document.getElementById("btn_distance_disposition").style.display = "";
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
                //document.getElementById("btn_distance_disposition").style.display = "none";
                document.getElementById("btn_vizrank_disposition").style.display = "none";
                document.getElementById("btn_t_statistic_disposition").style.display = "none";

            }
            //system.structure.initializeForceAxes(d3_radviz.data().angles);
            //system.structure.initializeRadarAxes(d3_radviz.data().angles);
        })

        d3.json('./data/json/min_max_effectiveness.json').then(json_data => {
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
            //system.structure.initializeForceAxes(d3_radviz.data().angles);
            //system.structure.initializeRadarAxes(d3_radviz.data().angles);
        })

        //system.structure.legenda_cluster(Array.from(new Set(d3_radviz.data().attributes.filter(function(pilot) {
        //    return pilot.id === name_attr
        //}).map(d => d.values)[0])))

        //system.data.load(name_dataset);   
    }

    this.initializeDBUploaded = () => {
        system.data.original_dimensions = '';
        system.settings.cleanVisualization();
        system.settings.resetVariables();

        let name_dataset = document.querySelector('#uploaded-dataset option:checked').value //document.querySelector('input[name="dataset"]:checked').value;

        d3_radviz.remove(true);

        system.data.nameDataset = name_dataset
            //newDataset(name_dataset);
        newDataset_upload(name_dataset, name_dataset)
            //newDataset('./data/' + name_dataset + '.csv', name_dataset);
        console.log("DATA", name_dataset)

        document.getElementById("btn_min_disposition").style.display = "none";
        document.getElementById("btn_max_disposition").style.display = "none";
        document.getElementById("btn_dependent_da_disposition").style.display = "none";
        document.getElementById("btn_independent_da_disposition").style.display = "none";
        document.getElementById("btn_radviz_pp_disposition").style.display = "none";
        //document.getElementById("btn_distance_disposition").style.display = "none";
        document.getElementById("btn_vizrank_disposition").style.display = "none";
        document.getElementById("btn_t_statistic_disposition").style.display = "none";


        //system.data.load(name_dataset);   
    }

    this.removeDimDataset = (d, but) => {
        system.data.original_dimensions = '';
        system.settings.cleanVisualization();
        system.settings.resetVariables();

        console.log('****', but)
        let name_dataset = document.querySelector('#select-dataset option:checked').value;
        d3_radviz.remove(true);
        system.data.nameDataset = name_dataset
        choiceDimensionsNewDataset(d, './data/' + name_dataset + '.csv', but)

        //system.data.load(name_dataset);   
    }

    this.removeDimDatasetUploaded = (d, but) => {
        system.data.original_dimensions = '';
        system.settings.cleanVisualization();
        system.settings.resetVariables();

        let name_dataset = document.querySelector('#uploaded-dataset option:checked').value;
        d3_radviz.remove(true);

        system.data.nameDataset = name_dataset
        choiceDimensionsNewDataset_upload(d, name_dataset, but)

        //system.data.load(name_dataset);   
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

        // FARE LE FUNZIONI QUI SOTTO 
        system.radviz.calculateInformation(system.data.points, system.data.dimensions_current);
        system.structure.initializeForceAxes(system.data.dimensions_current);
        system.structure.initializeRadarAxes(system.data.dimensions_current);
        system.structure.legenda_cluster(clusters_array);

        system.radviz.computeOptimization(); // computazione delle procedure degli altri paper

    }


    this.resetVisualization = function() {

        $('button').removeClass('active');
        if (document.querySelector('#select-dataset option:checked').value != '') {
            system.settings.initializeDB();
        } else {
            console.log('CHIAMO QUESTO')
            system.settings.initializeDBUploaded();
        }

        system.structure.uploadProgressBar();
    }

    this.updateRadviz = function(butt, _) {
        $('button').removeClass('active');
        $('#' + butt).addClass('active');

        //.on('click', function() {
        //$('a').removeClass('active');
        //$(this).addClass('active');
        console.log(butt)
        if (_ == undefined)
            d3_radviz.updateRadviz();
        else
            d3_radviz.updateRadviz(_);

        system.structure.initializeForceAxes(d3_radviz.data().angles);
        system.structure.initializeRadarAxes(d3_radviz.data().angles);
        system.radar.changeRadar(d3_radviz.data().angles);
        //console.log(d3_radviz.data().entries.map(d => d.errorE));
        system.structure.drawboxplot(d3_radviz.data().entries.map(d => d.errorE));
    }

    //* FINO A QUI */
    /*
     */
    return this;
}).call({})