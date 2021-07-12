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

    this.COLOR_POINT = '#67a9cf';

    this.initializeLasso = true;

    this.cleanVisualization = () => {
        system.structure.removeElementsByClass("checkbox_attributes");
        system.structure.removeElementsByClass("label_attributes");
        system.structure.removeElementsByClass("label_classification");
        system.structure.removeElementsByClass("checkbox_classification");
        system.structure.removeElementsByClass("axisforce");
        d3.select("#btn_quantile").attr("class", "btn_style");
        d3.select("#btn_cluster").attr("class", "btn_style");
        document.getElementById('dominance-check').checked = false
        document.getElementById('dominance-mean-check').checked = false

        system.settings.lazoSelection()
        system.settings.reprPoint()
        system.settings.updateDominanceMean()
        system.settings.updateDominance()


    };

    this.resetVariables = () => {
        this.perfect_selected = false;
        this.quantile_selected = false;
        this.cluster_selected = false;
        this.max_quantile_value = -1;
        this.max_cluster_quantile_value = -1;

        $('button').removeClass('active');
        
        document.getElementById('lazoselection').checked = false
        
    }



    this.addOtherMetrics = function(){
        let metrics = new RadVizMetrics(d3_radviz)
        if (d3.select("#oth-metrics").property('checked')){
            if (isNaN(metrics.dbindex())){
            document.getElementById('additional-metrics').innerHTML = "  <b>Projection Error COS</b>: " + metrics.projectionError("cosine").toFixed(4)+
            "<br>  <b>Clumping50</b>: " + metrics.clumping50().toFixed(4)
            } else {
                document.getElementById('additional-metrics').innerHTML = "  <b>Projection Error COS</b>: " + metrics.projectionError("cosine").toFixed(4)+
            "<br>  <b>Clumping50</b>: " + metrics.clumping50().toFixed(4)+
            "<br>  <b>DB index</b>: " + metrics.dbindex().toFixed(4)
            }
        } else {
            document.getElementById('additional-metrics').innerHTML = ""
        }
    }

    this.deselectPoints = function(){
        
        d3.selectAll('.data_point-'+ d3_radviz.getIndex())
        .each(function(d){
            d.selected = false;
        })
        .style("stroke-width", '0.2')

        status.selectedPoints = []
        d3.select('#deselectpoint').style('visibility','hidden')
            d3.select('#deselectpointlabel').style('visibility','hidden')
            d3.select('#deselectpoint').property('checked', false)
        
        onPointsSelectionChange(status.selectedPoints)
        
    }



    this.initializeDB = (name_dataset,technique,cluster,selectedpoint,interaction,dimensions, _callback) => {

        system.data.original_dimensions = '';
        //system.settings.cleanVisualization(); DA REINSERIRE
        //system.settings.resetVariables(); DA REINSERIRE
        if (d3.select('#container img').nodes().length != 0)
            d3.select('#container').selectAll("*").remove();
        
        d3_radviz.remove(true);
        system.data.nameDataset = name_dataset
     

        //system.settings.newDataset(system.data.LINK_SERVER +'data/' + name_dataset + '.csv', name_dataset);

        document.getElementById('lazoselection').checked = false
        d3_radviz = d3.radviz()

        d3.csv(system.data.LINK_SERVER +'data/' + name_dataset + '.csv').then(dataset => {

            DATASET_NAME = name_dataset
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

            //document.getElementById('avg-similarity').innerHTML = `<b>Avg ReprSimilarity: ${d3.mean(d3_radviz.data().entries, d => d.representativeSimilarity).toFixed(4)}</b>`
    
            system.data.load( system.data.LINK_SERVER + "data/" + name_dataset + ".csv", name_dataset);
       


            let f_context_menu = function(_) {

            }
            let f_click = function(a, b, c) {
                
                if (interaction != 'all'){
                
                    if (status.selectedPoints.length >= Number(interaction) && status.selectedPoints.indexOf(b.id) == -1){
                        alert('You have already selected ' + interaction + ' points. To change idea, you need to deselct almost one of them.')
                        return
                    }
                } 
                if (b.id != 'p'+selectedpoint){
                
                b.selected = !b.selected
                if (b.selected){
                    status.selectedPoints.push(b.id)
                    c.style('stroke-width','0.4')
                } else {
                    let index_point = status.selectedPoints.indexOf(b.id)
                    status.selectedPoints.splice(index_point,1)
                    c.style('stroke-width','0.2')
                }

                onPointsSelectionChange(status.selectedPoints)
                }
                
                //AP_points-1618406829643
                
                if (status.selectedPoints.length!= 0 ){
                    d3.select('#deselectpoint').style('visibility','visible')
                    d3.select('#deselectpointlabel').style('visibility','visible')
                } else {
                    d3.select('#deselectpoint').style('visibility','hidden')
                    d3.select('#deselectpointlabel').style('visibility','hidden')
                }
                return;

            }


            let f_mouse_over = function(a, b) {

                

                // #T_Budget-1618307108588
                that._sendTooltipEvent = true;
                setTimeout(() => {
                    if(that._sendTooltipEvent) onPointTooltip(b.id)
                }, 500)
                
                
                Object.keys(b.dimensions).forEach(dim => {

                    // aggiungo i valori normalizzati
                let current_label_text = d3.select('#T_' + dim.replace(/\s/g,'') + '-'+ d3_radviz.getIndex())
                current_label_text.append('tspan')
                    .attr('class', 'norm-value-anchor')
                    .attr('x', current_label_text.attr('x'))
                    .attr('y', Number(current_label_text.attr('y'))+3)
                    .attr('font-size','smaller')
                    .style('fill','white')
                    .html(
                        b.dimensions[dim].toFixed(4)
                    )
                })

                d3.selectAll('.norm-value-anchor').transition()
                    .duration(200)
                    .style('fill','black')
                    .delay(500);
                // cambio il colore delle labels
             d3.selectAll('.attr_label-' + d3_radviz.getIndex())
             .transition().duration(200)
                .style('fill','grey')
                .delay(500)


                // faccio vedere il tooltip
                var div = d3.select(".tooltip")
                div.transition()
                    .duration(200)
                    .style("opacity", .9)
                    .delay(500);
                
                let str = `Point #${b.id.replace('p', '')}`
                div.html(str)
                .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 20) + "px")
                    .style("color", "white")
                    .style("background", "black")
                //

            }

            let f_mouse_out = function() {
                that._sendTooltipEvent = false

                //d3.selectAll(".lineforce").remove();
                var div = d3.select(".tooltip")
                div.transition()
                    .duration(50)
                    .style("opacity", 0);
                
                    d3.selectAll('.attr_label-' + d3_radviz.getIndex()).transition()
                .duration(50)
                    .style('fill',(d) =>{ if (status.selectedDimensions.indexOf(d.value)!= -1) return 'green'; else return 'black'} )
                
                
                d3.selectAll('.norm-value-anchor').remove();

            }

            
            //d3_radviz.setFunctionUpdateResults(results1)
            if (interaction != 'none')
                d3_radviz.setFunctionClick(f_click)
            d3_radviz.setFunctionMouseOver(f_mouse_over)
            d3_radviz.setFunctionMouseOut(f_mouse_out)
            //d3_radviz.setFunctionDragEnd(f_drag_end)
            d3_radviz.setFunctionContextMenu(f_context_menu)
            
            if (cluster){
                d3_radviz.showDefaultColor(false)
                d3_radviz.showOutliers(false)
                d3_radviz.setQuality(false)
                
            } else {
                d3_radviz.setDefaultColorPoints(this.COLOR_POINT)
                d3_radviz.showDefaultColor(true)
                
            }
    
            //uci- effectiveness_error_heuristic - dependent_da - independent_da - radviz_pp - 
    
            
            if (technique === 'uci' )
                d3_radviz.updateRadviz();
            else if (technique === 'effectiveness_error_heuristic')
                d3_radviz.updateRadviz(d3.radvizDA.minEffectivenessErrorHeuristic(d3_radviz.data()));
            else if (technique === 'dependent_da')
                d3_radviz.updateRadviz(json_data[label_dataset][technique]);
            else if (technique === 'independent_da')
                d3_radviz.updateRadviz(json_data[label_dataset][technique]);
            else if (technique === 'radviz_pp')
                d3_radviz.updateRadviz(json_data[label_dataset][technique]);

            d3_radviz.setRadiusPoints(0.5)
            d3_radviz.setRightClick(false)
            d3_radviz.disableDraggableAnchors(true)
            d3.select('#container').call(d3_radviz);

            
          

            d3.selectAll('.attr_label-' +  d3_radviz.getIndex()).each((a)=>{a.selected = false;}) // inizializzo il fatto di essere selected

            if (dimensions!='none'){
                
                    d3.selectAll('.attr_label-' +  d3_radviz.getIndex()).on('click',function(a){
                        if (dimensions !== 'all'){
                            
                            if (status.selectedDimensions.length >= Number(dimensions) && status.selectedDimensions.indexOf(a.value) == -1){
                                alert('You have already selected ' + dimensions + ' dimensions. To change idea, you need to deselct almost one of them.')
                                return
                            }
                        }
                        if (!a.selected){
                            d3.select(this).style('fill','green')
                            a.selected = true;
                            status.selectedDimensions.push(a.value)
                        } else {
                            d3.select(this).style('fill','black')
                            a.selected = false;
                            let index_dim = status.selectedDimensions.indexOf(a.value)
                            status.selectedDimensions.splice(index_dim,1)
                        }
                        onAnchorsSelectionChange(status.selectedDimensions)
                    })
            }

            d3.selectAll('.AP_points-' +  d3_radviz.getIndex()).on('mouseover',()=>{})
            // centra radviz  
            let containerWidth= (document.getElementById("container").clientWidth)/2;//d3.select('#container').attr('width')
            let svgRadvizWidth = (Number(d3.select('.radviz-svg-' + d3_radviz.getIndex()).attr('width')))/2

            d3.select('.radviz-svg-' + d3_radviz.getIndex()).attr('transform','translate('+(containerWidth-svgRadvizWidth)+',0)')

            if (selectedpoint != ''){
                d3.select('#p_'+selectedpoint+'-'+d3_radviz.getIndex())
                    .raise()
                    .style('fill','#ef8a62')
            }
            
        
            if(_callback != undefined) _callback();
        })  
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

    this.start = () => {


        system.structure.initializeSVG();
        system.data.initializeScale();
        //system.structure.initializeForce();
        //system.structure.initializeRadar();


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

        
    }

    function setup_lasso(){

        // Lasso functions
        var lasso_start = function() {
            
            if(document.getElementById('lazoselection').checked){
                document.getElementById('lazoselection').checked
            }
            
        };

        var lasso_draw = function() {

            // Style the possible dots
            if(document.getElementById('lazoselection').checked){
            lasso.possibleItems()
                .style("stroke-width", "0.4")

            // Style the not possible dot
            lasso.notPossibleItems()
                .style("stroke-width", "0.2")
            }
        };

        var lasso_end = function() {
            if(document.getElementById('lazoselection').checked){
            system.settings.deselectPoints();
            status.selectedPoints = []
            // Style the selected dots
            
            lasso.selectedItems()
                .each((d)=> {
                    d.selected = true
                    status.selectedPoints.push(d.id)
                    //d.selected = true
                })
            
            onPointsSelectionChange(status.selectedPoints)

            lasso.selectedItems()
                .style("stroke", "black")
                .style("stroke-width", "0.4")

            // Reset the style of the not selected dots
            lasso.notSelectedItems().each((d)=> d.selected = false)
            lasso.notSelectedItems()
            .style("stroke", "black")
            .style("stroke-width", "0.2");
            
            if (status.selectedPoints.length!= 0){
                d3.select('#deselectpoint').style('visibility','visible')
                d3.select('#deselectpointlabel').style('visibility','visible')
            }}
        };

        

        //d3.select('#chart svg').call(lasso);
        var lasso = d3.lasso()
        .closePathSelect(true)
            .closePathDistance(100)
            .items(d3.select(`#points-g-${d3_radviz.getIndex()}`).selectAll('circle'))
            .targetArea(d3.select(`.radviz-svg-${d3_radviz.getIndex()}`))
            .on("start",lasso_start)
            .on("draw",lasso_draw)
            .on("end",lasso_end);
        
            d3.select(`.radviz-svg-${d3_radviz.getIndex()}`).call(lasso);
        
        
        
            // Sets the drag area for the lasso on the rectangle #myLassoRect
        
        //addDrag(d3.selectAll(`.radviz-svg-${d3_radviz.getIndex()}`).selectAll('g'))
        //addDrag(d3.select(`#points-g-${d3_radviz.getIndex()}`).selectAll('circle'))
    }


  

    this.lazoSelection = function () {
        
        if(that.initializeLasso){
            setup_lasso();
            that.initializeLasso = false;
        }
        else if(document.getElementById('lazoselection').checked) {
            d3.selectAll('.lasso').style('visibility','visible')
        } else {
            d3.selectAll('.lasso').style('visibility','hidden')   
        }

    }

    this.reprPoint = function(){
        
        if(document.getElementById('representative-point-check').checked) {
            d3_radviz.showRepresentativePoint(true)
        } else {
            d3_radviz.showRepresentativePoint(false)
        }
    }

    this.updateDominance = function(){
        // 
        document.getElementById('dominance-mean-check').checked = false
        if(document.getElementById('dominance-check').checked) {
            d3.select('#grid-g-' + d3_radviz.getIndex()).selectAll("text.attr_label-" + d3_radviz.getIndex())
            .text((d)=> {
                return d.labeldominance.substring(0,10);}
            )
        } else {
            d3.select('#grid-g-' + d3_radviz.getIndex()).selectAll("text.attr_label-" + d3_radviz.getIndex())
            .text(d=>{
                if (d.value.includes(' ')) return d.value.substring(0, d.value.indexOf(' '));
                    else return d.value;
                }
            )
        }
    }

    this.updateDominanceMean = function(){
        document.getElementById('dominance-check').checked = false
        // 
        if(document.getElementById('dominance-mean-check').checked) {
            d3.select('#grid-g-' + d3_radviz.getIndex()).selectAll("text.attr_label-" + d3_radviz.getIndex())
            .text((d)=> {
                return d.labelmeandominance.substring(0,10);}
            )
        } else {
            d3.select('#grid-g-' + d3_radviz.getIndex()).selectAll("text.attr_label-" + d3_radviz.getIndex())
            .text(d=>{
                if (d.value.includes(' ')) return d.value.substring(0, d.value.indexOf(' '));
                    else return d.value;
                }
            )
        }
    }

    return this;
}).call({})