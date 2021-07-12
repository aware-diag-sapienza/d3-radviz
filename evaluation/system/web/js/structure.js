if (window.system == undefined) window.system = {}
system.structure = (() => {
    const that = this;

    this.paragraph_classification = null;
    this.svg = null;
    this.svgforce = null;
    this.svgradar = null;

    this.removeElementsByClass = (className) => {
        let elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
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

    /*
     */
    return this;
}).call({})