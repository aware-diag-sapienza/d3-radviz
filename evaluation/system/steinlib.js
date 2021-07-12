
window.SteinLib = {
    systemLoaded: function(){
        window.parent.d3.select(window.parent.document.body)
        .dispatch('SteinLibEventSystemLoaded');
    },
    event: null,
    trackBootstrapTooltip: function(){
        if(jQuery) $('[data-toggle=\"tooltip\"]').on('shown.bs.tooltip.SteinLib', function(event){
            SteinLib.event = event;
        });
    },
    autoCollectedDatatypes: [],
    lastAutoCollectedDatatype: null,
    autoCollectedEvents: [],
    groupedAutoCollectedEvents: {},
    lastGroupedAutoCollectedEvent: null,
    datatypesSelector: {},
    svg: null,

    datumToObject: function (datum){
        if(datum == null || datum == undefined) return null;
        let cache = [];
        let d = JSON.parse(JSON.stringify(datum, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
            // Store value in our collection
                cache.push(value);
            }
            return value;
        }, "\t"));
        cache = null;
        return d;
    },

    highlightElements: function(selector){
        if(SteinLib.svg == null) SteinLib.svg = window.parent.d3.select(document.body).select("#stein-highlight-svg");
        //SteinLib.svg.style("opacity", "0.3");

        window.parent.d3.select(document.body).selectAll(selector)
            .each(function(){
                let b = this.getBoundingClientRect();
                SteinLib.svg.append("rect")
                    .attr("x", parseInt(b.left))
                    .attr("y", parseInt(b.top))
                    .attr("width", parseInt(b.width))
                    .attr("height", parseInt(b.height));
            });
                  
    },

    deHighlightElements: function(){
        if(SteinLib.svg == null) SteinLib.svg = window.parent.d3.select(document.body).select("#stein-highlight-svg");
        //SteinLib.svg.style("opacity", "0");
        SteinLib.svg.selectAll("*").remove();    
    },
    SteinEvent : (type, dataType, target, targetId, targetClass, elementsSelector, targetDatum, eventDatum=null) => {
        const e = {
            type: type,
            target: target,
            targetId: targetId,
            targetClass: targetClass,
            eventDatum: eventDatum,
            targetDatum: SteinLib.datumToObject(targetDatum),
            dataType: dataType,
            timestamp: Date.now(),
            generator: null,
            elementsSelector: elementsSelector,
            parentId: null,
            parentNode: null
        };
        return new class SteinEvent {
            constructor(e){
                Object.keys(e).forEach(k => this[k] = e[k]);
                this._manualTriggered = false
            }
        }(e);
    },

    dispatchEvent: (type, datatype, datum) => { //dispatch manual event to stein
        const event = SteinLib.SteinEvent(type, datatype, null, null, null, null, datum, datum);
        event._manualTriggered = true
        SteinLib.event = event;
    }


};

(function(){
    
    var f = function(){
        var elem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        elem.id = "stein-highlight-svg";
        elem.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1111;opacity:0.5;pointer-events:none;fill:red;'; //opacity:0;background:#000;
        document.body.appendChild(elem);

        

    };
    document.addEventListener("DOMContentLoaded", f, false);
})();



(function () {
    var original = Element.prototype['addEventListener'];
    Element.prototype['addEventListener'] = function() {
        arguments[1] = (function(f){
            return function() {
                let catchEventBeforeListener = false;
                //first call original listener, then propagate the event to SteinLib
                if(catchEventBeforeListener){
                    SteinLib.event = arguments[0];
                    return f.apply(this, arguments);
                }
                else{
                    let res = f.apply(this, arguments);
                    SteinLib.event = arguments[0];
                    return res;
                }
                
            }
        })(arguments[1]);
            
        //if(!["mousemove", "mousedown", "mouseout", "mouseover"].includes(arguments[0])){
            let name = this.classList[0];
            let elementsSelector = this.classList[0] == undefined ? undefined : "." + this.classList[0];
            
            if(name == undefined){
                name = this.id;
                elementsSelector = this.id == undefined ? undefined : "#" + this.id;
            }
            if(name == undefined){
                name = this.tagName;
                elementsSelector = this.tagName;
            }

            let target = window.parent.d3.select(this);

            let myEvent = SteinLib.SteinEvent(
                arguments[0], 
                name, 
                this.tagName, 
                target.attr("id"), 
                target.attr("class"), 
                elementsSelector, 
                null
            );
            
            if(myEvent.targetId == null) myEvent.targetId = "";
            if(myEvent.targetClass != null && myEvent.targetClass != "") myEvent.targetClass = myEvent.targetClass.replace(/ /g, ".");
            else myEvent.targetClass = "";
            myEvent.generator = myEvent.type + "/" + myEvent.target + "/" + myEvent.targetId + "/" + myEvent.targetClass;



            let parent = target.select(function(){ return this.parentNode;});
            if(!parent.node().nodeName.includes("#document")){
                myEvent.parentId = parent.attr("id");
                myEvent.parentClass = parent.attr("class");
                
                while(myEvent.parentId == null && myEvent.parentClass == null && !["#document", "HTML", "BODY"].includes(parent.node().nodeName)){
                    //console.log(parent.node().nodeName)
                    parent = parent.select(function(){ return this.parentNode;});
                    myEvent.parentId = parent.attr("id");
                    myEvent.parentClass = parent.attr("class");
                }
            }
            
            
            if(myEvent.parentId == null) myEvent.parentId = "";
            if(myEvent.parentClass != null) myEvent.parentClass = myEvent.parentClass.replace(/ /g, ".");
            else myEvent.parentClass = "";


            if(name == ""){
                name = myEvent.parentClass.split(".")[0];
            }
            if(name == ""){
                name = myEvent.parentId;
            }


            if(!SteinLib.autoCollectedDatatypes.includes(name)){
                SteinLib.autoCollectedDatatypes.push(name);
                SteinLib.lastAutoCollectedDatatype = name;
                SteinLib.datatypesSelector[name] = elementsSelector;
            }

            name = myEvent.type + "-on-" + name;

            SteinLib.autoCollectedEvents.push(myEvent);

            if(!SteinLib.groupedAutoCollectedEvents.hasOwnProperty(name)){
                SteinLib.groupedAutoCollectedEvents[name] = [];
                SteinLib.groupedAutoCollectedEvents[name].push(myEvent);
                SteinLib.lastGroupedAutoCollectedEvent = myEvent;
            }
            else{
                SteinLib.groupedAutoCollectedEvents[name].push(myEvent);
            }

            

            //console.log(Object.keys(SteinLib.groupedAutoCollectedEvents));
        //}
             
        return original.apply(this, arguments);
    }
})();