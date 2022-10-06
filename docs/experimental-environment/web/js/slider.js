if (window.system == undefined) window.system = {}
system.slider = (() =>{
    const that = this;
  /*
  */
  // variabili this.nome variabile.
  this.datasetcrosswidget = null;
  this.widgets_quality = null;
 
  this.aggiornaSlider = () => {
  
    this.datasetcrosswidget = crossfilter(system.data.points);
   
    d3.select('p#value-range').text(
        system.data.points.length + " of " + system.data.points.length
    );
  
  
    //console.log(points,"datasetcrosswidget",datasetcrosswidget);
    this.widgets_quality = d3.crosswidget(datasetcrosswidget,  (d)=> { return d.difference; })
      .paddingOuter(10)
      .addComponent(d3.crosswidgetComponent.frequencyPlot().bins(30))
      .addComponent(d3.crosswidgetComponent.sliderSelector());
    d3.select("#slider-range")
      .selectAll("*").remove();
    d3.select("#slider-range")
      .call(this.widgets_quality);
  
  
    let divided_group = this.datasetcrosswidget.allFiltered().map( (d)=> {
      if (d.difference >= 0 && d.difference < 0.60)
        return 0;
      else if (d.difference >= 0.60 && d.difference < 0.75) {
        return 1;
      }
      else if (d.difference >= 0.75 ) {
        return 2;
      }
      else return -1;
    });

    system.radviz.calculateDBI();
    console.log(system.settings.value_DBI);
  
    system.structure.legenda_metrica(divided_group)
  
    this.datasetcrosswidget.onChange( () =>{
      let filtrati = this.datasetcrosswidget.allFiltered().map( (d)=> { return d.index });
  
      d3.selectAll(".data_point")
        .each( (d)=> {
          d3.select("#p_" + d.index).style("display",  ()=> {
            if (filtrati.includes(d.index)) return null; else return 'none';
          })
  
          d3.select('p#value-range').text(
            filtrati.length + ' of ' + points.length
          );
        })
  
    })
    
  }

  return this;
}).call({})