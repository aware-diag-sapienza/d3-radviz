if (window.system == undefined) window.system = {}
system.spring = (function() {
    const that = this;

  /*
  */
  // variabili this.nome variabile.
  this.wforce = null;
  this.hforce = null;
  this.mforce = { top: 20, bottom: 20, left: 5, rigth: 5 };
  this.centerforce = null;
  this.scaleradiusforce = null;

  /*
  */

  // metodi this.nome_parametri = (variabili di input) => {}

  this.drawForce = (DIMENSIONS, d) => {
      
        let glineforce = svgforce
          .append("g")
          .attr("class", "lineforce")
          .attr("id", "glineforce")
          .attr('height', this.hforce - this.mforce.top - this.mforce.bottom)
          .attr('width', this.wforce - this.mforce.left - this.mforce.rigth)
          .attr("transform", "translate(" + this.centerforce.x + "," + this.centerforce.y + ")");
      
        DIMENSIONS.forEach(function (dim, i) {
      
          glineforce.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2",  () => { return ((that.scaleradiusforce(d.dimensions[dim.value])) * Math.cos(-Math.PI / 2 + (dim.start))) })
            .attr("y2",  () => { return ((that.scaleradiusforce(d.dimensions[dim.value])) * Math.sin(-Math.PI / 2 + (dim.start))) })
            .attr("class", "lineforce")
            .style("stroke", "orange")
            .style("stroke-width", "4px");
      
          glineforce.append("text")
            .attr("class", "lineforce")
            .style("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", () => { if (dim.start == 1.5707963267948966 || dim.start == 4.71238898038469 ) return (that.radiusforce + 10) * Math.cos(-Math.PI / 2 + (dim.start+0.15)); else return (that.radiusforce + 10) * Math.cos(-Math.PI / 2 + (dim.start)); })
            .attr("y", () => { if (dim.start == 1.5707963267948966 || dim.start == 4.71238898038469 ) return (that.radiusforce + 10) * Math.sin(-Math.PI / 2 + (dim.start+0.15)); else return (that.radiusforce + 10) * Math.sin(-Math.PI / 2 + (dim.start)); })
            .text( () => { return d.original[dim.value].toFixed(2) });
        })
      }

      //* FINO A QUI */
    
    

  /*
  */
  return this;
}).call({})