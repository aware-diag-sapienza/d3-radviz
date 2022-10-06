if (window.system == undefined) window.system = {}
system.structure = (() => {
    const that = this;
    /*
     */
    //letiabili this.nome letiabile.
    this.paragraph_classification = null;
    this.svg = null;
    this.svgforce = null;
    this.svgradar = null;


    /*
     */

    // metodi this.nome_parametri = (letiabili di input) => {}

    this.gradientLegend = function() {
        
        let ele = document.getElementById("legend-value"),
            eleStyle = window.getComputedStyle(ele);
        let posizione_height = ele.getBoundingClientRect().height;
        let posizione_width = ele.getBoundingClientRect().width;
        let margin = {
            top: (posizione_height / 100) * 12,
            right: (posizione_width / 100) * 10,
            bottom: (posizione_height / 100) * 10,
            left: (posizione_width / 100) * 10
        };
        var padding = 9;

        var barHeight = 8;

        let height = parseFloat((eleStyle.height).split('px')[0]) - margin.top - margin.bottom;
        let width = parseFloat((eleStyle.width).split('px')[0]) - margin.left - margin.right;
        var colorRange = ['#C0D9CC', '#F6F6F4', '#925D60', '#B74F55', '#969943']

        
        $("#legend-value").html('<p id="name-dataset-prototype"></p><hr><h6>Effectiveness Error</h6>')

        let svg = d3.select("#legend-value")
            .append("svg")
                .attr("id", "legend-value-svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                //.attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");
        

        let g = svg.append("g")
                .attr("transform", "translate(" + (margin.left) + "," + (margin.top / 2) + ")");
        
        var linearGradient = g.append("defs")
                .append("linearGradient")
                .attr("id", "linear-gradient")
                .attr("gradientTransform", "rotate(90)");
        
                g.append("rect")
                .attr("id","rect-gradient")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", barHeight * 2)
                .attr("height", (height - margin.top))

        this.createGradient();
    }

    this.createGradient = () => {
        let ele = document.getElementById("legend-value"),
            eleStyle = window.getComputedStyle(ele);
        let posizione_height = ele.getBoundingClientRect().height;
        let posizione_width = ele.getBoundingClientRect().width;
        let margin = {
            top: (posizione_height / 100) * 12,
            right: (posizione_width / 100) * 10,
            bottom: (posizione_height / 100) * 10,
            left: (posizione_width / 100) * 10
        };
        var padding = 9;

        var barHeight = 8;

        let height = parseFloat((eleStyle.height).split('px')[0]) - margin.top - margin.bottom;
        let width = parseFloat((eleStyle.width).split('px')[0]) - margin.left - margin.right;

        d3.select("#linear-gradient").selectAll("*").remove();
        let color = function(x) { return d3.interpolateWarm(d3.scaleLinear().domain([0, 1]).range([1, 0])(x)) };
        let colorblind = function(x) { return d3.interpolatePiYG(d3.scaleLinear().domain([0, 1]).range([1,0])(x))};

        var linearGradient = d3.select('#linear-gradient')


        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", ()=>{ if (d3_radviz.getColorblindSafe()) return colorblind(0); else return color(0)});

        linearGradient.append("stop")
            .attr("offset", "25%")
            .attr("stop-color", ()=>{ if (d3_radviz.getColorblindSafe()) return colorblind(0.25); else return color(0.25)});

        linearGradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", ()=>{ if (d3_radviz.getColorblindSafe()) return colorblind(0.50); else return color(0.50)});

        linearGradient.append("stop")
            .attr("offset", "75%")
            .attr("stop-color", ()=>{ if (d3_radviz.getColorblindSafe()) return colorblind(0.75); else return color(0.75)});

        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", ()=>{ if (d3_radviz.getColorblindSafe()) return colorblind(1); else return color(1)});

        
            //.style("stroke", "black")
            //.style("stroke-width", 1)
            d3.select("#rect-gradient").style("fill", "url(#linear-gradient)");

        
    }


    this.drawboxplot = (data) => {
        // set the dimensions and margins of the graph
        $("#name-dataset-prototype").html("<h5>" + system.data.nameDataset + "</h5>")
        d3.select("#g-boxplot").remove('*');

        let ele = document.getElementById("legend-value"),
            eleStyle = window.getComputedStyle(ele);
        let posizione_height = ele.getBoundingClientRect().height;
        let posizione_width = ele.getBoundingClientRect().width;
        let margin = {
            top: (posizione_height / 100) * 12,
            right: (posizione_width / 100) * 10,
            bottom: (posizione_height / 100) * 10,
            left: (posizione_width / 100) * 10
        };

        let height = parseFloat((eleStyle.height).split('px')[0]) - margin.top - margin.bottom;
        let width = parseFloat((eleStyle.width).split('px')[0]) - margin.left - margin.right;

        // append the svg object to the body of the page
        let svg = d3.select("#legend-value-svg")
            .append("g")
            .attr("id", "g-boxplot")
            //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            .attr("transform", "translate(" + (margin.left) + "," + (margin.top / 2) + ")");

        let data_sorted = data.sort(d3.ascending)
        let q1 = d3.quantile(data_sorted, .25)
        let median = d3.quantile(data_sorted, .5)
        let q3 = d3.quantile(data_sorted, .75)
        let interQuantileRange = q3 - q1
        let min = d3.min(data_sorted)
        let max = d3.max(data_sorted)
        let barHeight = 8;

        // Show the Y scale
        let y = d3.scaleLinear()
            .range([0, height - margin.top])
            .domain([0, 1]);

        // Poi rimettere la label ruotata bene

        svg.call(d3.axisLeft(y))
            //.selectAll("text")
            //.attr("y", 10)
            //.attr("dy", ".35em")
            //.attr("transform", "rotate(90)")
            //.style("text-anchor", "start");

        // a few features for the box
        let center = width / 3
        let width_boxplot = (width / 10) * 2

        // Show the main vertical line
        svg
            .append("line")
            .attr("x1", center)
            .attr("x2", center)
            .attr("y1", y(min))
            .attr("y2", y(max))
            .attr("stroke", "black")

        // Show the box
        svg
            .append("rect")
            .attr("x", center - width_boxplot / 2)
            .attr("y", y(q1))
            .attr("height", (y(q3) - y(q1)))
            .attr("width", width_boxplot)
            .attr("stroke", "black")
            .style("fill", "#d4c9bf")

        // show median, min and max horizontal lines
        svg
            .selectAll("toto")
            .data([min, median, max])
            .enter()
            .append("line")
            .attr("x1", center - width_boxplot / 2)
            .attr("x2", center + width_boxplot / 2)
            .attr("y1", function(d) { return (y(d)) })
            .attr("y2", function(d) { return (y(d)) })
            .attr("stroke", function(d, i) {
                if (i == 1) return "#9a1219";
                else return "black";
            })
    }

    this.uploadProgressBar = () => {
        let number_selected = d3.selectAll('.data_point-'+ d3_radviz.getIndex()).filter(function(d) { return d.selected === true; })["_groups"][0].length;
        $('#number-progress').html(number_selected + '/' + d3_radviz.data().entries.length)
        let progress_percentile = ((100 / d3_radviz.data().entries.length) * number_selected).toFixed(2)
        $('.progress-bar').attr('style', 'width: ' + progress_percentile + '%')

        if (number_selected ==0){
            d3.select('#deselectpoint').style('visibility','hidden')
            d3.select('#deselectpointlabel').style('visibility','hidden')
            d3.select('#deselectpoint').property('checked', false) 
        } else {
            d3.select('#deselectpoint').style('visibility','visible')
            d3.select('#deselectpointlabel').style('visibility','visible')
        }


    }


    


    this.removeElementsByClass = (className) => {
        let elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }


    this.loadMenuAttributes = (data, dime) => {

        document.getElementById("label-select-radviz-dim").style.display = "block";

        let dimensions_list = document.getElementById("dimensions-list");
        let para1 = document.createElement("P");
        para1.setAttribute("class", "label_attributes");
        para1.appendChild(document.createElement('br'));

        let lumenu = document.createElement("ul")
        dimensions_list.appendChild(lumenu)

        for (let i = 0; i < dime.length; i++) {
            if (!isNaN(data[0][dime[i]]) && dime[i] != system.data.cluster_label[system.data.nameDataset]) {
                let limenu = document.createElement('LI');
                limenu.setAttribute('class', 'liattributes');
                let chk = document.createElement('input'); // CREATE CHECK BOX.
                chk.setAttribute('type', 'checkbox'); // SPECIFY THE TYPE OF ELEMENT.
                chk.setAttribute('class', 'checkbox_attributes'); // SPECIFY THE TYPE OF ELEMENT.
                chk.setAttribute('id', 'check_attr' + i); // SET UNIQUE ID.
                chk.setAttribute('value', dime[i]);
                chk.setAttribute('onclick', 'system.settings.removeDimDataset(this,"check");');
                chk.setAttribute('name', 'attributes');
                chk.setAttribute('text', dime[i]);
                chk.setAttribute("checked", "checked");

                let lbl = document.createElement('label'); // CREATE LABEL.
                lbl.setAttribute('for', 'attribute' + i);
                lbl.setAttribute('class', 'label_attributes');

                // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
                lbl.appendChild(document.createTextNode(dime[i]));
                lbl.appendChild(document.createElement('br'));

                // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT.
                limenu.appendChild(chk);
                limenu.append(lbl);
                lumenu.appendChild(limenu)
            }


            if (dimensions_removed.indexOf(dime[i]) >= 0) {
                d3.select('#check_attr' + i).property('checked', false);
            }
            if (attr_removed.indexOf(dime[i]) >= 0) {
                d3.select('#check_attr' + i).property('checked', false);
            }
        }

    }

    this.loadMenuClassification = (data, dime) => {
        document.getElementById("label-select-radviz-classification").style.display = "block";
        d3.select("#lu-classification").remove('*');
        let dimensions_list = document.getElementById("classification-list");
        let para1 = document.createElement("P");
        para1.setAttribute("class", "label_classification");
        para1.appendChild(document.createElement('br'));

        let lumenu = document.createElement("ul")
        lumenu.id = 'lu-classification'
        dimensions_list.appendChild(lumenu)

        for (let i = 0; i < dime.length; i++) {

            let limenu = document.createElement('LI');
            limenu.setAttribute('class', 'liclassification');
            let chk = document.createElement('input'); // CREATE CHECK BOX.
            chk.setAttribute('type', 'radio'); // SPECIFY THE TYPE OF ELEMENT.
            chk.setAttribute('class', 'radio_classification'); // SPECIFY THE TYPE OF ELEMENT.
            chk.setAttribute('id', 'radio_attr' + i); // SET UNIQUE ID.
            chk.setAttribute('value', dime[i]);
            chk.setAttribute('onclick', 'system.settings.updateClassificationAttribute(this);');
            chk.setAttribute('name', 'classification');
            chk.setAttribute('text', dime[i]);

            if (d3_radviz.data().attributes.length > 0) {
                if (d3_radviz.data().attributes[0].id == dime[i]) {

                    chk.setAttribute("checked", "checked");
                    classification_selected = dime[i]
                }
            }

            let lbl = document.createElement('label'); // CREATE LABEL.
            lbl.setAttribute('for', 'attribute' + i);
            lbl.setAttribute('class', 'label_classification');

            // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
            lbl.appendChild(document.createTextNode(dime[i]));
            lbl.appendChild(document.createElement('br'));

            // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT.
            limenu.appendChild(chk);
            limenu.append(lbl);
            lumenu.appendChild(limenu)


            if (attr_removed.indexOf(dime[i]) >= 0) {
                d3.select('#check_attr' + i).property('checked', true);
            }

        }

    }


    this.loadMenuClassificationUpload = (data, dime) => {
        document.getElementById("label-upload-radviz-classification").style.display = "block";
        d3.select("#lu-classification-upload").remove('*');
        let dimensions_list = document.getElementById("classification-list-uploaded");
        let para1 = document.createElement("P");
        para1.setAttribute("class", "label_classification-upload");
        para1.appendChild(document.createElement('br'));

        let lumenu = document.createElement("ul")
        lumenu.id = 'lu-classification-upload'
        dimensions_list.appendChild(lumenu)

        for (let i = 0; i < dime.length; i++) {

            let limenu = document.createElement('LI');
            limenu.setAttribute('class', 'liclassification-upload');
            let chk = document.createElement('input'); // CREATE CHECK BOX.
            chk.setAttribute('type', 'radio'); // SPECIFY THE TYPE OF ELEMENT.
            chk.setAttribute('class', 'radio_classification'); // SPECIFY THE TYPE OF ELEMENT.
            chk.setAttribute('id', 'radio_attr' + i); // SET UNIQUE ID.
            chk.setAttribute('value', dime[i]);
            chk.setAttribute('onclick', 'system.settings.updateClassificationAttributeUpload(this);');
            chk.setAttribute('name', 'classification-upload');
            chk.setAttribute('text', dime[i]);

            if (d3_radviz.data().attributes.length > 0) {
                if (d3_radviz.data().attributes[0].id == dime[i]) {

                    chk.setAttribute("checked", "checked");
                    classification_selected = dime[i]
                }
            }

            let lbl = document.createElement('label'); // CREATE LABEL.
            lbl.setAttribute('for', 'attribute' + i);
            lbl.setAttribute('class', 'label_classification-upload');

            // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
            lbl.appendChild(document.createTextNode(dime[i]));
            lbl.appendChild(document.createElement('br'));

            // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT.
            limenu.appendChild(chk);
            limenu.append(lbl);
            lumenu.appendChild(limenu)


            if (attr_removed.indexOf(dime[i]) >= 0) {
                d3.select('#check_attr' + i).property('checked', true);
            }

        }

    }

    this.loadMenuAttributesUploaded = (data, dime) => {
        let dimensions_list = document.getElementById("dimensions-list-uploaded");
        let para1 = document.createElement("P");
        para1.setAttribute("class", "label_attributes");
        para1.appendChild(document.createElement('br'));

        let lumenu = document.createElement("ul")
        loadMenuAttributes.id = "ul-upload-menu"
        dimensions_list.appendChild(lumenu)
        for (let i = 0; i < dime.length; i++) {
            if (!isNaN(data[0][dime[i]]) && dime[i] != system.data.cluster_label[system.data.nameDataset]) {
                let limenu = document.createElement('LI');
                limenu.setAttribute('class', 'liattributes');
                let chk = document.createElement('input'); // CREATE CHECK BOX.
                chk.setAttribute('type', 'checkbox'); // SPECIFY THE TYPE OF ELEMENT.
                chk.setAttribute('class', 'checkbox_attributes'); // SPECIFY THE TYPE OF ELEMENT.
                chk.setAttribute('id', 'check_attr' + i); // SET UNIQUE ID.
                chk.setAttribute('value', dime[i]);
                chk.setAttribute('onclick', 'system.settings.removeDimDatasetUploaded(this,"check");');
                chk.setAttribute('name', 'attributes-uploaded');
                chk.setAttribute('text', dime[i]);
                chk.setAttribute("checked", "checked");

                let lbl = document.createElement('label'); // CREATE LABEL.
                lbl.setAttribute('for', 'attribute' + i);
                lbl.setAttribute('class', 'label_attributes');

                // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
                lbl.appendChild(document.createTextNode(dime[i]));
                lbl.appendChild(document.createElement('br'));

                // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT.
                limenu.appendChild(chk);
                limenu.append(lbl);
                lumenu.appendChild(limenu)
            }
            if (dimensions_removed.indexOf(dime[i]) >= 0) {
                d3.select('#check_attr' + i).property('checked', false);
            }
            if (attr_removed.indexOf(dime[i]) >= 0) {
                d3.select('#check_attr' + i).property('checked', false);
            }
        }

        for (let ind = 0; ind < dime.length; ind++) {
            if (isNaN(data[0][dime[ind]]) || dime[ind] == system.data.cluster_label[system.data.nameDataset]) {
                dime.splice(ind, 1);
            }
        }
    }


    this.initializeSVG = () => {

        let ele = document.getElementById("rviz"),
            eleStyle = window.getComputedStyle(ele);
        system.radviz.w = Math.min(parseFloat((eleStyle.width).split('px')[0]), parseFloat((eleStyle.height).split('px')[0]));
        system.radviz.h = Math.min(parseFloat((eleStyle.width).split('px')[0]), parseFloat((eleStyle.height).split('px')[0]));
        system.radviz.center = { x: (system.radviz.w / 2), y: (system.radviz.h / 2) }
        system.radviz.radius = Math.min(system.radviz.w, system.radviz.h) / 2 - (system.radviz.m.top * 2);

        // initialize the svg
        d3.select("#rviz").selectAll("*").remove();
        this.svg = d3.select('#rviz')
            .append('svg')
            .attr('width', system.radviz.w + system.radviz.m.top + system.radviz.m.bottom)
            .attr('height', system.radviz.h + system.radviz.m.top + system.radviz.m.bottom)

        //primary g with circumference
        let g = this.svg.append('g')
            .attr('id', 'principal-circumference')
            .attr('height', system.radviz.h - system.radviz.m.top - system.radviz.m.bottom)
            .attr('width', system.radviz.w - system.radviz.m.left - system.radviz.m.rigth)
            .attr("transform", "translate(" + system.radviz.center.x + "," + system.radviz.center.y + ")");


        g.append('circle')
            .attr('id', 'circumference')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', system.radviz.radius)
            .style('stroke', "black")
            .style('stroke-width', '2')
            .style('fill', "white")

    }

    //* FORCE INITIALIZATION */
    this.initializeForce = () => {

        let ele = document.getElementById("pointforce"),
            eleStyle = window.getComputedStyle(ele);

        system.spring.wforce = Math.min(parseFloat((eleStyle.width).split('px')[0]), parseFloat((eleStyle.height).split('px')[0]));
        system.spring.hforce = Math.min(parseFloat((eleStyle.width).split('px')[0]), parseFloat((eleStyle.height).split('px')[0]));
        system.spring.centerforce = { x: ((system.spring.wforce) / 2), y: ((system.spring.hforce) / 2) }
        system.spring.radiusforce = ((system.spring.wforce - (system.spring.mforce.top * 2)) / 2) - (system.spring.mforce.top * 2);

        system.spring.scaleradiusforce = d3.scaleLinear().domain([0, 1]).range([0, system.spring.radiusforce])


        d3.select("#pointforce").selectAll("*").remove();
        this.svgforce = d3.select('#pointforce')
            .append('svg')
            .attr('width', system.spring.wforce)
            .attr('height', system.spring.hforce);

        let gforce = this.svgforce.append('g')
            .attr('height', system.spring.hforce - system.spring.mforce.top - system.spring.mforce.bottom)
            .attr('width', system.spring.wforce - system.spring.mforce.left - system.spring.mforce.rigth)
            .attr("transform", "translate(" + system.spring.centerforce.x + "," + system.spring.centerforce.y + ")");

        gforce.append('circle')
            .attr('id', 'circforce')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', system.spring.radiusforce)
            .style('fill', '#f2f2f2')
    }

    this.initializeForceAxes = (DIMENSIONS) => {

        system.structure.removeElementsByClass("axisforce");

        let axissvg = this.svgforce.selectAll(".axisforce")
            .data(DIMENSIONS)
            .enter()
            .append("g")
            .attr("class", "axisforce")
            .attr("id", "g_axisforce")
            .attr('height', system.spring.hforce - system.spring.mforce.top - system.spring.mforce.bottom)
            .attr('width', system.spring.wforce - system.spring.mforce.left - system.spring.mforce.rigth)
            .attr("transform", "translate(" + system.spring.centerforce.x + "," + system.spring.centerforce.y + ")");

        axissvg.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => { return ((system.spring.radiusforce) * Math.cos(-Math.PI / 2 + (d.start))) })
            .attr("y2", (d, i) => { return ((system.spring.radiusforce) * Math.sin(-Math.PI / 2 + (d.start))) })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "0.5px");

        //Append the labels at each axis
        axissvg.append("text")
            .attr("class", "legend")
            .style("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", (d, i) => { return ((system.spring.radiusforce + 35) * Math.cos(-Math.PI / 2 + (d.start))) })
            .attr("y", (d, i) => { return ((system.spring.radiusforce + 35) * Math.sin(-Math.PI / 2 + (d.start))) })
            .text((d) => { return d.value.substring(0, 6) });

    }

    //* RADAR INITIALIZATION */
    this.initializeRadar = () => {

        let ele = document.getElementById("radar"),
            eleStyle = window.getComputedStyle(ele);
        system.radar.wradar = Math.min(parseFloat((eleStyle.width).split('px')[0]), parseFloat((eleStyle.height).split('px')[0]));
        system.radar.hradar = Math.min(parseFloat((eleStyle.width).split('px')[0]), parseFloat((eleStyle.height).split('px')[0]));
        system.radar.centerradar = { x: ((system.radar.wradar) / 2), y: ((system.radar.hradar) / 2) }
        system.radar.radiusradar = ((system.radar.wradar - (system.radar.mradar.top * 2)) / 2) - (system.radar.mradar.top * 2);
        system.radar.scaleradiusradar = d3.scaleLinear().domain([0, 1]).range([0, system.radar.radiusradar])

        d3.select("#radar").selectAll("*").remove();
        this.svgradar = d3.select('#radar')
            .append('svg')
            .attr('width', system.radar.wradar)
            .attr('height', system.radar.hradar)

        let gradar = this.svgradar.append('g')
            .attr('height', system.radar.hradar - system.radar.mradar.top - system.radar.mradar.bottom)
            .attr('width', system.radar.wradar - system.radar.mradar.left - system.radar.mradar.rigth)
            .attr("transform", "translate(" + system.radar.centerradar.x + "," + system.radar.centerradar.y + ")");

        gradar.append('circle')
            .attr('id', 'circradar')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', system.radar.radiusradar)
            .style('stroke', 'black')
            .style('stroke-width', '1')
            .style('fill', '#262626');
    }


    this.initializeRadarAxes = (DIMENSIONS) => {
        system.structure.removeElementsByClass("axisradar");
        let axisradar = this.svgradar.selectAll(".axisradar")
            .data(DIMENSIONS)
            .enter()
            .append("g")
            .attr("class", "axisradar")
            .attr("id", "g_axisradar")
            .attr('height', system.radar.hradar - system.radar.mradar.top - system.radar.mradar.bottom)
            .attr('width', system.radar.wradar - system.radar.mradar.left - system.radar.mradar.rigth)
            .attr("transform", "translate(" + system.radar.centerradar.x + "," + system.radar.centerradar.y + ")");

        axisradar.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => { return ((system.radar.radiusradar) * Math.cos(-Math.PI / 2 + (d.start))) })
            .attr("y2", (d, i) => { return ((system.radar.radiusradar) * Math.sin(-Math.PI / 2 + (d.start))) })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "0.5px");

        //Append the labels at each axis
        axisradar.append("text")
            .attr("class", "legend")
            .style("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", (d, i) => { return ((system.radar.radiusradar + 30) * Math.cos(-Math.PI / 2 + (d.start))) })
            .attr("y", (d, i) => { return ((system.radar.radiusradar + 30) * Math.sin(-Math.PI / 2 + (d.start))) })
            .text((d) => { return d.value.substring(0, 6) });
    }

    this.updateSVGDimensions = () => {
        let indice_primo;
        let lista_dimensione_attuale = system.data.dimensions_current.map((d) => { return d.value; });
        if (system.data.dimensions_original.length == 0)
            indice_primo = 0;
        else {
            indice_primo = lista_dimensione_attuale.indexOf(system.data.dimensions_original[0]);

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

    this.legenda_metrica = (ARRAY_VALORI) => {


        let ele = document.getElementById("legend-value"),
            eleStyle = window.getComputedStyle(ele);
        let posizione_height = ele.getBoundingClientRect().height;
        let posizione_width = ele.getBoundingClientRect().width;
        let margin = {
            top: (posizione_height / 100) * 3,
            right: (posizione_width / 100) * 10,
            bottom: (posizione_height / 100) * 3,
            left: (posizione_width / 100) * 40
        };

        d3.select("#legend-value").selectAll("*").remove();
        let height = parseFloat((eleStyle.height).split('px')[0]) - margin.top - margin.bottom;
        let width = parseFloat((eleStyle.width).split('px')[0]) - margin.left - margin.right;
        let array_value = [{ 'name': '[0,0.59]', 'value': 0 }, { 'name': '[0.60,0.74]', 'value': 0 }, { 'name': '[0.75,1.00]', 'value': 0 }]



        ARRAY_VALORI.forEach((da) => {
            switch (da) {
                case 0:
                    array_value[da].value++;
                    break;
                case 1:
                    array_value[da].value++;
                    break;
                case 2:
                    array_value[da].value++;
                    break;

            }
        })

        let svg = d3.select("#legend-value").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

        let x = d3.scaleLinear()
            .range([0, width])
            .domain([0, system.data.points.length]);

        let y = d3.scaleBand()
            .rangeRound([height / 3, 0], .5)
            .domain(array_value.map(function(d) {
                return d.name;
            }));
        let yAxis = d3.axisLeft()
            .scale(y)
            .tickSize(0)

        let gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)


        let bars = svg.selectAll(".bar")
            .data(array_value)
            .enter()
            .append("g")
            .attr("id", "quiBAR")

        //append rects
        bars.append("rect")
            .attr("class", "bar")
            .attr("y", (d) => {
                return y(d.name);
            })
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", (d) => {
                return x(d.value);
            })
            .style('fill', (d, i) => {
                return system.data.colorQuality(i);
            })

        bars.append("rect")
            .attr("class", "leg")
            .attr("y", (d) => {
                return y(d.name);
            })
            .attr("height", 20)
            .attr("x", -80)
            .attr("width", 20)
            .style("stroke", "black")
            .style('fill', (d, i) => {
                return system.data.colorQuality(i);
            })

        //add a value label to the right of each bar
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", (d) => {
                return y(d.name) + y.bandwidth() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", (d) => {
                return x(d.value) + 3;
            })
            .text((d) => {
                return d.value;
            });

        system.radviz.calculateDBI();




        let globalquality = (array_value[1].value + array_value[2].value) / system.data.points.length
        if (system.settings.quantile_selected) {
            //'<i class="fas fa-cog dropbtn"></i> 
            document.getElementById('menu1').innerHTML = '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong"><i class="fas fa-cog"></i></button> <b>Global Quality</b>: ' + globalquality.toFixed(4);
            system.settings.quantile_global_quality = globalquality;
        } else if (system.settings.cluster_selected) {
            //'<i class="fas fa-cog dropbtn"></i> 
            document.getElementById('menu1').innerHTML = '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong"><i class="fas fa-cog"></i></button> <b>Global Quality</b>: ' + globalquality.toFixed(4);
        } else if (system.settings.indipendent_selected) {
            //'<i class="fas fa-cog dropbtn"></i> 
            document.getElementById('menu1').innerHTML = '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong"><i class="fas fa-cog"></i></button> <b>Global Quality</b>: ' + globalquality.toFixed(4);
            system.settings.indipendent_global_quality = globalquality;
        } else if (system.settings.radvizplusplus_selected) {
            //'<i class="fas fa-cog dropbtn"></i> 
            document.getElementById('menu1').innerHTML = '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong"><i class="fas fa-cog"></i></button> <b>Global Quality</b>: ' + globalquality.toFixed(4);
            system.settings.radviz_plus_plus_global_quality = globalquality;
        } else if (system.settings.perfect_selected) {
            //'<i class="fas fa-cog dropbtn"></i> 
            document.getElementById('menu1').innerHTML = '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong"><i class="fas fa-cog"></i></button> <b>Global Quality</b>: ' + globalquality.toFixed(4);
        } else {
            //'<i class="fas fa-cog dropbtn"></i> 
            document.getElementById('menu1').innerHTML = '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong"><i class="fas fa-cog"></i></button> <b>Global Quality</b>: ' + globalquality.toFixed(4);
            system.settings.value_global_quality = globalquality;
        }
    }

    this.legenda_cluster = (clusters) => {
        d3.select("#legend-cluster").selectAll("*").remove();

        if (clusters.length != 0) {
            //$('#lctitle').css('visibility', 'visible');

            let ele = document.getElementById("legend-cluster"),
                eleStyle = window.getComputedStyle(ele);
            let scale_classification = d3.scaleOrdinal(d3.schemeCategory10).domain(new Set(d3_radviz.data().attributes.filter(function(pilot) { return pilot.id === name_attr }).map(d => d.values)[0])); //['a','b','c'])

            let posizione_height = ele.getBoundingClientRect().height;
            let posizione_width = ele.getBoundingClientRect().width;
            let margin = {
                top: (posizione_height / 100) * 10,
                right: (posizione_width / 100) * 1,
                bottom: (posizione_height / 100) * 1,
                left: (posizione_width / 100) * 40
            };

            let height = parseFloat((eleStyle.height).split('px')[0]) - margin.top - margin.bottom;
            let width = parseFloat((eleStyle.width).split('px')[0]) - margin.left - margin.right;
            let singlerow = posizione_height / 10;




            d3.select("#legend-cluster").selectAll("*").remove();
            $("#legend-cluster").html('<h6>Clusters</h6>')
                //height = parseFloat((eleStyle.height).split('px')[0]) - margin.top - margin.bottom;
                //width = parseFloat((eleStyle.width).split('px')[0]) - margin.left - margin.right;

            let svg = d3.select("#legend-cluster").append("svg")
                .attr("width", posizione_width)
                .attr("height", singlerow * (clusters.length + 2))
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + (singlerow) + ")");

            let bars = svg.selectAll(".clu")
                .data(clusters)
                .enter()
                .append("g")

            //let point_cluster = [];
            bars.append("circle")
                .attr("class", "clu")
                .attr("id", (d) => { return "cluster-" + d; })
                .attr("cx", (d, i) => { return -72; })
                .attr("cy", (d, i) => { return 30 * i; })
                .attr("r", '8')
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .style('fill', (d) => { return scale_classification(d); })


            bars.append("circle")
                .attr("class", "sel_cluster")
                .attr("id", (d) => { return "sel_cluster-" + d; })
                .attr("cx", (d, i) => { return 20; })
                .attr("cy", (d, i) => { return 30 * i; })
                .attr("r", '8')
                .style("stroke", "grey")
                .style("stroke-width", "2px")
                .style('fill', 'white')
                .on("click", function(d) {

                    if (d3.select("#sel_cluster-" + d).style('fill') == 'white') {
                        d3.select("#sel_cluster-" + d).style('fill', 'black');
                        d3_radviz.data().entries.forEach(
                            function(p, i) {

                                if (p.attributes[d3_radviz.getAttrColor(1)] == d) {
                                    system.radar.drawRadar(d3_radviz.data().angles, p, d3.select('#p_' + p.index))

                                }

                            })

                    } else {
                        d3.select("#sel_cluster-" + d).style('fill', 'white');
                        d3_radviz.data().entries.forEach(
                            function(p, i) {
                                if (p.attributes[d3_radviz.getAttrColor(1)] == d) {
                                    d3_radviz.data().entries[i].selected = false
                                    d3.select("#radar_" + p.index).remove()


                                }
                            })
                    }
                    d3.selectAll('.data_point')
                        .style("stroke-width", (d) => {
                            if (d.selected) {
                                return 0.5;
                            } else {
                                return 0.2;
                            }
                        })
                    system.structure.uploadProgressBar();
                })


            bars.append("text")
                .attr("class", "label")
                .attr("y", function(d, i) {
                    return 5 + (30 * i);
                })
                .attr("x", function(d, i) {
                    return -55;
                })
                .text(function(d, i) {
                    return d;
                });

            bars.append("text")
                .attr("class", "label_selected")
                .attr("y", function(d, i) {
                    return 5 + (30 * i);
                })
                .attr("x", function(d, i) {
                    return 30;
                })
                .text("");


            document.getElementById("btn_vizrank_disposition").style.display = "";
            document.getElementById("btn_t_statistic_disposition").style.display = "";


        }
    }


    function optimizeCluster() {

        var cluster_selected_labels = [];
        d3.selectAll('.sel_cluster')
            .each(function(l) {


                if (d3.select(this).style('fill') == 'black') { // quindi devo essere preso

                    cluster_selected_labels.push(l);
                }
            })





        if (cluster_selected_labels.length != 0) {


            if (QUANTILE_SELECTED) {
                QUANTILE_SELECTED = false;
                d3.select("#btn_quantile").attr("class", "btn_style")
            }

            var q;
            for (q = 1; q <= 100; q++) {
                calculatePerfectPositionBoxPlot(points, current_configuration.order_dimension, "cluster", q / 100);

                perfectPosition(points, "cluster order " + q / 100, "cq" + q + "x1", "cq" + q + "x2");

                calculateDistancefromCenter(points, "cq" + q + "x1", "cq" + q + "x2", "CQ " + q / 100 + " MEAN", "CLUSTER", "cluster order " + q / 100);
            }
            updateCluster(cluster_selected_labels);

        } else {
            alert("You must choose clusters");
            d3.select("#btn_cluster").attr("class", "btn_style")
            CLUSTER_SELECTED = false;

        }

    }
    /*
     */
    return this;
}).call({})