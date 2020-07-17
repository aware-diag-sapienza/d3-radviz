if (window.system == undefined) window.system = {}
system.data = (function() {
    const that = this;
    /*
     */

    this.LINK_SERVER = './' // se OFFLINE . cosi si prende i dati in locale 
    //this.LINK_SERVER = 'https://aware-diag-sapienza.github.io/d3-radviz/prototype/' // se ONLINE inserire https://aware-diag-sapienza.github.io/d3-radviz/prototype/ 
    this.plainDataset = null
    this.dataset = null
    this.nameDataset = null

    this.dimensions_original = null
    this.dimensions_current = null
    this.dime = null
        //this.dimensions_color = null
    this.perfect_dimensions = null
    this.dimensions_indipendentDA = null
    this.dimensions_radvizPlusPlus = null

    this.classification_attr = []
    this.index_classification = []
    this.points = null;

    this.scale_x1 = null;
    this.scale_x2 = null;
    this.colorQuality = null;
    this.color = null;
    this.color2 = d3.scaleOrdinal(d3.schemeCategory10)

    this.cluster_label = { oils: 'AreaName', wine: 'Wine', arancioni: 'Wine', blu: 'Wine', diabetes: 'Diabetes', iris: 'species', letterale: 'species', prova: 'Prova', provaminimo: 'Prova', verde: 'Wine', wdbc: 'b', winemarco: 'Wine', winesorted: 'Wine' };


    this.scale_set = function(da) {
        if (da >= 0 && da < 0.60)
            return 0;
        else if (da >= 0.60 && da < 0.75) {
            return 1;
        } else if (da >= 0.75) {
            return 2;
        }
    };

    /*
     */

    this.load = (loadfiledataset, name) => {

        this.nameDataset = name;
        d3.csv(loadfiledataset).then(data => {
            that.dime = data.columns;
            if (!ORIGINAL_CLASSIFIED) {
                system.structure.loadMenuClassification(data, that.dime);
                system.structure.loadMenuAttributes(data, that.dime);
            } else {
                const index = that.dime.indexOf(name_attr);
                if (index > -1) {
                    delete that.dime[index];
                }
                system.structure.loadMenuAttributes(data, that.dime);
                system.structure.loadMenuClassification(data, [name_attr]);

            }



            this.dimensions_original = that.dime.slice();
            data.forEach(function(d, i) {
                data.columns.forEach(function(col) {
                    d[col] = +d[col]
                    d["N__" + col] = +d[col]
                })
                d["index"] = i;
                d["relx1"] = 0;
                d["relx2"] = 0;
                d["selected"] = false;
                d["dimensions_labels"] = that.dime;
                d["active"] = false;
                d["color_radar"] = '';
                d["difference"] = 0;
            });

            this.color = d3.scaleOrdinal(d3.schemeCategory10);
            this.color.domain(data.map(function(d) { return d[this.dimensions_color]; }));
            this.dataset = Object.assign([], data);
            that.dimensions_current = system.radviz.assignAnglesToDimensions(that.dime);
        });
    }

    this.load_upload = (loadfiledataset, name) => {
        this.nameDataset = name;

        data = (d3.csvParse(system.uploadedfile.readDataUploaded(name)))
        that.dime = data.columns;

        if (!ORIGINAL_CLASSIFIED) {
            system.structure.loadMenuClassificationUpload(data, that.dime);
            system.structure.loadMenuAttributesUploaded(data, that.dime);
        } else {
            const index = that.dime.indexOf(name_attr);
            if (index > -1) {
                delete that.dime[index];
            }
            system.structure.loadMenuAttributesUploaded(data, that.dime);
            system.structure.loadMenuClassificationUpload(data, [name_attr]);
        }

        this.dimensions_original = that.dime.slice();
        data.forEach(function(d, i) {
            data.columns.forEach(function(col) {
                d[col] = +d[col]
                d["N__" + col] = +d[col]
            })
            d["index"] = i;
            d["relx1"] = 0;
            d["relx2"] = 0;
            d["selected"] = false;
            d["dimensions_labels"] = that.dime;
            d["active"] = false;
            d["color_radar"] = '';
            d["difference"] = 0;
        });

        this.color = d3.scaleOrdinal(d3.schemeCategory10);
        this.color.domain(data.map(function(d) { return d[this.dimensions_color]; }));
        this.dataset = Object.assign([], data);

        that.dimensions_current = system.radviz.assignAnglesToDimensions(that.dime);
        //system.settings.start(); // qui faccio iniziare tutte le funzioni, dopo aver caricato il DB

    }

    this.continueLoading = (data, dime) => {
        this.dimensions_original = dime.slice();

        data.forEach(function(d, i) {
            data.columns.forEach(function(col) {
                d[col] = +d[col]
                d["N__" + col] = +d[col]
            })
            d["index"] = i;
            d["relx1"] = 0;
            d["relx2"] = 0;
            d["selected"] = false;
            d["dimensions_labels"] = dime;
            d["active"] = false;
            d["color_radar"] = '';
            d["difference"] = 0;
        });
        this.color = d3.scaleOrdinal(d3.schemeCategory10);


        this.color.domain(data.map(function(d) { return d[this.dimensions_color]; }));
        this.dataset = Object.assign([], data);
        that.dimensions_current = system.radviz.assignAnglesToDimensions(dime);

        system.settings.start(); // qui faccio iniziare tutte le funzioni, dopo aver caricato il DB
    }

    this.initializeScale = () => {

        this.scale_x1 = d3.scaleLinear()
            .domain([-1, 1])
            .range([-system.radviz.radius, system.radviz.radius]);

        this.scale_x2 = d3.scaleLinear()
            .domain([-1, 1])
            .range([system.radviz.radius, -system.radviz.radius]);
        if (this.colorQuality == null) {
            this.colorQuality = d3.scaleOrdinal(d3.schemeYlOrRd[3].reverse());
        }

        this.color2 = d3.scaleOrdinal(d3.schemeCategory10)
    }


    this.normalizeDataset = (D, angle) => {

            let dimensioniangolinormalizzate = [];
            let punti = D
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
                        // normalizzo
                        if (dim.slice(0, 3) != "N__" && dim != "index" && dim != "selected") {
                            if ((max_values[i] - min_values[i]) == 0) {
                                d[dim] = 0;
                            } else {
                                d[dim] = (d[dim] - min_values[i]) / (max_values[i] - min_values[i]);
                            }

                            if (j == 0) dimensioniangolinormalizzate.push({ 'value': dim, 'min': min_values[i], 'max': max_values[i] });
                        }
                    })
                    // mi calcolo la posizione x e y
                let x_1_j = { 'denominator': 0, 'numerator': 0 };
                let x_2_j = { 'denominator': 0, 'numerator': 0 };
                angle.forEach((dim, i) => {
                    x_1_j.numerator = x_1_j.numerator + (d[dim.value] * Math.cos(dim.start));
                    x_1_j.denominator = x_1_j.denominator + d[dim.value];
                    x_2_j.numerator = x_2_j.numerator + (d[dim.value] * Math.sin(dim.start));
                    x_2_j.denominator = x_2_j.denominator + d[dim.value];
                    punti[j]["n" + dim.value] = d[dim.value];
                })


                if (x_1_j.denominator == 0) {
                    punti[j]["x1"] = 0;
                } else {
                    punti[j]["x1"] = x_1_j.numerator / x_1_j.denominator;
                }

                if (x_2_j.denominator == 0) {
                    punti[j]["x2"] = 0
                } else {
                    punti[j]["x2"] = x_2_j.numerator / x_2_j.denominator;
                }
            })

            return punti;
        }
        /*
         */
    return this;
}).call({})