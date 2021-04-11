if (window.system == undefined) window.system = {}
system.radar = (function() {
    const that = this;
    /*
     */
    // variabili this.nome variabile.
    this.wradar = null;
    this.hradar = null;
    this.mradar = { top: 20, bottom: 20, left: 5, rigth: 5 };
    this.centerradar = null;
    this.scaleradiusradar = null;

    this.numero_di_radarchart = 0;
    /*
     */

    // metodi this.nome_parametri = (variabili di input) => {}

    this.drawRadar = (DIMENSIONS, d, element) => {


        if (d.selected) {
            d.selected = false;
            this.numero_di_radarchart--;

            d3.selectAll(".lineradar_" + d.index).remove();
            d3.selectAll(".pointradar_" + d.index).remove();
            element.style("stroke-width", 0.2);
        } else {

            d.selected = true;
            this.numero_di_radarchart++;

            d.color_radar = system.data.color2(d.index);
            element.style("stroke-width", 0.5)

            let gradar = system.structure.svgradar
                .append("g")
                .attr("class", "radarlevel")
                .attr("id", "radar_" + d.index)
                .attr('height', this.hradar - this.mradar.top - this.mradar.bottom)
                .attr('width', this.wradar - this.mradar.left - this.mradar.rigth)
                .attr("transform", "translate(" + this.centerradar.x + "," + this.centerradar.y + ")");

            DIMENSIONS.forEach((dim, i) => {


                if (i > 0) {

                    gradar.append("line")
                        .attr("x1", () => { return ((that.scaleradiusradar(d.dimensions[DIMENSIONS[i - 1].value])) * Math.cos(-Math.PI / 2 + (DIMENSIONS[i - 1].start))) })
                        .attr("y1", () => { return ((that.scaleradiusradar(d.dimensions[DIMENSIONS[i - 1].value])) * Math.sin(-Math.PI / 2 + (DIMENSIONS[i - 1].start))) })
                        .attr("x2", () => { return ((that.scaleradiusradar(d.dimensions[dim.value])) * Math.cos(-Math.PI / 2 + (dim.start))) })
                        .attr("y2", () => { return ((that.scaleradiusradar(d.dimensions[dim.value])) * Math.sin(-Math.PI / 2 + (dim.start))) })
                        .attr("class", () => { return "lineradar_" + d.index; })
                        .style("fill", () => { return system.data.color2(d.color_radar); })
                        //.style("opacity",'0.5')
                        .style("stroke", () => { return system.data.color2(d.color_radar); })
                        .style("stroke-width", "2px");
                } else {

                    gradar.append("line")
                        .attr("x1", () => { return ((that.scaleradiusradar(d.dimensions[DIMENSIONS[DIMENSIONS.length - 1].value])) * Math.cos(-Math.PI / 2 + (DIMENSIONS[DIMENSIONS.length - 1].start))) })
                        .attr("y1", () => { return ((that.scaleradiusradar(d.dimensions[DIMENSIONS[DIMENSIONS.length - 1].value])) * Math.sin(-Math.PI / 2 + (DIMENSIONS[DIMENSIONS.length - 1].start))) })
                        .attr("x2", () => { return ((that.scaleradiusradar(d.dimensions[dim.value])) * Math.cos(-Math.PI / 2 + (dim.start))) })
                        .attr("y2", () => { return ((that.scaleradiusradar(d.dimensions[dim.value])) * Math.sin(-Math.PI / 2 + (dim.start))) })
                        .attr("class", () => { return "lineradar_" + d.index; })
                        .style("fill", () => { return system.data.color2(d.color_radar); })
                        //.style("opacity",'0.5')
                        .style("stroke", () => { return system.data.color2(d.color_radar); })
                        .style("stroke-width", "2px");
                }

                gradar.append("circle")
                    .attr("cx", () => { return ((that.scaleradiusradar(d.dimensions[dim.value])) * Math.cos(-Math.PI / 2 + (dim.start))) })
                    .attr("cy", () => { return ((that.scaleradiusradar(d.dimensions[dim.value])) * Math.sin(-Math.PI / 2 + (dim.start))) })
                    .attr("r", '2')
                    .style("fill", () => { return system.data.color2(d.color_radar); })
                    .attr("id", () => { return "RD" + d["index"]; })
                    .attr("class", () => { return "pointradar_" + d.index; })
                    .on("mouseover", function() {
                        d3.select(this).attr('r', 4)
                        var div = d3.select(".tooltip")
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html(d['dimensions'][dim.value].toFixed(2))
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px")
                            .style("color", "black")
                            .style("background", system.data.color2(d.color_radar))

                    })
                    .on("mouseout", function() {
                        var div = d3.select(".tooltip")
                        d3.select("#label" + d["index"]).remove();
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                        d3.select(this).attr('r', 2)
                    })
            })
        }



    }

    this.changeRadar = (DIMENSIONS) => {
        d3.selectAll(".data_point").each(function(d, i) {
            d3.selectAll(".lineradar_" + d.index).remove();
            d3.selectAll(".pointradar_" + d.index).remove();
            if (d.selected) {
                d.selected = false;
                system.radar.drawRadar(DIMENSIONS, d, d3.select(this));
            }
        })
    }

    this.resetNumberChart = () => {
        this.numero_di_radarchart = 0
    }

    /*
     */
    return this;
}).call({})