
/*
*
* Set the url for uploading data. Data are send as POST request with two parameters:
    content
    filename
*
*/
const serverUploadUrl = "save.php";
/*
*
*
*/
;Array.prototype.swap = function(i, j){
    let temp = this[i];
    this[i] = this[j];
    this[j] = temp;
    return this;
}

String.prototype.insertAfter = function(search, value){
    let i = this.indexOf(search) + search.length;
    return this.substring(0, i) + value +  this.substring(i, this.length);
}

d3.selection.prototype.parent = function() {
    return this.select(function(){return this.parentNode});
};

d3.selection.prototype.clone = function() {
    let node = this.node();
    d3.select(node.parentNode.insertBefore(node.cloneNode(true),node.nextSibling));
};

d3.selection.prototype.response = function() {
    return JSON.parse(this.property("response"));
};

d3.selection.prototype.appendSmallTextInput = function() {
    let form = this.append("form");
    form.append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("placeholder", "Insert the text here")
        .on("keyup.response", function(d){
            let val = d3.select(this).property("value");
            form.property("response", JSON.stringify(val));
            form.dispatch("response");
        });
    form.defaultValue = function(value){
        this.select("input")
        .property("value", function(d){
            if(typeof value == "function") return value.call(this, d);
            else return value;
        });
        return this;
    };
    return form;
};

d3.selection.prototype.appendLargeTextInput = function() {
    function getDefaultValue(d){
        if(typeof defaultValue == "function") return defaultValue.call(this, d);
        else return defaultValue;
    }

    let form = this.append("form");
    form.append("textarea")
        .attr("class", "form-control")
        .attr("rows", "8")
        .attr("placeholder", "Insert the text here")
        .on("keyup.response", function(d){
            let val = d3.select(this).property("value");
            form.property("response", JSON.stringify(val));
            form.dispatch("response");
        });

    form.defaultValue = function(value){
        this.select("textarea")
        .property("value", function(d){
            if(typeof value == "function") return value.call(this, d);
            else return value;
        });
        return this;
    };
    return form;
};

d3.selection.prototype.appendMultipleChoiceInput = function(options, inline=false) {
    let _this=this;
    let name = new Date().getTime() + "-";
    for(let i=0; i<4; i++) name += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    let form = this.append("form");
    options.forEach(function(opt, i){
        let div = form.append("div")
        .attr("class", function(){if(inline) return "form-check-inline"; else return "form-check"});
        div.append("input")
            .attr("class", "form-check-input")
            .attr("type", "radio")
            .attr("name", name)
            .attr("id", name + "-" + i)
            .attr("value", opt)
            .on("change.response", function(d){
                form.property("response", JSON.stringify(opt));
                form.dispatch("response");
            });
        div.append("label")
            .attr("class", "form-check-label")
            .attr("for", name + "-" + i)
            .text(opt);
    });

    form.defaultValue = function(value){
        this.selectAll("input")
        .property("checked", function(d){
            if(typeof value == "function") return value.call(this, d) == d3.select(this).attr("value");
            else return value == d3.select(this).attr("value");
        });
        return this;
    };
    return form;
};

d3.selection.prototype.appendCheckboxesInput = function(options, inline=false) {
    let _this=this;
    let form = this.append("form");
    let name = new Date().getTime() + "-";
    for(let i=0; i<4; i++) name += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    //let response = [];
    options.forEach(function(opt, i){
        let div = form.append("div")
        .attr("class", function(){if(inline) return "form-check-inline"; else return "form-check"});;
        div.append("input")
            .attr("class", "form-check-input")
            .attr("type", "checkbox")
            .attr("id", name + "-" + i)
            .attr("value", opt)
            .on("change.response", function(d){
                let response = [];
                form.selectAll("input").each(function(){
                    if(d3.select(this).property("checked")) response.push(d3.select(this).property("value"))
                })
                form.property("response", JSON.stringify(response));
                form.dispatch("response");
            });
        
        div.append("label")
            .attr("class", "form-check-label")
            .attr("for", name + "-" + i)
            .text(opt);
    });

    form.defaultValue = function(value){
        this.selectAll("input")
        .property("checked", function(d){
            if(typeof value == "function") return value.call(this, d) == d3.select(this).attr("value");
            else return value == d3.select(this).attr("value");
        });
        return this;
    };
    return form;
};

d3.selection.prototype.appendImageMultipleChoiceInput = function(options, images) {
    let _this=this;
    let name = new Date().getTime() + "-";
    for(let i=0; i<4; i++) name += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    let form = this.append("form");
    options.forEach(function(opt, i){
        let div = form.append("div")
        .attr("class", "form-check")
        .style("padding-bottom", "2em");
        
        div.append("input")
            .attr("class", "form-check-input")
            .attr("type", "radio")
            .attr("name", name)
            .attr("id", name + "-" + i)
            .attr("value", opt)
            .on("change.response", function(d){
                form.property("response", JSON.stringify(opt));
                form.dispatch("response");
            });
        div.append("img").attr("src", images[i]).attr("class", "image-multiple-choice").attr("height", "50px").attr("class", "form-check-label")
            .attr("for", name + "-" + i).style("padding-right", "2em")
        div.append("label")
            .attr("class", "form-check-label")
            .attr("for", name + "-" + i)
            .text(opt)
    });

    form.defaultValue = function(value){
        this.selectAll("input")
        .property("checked", function(d){
            if(typeof value == "function") return value.call(this, d) == d3.select(this).attr("value");
            else return value == d3.select(this).attr("value");
        });
        return this;
    };
    return form;
};


d3.selection.prototype.appendImageCheckboxesInput = function(options, images) {
    let _this=this;
    let form = this.append("form");
    let name = new Date().getTime() + "-";
    for(let i=0; i<4; i++) name += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    options.forEach(function(opt, i){
        let div = form.append("div")
        .attr("class", "form-check")
        .style("padding-bottom", "2em");
        div.append("input")
            .attr("class", "form-check-input")
            .attr("type", "checkbox")
            .attr("id", name + "-" + i)
            .attr("value", opt)
            .on("change.response", function(d){
                let response = [];
                form.selectAll("input").each(function(){
                    if(d3.select(this).property("checked")) response.push(d3.select(this).property("value"))
                })
                form.property("response", JSON.stringify(response));
                form.dispatch("response");
            });
        
        div.append("img").attr("src", images[i]).attr("class", "image-multiple-choice").attr("height", "50px").attr("class", "form-check-label")
            .attr("for", name + "-" + i).style("padding-right", "2em")
        
        div.append("label")
            .attr("class", "form-check-label")
            .attr("for", name + "-" + i)
            .text(opt);
    });

    form.defaultValue = function(value){
        this.selectAll("input")
        .property("checked", function(d){
            if(typeof value == "function") return value.call(this, d) == d3.select(this).attr("value");
            else return value == d3.select(this).attr("value");
        });
        return this;
    };
    return form;
};


d3.selection.prototype.appendSortableList = function(elements){
    let _this = this;
    let id = new Date().getTime() + "-";
    for(let i=0; i<4; i++) id += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    let ul = this.append("ul").attr("class", "sortable-list").attr("id",id);
    ul.selectAll("li")
        .data(elements)
        .enter()
        .append("li")
        .append("div").attr("class", "alert alert-secondary")
        .html(function(d){ return d;});

    Sortable.create(document.getElementById(id), {
            onSort : function(evt){
                ul.dispatch("sort"); 
            }
        });
    return ul;
};

d3.selection.prototype.appendConfidenceMultipleChoiceInput = function(inline=false) {
    let _this = this;
    let text = "Then, report the confidence of your answer."
    let options = [
        "4 - Completely confident",
        "3 - Very confident",
        "2 - Averagely confident",
        "1 - Poorly confident",
        "0 - Not confident at all"
    ];
    let name = new Date().getTime() + "-";
    for(let i=0; i<4; i++) name += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    
    this.append("div").text(text);
    let form = this.append("form");
    options.forEach(function(opt, i){
        
        
        let div = form.append("div")
        .attr("class", function(){if(inline) return "form-check-inline"; else return "form-check"});
        div.append("input")
            .attr("class", "form-check-input")
            .attr("type", "radio")
            .attr("name", name)
            .attr("id", name + "-" + i)
            .attr("value", opt)
            .on("change.response", function(d){
                form.property("response", JSON.stringify(opt));
                form.dispatch("response");
            });
        div.append("label")
            .attr("class", "form-check-label")
            .attr("for", name + "-" + i)
            .text(opt);
    });

    form.defaultValue = function(value){
        this.selectAll("input")
        .property("checked", function(d){
            if(typeof value == "function") return value.call(this, d) == d3.select(this).attr("value");
            else return value == d3.select(this).attr("value");
        });
        return this;
    };
    return form;
};

$(function(){
     d3.select("body").selectAll(".aspect-16-9").each(function(){
        let parentSize = d3.select(this.parentNode).node().getBoundingClientRect();
        let w = 0;
        let h = 0;
        let top = 0;
        while(true){
            let tempW = w + 1;
            let tempH = parseInt(tempW * 9 / 16);
            if(tempW > parentSize.width || tempH > parentSize.height) break;
            w = tempW;
            h = tempH;
            top = parseInt((parentSize.height - h)/2)
        }
        d3.select(this)
            .style("width", w + "px")
            .style("height", h + "px")
            .style("top", top + "px");
    });

    d3.select("body").selectAll(".aspect-4-3").each(function(){
        let parentSize = d3.select(this.parentNode).node().getBoundingClientRect();
        let w = 0;
        let h = 0;
        let top = 0;
        while(true){
            let tempW = w + 1;
            let tempH = parseInt(tempW * 3 / 4);
            if(tempW > parentSize.width || tempH > parentSize.height) break;
            w = tempW;
            h = tempH;
            top = parseInt((parentSize.height - h)/2)
        }
        d3.select(this)
            .style("width", w + "px")
            .style("height", h + "px")
            .style("top", top + "px");
    });

    d3.selectAll("iframe")
        .attr("width", function(){ return d3.select(this.parentNode).node().getBoundingClientRect().width;})
        .attr("height", function(){ return d3.select(this.parentNode).node().getBoundingClientRect().height;});
});


window.Stein = new class{
    constructor(){
        this.highLevelEventTimestamp = {};
        this.events = {};
        
        this.configFileName = "stein-config.json?q=" + Date.now(); //random number to bypass cache
        this.design = undefined;
        this.evaluation = undefined;
        this.test = undefined;
        this.baseUrl = location.href.substr(0,location.href.lastIndexOf("/") + 1); 

        this.urlParams = {};
        [...(new URLSearchParams(window.location.search)).entries()].forEach(d => {
            const key = d[0]
            const value = d[1]
            this.urlParams[key] = value
        });
        console.log("URL Params", this.urlParams);
    }


    downloadJson(filename, content){
        let blob = new Blob([JSON.stringify(content, null, 2)], {type : 'application/json'});
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    uploadJson(url, filename, content, callback){
        //console.log("Send result to: " + url);
        let datum = {content: JSON.stringify(content, null, 2), filename: filename};
        console.log("Send to " + url, datum);
        $.ajax({
            type: "POST",
            url: url,
            data: datum,
            success: function(response){
                try {
                    var jsonResponse = JSON.parse(response);
                    console.log(jsonResponse);
                    if(jsonResponse != null && jsonResponse.result == "ok"){
                        if(callback != undefined) callback(true);
                    }
                    else{
                        console.log("---------- An error occurred ----------");
                        console.log("-- Server response:", response);
                        console.log("---------- ----------------- ----------");
                        alert("An error occurred");
                        if(callback != undefined) callback(false, response);
                    }
                } catch(e) {
                    console.log("---------- An error occurred ----------");
                    console.log("-- Server response:", response);
                    console.log("---------- ----------------- ----------");
                    alert("An error occurred");
                    if(callback != undefined) callback(false, e);
                }   
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("An error occurred");
                console.log("---------- An error occurred ----------");
                console.log("-- Text status error: ", textStatus);
                console.log("-- Error thrown: ", errorThrown);
                console.log("---------- ----------------- ----------");
                if(callback != undefined) callback(false, errorThrown);
             }
        });
    }
    
    /*
    //insert the library in the content of the iframe
    setIframeContent(iframeId, url, script, callback){
        if(script == undefined) script = "";
        let iframe = document.getElementById(iframeId);
        $.get(url, function(html) {
            let newUrl = (url.endsWith("/")) ? url : url + "/";
            let s = "<base target='_blank' href='";
        	 if(!newUrl.startsWith("../") && !newUrl.startsWith("./") && !newUrl.startsWith("http")) s += "./"; //
            s = s + newUrl + "'> <script>" + script + "</script>";
            
            if(html.includes("<head>") && html.includes("</head>")){
                iframe.srcdoc = html.insertAfter("<head>", s);
            }
            else{
                s = "\n<head>\n" + s + "\n</head>\n";
                iframe.srcdoc = html.insertAfter("<!DOCTYPE html>", s);
            }
            if(callback != undefined) callback.call();
        });
    }
    */
    
   //load the iframe, the stein-events.js should be already loaded in system
   
   setIframeContent(iframeId, url, script, callback){
        let iframe = document.getElementById(iframeId);
        
        iframe.contentWindow.location.reload()
        iframe.src = "about:blank";
        iframe.src = url;
        if(callback != undefined) callback.call();
    }
    
    
    

    datumToObject(datum){
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
    }

    watcher(target, property, callback) {
        //console.log(target, property);
        if (target.__lookupGetter__(property) != null) {
          return true
        }
        let oldval = target[property],
          newval = oldval,
          self = this,
          getter = function () {
            return newval
          },
          setter = function (val) {
            if (Object.prototype.toString.call(val) === '[object Array]') {
                console.warn("The object is an array. The function for elaborating array is not defined.")
                /* 
                The original version of the code define a function for elaborate array.
                // WATCH VARIABLES - http://techblog.personalcapital.com/2013/02/js-hacks-dead-simple-javascript-variable-change-watchers/
                val = _this._extendArray(val, handler, self) //oroginal version of the function
                */
            }
           
            oldval = newval
            newval = val
            if(newval!=null) callback.call(this, newval);
          };
        if (delete target[property]) { // can't watch constants
          if (Object.defineProperty) { // ECMAScript 5
            Object.defineProperty(target, property, {
              get: getter,
              set: setter,
              enumerable: false,
              configurable: true
            })
          }
          else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
            Object.prototype.__defineGetter__.call(target, property, getter)
            Object.prototype.__defineSetter__.call(target, property, setter)
          }
        }
        return this
      }

    watchEvents(window, callback) {
        this.watcher(window.SteinLib, "event", callback);
        
        if(window.d3) this.watcher(window.d3, "event", function(e){
            if(["brush", "zoom", "brushend"].includes(e.type)){
                window.SteinLib.event = e;
            }
        });  
    }

    watchAutoCollectedEvents(window, callback){
        this.watcher(window.SteinLib, "autoCollectedEvents", callback);
    }


    parseEvent(e, sourceWindowName){
        let _this = this;
        let timestamp = Date.now();
        if(sourceWindowName == undefined){
            sourceWindowName = timestamp + "-";
            for(let i=0; i<4; i++) sourceWindowName += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); //random id
        }
        if(_this.events[sourceWindowName] == undefined) _this.events[sourceWindowName] = []
        
        
        //if stein event, pass as is
        if(e.constructor.name == "SteinEvent") return e;
        
        let lowLevelTypes = ["click", "dblclick", "wheel", "change", "mousedown", "shown"];
        let highLevelTypes = ["brush", "zoom", "end"];
        let overLevelTypes = ["mouseenter", "mouseleave", "mouseover"];
        
        //console.log(e);

        let isLowLewel = lowLevelTypes.includes(e.type);
        let isHighLevel = highLevelTypes.includes(e.type) && e.sourceEvent;
        let isOverLevel = overLevelTypes.includes(e.type);

        if(!isLowLewel && !isHighLevel && !isOverLevel) return null;
        if(isOverLevel && !e.shiftKey) return null;
        if(isHighLevel && !["MouseEvent", "WheelEvent"].includes(e.sourceEvent.__proto__.constructor.name)) return null;

        
        if(!_this.highLevelEventTimestamp.hasOwnProperty(sourceWindowName)) _this.highLevelEventTimestamp[sourceWindowName] = 0;
        if(!_this.events.hasOwnProperty(sourceWindowName)) _this.events[sourceWindowName] = [];
        if(_this.events[sourceWindowName].length != 0 && timestamp - _this.events[sourceWindowName][_this.events[sourceWindowName].length-1].timestamp > 150){
            _this.events[sourceWindowName] = [];
        }
        

        let type = e.type;
        let eventDatum = {
            extent: null,
            position: null,
            selection: null,
            transform: null,
            value: null,
            checked: null
        };

        /*
        bootstrap(jquery) tooltips
        */
       if(type == "shown" && e.hasOwnProperty("namespace") && e.namespace == "bs.tooltip") type = "tooltip";

        
        /*
        brush and zoom have a function as target, 
        the sourceEvent is the mouse event that generates it
        */
        if(typeof e.target == "function"){
            if(type == "brush" && e.target.hasOwnProperty("extent")) eventDatum.extent = e.target.extent();
            if(e.hasOwnProperty("selection")) eventDatum.selection = e.selection;
            if(e.hasOwnProperty("transform")) eventDatum.transform = e.transform;
            e = e.sourceEvent;
        }
        if(e.clientX != undefined) eventDatum.position = [e.clientX, e.clientY];

        let target = d3.select(e.target);
        if(type == "shown") target = d3.select(e.currentTarget);
            

        let myEvent = {
            type: type,
            target: e.target.nodeName,
            targetId: target.attr("id"),
            targetClass: target.attr("class"),
            eventDatum: eventDatum,
            targetDatum: _this.datumToObject(target.datum()),
            timestamp: timestamp,
            generator: null,
            parentId: null,
            parentClass: null
        };

        if(type == "change"){
            eventDatum.value = target.property("value");
            eventDatum.checked = target.property("checked");
            
            if(myEvent.target.toLowerCase() == "select" && myEvent.targetDatum == null){
                myEvent.targetDatum = target.property("value");
            }
            
        }

        if(myEvent.targetId == null) myEvent.targetId = "";
        if(myEvent.targetClass != null) myEvent.targetClass = myEvent.targetClass.replace(/ /g, ".");
        else myEvent.targetClass = "";
        myEvent.generator = myEvent.type + "/" + myEvent.target + "/" + myEvent.targetId + "/" + myEvent.targetClass;


        let parent = target.parent();
        myEvent.parentId = parent.attr("id");
        myEvent.parentClass = parent.attr("class");
        let parentLevel = -1;
        
        while(myEvent.parentId == null && myEvent.parentClass == null && parent.node().nodeName != "#document"){
            parent = parent.parent();
            myEvent.parentId = parent.attr("id");
            myEvent.parentClass = parent.attr("class");
            parentLevel--;
        }
        if(myEvent.parentId == null) myEvent.parentId = "";
        if(myEvent.parentClass != null) myEvent.parentClass = myEvent.parentClass.replace(/ /g, ".");
        else myEvent.parentClass = "";


        _this.events[sourceWindowName].push(myEvent);
        //console.log(_this.events[sourceWindowName]);
        return myEvent;
    }

        //current datetime in iso format 2018-01-10T14:16:16.858Z
    getCurrentDateTime(){
        let d = new Date();
        let n = d.toISOString();
        return n;
    }

    //current compact datetime in iso format 20180110-141616
    getCurrentCompactDateTime(){
        let d = new Date();
        let n = d.toISOString();
        let i = n.indexOf(".");
        n = n.substring(0, i);
        return n.replace(/[:-]/g , "").replace("T", "-");
    }

    //current timestamp in sec
    getCurrentTimestamp(){
        let d = new Date();
        let n = d.getTime();
        return parseInt(n/1000);
    }

    //current timestamp in millisec
    getCurrentMillisecTimestamp(){
        let d = new Date();
        let n = d.getTime();
        return n;
    }

    getRandomString(len = 2){
        let s = "";
        for(let i=0; i<len; i++){
            s += Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s;
    }
	
	getPublicIp(callback){
        d3.text("https://ifconfig.me/ip", data => {
            callback(data)
        })
    }

    getPrivateIp(callback) {
        //compatibility for firefox and chrome
        var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;
    
        function iterateIP(ip) {
            if (!localIPs[ip]) callback(ip);
            localIPs[ip] = true;
        }
    
         //create a bogus data channel
        pc.createDataChannel("");
    
        // create offer and set local description
        pc.createOffer().then(function(sdp) {
            sdp.sdp.split('\n').forEach(function(line) {
                if (line.indexOf('candidate') < 0) return;
                line.match(ipRegex).forEach(iterateIP);
            });
            
            pc.setLocalDescription(sdp, noop, noop);
        }).catch(function(reason) {
            // An error occurred, so handle the failure to connect
        });
    
        //listen for candidate events
        pc.onicecandidate = function(ice) {
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
        };
    }
};


;window.Stein.design = new class {
    constructor(){
        let _this = this;

        this.stein = Stein;

        this.data = {
            stein: "This is a Stein configuration file",
            steinVersion: 7,
            creation: "",
            export: "",
            systemUrl: "",
            uploadUrl: "",
            title: "",
            description: "",
            lastEditedFileName: "",
            dataTypes: [
                {name: "undefined", toStringFunction: _this._toStringFunctionString()}
            ],
            events: [],
            initialQuestions: [],
            systemQuestions: [],
            finalQuestions: []
        }
       
        this.systemLoaded = false;
        this.systemLoadedCatchPage = false;
        this.lastPage = null;

        this.eventsScript = "";

        /* constants */
        this.localStorageKey = "SteinDesign";
        
        this.dom = {
            pages: {
                start: "#start-page",
                system: "#system-page",
                catchEvents: "#catch-events-page",
                initialQuestions: "#initial-questions-page",
                systemQuestions: "#system-questions-page",
                finalQuestions: "#final-questions-page",
                initialQuestionsTest: "#initial-questions-test-page",
                systemQuestionsTest: "#system-questions-test-page",
                finalQuestionsTest: "#final-questions-test-page",
                save: "#save-page",
                deploy: "#deploy-page",
                results: "#results-page",
                loading: "#loading-page"
            },
            resumeMessage: "#resume-message",
            startButton: "#button-start",
            resumeButton: "#button-resume",
            editButton: "#button-edit",

            bottomBar: "#bottom-bar",

            //system page
            datatypesNumber: "#datatypes-number",
            datatypesList: "#datatypes-list",
            datatypesDetectedList: "#detected-datatypes-list",
            systemLoading: "#system-loading",
            systemIframe: "#system-iframe",
            systemEventContainer: "#event-container-system",
            systemEvent: "#event-system",
            //settings page
            systemUrl: "#system-url",
            inputUploadUrl: "#input-upload-url",
            addDatatypeButton: "#button-add-dataype",
            datatypesBody: "#datatypes-body",
            //catch events page
            eventsNumber: "#events-number",
            eventsList: "#events-list",
            eventsDetectedNumber: "#detected-events-number",
            eventsDetectedList: "#detected-events-list",
            systemLoadingCatch: "#system-loading-catch",
            systemIframeCatch: "#system-iframe-catch",
            catchEventContainer: "#event-container-catch",
            eventSavedAlert: "#alert-event-saved",
            catchEvent: "#event-catch",
            functionSelector: "#function-selector",
            functionData: "#function-data",
            answerContribution: "#answer-contribution",
            showFunctionSelectorButton: "#button-show-function-selector",
            showFunctionDataButton: "#button-show-function-data",
            showAnswerContributionButton: "#button-show-answer-contribution",

            
            eventType: "#event-type",
            eventTarget: "#event-target",
            eventTargetId: "#event-targetId",
            eventTargetClass: "#event-targetClass",
            eventParentId: "#event-parentId",
            eventParentClass: "#event-parentClass",
            eventEventDatum: "#event-eventDatum",
            eventEventDatumArrow: "#event-eventDatum-arrow",
            eventTargetDatumArrow: "#event-targetDatum-arrow",
            eventTargetDatum: "#event-targetDatum",
            inputEventTagFixed: "#input-event-tag-fixed",
            inputEventTag: "#input-event-tag",
            inputEventDatatype: "#input-event-datatype",
            inputEventContributeToAnswer: "#input-event-contribute-to-answer",
            selectorLinesBeforeBody: "#selector-lines-before-body",
            selectorLinesAfterBody: "#selector-lines-after-body",
            inputFunctionSelector: "#input-function-selector",
            buttonRunSelector: "#button-run-selector",
            dataLinesBeforeBody: "#data-lines-before-body",
            dataLinesAfterBody: "#data-lines-after-body",
            inputFunctionData: "#input-function-data",
            buttonRunData: "#button-run-data",
            saveEventButton: "#button-save-event",

            //save page
            outputFile: "#output-file",

            systemIframePreview: "#system-iframe-preview",
            systemLoadingPreview: "#system-loading-preview",
        };

        this.iframe = {
            datatype: null,
            events: null
        }
    }


    _selectorFunctionsDefaultLines(event){
        let res = {
            beforeBody: ["if(event.type != '" + event.type + "') return false;", "var result = false;"],
            body: ["if(event.targetClass.split('.').includes('" + event.targetClass.split(".")[0] + "')) result = true;"],
            afterBody: ["return result;"]
        };

        
        if(event.targetClass != ""){
            res.body = ["if(event.targetClass.split('.').includes('" + event.targetClass.split(".")[0] + "')) result = true;"];
        }
        else if(event.targetId != ""){
            res.body = ["if(event.targetId == '" + event.targetId + "') result = true;"];
        }
        else if(event.parentClass != ""){
            res.body = ["if(event.parentClass.split('.').includes('" + event.parentClass.split(".")[0] + "')) result = true;"];
        }
        else res.body = ["if(event.parentId == " + event.parentId + "') result = true;"];
        
        
        return res;
    }

    _selectorFunctionString(event, functionBody = ""){
        let fString = "(function(event){";
        this._selectorFunctionsDefaultLines(event).beforeBody.forEach(function(l){ fString += l});
        fString += functionBody + ";";
        this._selectorFunctionsDefaultLines(event).afterBody.forEach(function(l){ fString += l});
        fString += "})";
        //".call(this, " + JSON.stringify(myEvent) + ");"; to call the function
        return fString;
    }

    _dataFunctionsDefaultLines(event){
        let property = "targetId";
        if(event[property] == "") property = "targetClass";
        if(event[property] == "") property = "target";

        if(event.type == "change" && event.target.toLowerCase() == "select"){
            property = "eventDatum.value";
        }

        return {
            beforeBody: ["var result = null;"],
            body: [
                "if(event.targetId != '') result = event.targetId;",
                "else if(event.targetClass != '') result = event.targetClass;",
                "else if(event.parentId != '') result = event.parentId;",
                "else if(event.parentClass != '') result = event.parentClass;",
                "else result = event." + property + ";"
            ],
            afterBody: ["return result;"]
        }
    }

    _dataFunctionString(event, functionBody = ""){
        let fString = "(function(event){";
        this._dataFunctionsDefaultLines(event).beforeBody.forEach(function(l){ fString += l});
        fString += functionBody + ";";
        this._dataFunctionsDefaultLines(event).afterBody.forEach(function(l){ fString += l});
        fString += "})";
        //".call(this, " + JSON.stringify(myEvent) + ");"; to call the function
        return fString;
    }

    _toStringFunctionsDefaultLines(){
        return {
            beforeBody: ["var result = d.toString();"],
            body: [],
            afterBody: ["return result;"]
        }
    }

    _toStringFunctionString(functionBody = ""){
        let fString = "(function(d){";
        this._toStringFunctionsDefaultLines().beforeBody.forEach(function(l){ fString += l});
        fString += "/*body-start*/" + functionBody + "/*body-end*/;";
        this._toStringFunctionsDefaultLines().afterBody.forEach(function(l){ fString += l});
        fString += "})";
        //".call(this, " + JSON.stringify(myEvent) + ");"; to call the function
        return fString;
    }

    _beforeFunctionDefaultLines(){
        return {
            body: ["/*Call this function to notify to Stein that the system is loaded.*/", "if(SteinLib) SteinLib.systemLoaded();"],
        }
    }

    _beforeFunctionString(functionBody = ""){
        let fString = "(function(){";
        fString += "/*body-start*/" + functionBody + "/*body-end*/;";
        fString += "})";
        //".call(this, " + JSON.stringify(myEvent) + ");"; to call the function
        return fString;
    }

    _afterFunctionString(functionBody = ""){
        let fString = "(function(){";
        fString += "/*body-start*/" + functionBody + "/*body-end*/;";
        fString += "})";
        //".call(this, " + JSON.stringify(myEvent) + ");"; to call the function
        return fString;
    }

    _datumToObject(datum){
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
    }

    _getHtmlJson(obj){
        return JSON.stringify(obj, null, "\t").replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;'); 
      }

    start(){
        let _this = this;
        //load stein-events.js
        $.get('js/steinlib.js', function(script) {
            console.log(script);
            _this.eventsScript = script;
            _this.start2();
        });
    }

      
    start2(){
        let _this = this;
        let sessionData = _this._getSessionData();
        
        if(sessionData == null){
            d3.select(_this.dom.resumeButton).style("display", "none");
            d3.select(_this.dom.resumeMessage).style("display", "none");
        }
        else{
            d3.select(_this.dom.resumeButton).style("display", null);
            d3.select(_this.dom.resumeMessage).style("display", null);
        } 
        
    
        //set navbar listeners
        d3.select("nav").selectAll(".nav-link").on("click", function(){
            let page = d3.select(this).attr("page");
            if(page == null) return;
            d3.select("nav").selectAll(".nav-item.active").attr("class", "nav-item");
            d3.select("nav").selectAll("nav-item.dropdown").style("color", "white !important");
            d3.select(this.parentNode).attr("class", "nav-item active");
            _this._showPage("#" + page);
        });
        d3.select("nav").selectAll(".dropdown-item").on("click", function(){
            let page = d3.select(this).attr("page");
            if(page == null) return;
            d3.select("nav").selectAll(".nav-item.active").attr("class", "nav-item");
            d3.select("nav").selectAll("nav-item.dropdow").style("color", null);
            d3.select(this).parent().parent().style("color", "white !important");
            _this._showPage("#" + page);
        });

        //listener on show functions in catch event page
        
        d3.select(_this.dom.showFunctionSelectorButton).on("click", function(){
            let element = d3.select(_this.dom.functionSelector);
            if(element.style("display") == "block") element.style("display", "none");
            else element.style("display", "block");
            
        });
        
        d3.select(_this.dom.showFunctionDataButton).on("click", function(){
            let element = d3.select(_this.dom.functionData);
            if(element.style("display") == "block") element.style("display", "none");
            else element.style("display", "block");
        });

        d3.select(_this.dom.showAnswerContributionButton).on("click", function(){
            let element = d3.select(_this.dom.answerContribution);
            if(element.style("display") == "block") element.style("display", "none");
            else element.style("display", "block");
        });
      
        
        

        d3.select(_this.dom.systemIframe)
            .attr("width", function(){ return d3.select(this.parentNode).node().getBoundingClientRect().width;})
            .attr("height", function(){ return d3.select(this.parentNode).node().getBoundingClientRect().height;});

        d3.select(_this.dom.systemIframeCatch)
            .attr("width", function(){ return d3.select(this.parentNode).node().getBoundingClientRect().width;})
            .attr("height", function(){ return d3.select(this.parentNode).node().getBoundingClientRect().height;});

        d3.select(_this.dom.systemIframePreview)
            .attr("width", function(){ return d3.select(this.parentNode).node().getBoundingClientRect().width;})
            .attr("height", function(){ return d3.select(this.parentNode).node().getBoundingClientRect().height;});

         //edit button
        d3.select(_this.dom.editButton).on("click", function(){
            let filename = window.prompt("Insert the name of the Json file to edit", "");
            if (filename != null && filename != ""){
                _this._showLoadingPage();
                d3.json(filename, function(json){
                    if(json == null){
                        alert("An error occurred during the reading of the file.\nSee the console for more details.");
                        _this._showStartPage();
                    }
                    else{
                        _this._deleteSessionData();
                        _this.data = json;
                        _this.data.lastEditedFileName = filename;
                        _this._saveSessionData();
                        _this._showPage(_this.dom.pages.system);
                    } 
                }); 
            }
        });
         
        //resume button
        d3.select(_this.dom.resumeButton).on("click", function(){
            _this.data = _this._getSessionData();
            _this._showPage(_this.dom.pages.system);
        });

        //start new button
        d3.select(_this.dom.startButton).on("click", function(){
            _this._deleteSessionData();
            if(typeof demo !== 'undefined' && demo){
                let modal = d3.select("#modal-system-url");
                modal.select("#continue").on("click", function(){
                    let url = modal.select("#select").property("value");
                    _this.data.systemUrl = url;
                    _this.data.creation = _this._getCurrentCompactDateTime();
                    _this._saveSessionData();
                    _this._showPage(_this.dom.pages.system);
                    $("#modal-system-url").modal("hide");
                });
                $("#modal-system-url").modal("show"); 
            }
            else{
                let url = window.prompt("Insert url of the system:", "../colorbrewer");
                if (url != null && url != ""){
                    _this.data.systemUrl = url;
                    _this.data.creation = _this._getCurrentCompactDateTime();
                    _this._saveSessionData();
                    _this._showPage(_this.dom.pages.system);
                }
            }
            
            
        });
        _this._showPage(_this.dom.pages.start);
    }

    _showPage(id, options){
        let _this = this;
        d3.values(_this.dom.pages).forEach(function(p){
            d3.select(p).style("visibility", "hidden");
        });
        _this._setPageContent(id, options);
        d3.select(id).style("visibility", "visible");  
    }

    _showLoadingPage(){
        let _this = this;
        _this._showPage(_this.dom.pages.loading);
    }

    _showStartPage(){
        let _this = this;
        _this._showPage(_this.dom.pages.start);
    }

    _showSettingsPage(){
        let _this = this;
        _this._showPage(_this.dom.pages.settings);
    }

    _showSystemLoading(){
        let _this = this;
        d3.select(_this.dom.systemLoading).style("visibility", null);
    }

    _removeSystemLoading(){
        let _this = this;
        d3.select(_this.dom.systemLoading).style("visibility", "hidden");
    }

    _showSystemLoadingCatch(){
        let _this = this;
        d3.select(_this.dom.systemLoadingCatch).style("visibility", null);
    }

    _removeSystemLoadingCatch(){
        let _this = this;
        d3.select(_this.dom.systemLoadingCatch).style("visibility", "hidden");
    }

    _showSystemLoadingPreview(){
        let _this = this;
        d3.select(_this.dom.systemLoadingPreview).style("visibility", null);
    }

    _removeSystemLoadingPreview(){
        let _this = this;
        d3.select(_this.dom.systemLoadingPreview).style("visibility", "hidden");
    }

    _initialQuestionPreview(globalPreview=true){
        let _this = this;
        _this._showPage(_this.dom.pages.initialQuestionsTest, {globalPreview: globalPreview});
    }

    _systemQuestionPreview(question, globalPreview=true){
        let _this = this;
        let questionIndex = 0;
        if(question != undefined){
            _this.data.systemQuestions.forEach(function(d, i){
                if(question.id == d.id) questionIndex = i;
            });
        }
        _this._showPage(_this.dom.pages.systemQuestionsTest, {questionIndex: questionIndex, globalPreview: globalPreview});
    }

    _finalQuestionPreview(globalPreview=true){
        let _this = this;
        _this._showPage(_this.dom.pages.finalQuestionsTest, {globalPreview: globalPreview});
    }

    _updateDatatypesList(){
        let _this = this;
        let dom = _this.dom;
        let page = dom.pages.system;
        let iframe = _this.iframe.datatype;

        /*
        let list = iframe.contentWindow.SteinLib.autoCollectedDatatypes.filter(function(d){
            return !_this.data.dataTypes.map(function(t){ return t.name}).includes(d);
        });
        */
        let list = iframe.contentWindow.SteinLib.autoCollectedDatatypes;

        d3.select(page).select("#detected-datatypes-number").text(function(){
            if(list.length == 0) return "";
            else return list.length; 
        });

        d3.select(page).select(dom.datatypesDetectedList).selectAll("*").remove();
        d3.select(page).select(dom.datatypesDetectedList).selectAll("li")
            .data(list)
            .enter()
            .append("li")
            .append("a").attr("class", "badge badge-light")
            .attr("id", function(d){ return "datatype-" + d})
            .text(function(d){ return d})
            .attr("href", "#")
            .on("mouseover", function(d){
                let selector = iframe.contentWindow.SteinLib.datatypesSelector[d];
                iframe.contentWindow.SteinLib.highlightElements(selector);
            })
            .on("mouseout", function(){
                iframe.contentWindow.SteinLib.deHighlightElements();
            })
            .on("click", function(d){
                if(!_this.data.dataTypes.map(function(t){ return t.name}).includes(d)) return;
                _this._openModalEditDatatype(d);
            })
            
            .select(function(){ return this.parentNode;})
            .append("input").attr("type", "checkbox")
            .property("checked", function(d){
                let checked = _this.data.dataTypes.map(function(t){ return t.name}).includes(d);
                d3.select("#datatype-" + d).classed("badge-info", checked).classed("badge-light", !checked).classed("no-hover", !checked);
                return checked;
            })
            .property("disabled", function(d){
                //disabilitata se esiste un evento associato con questo datatype. non posso eliminarlo se prima non elimino l'evento
                return _this.data.events.map(function(e){ return e.dataType}).includes(d);  
            })
            .on("change", function(d){
                let checked = d3.select(this).property("checked");
                if(checked) _this.data.dataTypes.push({name: d, toStringFunction: _this._toStringFunctionString()});
                else{
                    for(let i=_this.data.dataTypes.length-1; i>=0; i--){
                        if(_this.data.dataTypes[i].name == d){
                            _this.data.dataTypes.splice(i, 1);
                            break;
                        }
                    }
                }
                d3.select("#datatype-" + d).classed("badge-info", checked).classed("badge-light", !checked).classed("no-hover", !checked);
				d3.select(page).select(dom.datatypesNumber).text(_this.data.dataTypes.length-1); //undefined is not considered
                _this._saveSessionData();
            });

            ////////////////////

            d3.select(page).select(dom.datatypesNumber).text(_this.data.dataTypes.length-1); //undefined is not considered
            d3.select(page).select(dom.datatypesList).selectAll("*").remove();
            
            d3.select(page).select(dom.datatypesList).selectAll("li")
                .data(_this.data.dataTypes.filter(function(d){
                    if(d.name == "undefined") return false;
                    return !_this.iframe.datatype.contentWindow.SteinLib.autoCollectedDatatypes.includes(d.name);   
                }))
                .enter()
                .append("li")
                .append("a").attr("class", "badge badge-info").text(function(d){ return d.name})
                .attr("href", "#")
                .attr("data-toggle", "tooltip")
                .attr("data-placement", "top")
                .attr("title", "Edit")
                .on("click", function(d){
                    _this._openModalEditDatatype(d.name);       
                });
    }

    _openModalEditDatatype(datatypeName){
        let _this = this;
        let dom = _this.dom;
        let page = dom.pages.system;

        let d = _this.data.dataTypes.filter(function(e){ return e.name == datatypeName})[0];

        let modal = d3.select("#modal-datatype");
        modal.select(".modal-title").text(d.name);
                        
        modal.select("#input-function-tostring")
            .property("value", function(){
                if(d.toStringFunction == "") return "";
                let j0 = d.toStringFunction.indexOf("/*body-start*/") + "/*body-start>*/".length -1;
                let j1 = d.toStringFunction.indexOf("/*body-end*/");
                return d.toStringFunction.substr(j0, j1-j0);
            });
        modal.select("#tostring-lines-before-body").html(_this._toStringFunctionsDefaultLines().beforeBody.join("<br>"));
        modal.select("#tostring-lines-after-body").html(_this._toStringFunctionsDefaultLines().afterBody.join("<br>"));

        modal.select("#advanced").attr("aria-expanded", "true"); //collapse the function
        modal.select("#modal-function-tostring").attr("class", "collapse show");

        modal.select("#save").on("click", function(){
            d.toStringFunction = _this._toStringFunctionString(modal.select("#input-function-tostring").property("value"));
            _this._saveSessionData();
            _this._setPageContent(page);
            $('#modal-datatype').modal('hide');
        });

        modal.select("#delete")
        .classed("disabled", function(){
            //disabilitata se esiste un evento associato con questo datatype. non posso eliminarlo se prima non elimino l'evento
            return _this.data.events.map(function(e){ return e.dataType}).includes(d.name);  
        })
        .on("click", function(){
            if(_this.data.events.map(function(e){ return e.dataType}).includes(d.name)) return;
            for(let i=_this.data.dataTypes.length-1; i>=0; i--){
                if(_this.data.dataTypes[i].name == d.name){
                    _this.data.dataTypes.splice(i,1);
                        _this._saveSessionData();
                        _this._setPageContent(page);
                        $('#modal-datatype').modal('hide');
                        break;
                }
            }
        });

        $('#modal-datatype').modal('show');
    }
    
    _updateEventsList(){
        let _this = this;
        let dom = _this.dom;
        let page = dom.pages.catchEvents;
        let iframe = _this.iframe.events;

        /*
        let list = d3.keys(iframe.contentWindow.SteinLib.groupedAutoCollectedEvents).filter(function(d){
            return !_this.data.events.map(function(t){ return t.name}).includes(d);
        });
        */
       let list = d3.keys(iframe.contentWindow.SteinLib.groupedAutoCollectedEvents);

        
        d3.select(page).select("#detected-events-number").text(function(){
            if(list.length == 0) return "";
            else return list.length; 
        });

        d3.select(page).select(dom.eventsDetectedList).selectAll("*").remove();
        d3.select(page).select(dom.eventsDetectedList).selectAll("li")
            .data(list)
            .enter()
            .append("li")
            .append("a").attr("class", "badge badge-light")
            .attr("id", function(d){ return "event-" + d})
            .text(function(d){ return d})
            .attr("href", "#")
            .on("click", function(d){
                if(!_this.data.events.map(function(t){ return t.name}).includes(d)) return;
                _this._openModalEditEvent(d);
                //let e = iframe.contentWindow.SteinLib.groupedAutoCollectedEvents[d][0];
                //console.log(e);
            })
            .on("mouseover", function(d){
                let selector = iframe.contentWindow.SteinLib.groupedAutoCollectedEvents[d][0].elementsSelector;
                iframe.contentWindow.SteinLib.highlightElements(selector);
            })
            .on("mouseout", function(){
                iframe.contentWindow.SteinLib.deHighlightElements();
            })
            .select(function(){ return this.parentNode;})
            .append("input").attr("type", "checkbox")
            .property("checked", function(d){
                let checked = _this.data.events.map(function(t){ return t.name}).includes(d);
                d3.select("#event-" + d).classed("badge-info", checked).classed("badge-light", !checked).classed("no-hover", !checked);
                return checked; 
            })
            .on("change", function(d){
                let checked = d3.select(this).property("checked");
                if(checked){
                    let detectedEvent = iframe.contentWindow.SteinLib.groupedAutoCollectedEvents[d][0]; //prendo il primo del gruppo

                    //aggiungo il dadatype se non esiste
                    let datatypeFound = false;
                    for(let i=0; i<_this.data.dataTypes.length; i++){
                        if(_this.data.dataTypes[i].name == detectedEvent.datatype){
                            datatypeFound = true;
                            break;
                        }
                    }
                    if(!datatypeFound) _this.data.dataTypes.push({name: detectedEvent.datatype, toStringFunction: _this._toStringFunctionString()});

                    let e = {
                        type: detectedEvent.type,
                        name: d,
                        dataType: detectedEvent.datatype,
                        contributeToAnswer: "Yes",
                        specializeEvent: _this._selectorFunctionString(detectedEvent, _this._selectorFunctionsDefaultLines(detectedEvent).body.join("\n")),
                        traceData: _this._dataFunctionString(detectedEvent, _this._dataFunctionsDefaultLines(detectedEvent).body.join("\n")),
                        generator: detectedEvent.generator,
                    };

                    _this.data.events.push(e);
                }
                else{
                    for(let i=_this.data.events.length-1; i>=0; i--){
                        if(_this.data.events[i].name == d){
                            _this.data.events.splice(i, 1);
                            break;
                        }
                    }
                }
                d3.select("#event-" + d).classed("badge-info", checked).classed("badge-light", !checked).classed("no-hover", !checked);
				d3.select(page).select(dom.eventsNumber).text(_this.data.events.length);
                _this._saveSessionData();
            });
        
        /////
        d3.select(page).select(dom.eventsNumber).text(_this.data.events.length);
        d3.select(page).select(dom.eventsList).selectAll("*").remove();

        d3.select(page).select(dom.eventsList).selectAll("li")
                .data(_this.data.events.filter(function(d){
                    return !d3.keys(iframe.contentWindow.SteinLib.groupedAutoCollectedEvents).includes(d.name);   
                }))
                .enter()
                .append("li")
                .append("a").attr("class", "badge badge-info").text(function(d){ return d.name})//.style("display", "inline-block").style("width", "150px")
                .attr("href", "#")
                    .style("margin-left", "2em")
                    .attr("data-toggle", "tooltip")
                    .attr("data-placement", "top")
                    .attr("title", "Edit")
                    .on("click", function(d){
                        _this._openModalEditEvent(d.name);
                    });
    }

    _openModalEditEvent(eventName){
        let _this = this;
        let dom = _this.dom;
        let page = dom.pages.catchEvents;

        let d = _this.data.events.filter(function(e){ return e.name == eventName})[0];

        let modal = d3.select("#modal-event");
                        modal.select(".modal-title").text(d.name);
                        
                        let dataTypeInput = modal.select(dom.inputEventDatatype);
                        dataTypeInput.selectAll("*").remove();
                        _this.data.dataTypes.forEach(function(t){
                            dataTypeInput.append("option").property("value", t.name).text(t.name)
                                .property("selected", function(){
                                    if(t.name == d.dataType) return true;
                                })
                        });

                        let contributeInput = modal.select(dom.inputEventContributeToAnswer);
                        contributeInput.selectAll("*").remove();
                        ["No", "Yes"].forEach(function(t){
                            contributeInput.append("option").property("value", t).text(t)
                            .property("selected", function(){
                                if(t == d.contributeToAnswer) return true;
                            })
                        });

                        
                        let specializeFunction = modal.select("#input-function-specialize").property("value", d.specializeEvent);
                        let dataFunction = modal.select("#input-function-data").property("value", d.traceData);
                        
                      
                        modal.select("#properties").selectAll("*").remove();
                        modal.select("#properties").selectAll("li")
                            .data(d3.entries(d))
                            .enter()
                            .filter(function(x){ return x.key!="specializeEvent" && x.key!="traceData"})
                            .append("li")
                            .append("span").attr("class", "font-weight-500").text(function(x){ return x.key + " : "}).parent()
                            .append("span").text(function(x){ return x.value})
                        
                       

                        modal.select("#advanced").attr("aria-expanded", "flase"); //collapse the functions
                        modal.select("#modal-functions").attr("class", "collapse");

                        modal.select("#save").on("click", function(){
                            
                            d.dataType = dataTypeInput.property("value");
                            d.contributeToAnswer = contributeInput.property("value");
                            d.specializeEvent = specializeFunction.property("value");
                            d.traceData = dataFunction.property("value");
                            _this._saveSessionData();
                            _this._setPageContent(page);
                            $('#modal-event').modal('hide');
                        });

                        modal.select("#delete").on("click", function(){
                            for(let i=_this.data.events.length-1; i>=0; i--){
                                if(_this.data.events[i].name == d.name){
                                    _this.data.events.splice(i,1);
                                    _this._saveSessionData();
                                    _this._setPageContent(page);
                                    $('#modal-event').modal('hide');
                                }
                            }
                        });

                        $('#modal-event').modal('show');
    }
    

    _setPageContent(page, options){
        let _this = this;
        let dom = _this.dom;
        //if(_this.lastPage == page) 
        d3.select(page).style("opacity", 0);
        let bottomBar = d3.select(dom.bottomBar);
        /*

        SYSTEM

        */
        if(page == dom.pages.system){

            bottomBar.selectAll("*").remove();
            bottomBar.append("button").attr("class", "btn btn-secondary")
            .html("<i class='fas fa-sync-alt'></i> <small>Refresh System</small>")
            .on("click", function(){
                _this.systemLoaded = false;
                _this._setPageContent(page);
            });

            bottomBar.append("button").attr("class", "btn btn-success")
            .html("<small>Next Step</small>")
            .on("click", function(){
                d3.select("nav").selectAll(".nav-link").each(function(d, i){
                    if(d3.select(this).attr("page") == dom.pages.catchEvents.replace("#", "")){
                        d3.select(this).on("click").apply(this, d, i);
                    }
                });
            });
            
            if(!_this.systemLoaded){
                _this._showSystemLoading();
                let iframe = document.getElementById(_this.dom.systemIframe.replace("#", ""));
                _this.iframe.datatype = iframe;

                
                _this.stein.setIframeContent(_this.dom.systemIframe.replace("#", ""), _this.data.systemUrl, _this.eventsScript);
                
                d3.select(_this.dom.systemIframe).on("load", function(){
                    _this.systemLoaded = true;
                    
                    _this.stein.watchEvents(iframe.contentWindow, function(e){
                        _this._onEvent(e, page)
                    });


                    _this._updateDatatypesList();
                    

                    _this.stein.watcher(iframe.contentWindow.SteinLib, "lastAutoCollectedDatatype", function(x){
                        _this._updateDatatypesList();
                    });
                    

                    _this._removeSystemLoading();
                });   
            }
            else{
                _this._updateDatatypesList();
            }
  
                
        }
        /*

        CATCH EVENTS PAGE

        */
        if(page == dom.pages.catchEvents){

            bottomBar.selectAll("*").remove();
            bottomBar.append("button").attr("class", "btn btn-secondary")
            .html("<i class='fas fa-sync-alt'></i> <small>Refresh System</small>")
            .on("click", function(){
                _this.systemLoadedCatchPage = false;
                _this._setPageContent(page);
            });

            bottomBar.append("button").attr("class", "btn btn-success")
            .html("<small>Next Step</small>")
            .on("click", function(){
                d3.select("nav").selectAll(".dropdown-item").each(function(d, i){
                    if(d3.select(this).attr("page") == dom.pages.initialQuestions.replace("#", "")){
                        d3.select(this).on("click").apply(this, d, i);
                    }
                });
            });

            if(!_this.systemLoadedCatchPage){
                _this._showSystemLoadingCatch();
                let iframe = document.getElementById(_this.dom.systemIframeCatch.replace("#", ""));
                _this.iframe.events = iframe;

                
                _this.stein.setIframeContent(_this.dom.systemIframeCatch.replace("#", ""), _this.data.systemUrl, _this.eventsScript);
                d3.select(_this.dom.systemIframeCatch).on("load", function(){
                    _this.systemLoadedCatchPage = true;
                    _this.stein.watchEvents(iframe.contentWindow, function(e){
                        _this._onEventCatchPage(e, page)
                    });

                    _this._updateEventsList();

                    _this.stein.watcher(iframe.contentWindow.SteinLib, "lastGroupedAutoCollectedEvent", function(x){
                        _this._updateEventsList();
                    });

                    _this._removeSystemLoadingCatch();
                });
                

                d3.select("#cattura").on("click", function(){
                    console.log(iframe.contentWindow.SteinLib.autoCollectedEvents)
                })
            }
            else{
                _this._updateEventsList();
            } 
        }
        /*

        INITIAL QUESTIONS

        */
        if(page == dom.pages.initialQuestions){

            bottomBar.selectAll("*").remove();

            if(_this.data.initialQuestions.length != 0){
                bottomBar.append("button").attr("class", "btn btn-secondary")
                .html("<i class='fa fa-eye'></i> <small>Preview</small>")
                .on("click", function(){
                    _this._initialQuestionPreview(false);
                });
            }
            

            bottomBar.append("button").attr("class", "btn btn-success")
            .html("<small>Next Step</small>")
            .on("click", function(){
                d3.select("nav").selectAll(".dropdown-item").each(function(d, i){
                    if(d3.select(this).attr("page") == dom.pages.systemQuestions.replace("#", "")){
                        d3.select(this).on("click").apply(this, d, i);
                    }
                });
            });

            if(_this.data.initialQuestions.length == 0){
                _this.data.initialQuestions.push({
                    id: _this.data.initialQuestions.length + 1,
                    text: "What is your age ?",
                    responseType: SteinInitialQuestion.ResponseType.MultipleChoice,
                    options: ["Under 18", "18-24", "25-34", "35-44", "45-54","More than 54"],
                    images: [],
                    mandatory: true
                });
                
                _this.data.initialQuestions.push({
                    id: _this.data.initialQuestions.length + 1,
                    text: "Select your gender:",
                    responseType: SteinInitialQuestion.ResponseType.MultipleChoice,
                    options: ["Male","Female"],
                    images: [],
                    mandatory: true
                });
                
                _this._saveSessionData();
            }



            let responseTypes = d3.entries(SteinInitialQuestion.ResponseType);

            d3.select(page).select(".add-question-button")
                .on("click", function(){
                    _this.data.initialQuestions.push({
                        id: _this.data.initialQuestions.length + 1,
                        text: "",
                        responseType: SteinInitialQuestion.ResponseType.SmallText,
                        options: [],
                        images: [],
                        mandatory: true
                    });
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });

            let container = d3.select(page).select(".container.container-questions");
            container.selectAll(".dynamic").remove();
            let template = container.select("#initial-question-template").html();
            for(let i=0; i<_this.data.initialQuestions.length; i++){
                let row = container.selectAll("dynamic")
                    .data([_this.data.initialQuestions[i]])
                    .enter()
                    .append("div")
                    .attr("class", function(d){ return "row dynamic question-" + d.id})
                    .style("padding-top", "3em").style("display", null)
                    .html(template);

                row.select(".question-name").text(function(d){ return "Question " + d.id});
                row.select(".question-button-test").on("click", function(d){
                    console.log(d);
                });
                row.select(".question-up")
                .style("display", function(d){
                    if(i==0) return "none";
                    else return null;
                }).on("click", function(d){
                    
                    _this.data.initialQuestions.swap(i, i-1);
                    for(let j=0; j<_this.data.initialQuestions.length; j++){
                        _this.data.initialQuestions[j].id = j+1;
                    }
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });
                row.select(".question-down")
                .style("display", function(d){
                    if(i==_this.data.initialQuestions.length-1) return "none";
                    else return null;
                })
                .on("click", function(d){
                    if(i==_this.data.initialQuestions.length-1) return;
                    _this.data.initialQuestions.swap(i, i+1);
                    for(let j=0; j<_this.data.initialQuestions.length; j++){
                        _this.data.initialQuestions[j].id = j+1;
                    }
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });
                row.select(".question-delete").on("click", function(d){
                    _this.data.initialQuestions.splice(i,1);
                    for(let j=0; j<_this.data.initialQuestions.length; j++){
                        _this.data.initialQuestions[j].id = j+1;
                    }
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });
                row.select(".question-text").on("keyup", function(d){
                    d.text = d3.select(this).property("value");
                    _this._saveSessionData();
                })
                .property("value", function(d){ return d.text; });
                //response type
                row.select(".question-response-type")
                .html( function(d){
                    let str = "";
                    responseTypes.forEach(function(t){
                        let sel = t.value === d.responseType ? "selected" : "";
                        str += "<option value='" + t.value + "' " + sel + ">" + t.key + "</option>";
                    });
                    return str;
                })
                .on("change", function(d){
                    let val = d3.select(this).property("value");
                    d.responseType = val;
                   _this._saveSessionData();
                   let allTypes = SteinInitialQuestion.ResponseType;
                    let types = [allTypes.MultipleChoice, allTypes.ImageMultipleChoice, allTypes.CheckBoxes, allTypes.ImageCheckBoxes];
                    if(types.includes(val)){  
                        row.select(".options").style("display", null);
                        
                        if(val == allTypes.ImageMultipleChoice || val == allTypes.ImageCheckBoxes){
                            row.select(".images").style("display", null);
                        } else row.select(".images").style("display", "none");
                    }
                   else{
                       row.select(".options").style("display", "none");
                       row.select(".images").style("display", "none");
                    }
                });
                
                //options
                row.select(".options").style("display", function(d){  
                    let allTypes = SteinInitialQuestion.ResponseType;
                    let types = [allTypes.MultipleChoice, allTypes.ImageMultipleChoice, allTypes.CheckBoxes, allTypes.ImageCheckBoxes];
                    if(types.includes(d.responseType)) return null;
                    else return "none";
                });
                row.select(".question-options").on("keyup", function(d){
                    let values = d3.select(this).property("value").split("\n");
                    for(let i=values.length-1; i>=0; i--){
                        if(values[i] === "") values.splice(i,1);
                    }
                    d.options = values;
                    _this._saveSessionData();
                })
                .property("value", function(d){ return d.options.join("\n"); });
                //images
                row.select(".images").style("display", function(d){
                    let allTypes = SteinInitialQuestion.ResponseType;
                    let types = [allTypes.ImageMultipleChoice, allTypes.ImageCheckBoxes];
                    if(types.includes(d.responseType)) return null;
                    else return "none";
                });
                row.select(".question-images").on("keyup", function(d){
                    let values = d3.select(this).property("value").split("\n");
                    for(let i=values.length-1; i>=0; i--){
                        if(values[i] === "") values.splice(i,1);
                    }
                    d.images = values;
                    _this._saveSessionData();
                })
                .property("value", function(d){ return d.images.join("\n"); });
            }
        }
        /*

        FINAL QUESTIONS

        */
        if(page == dom.pages.finalQuestions){


            bottomBar.selectAll("*").remove();

            if(_this.data.finalQuestions.length != 0){
                bottomBar.append("button").attr("class", "btn btn-secondary")
                .html("<i class='fa fa-eye'></i> <small>Preview</small>")
                .on("click", function(){
                    _this._finalQuestionPreview(false);
                });
            }

            bottomBar.append("button").attr("class", "btn btn-success")
            .html("<small>Next Step</small>")
            .on("click", function(){
                d3.select("nav").selectAll(".nav-link").each(function(d, i){
                    if(d3.select(this).attr("page") == dom.pages.initialQuestionsTest.replace("#", "")){
                        d3.select(this).on("click").apply(this, d, i);
                    }
                });
            });


            let responseTypes = d3.entries(SteinFinalQuestion.ResponseType);

            if(_this.data.finalQuestions.length == 0){
                
                _this.data.finalQuestions.push({
                    id: _this.data.finalQuestions.length + 1,
                    text: "Please provide us additional comments if you have any.",
                    responseType: SteinFinalQuestion.ResponseType.LargeText,
                    options: [],
                    images: [],
                    mandatory: true
                });
                
                _this._saveSessionData();
            }

            d3.select(page).select(".add-question-button")
                .on("click", function(){
                    _this.data.finalQuestions.push({
                        id: _this.data.finalQuestions.length + 1,
                        text: "",
                        responseType: SteinFinalQuestion.ResponseType.SmallText,
                        options: [],
                        images: [],
                        mandatory: true
                    });
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });

            let container = d3.select(page).select(".container.container-questions");
            container.selectAll(".dynamic").remove();
            let template = container.select("#final-question-template").html();
            for(let i=0; i<_this.data.finalQuestions.length; i++){
                let row = container.selectAll("dynamic")
                    .data([_this.data.finalQuestions[i]])
                    .enter()
                    .append("div")
                    .attr("class", function(d){ return "row dynamic question-" + d.id})
                    .style("padding-top", "3em").style("display", null)
                    .html(template);

                row.select(".question-name").text(function(d){ return "Question " + d.id});
                row.select(".question-button-test").on("click", function(d){
                    console.log(d);
                });
                row.select(".question-up")
                .style("display", function(d){
                    if(i==0) return "none";
                    else return null;
                }).on("click", function(d){
                    
                    _this.data.finalQuestions.swap(i, i-1);
                    for(let j=0; j<_this.data.finalQuestions.length; j++){
                        _this.data.finalQuestions[j].id = j+1;
                    }
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });
                row.select(".question-down")
                .style("display", function(d){
                    if(i==_this.data.finalQuestions.length-1) return "none";
                    else return null;
                })
                .on("click", function(d){
                    if(i==_this.data.finalQuestions.length-1) return;
                    _this.data.finalQuestions.swap(i, i+1);
                    for(let j=0; j<_this.data.finalQuestions.length; j++){
                        _this.data.finalQuestions[j].id = j+1;
                    }
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });
                row.select(".question-delete").on("click", function(d){
                    _this.data.finalQuestions.splice(i,1);
                    for(let j=0; j<_this.data.finalQuestions.length; j++){
                        _this.data.finalQuestions[j].id = j+1;
                    }
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });
                row.select(".question-text").on("keyup", function(d){
                    d.text = d3.select(this).property("value");
                    _this._saveSessionData();
                })
                .property("value", function(d){ return d.text; });
                //response type
                row.select(".question-response-type")
                .html( function(d){
                    let str = "";
                    responseTypes.forEach(function(t){
                        let sel = t.value === d.responseType ? "selected" : "";
                        str += "<option value='" + t.value + "' " + sel + ">" + t.key + "</option>";
                    });
                    return str;
                })
                .on("change", function(d){
                    let val = d3.select(this).property("value");
                    d.responseType = val;
                   _this._saveSessionData();
                   let allTypes = SteinFinalQuestion.ResponseType;
                    let types = [allTypes.MultipleChoice, allTypes.ImageMultipleChoice, allTypes.CheckBoxes, allTypes.ImageCheckBoxes];
                    if(types.includes(val)){  
                        row.select(".options").style("display", null);
                        
                        if(val == allTypes.ImageMultipleChoice || val == allTypes.ImageCheckBoxes){
                            row.select(".images").style("display", null);
                        } else row.select(".images").style("display", "none");
                    }
                   else{
                       row.select(".options").style("display", "none");
                       row.select(".images").style("display", "none");
                    }
                });
                
                //options
                row.select(".options").style("display", function(d){  
                    let allTypes = SteinFinalQuestion.ResponseType;
                    let types = [allTypes.MultipleChoice, allTypes.ImageMultipleChoice, allTypes.CheckBoxes, allTypes.ImageCheckBoxes];
                    if(types.includes(d.responseType)) return null;
                    else return "none";
                });
                row.select(".question-options").on("keyup", function(d){
                    let values = d3.select(this).property("value").split("\n");
                    for(let i=values.length-1; i>=0; i--){
                        if(values[i] === "") values.splice(i,1);
                    }
                    d.options = values;
                    _this._saveSessionData();
                })
                .property("value", function(d){ return d.options.join("\n"); });
                //images
                row.select(".images").style("display", function(d){
                    let allTypes = SteinFinalQuestion.ResponseType;
                    let types = [allTypes.ImageMultipleChoice, allTypes.ImageCheckBoxes];
                    if(types.includes(d.responseType)) return null;
                    else return "none";
                });
                row.select(".question-images").on("keyup", function(d){
                    let values = d3.select(this).property("value").split("\n");
                    for(let i=values.length-1; i>=0; i--){
                        if(values[i] === "") values.splice(i,1);
                    }
                    d.images = values;
                    _this._saveSessionData();
                })
                .property("value", function(d){ return d.images.join("\n"); });
            }
        }
        /*

        SYSTEM QUESTIONS

        */
        if(page == dom.pages.systemQuestions){

            bottomBar.selectAll("*").remove();

            bottomBar.append("button").attr("class", "btn btn-success")
            .html("<small>Next Step</small>")
            .on("click", function(){
                d3.select("nav").selectAll(".dropdown-item").each(function(d, i){
                    if(d3.select(this).attr("page") == dom.pages.finalQuestions.replace("#", "")){
                        d3.select(this).on("click").apply(this, d, i);
                    }
                });
            });



            let responseTypes = d3.entries(SteinSystemQuestion.ResponseType);


            d3.select(page).select(".add-question-button")
                .on("click", function(){
                    _this.data.systemQuestions.push({
                        id: _this.data.systemQuestions.length + 1,
                        text: "",
                        responseType: SteinSystemQuestion.ResponseType.UserInteractionList,
                        options: [],
                        images: [],
                        dataType: "undefined",
                        beforeFunction: _this._beforeFunctionString(_this._beforeFunctionDefaultLines().body.join("\n")),
                        afterFunction: _this._afterFunctionString(),
                        mandatory: true,
                        trackMouse: false,
                        trackMouseInterval: 200
                    });
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });

            let container = d3.select(page).select(".container.container-questions");
            container.selectAll(".dynamic").remove();
            let template = container.select("#system-question-template").html();
            for(let i=0; i<_this.data.systemQuestions.length; i++){
                let row = container.selectAll("dynamic")
                    .data([_this.data.systemQuestions[i]])
                    .enter()
                    .append("div")
                    .attr("class", function(d){ return "row dynamic question-" + d.id})
                    .style("padding-top", "3em").style("display", null)
                    .html(template);

                row.select(".question-name").text(function(d){ return "Question " + d.id});
                row.select(".question-button-test").on("click", function(d){
                    _this._systemQuestionPreview(d, false);
                });
                row.select(".question-up")
                .style("display", function(d){
                    if(i==0) return "none";
                    else return null;
                }).on("click", function(d){
                    
                    _this.data.systemQuestions.swap(i, i-1);
                    for(let j=0; j<_this.data.systemQuestions.length; j++){
                        _this.data.systemQuestions[j].id = j+1;
                    }
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });
                row.select(".question-down")
                .style("display", function(d){
                    if(i==_this.data.systemQuestions.length-1) return "none";
                    else return null;
                })
                .on("click", function(d){
                    if(i==_this.data.systemQuestions.length-1) return;
                    _this.data.systemQuestions.swap(i, i+1);
                    for(let j=0; j<_this.data.systemQuestions.length; j++){
                        _this.data.systemQuestions[j].id = j+1;
                    }
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });
                row.select(".question-delete").on("click", function(d){
                    _this.data.systemQuestions.splice(i,1);
                    for(let j=0; j<_this.data.systemQuestions.length; j++){
                        _this.data.systemQuestions[j].id = j+1;
                    }
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });
                row.select(".question-text").on("keyup", function(d){
                    d.text = d3.select(this).property("value");
                    _this._saveSessionData();
                })
                .property("value", function(d){ return d.text; });
                //response type
                row.select(".question-response-type")
                .html( function(d){
                    let str = "";
                    responseTypes.forEach(function(t){
                        let sel = t.value === d.responseType ? "selected" : "";
                        str += "<option value='" + t.value + "' " + sel + ">" + t.key + "</option>";
                    });
                    return str;
                })
                .on("change", function(d){
                    let val = d3.select(this).property("value");
                    d.responseType = val;
                   _this._saveSessionData();
                   let allTypes = SteinSystemQuestion.ResponseType;
                    let types = [allTypes.MultipleChoice, allTypes.ImageMultipleChoice, allTypes.CheckBoxes, allTypes.ImageCheckBoxes];
                    if(types.includes(val)){  
                        row.select(".options").style("display", null);
                        
                        if(val == allTypes.ImageMultipleChoice || val == allTypes.ImageCheckBoxes){
                            row.select(".images").style("display", null);
                        } else row.select(".images").style("display", "none");
                    }
                   else{
                       row.select(".options").style("display", "none");
                       row.select(".images").style("display", "none");
                    }
                
                   if(val === SteinSystemQuestion.ResponseType.UserInteractionList || val === SteinSystemQuestion.ResponseType.UserInteractionSingleResponse) row.select(".datatype").style("display", null);
                   else row.select(".datatype").style("display", "none");

                });
                //datatype
                row.select(".datatype").style("display", function(d){  
                    if(d.responseType === SteinSystemQuestion.ResponseType.UserInteractionList || d.responseType === SteinSystemQuestion.ResponseType.UserInteractionSingleResponse) return null;
                    else return "none";
                });
                row.select(".question-data-type").html( function(d){
                    let str = "";
                    _this.data.dataTypes.forEach(function(t){
                        let sel = t.name === d.dataType ? "selected" : "";
                        str += "<option value='" + t.name + "' " + sel + ">" + t.name + "</option>";
                    });
                    return str;
                })
                .on("change", function(d){
                    let val = d3.select(this).property("value");
                    d.dataType = val;
                   _this._saveSessionData();
                })
                //options
                row.select(".options").style("display", function(d){  
                    let allTypes = SteinSystemQuestion.ResponseType;
                    let types = [allTypes.MultipleChoice, allTypes.ImageMultipleChoice, allTypes.CheckBoxes, allTypes.ImageCheckBoxes];
                    if(types.includes(d.responseType)) return null;
                    else return "none";
                });
                row.select(".question-options").on("keyup", function(d){
                    let values = d3.select(this).property("value").split("\n");
                    for(let i=values.length-1; i>=0; i--){
                        if(values[i] === "") values.splice(i,1);
                    }
                    d.options = values;
                    _this._saveSessionData();
                })
                .property("value", function(d){ return d.options.join("\n"); });
                //images
                row.select(".images").style("display", function(d){
                    let allTypes = SteinSystemQuestion.ResponseType;
                    let types = [allTypes.ImageMultipleChoice, allTypes.ImageCheckBoxes];
                    if(types.includes(d.responseType)) return null;
                    else return "none";
                });
                row.select(".question-images").on("keyup", function(d){
                    let values = d3.select(this).property("value").split("\n");
                    for(let i=values.length-1; i>=0; i--){
                        if(values[i] === "") values.splice(i,1);
                    }
                    d.images = values;
                    _this._saveSessionData();
                })
                .property("value", function(d){ return d.images.join("\n"); });
                //before function
                /*
                row.select(".question-before-function").on("keyup", function(d){
                    d.beforeFunction = d3.select(this).property("value");
                    _this._saveSessionData();
                })
                .property("value", function(d){ return d.beforeFunction; });
                */
                row.select(".question-before-function").property("value", function(d){
                    if(d.beforeFunction == "") return "";
                    let j0 = d.beforeFunction.indexOf("/*body-start*/") + "/*body-start>*/".length - 1;
                    let j1 = d.beforeFunction.indexOf("/*body-end*/");
                    return d.beforeFunction.substr(j0, j1-j0);
                })
                .on("keyup", function(d){
                    d.beforeFunction = _this._beforeFunctionString(d3.select(this).property("value"));
                    _this._saveSessionData();
                });
                //after function
                row.select(".question-after-function").property("value", function(d){
                    if(d.afterFunction == "") return "";
                    let j0 = d.afterFunction.indexOf("/*body-start*/") + "/*body-start>*/".length - 1;
                    let j1 = d.afterFunction.indexOf("/*body-end*/");
                    return d.afterFunction.substr(j0, j1-j0);
                })
                .on("keyup", function(d){
                    d.afterFunction = _this._afterFunctionString(d3.select(this).property("value"));
                    _this._saveSessionData();
                })
                .property("value", function(d){ return d.afterFunction; });
                //button functions
                row.select(".question-button-functions")
                    //.attr("aria-controls", function(d){ return "before-container-" + d.id + " after-container-" + d.id})
                    .attr("data-target", function(d){ return ".collapse-" + d.id});
                row.select(".before-container").attr("class", function(d){return "collapse multi-collapse before-container collapse-" + d.id});
                row.select( ".after-container").attr("class", function(d){return "collapse multi-collapse after-container collapse-" + d.id});

            }
        }
        /*

        INITIAL QUESTIONS TEST PAGE

        */
        if(page == dom.pages.initialQuestionsTest){

            let globalPreview = true;
            if(options != undefined && options.hasOwnProperty("globalPreview")) globalPreview = options.globalPreview;
            
            
            bottomBar.selectAll("*").remove();

            if(!globalPreview){
                bottomBar.append("button").attr("class", "btn btn-secondary")
                .html("<i class='fa fa-undo'></i> <small>Return to Design</small>")
                .on("click", function(){
                    d3.select("nav").selectAll(".dropdown-item").each(function(d, i){
                        if(d3.select(this).attr("page") == dom.pages.initialQuestions.replace("#", "")){
                            d3.select(this).on("click").apply(this, d, i);
                        }
                    });
                });
            }
            else{
                bottomBar.append("button").attr("class", "btn btn-success")
                .html("<small>Continue</small>")
                .on("click", function(){
                    _this._systemQuestionPreview(undefined, globalPreview);
                }); 
            }
            
            
            
            let container = d3.select(page).select(".container");
            container.selectAll("*").remove();
            
            container.selectAll(".row")
                .data(_this.data.initialQuestions)
                .enter()
                .append("div").attr("class", "row justify-content-center").attr("id", function(d){ return "question-" + d.id})
                .append("div").attr("class", "col-8")
                .append("div").attr("class", "card")
                .append("div").attr("class", "card-header")
                .append("small").attr("class", "font-weight-500").text(function(d){ return "Question " + d.id}).parent()
                .append("br").parent()
                .append("span").text(function(d){ return d.text}).parent()
                .parent()
                .append("div").attr("class", "card-body")
                
                .each(function(d){
                    if(d.responseType == SteinInitialQuestion.ResponseType.SmallText){
                        d3.select(this).appendSmallTextInput();
                    }
                    if(d.responseType == SteinInitialQuestion.ResponseType.LargeText){
                        d3.select(this).appendLargeTextInput()
                    }
                    if(d.responseType == SteinInitialQuestion.ResponseType.MultipleChoice){
                        d3.select(this).appendMultipleChoiceInput(d.options)
                    }
                    if(d.responseType == SteinInitialQuestion.ResponseType.CheckBoxes){
                        d3.select(this).appendCheckboxesInput(d.options)
                    }
                    if(d.responseType == SteinInitialQuestion.ResponseType.ImageMultipleChoice){
                        d3.select(this).appendImageMultipleChoiceInput(d.options, d.images)
                    }
                    if(d.responseType == SteinInitialQuestion.ResponseType.ImageCheckBoxes){
                        d3.select(this).appendImageCheckboxesInput(d.options, d.images)
                    }
                });

        }
        /*

        SYSTEM QUESTIONS TEST PAGE

        */
        if(page == dom.pages.systemQuestionsTest){
            
            let globalPreview = true;
            if(options != undefined && options.hasOwnProperty("globalPreview")) globalPreview = options.globalPreview;

            bottomBar.selectAll("*").remove();
            if(!globalPreview){
                bottomBar.append("button").attr("class", "btn btn-secondary")
                .html("<i class='fa fa-undo'></i> <small>Return to Design</small>")
                .on("click", function(){
                    d3.select("nav").selectAll(".dropdown-item").each(function(d, i){
                        if(d3.select(this).attr("page") == dom.pages.systemQuestions.replace("#", "")){
                            d3.select(this).on("click").apply(this, d, i);
                        }
                    });
                });
            }
            else{
                bottomBar.append("button").attr("class", "btn btn-secondary")
                .html("<small>Back to Initial Questions</small>")
                .on("click", function(){
                    _this._initialQuestionPreview(globalPreview);
                });
                bottomBar.append("button").attr("class", "btn btn-success")
                .html("<small>Skip to Final Questions</small>")
                .on("click", function(){
                    _this._finalQuestionPreview(globalPreview);
                }); 
            }



            if(_this.data.systemQuestions.length == 0){
                alert("No questions to show!");
                return;
            }
            let questionIndex = 0;
            if(options != undefined && options.hasOwnProperty("questionIndex")) questionIndex = options.questionIndex;
            let question = _this.data.systemQuestions[questionIndex];
            let response = []; //used for autocomputed list
            
            let pageDiv = d3.select(page);
            pageDiv.select("#question-name").selectAll("*").remove();
            pageDiv.select("#question-text").selectAll("*").remove();
            pageDiv.select("#question-response").selectAll("*").remove();
            pageDiv.select("#btn-prev-system-question").style("display", "none");
            pageDiv.select("#btn-next-system-question").style("display", "none");

            _this._showSystemLoadingPreview();
            let iframe = document.getElementById(_this.dom.systemIframePreview.replace("#", ""));
            _this.stein.setIframeContent(_this.dom.systemIframePreview.replace("#", ""), _this.data.systemUrl, _this.eventsScript);
            
            
            d3.select(_this.dom.systemIframePreview).on("load", function(){
                d3.select("body").on("SteinLibEventSystemLoaded", function(){
                    //print question
                    pageDiv.select("#question-name").text("Question " + question.id);
                    pageDiv.select("#question-text").append("p").text(question.text);

                    if(questionIndex != 0 && globalPreview){
                        pageDiv.select("#btn-prev-system-question")
                            .style("display", null)
                            .on("click", function(){
                                _this._setPageContent(page, {questionIndex: questionIndex-1})
                            });
                    }

                    if(globalPreview){
                        pageDiv.select("#btn-next-system-question")
                            .style("display", null)
                            .on("click", function(){
                                if(questionIndex != _this.data.systemQuestions.length-1) _this._setPageContent(page, {questionIndex: questionIndex+1});
                                else _this._finalQuestionPreview(globalPreview);
                            });
                    }

                     
                    
                    pageDiv.select("#question-response")
                        .selectAll(".col-12")
                        .data([question])
                        .enter()
                        .append("div").attr("class", "col-12")
                        .each(function(d){
                            if(d.responseType == SteinSystemQuestion.ResponseType.SmallText){
                                d3.select(this).appendSmallTextInput();
                            }
                            if(d.responseType == SteinSystemQuestion.ResponseType.LargeText){
                                d3.select(this).appendLargeTextInput()
                            }
                            if(d.responseType == SteinSystemQuestion.ResponseType.MultipleChoice){
                                d3.select(this).appendMultipleChoiceInput(d.options)
                            }
                            if(d.responseType == SteinSystemQuestion.ResponseType.CheckBoxes){
                                d3.select(this).appendCheckboxesInput(d.options)
                            }
                            if(d.responseType == SteinSystemQuestion.ResponseType.ImageMultipleChoice){
                                d3.select(this).appendImageMultipleChoiceInput(d.options, d.images)
                            }
                            if(d.responseType == SteinSystemQuestion.ResponseType.ImageCheckBoxes){
                                d3.select(this).appendImageCheckboxesInput(d.options, d.images)
                            }
                            if(d.responseType == SteinSystemQuestion.ResponseType.UserInteractionList){
                                let div = d3.select(this);
                                //set listener on events that contribure to answer and have the same datatype of the question
                                _this.stein.watchEvents(iframe.contentWindow, function(event){
                                    let e = _this.stein.parseEvent(event, page);
                                    if(e == null) return;

                                    for(let i=0; i<_this.data.events.length; i++){
                                        let tracedEvent = _this.data.events[i];
                                        if(tracedEvent.contributeToAnswer != "Yes" || tracedEvent.dataType != d.dataType) continue;
                                        //check selector
                                        let fSelector = tracedEvent.specializeEvent + ".call(this, " + JSON.stringify(e) + ");";
                                        let resultSelector = iframe.contentWindow.eval(fSelector);
                                        //console.log(fSelector, e, resultSelector);
                                        if(resultSelector != true) continue;
                                        
                                        //retrieve data
                                       let fData = tracedEvent.traceData + ".call(this, " + JSON.stringify(e) + ");";
                                       let resultData = iframe.contentWindow.eval(fData);
                                       if(!Array.isArray(resultData)) resultData = [resultData];
                                       
                                       

                                       let datatypeToStringFunction = null;
                                       for(let j=0; j<_this.data.dataTypes.length; j++){
                                           if(_this.data.dataTypes[j].name == tracedEvent.dataType){
                                               datatypeToStringFunction = JSON.parse(JSON.stringify(_this.data.dataTypes[j])).toStringFunction;
                                               break;
                                           }
                                       }

                                       
                                       resultData = resultData.map(function(x){
                                           return iframe.contentWindow.eval(datatypeToStringFunction + ".call(this, " + JSON.stringify(x) + ")");
                                       });


                                        
                                        if(!Array.isArray(resultData)) resultData = [resultData];
                                        //console.log(resultData);
                                        for(let k=resultData.length-1; k>=0; k--){
                                            for(let j=response.length; j>=0; j--){
                                                if(response[j] == resultData[k]){
                                                    resultData.splice(k,1);
                                                    response.splice(j,1);
                                                }
                                            }
                                        }
                                        response = response.concat(resultData);
                                        div.selectAll("*").remove();
                                        div.appendSortableList(response);
                                        break;
                                    }
                                }); 
                            }
                            if(d.responseType == SteinSystemQuestion.ResponseType.UserInteractionSingleResponse){
                                let div = d3.select(this);
                                //set listener on events that contribure to answer and have the same datatype of the question
                                _this.stein.watchEvents(iframe.contentWindow, function(event){
                                    let e = _this.stein.parseEvent(event, page);
                                    if(e == null) return;

                                    

                                    for(let i=0; i<_this.data.events.length; i++){
                                        let tracedEvent = _this.data.events[i];
                                        if(tracedEvent.contributeToAnswer != "Yes" || tracedEvent.dataType != d.dataType) continue;
                                        //check selector
                                        let fSelector = tracedEvent.specializeEvent + ".call(this, " + JSON.stringify(e) + ");";
                                        let resultSelector = iframe.contentWindow.eval(fSelector);
                                        console.log(fSelector, e, resultSelector);
                                        
                                        if(resultSelector != true) continue;
                                        //retrieve data
                                        let fData = tracedEvent.traceData + ".call(this, " + JSON.stringify(e) + ");";
                                        let resultData = iframe.contentWindow.eval(fData);
                                        if(!Array.isArray(resultData)) resultData = [resultData];
                                        
                                        

                                        let datatypeToStringFunction = null;
                                        for(let j=0; j<_this.data.dataTypes.length; j++){
                                            if(_this.data.dataTypes[j].name == tracedEvent.dataType){
                                                datatypeToStringFunction = JSON.parse(JSON.stringify(_this.data.dataTypes[j])).toStringFunction;
                                                break;
                                            }
                                        }

                                        
                                        resultData = resultData.map(function(x){
                                            return iframe.contentWindow.eval(datatypeToStringFunction + ".call(this, " + JSON.stringify(x) + ")");
                                        });
                                        

                                        
                                        div.selectAll("*").remove();
                                        div.appendSortableList(resultData);
                                        break;
                                    }
                                }); 
                            }
                        });

                    
                    _this._removeSystemLoadingPreview();
                });
                iframe.contentWindow.eval(question.beforeFunction + ".call(this)"); 
            });
        }
        /*

        FINAL QUESTIONS TEST PAGE

        */
        if(page == dom.pages.finalQuestionsTest){

            let globalPreview = true;
            if(options != undefined && options.hasOwnProperty("globalPreview")) globalPreview = options.globalPreview;

            bottomBar.selectAll("*").remove();
            if(!globalPreview){
                bottomBar.append("button").attr("class", "btn btn-secondary")
                .html("<i class='fa fa-undo'></i> <small>Return to Design</small>")
                .on("click", function(){
                    d3.select("nav").selectAll(".dropdown-item").each(function(d, i){
                        if(d3.select(this).attr("page") == dom.pages.finalQuestions.replace("#", "")){
                            d3.select(this).on("click").apply(this, d, i);
                        }
                    });
                });
            }
            else{
                bottomBar.append("button").attr("class", "btn btn-secondary")
                .html("<small>Back to System Questions</small>")
                .on("click", function(){
                    _this._systemQuestionPreview(_this.data.systemQuestions[_this.data.systemQuestions.length-1], globalPreview);
                });
                bottomBar.append("button").attr("class", "btn btn-success")
                .html("<small>Terminate preview</small>")
                .on("click", function(){
                    d3.select("nav").selectAll(".nav-link").each(function(d, i){
                        if(d3.select(this).attr("page") == dom.pages.save.replace("#", "")){
                            d3.select(this).on("click").apply(this, d, i);
                        }
                    });
                }); 
            }

            /*
            bottomBar.selectAll("*").remove();
            bottomBar.append("button").attr("class", "btn btn-secondary")
            .html("<i class='fa fa-undo'></i> <small>Return to Design</small>")
            .on("click", function(){
                d3.select("nav").selectAll(".dropdown-item").each(function(d, i){
                    if(d3.select(this).attr("page") == dom.pages.finalQuestions.replace("#", "")){
                        d3.select(this).on("click").apply(this, d, i);
                    }
                });
            });
            */

            let container = d3.select(page).select(".container");
            container.selectAll("*").remove();
            
            container.selectAll(".row")
                .data(_this.data.finalQuestions)
                .enter()
                .append("div").attr("class", "row justify-content-center").attr("id", function(d){ return "question-" + d.id})
                .append("div").attr("class", "col-8")
                .append("div").attr("class", "card")
                .append("div").attr("class", "card-header")
                .append("small").attr("class", "font-weight-500").text(function(d){ return "Question " + d.id}).parent()
                .append("br").parent()
                .append("span").text(function(d){ return d.text}).parent()
                .parent()
                .append("div").attr("class", "card-body")
                
                .each(function(d){
                    if(d.responseType == SteinFinalQuestion.ResponseType.SmallText){
                        d3.select(this).appendSmallTextInput();
                    }
                    if(d.responseType == SteinFinalQuestion.ResponseType.LargeText){
                        d3.select(this).appendLargeTextInput()
                    }
                    if(d.responseType == SteinFinalQuestion.ResponseType.MultipleChoice){
                        d3.select(this).appendMultipleChoiceInput(d.options)
                    }
                    if(d.responseType == SteinFinalQuestion.ResponseType.CheckBoxes){
                        d3.select(this).appendCheckboxesInput(d.options)
                    }
                    if(d.responseType == SteinFinalQuestion.ResponseType.ImageMultipleChoice){
                        d3.select(this).appendImageMultipleChoiceInput(d.options, d.images)
                    }
                    if(d.responseType == SteinFinalQuestion.ResponseType.ImageCheckBoxes){
                        d3.select(this).appendImageCheckboxesInput(d.options, d.images)
                    }
                });

        }
        /*

        save-page

        */
        if(page == dom.pages.save){
            bottomBar.selectAll("*").remove();
            let container = d3.select(page).select(".container");
            container.select(dom.outputFile).html(_this._getHtmlJson(_this.data));
            
            container.select(".survey-title")
                .property("value", _this.data.title)
                .on("keyup", function(){
                    _this.data.title = d3.select(this).property("value");
                    _this._saveSessionData();
                });

            container.select(".survey-description")
                .property("value", _this.data.description)
                .on("keyup", function(){
                    _this.data.description = d3.select(this).property("value");
                    _this._saveSessionData();
                });
            
            container.select(".save-button")
                .on("click", function(){
                    _this._downloadConfigFile();
                });
  
        }
        /*

        deploy-page

        */
        if(page == dom.pages.deploy){
            bottomBar.selectAll("*").remove();
            let container = d3.select(page).select(".container");
            container.select(dom.outputFile).html(_this._getHtmlJson(_this.data));
            

            container.select(".deploy-button")
                .on("click", function(){
                    if(typeof demo !== 'undefined' && demo){
                        alert("The demo version does not allow to deploy the configuration file.");
                    }
                    else{
                        _this._deployConfigFile(function(success, error){
                            if(success) alert("The evaluation has been correctly deployed");
                            else{
                                alert("An error occurred. See the console for more details.");
                                console.log(error);
                            }
                        });
                    }
                    
                });

            container.select(".deployed-url")
                .attr("href", Stein.baseUrl + "evaluation.html")
                .text(Stein.baseUrl + "evaluation.html");   
        }

        if(page == dom.pages.results){
            bottomBar.selectAll("*").remove();
            let container = d3.select(page).select(".container");
            container.selectAll("*").remove();
            
            let accordion = container.append("div").attr("class", "row").style("padding-top", "3em")
                .append("div").attr("class", "col-12")
                .append("div").attr("id", "accordion-results")
            //let spinner = container.select("#spinner-row").style("display")

            
            d3.json("results-list.jsp", function(json){
                /*
                json.files.forEach(function(f){
                    console.log(f);
                });
                */
                let q = d3.queue();
                json.files.forEach(function(f){
                    q.defer(d3.json, "results/"+ f)
                });
                q.await(function(error) {
                    let results = [];
                    for(let i=1; i<arguments.length; i++) results.push(arguments[i]);
                    accordion.selectAll(".card")
                            .data(results)
                            .enter()
                            .append("div").attr("class", "card")
                            .append("div").attr("class", "card-header")
                            .attr("id", function(d,i){ return "heading-" + i})
                            .append("h5").attr("class", "mb-0")
                            .append("button").attr("class", "btn btn-link")
                            .attr("data-toggle","collapse")
                            .attr("data-target", function(d,i){ return "#collapse-" + i})
                            .attr("aria-expanded", "false")
                            .attr("aria-controls", function(d,i){ return "collapse-" + i})
                            .text(function(d, i){return "User " + i})
                            .parent()
                            .append("small").text(function(d){ return d.date.replace("T", " ").substr(0,d.date.lastIndexOf("."))})
                            .parent()
                            .parent()
                            .parent()
                            .append("div").attr("class", "collapse")
                            .attr("id", function(d,i){ return "collapse-" + i})
                            .attr("aria-labelledby", function(d,i){ return "heading-" + i})
                            .attr("data-parent", "#accordion-results")

                            .append("div").attr("class", "card-body")
                            .append("p").style("font-size", "10px")
                            .html(function(d){
                                return _this._getHtmlJson(d);
                            });
                    
                });
            });
            
            /*
            d3.json("results/1.json", function(result1){
                d3.json("results/2.json", function(result2){
                    d3.json("results/3.json", function(result3){
                        let results = [result1, result2, result3];
                        accordion.selectAll(".card")
                            .data(results)
                            .enter()
                            .append("div").attr("class", "card")
                            .append("div").attr("class", "card-header")
                            .attr("id", function(d,i){ return "heading-" + i})
                            .append("h5").attr("class", "mb-0")
                            .append("button").attr("class", "btn btn-link")
                            .attr("data-toggle","collapse")
                            .attr("data-target", function(d,i){ return "#collapse-" + i})
                            .attr("aria-expanded", "false")
                            .attr("aria-controls", function(d,i){ return "collapse-" + i})
                            .text(function(d, i){return "User " + i})
                            .parent()
                            .append("small").text(function(d){ return d.date.replace("T", " ").substr(0,d.date.lastIndexOf("."))})
                            .parent()
                            .parent()
                            .parent()
                            .append("div").attr("class", "collapse")
                            .attr("id", function(d,i){ return "collapse-" + i})
                            .attr("aria-labelledby", function(d,i){ return "heading-" + i})
                            .attr("data-parent", "#accordion-results")

                            .append("div").attr("class", "card-body")
                            .append("p").style("font-size", "10px")
                            .html(function(d){
                                return _this._getHtmlJson(d);
                            });
                    });
                });
            });
            */
        }

        //if(_this.lastPage == page) 
        d3.select(page).transition().duration(250).style("opacity", 1);
        _this.lastPage = page;
    }

    _computeSuggestedDataTypeName(event){
        let name = event.targetClass.split(".")[0];
        if(name == "") name = event.targetId;
        if(name == "") name = event.parentClass.split(".")[0];
        if(name == "") name = event.parentId;
        return name;
    }

    _computeSuggestedEventName(event){
        let name = event.targetClass.split(".")[0];
        if(name == "") name = event.targetId;
        if(name == "") name = event.parentClass.split(".")[0];
        if(name == "") name = event.parentId;
        return name;
    }

    _onEvent(e) {
        let _this = this;
        let dom = _this.dom;
        
        let myEvent = _this.stein.parseEvent(e, dom.pages.system);
        if(myEvent == null) return;

        let eventContainer = d3.select(dom.systemEventContainer).style("opacity", 0);
        let eventDiv = eventContainer.select(dom.systemEvent);

        eventDiv.select(dom.eventTarget).text(JSON.stringify(myEvent.target));
        eventDiv.select(dom.eventTargetId).text(JSON.stringify(myEvent.targetId));
        eventDiv.select(dom.eventTargetClass).text(JSON.stringify(myEvent.targetClass));
        
        let datumHtml = _this._getHtmlJson(myEvent.targetDatum);
        eventDiv.select(dom.eventTargetDatum).html(datumHtml);

        let targetDatumArrow = eventDiv.select(dom.eventTargetDatumArrow).style("display", null).attr("status", "down");
        targetDatumArrow.selectAll("*").remove();
        targetDatumArrow.append("i").attr("class", "fas fa-angle-down");
        if(datumHtml.length > 50){
            eventDiv.select(dom.eventTargetDatum).style("display", "none");
            targetDatumArrow.on("click", function(){
                if(targetDatumArrow.attr("status") == "up"){
                        targetDatumArrow.selectAll("*").remove();
                        targetDatumArrow.attr("status", "down").append("i").attr("class", "fas fa-angle-down");
                        eventDiv.select(dom.eventTargetDatum).style("display","none");
                        
                } else{
                    targetDatumArrow.selectAll("*").remove();
                    targetDatumArrow.attr("status", "up").append("i").attr("class", "fas fa-angle-up");
                    eventDiv.select(dom.eventTargetDatum).style("display", null);
                }   
            });
        } 
        else targetDatumArrow.style("display", "none");


        let suggestedDataTypeName = _this._computeSuggestedDataTypeName(myEvent);
        
        let nameFound = false;
        _this.data.dataTypes.forEach(function(d){
            if(d.name == suggestedDataTypeName) nameFound = true;
        });

        eventContainer.select("#input-suggested-datatype").property("value", suggestedDataTypeName)
        .attr("class", function(){
            if(nameFound) return "form-control form-control-sm is-invalid";
            else return "form-control form-control-sm is-valid";
        });

        eventContainer.select("#button-save-datatype").on("click", function(){
            let name = eventContainer.select("#input-suggested-datatype").property("value");
            //name = name.replace(/[^\w]|_/g, ""); //mantains only characters and numbers
            let nameFound = false;
            _this.data.dataTypes.forEach(function(d){ if(name == d.name) nameFound = true;});
            if(name == "" || nameFound){
                eventContainer.select("#input-suggested-datatype").property("value", name)
                .attr("class",  "form-control form-control-sm is-invalid");
                return;
            }

            _this.data.dataTypes.push({name: name, toStringFunction: _this._toStringFunctionString()});
            _this.data.dataTypes.sort(function(a,b){
                if(a.name == "undefined") return -1;
                if(b.name == "undefined") return 1;
                return a.name.localeCompare(b.name);
            });
            _this._saveSessionData();

            eventContainer.select("#input-suggested-datatype").property("value", "").attr("class","form-control form-control-sm");
            _this._setPageContent(_this.dom.pages.system);
        });

        eventContainer.transition().duration(400).style("opacity", 1);  

        
    }

     
    _onEventCatchPage(e) {
        let _this = this;
        let dom = _this.dom;
        
        let myEvent = _this.stein.parseEvent(e, dom.pages.catchEvents);
        if(myEvent == null) return;

        let eventContainer = d3.select(dom.catchEventContainer).style("opacity", 0);
        let eventDiv = eventContainer.select(dom.catchEvent);

        //reset input

        
        let generatorFound = false;
        _this.data.events.forEach(function(x){
            if(x.generator === myEvent.generator) generatorFound = true;
        });
        if(generatorFound){
            d3.select(dom.eventSavedAlert)
                .style("opacity", 0)
                .style("display", "block")
                .transition().duration(400).style("opacity", 1); 
            return;
        }
        d3.select(dom.eventSavedAlert).style("display", "none");
        

        eventDiv.select(dom.eventType).text(JSON.stringify(myEvent.type));
        eventDiv.select(dom.eventTarget).text(JSON.stringify(myEvent.target));
        eventDiv.select(dom.eventTargetId).text(JSON.stringify(myEvent.targetId));
        eventDiv.select(dom.eventTargetClass).text(JSON.stringify(myEvent.targetClass));
        eventDiv.select(dom.eventParentId).text(JSON.stringify(myEvent.parentId));
        eventDiv.select(dom.eventParentClass).text(JSON.stringify(myEvent.parentClass));
        
        
        
        let eventDatumHtml = _this._getHtmlJson(myEvent.eventDatum);
        eventDiv.select(dom.eventEventDatum).html(eventDatumHtml);
        
        let eventDatumArrow = eventDiv.select(dom.eventEventDatumArrow).style("display", null).attr("status", "down");
        eventDatumArrow.selectAll("*").remove();
        eventDatumArrow.append("i").attr("class", "fas fa-angle-down");
        if(eventDatumHtml.length > 50){
            eventDiv.select(dom.eventEventDatum).style("display", "none");
            eventDatumArrow.on("click", function(){
                if(eventDatumArrow.attr("status") == "up"){
                        eventDatumArrow.selectAll("*").remove();
                        eventDatumArrow.attr("status", "down").append("i").attr("class", "fas fa-angle-down");
                        eventDiv.select(dom.eventEventDatum).style("display","none");
                        
                } else{
                    eventDatumArrow.selectAll("*").remove();
                    eventDatumArrow.attr("status", "up").append("i").attr("class", "fas fa-angle-up");
                    eventDiv.select(dom.eventEventDatum).style("display", null);
                }   
            });
        } 
        else eventDatumArrow.style("display", "none");
        
        let datumHtml = _this._getHtmlJson(myEvent.targetDatum);
        eventDiv.select(dom.eventTargetDatum).html(datumHtml);

        let targetDatumArrow = eventDiv.select(dom.eventTargetDatumArrow).style("display", null).attr("status", "down");
        targetDatumArrow.selectAll("*").remove();
        targetDatumArrow.append("i").attr("class", "fas fa-angle-down");
        if(datumHtml.length > 50){
            eventDiv.select(dom.eventTargetDatum).style("display", "none");
            targetDatumArrow.on("click", function(){
                if(targetDatumArrow.attr("status") == "up"){
                        targetDatumArrow.selectAll("*").remove();
                        targetDatumArrow.attr("status", "down").append("i").attr("class", "fas fa-angle-down");
                        eventDiv.select(dom.eventTargetDatum).style("display","none");
                        
                } else{
                    targetDatumArrow.selectAll("*").remove();
                    targetDatumArrow.attr("status", "up").append("i").attr("class", "fas fa-angle-up");
                    eventDiv.select(dom.eventTargetDatum).style("display", null);
                }   
            });
        } 
        else targetDatumArrow.style("display", "none");


        eventContainer.select(dom.inputEventTagFixed).text(myEvent.type + "-on-");
        
        eventContainer.select(dom.inputEventTag).property("value", _this._computeSuggestedEventName(myEvent))
            .attr("class",  "form-control form-control-sm")
            .on("keyup", function(){
                let s = myEvent.type + "-on-" + d3.select(this).property("value");
                let el = d3.select(dom.eventsList).select(".current-event");
                if(el.empty()){
                    el = d3.select(dom.eventsList).append("li").append("span").attr("class", "current-event");
                }
                el.text(s);
            });
        


        let dataTypeInput = eventContainer.select(dom.inputEventDatatype);
        dataTypeInput.selectAll("*").remove();
        _this.data.dataTypes.forEach(function(d){
            dataTypeInput.append("option")
                .property("value", d.name)
                .text(d.name)
                .property("selected", function(){
                    if(d.name == _this._computeSuggestedEventName(myEvent)) return true;
                    else return null;
                })
        });

        let contributeInput = eventContainer.select(dom.inputEventContributeToAnswer);
        contributeInput.selectAll("*").remove();
        ["Yes", "No"].forEach(function(d){
            contributeInput.append("option").property("value", d).text(d);
        });


        eventContainer.select(dom.selectorLinesBeforeBody).html(_this._selectorFunctionsDefaultLines(myEvent).beforeBody.join("<br>"));
        eventContainer.select(dom.inputFunctionSelector).property("value", _this._selectorFunctionsDefaultLines(myEvent).body.join("\n"));
        eventContainer.select(dom.selectorLinesAfterBody).html(_this._selectorFunctionsDefaultLines(myEvent).afterBody.join("<br>"));
        eventContainer.select(dom.buttonRunSelector).on("click", function(){
            let text = eventContainer.select(dom.inputFunctionSelector).property("value");
            let fString = _this._selectorFunctionString(myEvent, text) + ".call(this, " + JSON.stringify(myEvent) + ");";
            let res = document.getElementById(_this.dom.systemIframeCatch.replace("#", "")).contentWindow.eval(fString);
            alert("The return value of the function is:\n\n" + JSON.stringify(res));
        });

        eventContainer.select(dom.inputFunctionData).property("value", "");
        eventContainer.select(dom.dataLinesBeforeBody).html(_this._dataFunctionsDefaultLines(myEvent).beforeBody.join("<br>"));
        eventContainer.select(dom.inputFunctionData).property("value", _this._dataFunctionsDefaultLines(myEvent).body.join("\n"));
        eventContainer.select(dom.dataLinesAfterBody).html(_this._selectorFunctionsDefaultLines(myEvent).afterBody.join("<br>"));
        eventContainer.select(dom.buttonRunData).on("click", function(){
            let text = eventContainer.select(dom.inputFunctionData).property("value");
            let fString = _this._dataFunctionString(myEvent, text) + ".call(this, " + JSON.stringify(myEvent) + ");";
            let res = document.getElementById(_this.dom.systemIframeCatch.replace("#", "")).contentWindow.eval(fString);
            alert("The return value of the function is:\n\n" + JSON.stringify(res));
        });


        eventContainer.select(dom.saveEventButton).on("click", function(){
            //check name
            let name = eventContainer.select(dom.inputEventTag).property("value");
            name = name.replace(/[^\w]|_/g, ""); //mantains only characters and numbers
            let nameFound = false;
            _this.data.events.forEach(function(d){ if(myEvent.type + "-on-" + name == d.name) nameFound = true;});
            if(name == "" || nameFound){
                eventContainer.select(dom.inputEventTag).property("value", name)
                .attr("class",  "form-control form-control-sm is-invalid");
                return;
            }
            

            let e = {
                type: myEvent.type,
                name: myEvent.type + "-on-" + name,
                dataType: eventContainer.select(dom.inputEventDatatype).property("value"),
                contributeToAnswer: eventContainer.select(dom.inputEventContributeToAnswer).property("value"),
                specializeEvent: _this._selectorFunctionString(myEvent, eventContainer.select(dom.inputFunctionSelector).property("value")),
                traceData: _this._dataFunctionString(myEvent, eventContainer.select(dom.inputFunctionData).property("value")),
                generator: myEvent.generator,
            };
            _this.data.events.push(e);
            _this.data.events.sort(function(a,b){ return a.name.localeCompare(b.name);});
            _this._saveSessionData();
            eventContainer.transition().duration(200).style("opacity", 0);
            _this._setPageContent(_this.dom.pages.catchEvents);
        });
        
        
        d3.select(_this.dom.functionSelector).style("display", "none");
        d3.select(_this.dom.functionData).style("display", "none");
        d3.select(_this.dom.answerContribution).style("display", "none");
        
        eventContainer.transition().duration(400).style("opacity", 1);      
    }

    _getSessionData(){
        let _this = this;
        let data = localStorage.getItem(_this.localStorageKey);
        if(data == undefined || data == null) return null;
        else return JSON.parse(data);
    }
    //save data to local storage for persistency
    _saveSessionData(){
        let _this = this;
        localStorage.setItem(_this.localStorageKey, JSON.stringify(_this.data));
    }
    //delete persistency data
    _deleteSessionData(){
        let _this = this;
        localStorage.removeItem(_this.localStorageKey);
    }

    //current datetime in iso format 2018-01-10T14:16:16.858Z
    _getCurrentDateTime(){
        let d = new Date();
        let n = d.toISOString();
        return n;
    }

    //current compact datetime in iso format 20180110-141616
    _getCurrentCompactDateTime(){
        let d = new Date();
        let n = d.toISOString();
        let i = n.indexOf(".");
        n = n.substring(0, i);
        return n.replace(/[:-]/g , "").replace("T", "-");
    }

    //current timestamp in sec
    _getCurrentTimestamp(){
        let d = new Date();
        let n = d.getTime();
        return parseInt(n/1000);
    }

    //current timestamp in millisec
    _getCurrentMillisecTimestamp(){
        let d = new Date();
        let n = d.getTime();
        return n;
    }

    _getRandomString(){
        let s = "";
        for(let i=0; i<10; i++){
            s += Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s;
    }

  
    _downloadConfigFile(){
        let _this = this;
        _this.data.export = _this._getCurrentCompactDateTime();
        _this._saveSessionData();
        _this.stein.downloadJson(_this.stein.configFileName, _this.data);
    }

    _deployConfigFile(callback){
        let _this = this;
        _this.stein.uploadJson(serverUploadUrl, _this.stein.configFileName, _this.data, function(done, error){
            if(callback != null) callback(done, error);
        });
    }


}
/*
*
*
*/
;window.Stein.evaluation = new class {
    constructor(){
        let _this = this;

        this.stein = Stein;

        this.data = {
            urlParams: this.stein.urlParams,
            config: null,
            id: null,
            date: null,
			privateIp: null,
			publicIp: null,
            startTime: null,
            endTime: null,
            currentSystemQuestionIndex: 0,
            saved: false,
            initialQuestions: [],
            systemQuestions: [],
            finalQuestions: [],
            userConfiguration: null
        }

        this.eventsScript = "";

        this.localStorageKey = "SteinEvaluation";
        
        this.dom = {
            pages: {
                start: "#start-page",
                initialQuestions: "#initial-questions-page",
                systemQuestions: "#system-questions-page",
                finalQuestions: "#final-questions-page",
                surveyCompleted: "#survey-completed-page",
                surveySaved: "#survey-saved-page",
                loading: "#loading-page"
            },
            title: "#title",
            description: "#description",
            resumeMessage: "#resume-message",
            startButton: "#button-start",
            resumeButton: "#button-resume",

            bottomBar: "#bottom-bar",
            systemIframe: "#system-iframe",

            saveButton: "#save-btn",

            systemLoading: "#system-loading",

        };

        this.possibleStates = {
            Configured: "configured",
            Started: "started",
            InitialQuestions: "initial-questions",
            SystemQuestions: "system-questions",
            FinalQuestions: "final-questions",
            Completed: "completed",
            Saved: "saved"
        };

        this.state = undefined;
    }

    _getSessionData(){
        let _this = this;
        let data = localStorage.getItem(_this.localStorageKey);
        if(data == undefined || data == null) return null;
        data = JSON.parse(data);
        data.initialQuestions = data.initialQuestions.map(function(q){ return new SteinInitialQuestion(q)});
        data.systemQuestions = data.systemQuestions.map(function(q){ return new SteinSystemQuestion(q)});
        data.finalQuestions = data.finalQuestions.map(function(q){ return new SteinFinalQuestion(q)});
        return data;
    }
    //save data to local storage for persistency
    _saveSessionData(){
        let _this = this;
        localStorage.setItem(_this.localStorageKey, JSON.stringify(_this.data));
    }
    //delete persistency data
    _deleteSessionData(){
        let _this = this;
        localStorage.removeItem(_this.localStorageKey);
    }

    _getOutputFilename(){
        return `stein-${this.data.id}-user${this.data.userConfiguration.user}.json`;
        //return "stein-" + this.data.id + ".json";
    }

    start(){
        let _this = this;
        //load stein-events.js
        $.get('js/steinlib.js', function(script) {
            _this.eventsScript = script;
            //console.log(script);
            _this.start2();
        });
    }

    start2(){
        let _this = this;

        d3.json(_this.stein.configFileName, function(config){
            d3.json("test-generated.json", function(testGenerated){
                
                if(config == null){
                    alert("Configuration file not found !");
                    return;
                }
                if(testGenerated == null){
                    alert("TestGenerated file not found !");
                    return;
                }

                /** configurazione per utente */
                _this.data.userConfiguration = null;
                if(_this.stein.urlParams.user == undefined) _this.data.userConfiguration = testGenerated[0]
                else _this.data.userConfiguration = testGenerated.filter(d => d.user == _this.stein.urlParams.user)[0]
                if(_this.data.userConfiguration == undefined) _this.data.userConfiguration = testGenerated[0]

                config.systemQuestions.forEach(q => {
                    let bf = q.beforeFunction
                    if(bf.startsWith('***') && bf.endsWith('***')){
                        const questionId = bf.substring(3, bf.length-3) // Safari < 13.1 (Marzo 2020) NON SUPPORTA  bf.replaceAll('***', '') 
                        const fn = _this.data.userConfiguration[questionId].fn
                        q.beforeFunction = fn
                    }
                })
                //console.log(config)

                /**  */
                

                d3.select(_this.dom.title).html(config.title);
                d3.select(_this.dom.description).html(config.description);

                d3.select(_this.dom.systemIframe)
                .attr("width", function(){ return d3.select(this.parentNode).node().getBoundingClientRect().width;})
                .attr("height", function(){ return d3.select(this.parentNode).node().getBoundingClientRect().height;});

                let sessionData = _this._getSessionData();
            
                if(sessionData == null){
                    d3.select(_this.dom.resumeButton).style("display", "none");
                    d3.select(_this.dom.resumeMessage).style("display", "none");
                }
                else{
                    d3.select(_this.dom.resumeButton).style("display", null);
                    d3.select(_this.dom.resumeMessage).style("display", null);
                } 

                //resume button
                d3.select(_this.dom.resumeButton).on("click", function(){
                    _this.data = _this._getSessionData();
                    d3.select("#evaluation-id").text(_this.data.id)
                    _this._showInitialQuestionsPage();
                });

                //start new button
                d3.select(_this.dom.startButton).on("click", function(){
                    _this._deleteSessionData();
                    _this._parseConfigurationFile(config);
                    _this.data.id = _this.stein.getCurrentCompactDateTime() + "-" + _this.stein.getRandomString();
                    d3.select("#evaluation-id").text(_this.data.id)
                    _this.data.startTime = _this.stein.getCurrentTimestamp();
                    _this.data.date = _this.stein.getCurrentDateTime();
                    _this._saveSessionData();
                    _this._showInitialQuestionsPage();
                    
                });
                _this._showPage(_this.dom.pages.start);
                
                
                _this.stein.getPrivateIp(function(ip){
                    _this.data.privateIp = ip;
                });

                _this.stein.getPublicIp(function(ip){
                    _this.data.publicIp = ip;
                });
                

            });
			
			
        });    
    }

    _parseConfigurationFile(config){
        let _this = this;
        _this.data.initialQuestions = config.initialQuestions.map(function(q){ return new SteinInitialQuestion(q)});
        _this.data.systemQuestions = config.systemQuestions.map(function(q){ return new SteinSystemQuestion(q)});
        _this.data.finalQuestions = config.finalQuestions.map(function(q){ return new SteinFinalQuestion(q)});
        _this.data.config = config;
    }

    _checkInitialQuestionsCompletion(){
        var _this = this;
        var allCompleted = true;
        _this.data.initialQuestions.forEach(function(q){ allCompleted = allCompleted && (q.completed || !q.mandatory)});
        return allCompleted;
    }

    _checkSystemQuestionsCompletion(){
        var _this = this;
        var allCompleted = true;
        _this.data.systemQuestions.forEach(function(q){ allCompleted = allCompleted && (q.completed || !q.mandatory)});
        return allCompleted;
    }

    _checkFinalQuestionsCompletion(){
        var _this = this;
        var allCompleted = true;
        _this.data.finalQuestions.forEach(function(q){ allCompleted = allCompleted && (q.completed || !q.mandatory)});
        return allCompleted;
    }

    _getCurrentSystemQuestion(){
        return this.data.systemQuestions[this.data.currentSystemQuestionIndex]
    }

    _showPage(id, options){
        let _this = this;
        d3.values(_this.dom.pages).forEach(function(p){
            d3.select(p).style("visibility", "hidden");
        });
        _this._setPageContent(id, options);
        d3.select(id).style("visibility", "visible");  
    }

    _showLoadingPage(){
        let _this = this;
        _this._showPage(_this.dom.pages.loading);
    }

    _showSystemLoading(){
        let _this = this;
        d3.select(_this.dom.systemLoading).style("visibility", null);
    }

    _removeSystemLoading(){
        let _this = this;
        d3.select(_this.dom.systemLoading).style("visibility", "hidden");
    }

    _showInitialQuestionsPage(){
        let _this = this;
        //controllo se le domande sono completate, nel caso passo a system question
        if(_this._checkInitialQuestionsCompletion()){
            _this._showSystemQuestionsPage();
            return;
        }
        _this.state = _this.possibleStates.InitialQuestions;
        _this._showPage(_this.dom.pages.initialQuestions);
    }

    _showSystemQuestionsPage(){
        let _this = this;
        //controllo se le domande sono completate, nel caso passo a final question
        if(_this._checkSystemQuestionsCompletion()){
            _this._showFinalQuestionsPage();
            return;
        }
        _this.state = _this.possibleStates.SystemQuestions;
        _this._showPage(_this.dom.pages.systemQuestions);
    }

    _showFinalQuestionsPage(){
        //controllo se le domande sono completate, nel caso passo a end
        let _this = this;
        //controllo se le domande sono completate, nel caso passo a system question
        if(_this._checkFinalQuestionsCompletion()){
            _this._showSurveyCompletedPage();
            return;
        }
        _this.state = _this.possibleStates.FinalQuestions;
        _this._showPage(_this.dom.pages.finalQuestions);
    }

    _showSurveyCompletedPage(){
        let _this = this;
        if(_this.data.saved){
            _this._showSurveySavedPage();
            return;
        }
        _this.data.endTime = _this.stein.getCurrentTimestamp();
        _this.state = _this.possibleStates.Completed;
        _this._showPage(_this.dom.pages.surveyCompleted);
    }

    _showSurveySavedPage(){
        let _this = this;
        _this.state = _this.possibleStates.Saved;
        _this._showPage(_this.dom.pages.surveySaved);
    }

    _setPageContent(page, options){
        let _this = this;
        let dom = _this.dom;
        //if(_this.lastPage == page) 
        d3.select(page).style("opacity", 0);
        let bottomBar = d3.select(dom.bottomBar);
        bottomBar.selectAll("*").remove();
        /*

        INITIAL QUESTIONS

        */
        if(page == dom.pages.initialQuestions){

            _this.data.initialQuestions.forEach(function(q){ q.setStartTime()});
            
            let container = d3.select(page).select(".container");
            container.selectAll("*").remove();
            container.selectAll(".row")
                .data(_this.data.initialQuestions)
                .enter()
                .append("div").attr("class", "row justify-content-center").attr("id", function(d){ return "question-" + d.id})
                .append("div").attr("class", "col-8")
                .append("div").attr("class", "card")
                .append("div").attr("class", "card-header")
                .append("small").attr("class", "font-weight-500").text(function(d){ return "Question " + d.id}).parent()
                .append("br").parent()
                .append("span").text(function(d){ return d.text}).parent()
                .parent()
                .append("div").attr("class", "card-body")
                
                .each(function(d){
                    let form = undefined;
                    if(d.responseType == SteinInitialQuestion.ResponseType.SmallText){
                        form = d3.select(this).appendSmallTextInput();
                    }
                    if(d.responseType == SteinInitialQuestion.ResponseType.LargeText){
                        form = d3.select(this).appendLargeTextInput()
                    }
                    if(d.responseType == SteinInitialQuestion.ResponseType.MultipleChoice){
                        form = d3.select(this).appendMultipleChoiceInput(d.options)
                    }
                    if(d.responseType == SteinInitialQuestion.ResponseType.CheckBoxes){
                        form = d3.select(this).appendCheckboxesInput(d.options)
                    }
                    if(d.responseType == SteinInitialQuestion.ResponseType.ImageMultipleChoice){
                        form = d3.select(this).appendImageMultipleChoiceInput(d.options, d.images)
                    }
                    if(d.responseType == SteinInitialQuestion.ResponseType.ImageCheckBoxes){
                        form = d3.select(this).appendImageCheckboxesInput(d.options, d.images)
                    }

                    form.on("response", function(){
                        d.setCompleted();
                        d.response = d3.select(this).response();
                        _this._saveSessionData();
                    })
                    .defaultValue(function(d){
                        return d.response;
                    })
                });

            
            bottomBar.append("button").attr("class", "btn btn-primary")
                .html("<small>Continue</small>")
                .on("click", function(){
                    let allCompleted = _this._checkInitialQuestionsCompletion();
                    if(allCompleted){
                        _this.data.initialQuestions.forEach(function(q){ q.setEndTime()});
                        _this._showSystemQuestionsPage();
                    } 
                    else alert("You must complete all the questions !");
                });
        }
        /*

        FINAL QUESTIONS

        */
        if(page == dom.pages.finalQuestions){
            
            _this.data.finalQuestions.forEach(function(q){ q.setStartTime()});

            let container = d3.select(page).select(".container");
            container.selectAll("*").remove();
            container.selectAll(".row")
                .data(_this.data.finalQuestions)
                .enter()
                .append("div").attr("class", "row justify-content-center").attr("id", function(d){ return "question-" + d.id})
                .append("div").attr("class", "col-8")
                .append("div").attr("class", "card")
                .append("div").attr("class", "card-header")
                .append("small").attr("class", "font-weight-500").text(function(d){ return "Question " + d.id}).parent()
                .append("br").parent()
                .append("span").text(function(d){ return d.text}).parent()
                .parent()
                .append("div").attr("class", "card-body")
                
                .each(function(d){
                    let form = undefined;
                    if(d.responseType == SteinFinalQuestion.ResponseType.SmallText){
                        form = d3.select(this).appendSmallTextInput();
                    }
                    if(d.responseType == SteinFinalQuestion.ResponseType.LargeText){
                        form = d3.select(this).appendLargeTextInput()
                    }
                    if(d.responseType == SteinFinalQuestion.ResponseType.MultipleChoice){
                        form = d3.select(this).appendMultipleChoiceInput(d.options)
                    }
                    if(d.responseType == SteinFinalQuestion.ResponseType.CheckBoxes){
                        form = d3.select(this).appendCheckboxesInput(d.options)
                    }
                    if(d.responseType == SteinFinalQuestion.ResponseType.ImageMultipleChoice){
                        form = d3.select(this).appendImageMultipleChoiceInput(d.options, d.images)
                    }
                    if(d.responseType == SteinFinalQuestion.ResponseType.ImageCheckBoxes){
                        form = d3.select(this).appendImageCheckboxesInput(d.options, d.images)
                    }

                    form.on("response", function(){
                        d.setCompleted();
                        d.response = d3.select(this).response();
                        _this._saveSessionData();
                    })
                    .defaultValue(function(d){
                        return d.response;
                    });
                });

            
            bottomBar.append("button").attr("class", "btn btn-primary")
                .html("<small>Continue</small>")
                .on("click", function(){
                    let allCompleted = _this._checkFinalQuestionsCompletion();
                    if(allCompleted){
                        _this.data.finalQuestions.forEach(function(q){ q.setEndTime()});
                        _this._showSurveyCompletedPage();
                    } 
                    else alert("You must complete all the questions !");
                });
        }
        /*

        SYSTEM QUESTIONS

        */
        if(page == dom.pages.systemQuestions){
            let isFirstQuestion = _this.data.currentSystemQuestionIndex == 0;
            let isLastQuestion = _this.data.currentSystemQuestionIndex == _this.data.systemQuestions.length -1;
            let iframe = document.getElementById(_this.dom.systemIframe.replace("#", ""));
            
            const question =  _this._getCurrentSystemQuestion();
            console.log(page, question)

            question.setStartTime();
            question.setCompleted(false);
            if(question.responseType == SteinSystemQuestion.ResponseType.UserInteractionList || question.responseType == SteinSystemQuestion.ResponseType.UserInteractionSingleResponse) question.response = [];
            
            bottomBar.append("button").attr("class", "btn btn-secondary")
                .html("<small>Back</small>")
                .style("display", function(){
                    if(isFirstQuestion) return "none";
                    else return true;
                })
                .on("click", function(){
                    question.setCompleted(true);
                    question.setEndTime();
                    _this.data.currentSystemQuestionIndex--;
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });

            if(question.text != null) bottomBar.append("button").attr("class", "btn btn-light")
                .html("<small>Restore Question</small>")
                
                .on("click", function(){
                    question.setCompleted(true);
                    question.setEndTime();
                    
                    _this._saveSessionData();
                    _this._setPageContent(page);
                });

            bottomBar.append("button").attr("class", "btn btn-primary")
                .html("<small>Continue</small>")
                .on("click", function(){
                    //call after function
                    
                    question.afterResult = iframe.contentWindow.eval(question.afterFunction + ".call(this)");
                    
                    question.setCompleted(true);
                    question.setEndTime();
                    _this._saveSessionData();
                    if(isLastQuestion){
                        _this._showFinalQuestionsPage();
                    }
                    else{
                        _this.data.currentSystemQuestionIndex++;
                        _this._saveSessionData();
                        _this._setPageContent(page);
                    }

                });
            
            
            let pageDiv = d3.select(page);
            
    
            _this._showSystemLoading();
            
            
            _this.stein.setIframeContent(_this.dom.systemIframe.replace("#", ""), _this.data.config.systemUrl, _this.eventsScript);
            

            d3.select(_this.dom.systemIframe).on("load", function(){
                d3.select("body").on("SteinLibEventSystemLoaded", function(){
                    const question = _this._getCurrentSystemQuestion();

                    pageDiv.select("#question-name").selectAll("*").remove();
                    pageDiv.select("#question-text").selectAll("*").remove();
                    pageDiv.select("#question-confidence-up").selectAll("*").remove();
                    pageDiv.select("#question-confidence-down").selectAll("*").remove();
                    pageDiv.select("#question-response").selectAll("*").remove();

                    
                    if(question.text != null) pageDiv.select("#question-name").text("Question " + question.id);
                    pageDiv.select("#question-text").append("p").html(question.text);

                    
                    let iframeBody = d3.select(iframe.contentDocument).select("body");
                    let systemSize = [$(iframe).contents().innerWidth(), $(iframe).contents().innerHeight()];
                    
                    if(question.trackMouse){
                        iframeBody.on("mousemove.SteinTrack", function(){
                            let position = d3.mouse(this);
                            question.fireMousemoveEvent(position[0], position[1], systemSize[0], systemSize[1], d3.event.target);
                        });
                    }
                    

                    _this.stein.watchEvents(iframe.contentWindow, function(event){
                        let e = _this.stein.parseEvent(event, page);
                        if(e == null) return;
                        for(let i=0; i<_this.data.config.events.length; i++){
                            let tracedEvent = _this.data.config.events[i];

                            
                            let fSpecialize = tracedEvent.specializeEvent + ".call(this, " + JSON.stringify(e) + ");";
                            let resultSpecialize = iframe.contentWindow.eval(fSpecialize);
                            if(!resultSpecialize) continue;
                            let fData = tracedEvent.traceData + ".call(this, " + JSON.stringify(e) + ");";
                            let resultData = iframe.contentWindow.eval(fData);
                            //console.log(resultData);

                            let fToString = "";
                            _this.data.config.dataTypes.forEach(function(dt){
                                if(dt.name == tracedEvent.dataType) fToString = dt.toStringFunction;
                            });

                            let eventToSave = {
                                name: tracedEvent.name,
                                timestamp: e.timestamp,
                                dataType: tracedEvent.dataType,
                                data: resultData,
                                dataTypeToString: fToString
                            }

                            console.log("[STEIN] Saving event:", eventToSave)

                            question.fireEvent(eventToSave, tracedEvent.contributeToAnswer == "Yes", function(responseUpdated){
                                if(!responseUpdated) return;
                                //console.log(question.response)
                                let div = pageDiv.select("#question-response").select(".col-12");
                                div.selectAll("*").remove();
                                div.appendSortableList(question.response)
                                    .on("sort", function(){
                                        let newResponse = [];
                                        d3.select(this).selectAll("li")
                                            .each(function(d){
                                                newResponse.push(d);
                                            });
                                        question.response = newResponse;
                                    });

                            });
                            //break;
                        }
                        
                    });
                    
            
                    pageDiv.select("#question-response")
                        .selectAll(".col-12")
                        .data([question])
                        .enter()
                        .append("div").attr("class", "col-12")
                        .each(function(d){
                            let form = undefined;
                            if(d.responseType == SteinSystemQuestion.ResponseType.SmallText){
                                form = d3.select(this).appendSmallTextInput();
                            }
                            if(d.responseType == SteinSystemQuestion.ResponseType.LargeText){
                                form = d3.select(this).appendLargeTextInput()
                            }
                            if(d.responseType == SteinSystemQuestion.ResponseType.MultipleChoice){
                                form = d3.select(this).appendMultipleChoiceInput(d.options)
                            }
                            if(d.responseType == SteinSystemQuestion.ResponseType.CheckBoxes){
                                form = d3.select(this).appendCheckboxesInput(d.options)
                            }
                            if(d.responseType == SteinSystemQuestion.ResponseType.ImageMultipleChoice){
                                form = d3.select(this).appendImageMultipleChoiceInput(d.options, d.images)
                            }
                            if(d.responseType == SteinSystemQuestion.ResponseType.ImageCheckBoxes){
                                form = d3.select(this).appendImageCheckboxesInput(d.options, d.images)
                            }
                            if(d.responseType != SteinSystemQuestion.ResponseType.UserInteractionList && d.responseType != SteinSystemQuestion.ResponseType.UserInteractionSingleResponse){
                                form.on("response", function(){
                                    d.response = d3.select(this).response();
                                })
                                .defaultValue(function(d){
                                    return d.response;
                                })
                            }
                            
                        });
                        
                        pageDiv.select("#question-confidence-up").style("display", "none");
                        pageDiv.select("#question-confidence-down").style("display", "none");
                        if(question.askForConfidence){
                            const divid = (question.responseType == SteinSystemQuestion.ResponseType.UserInteractionList || question.responseType == SteinSystemQuestion.ResponseType.UserInteractionSingleResponse) ? "#question-confidence-up" : "#question-confidence-down"; 
                            pageDiv.select(divid)
                                .style("display", null)
                                .selectAll(".col-12")
                                .data([question])
                                .enter()
                                .append("div").attr("class", "col-12")
                                .each(function(d){ 
                                    const confidenceForm = d3.select(this).appendConfidenceMultipleChoiceInput();
                                    confidenceForm.on("response", () => {
                                        d.confidence = confidenceForm.response();
                                    })
                                });
                        }


                        /*
                        pageDiv.select("#question-confidence")
                            .selectAll(".col-12")
                            .data([question])
                            .enter()
                            .append("div").attr("class", "col-12")
                            .each(function(d){ 
                                if(d.responseType == SteinSystemQuestion.ResponseType.UserInteractionList || d.responseType == SteinSystemQuestion.ResponseType.UserInteractionSingleResponse){
                                    if(d.askForConfidence){
                                        const confidenceForm = d3.select(this).appendConfidenceMultipleChoiceInput();
                                        confidenceForm.on("response", () => {
                                            d.confidence = confidenceForm.response();
                                        })
                                    }
                                    
                                }
                            });
                            */


                    _this._removeSystemLoading();   
                });
            // GRAZIANO 16-04-2020 messo if perchè ad ogni domanda stein si gira tutte le domande passate e chiama before question, non so perchè viene chiamato su tutte le domande passate
            if(!question.completed) iframe.contentWindow.eval(question.beforeFunction + ".call(this)");  
            });
            

            
          
        }
        /*

        SURVEY COMPLETED

        */
        if(page == dom.pages.surveyCompleted){
            d3.select(_this.dom.saveButton).on("click", function(){
                /*
                console.log(_this.data.config.uploadUrl )
                if(_this.data.config.uploadUrl != ""){
                    //upload 
                    _this.data.saved = true;
                    _this._saveSessionData();
                    _this._showPage(dom.pages.surveySaved);
                }
                */
                //else{
                    let filename = _this._getOutputFilename();
                    _this._showLoadingPage();
                    _this.uploadSurvey(function(done, error){
                        if(done){
                            _this.data.saved = true;
                            _this._saveSessionData();
                            _this._showPage(dom.pages.surveySaved);
                        }
                        else{
                            _this.stein.downloadJson(_this._getOutputFilename(), _this._generateSurveyResult());
                            _this._showPage(page);
                        }
                    })
   
                //}
            });
        }
        /*

        SURVEY SAVED

        */
       if(page == dom.pages.surveySaved){
           _this._deleteSessionData();
       }


        d3.select(page).transition().duration(250).style("opacity", 1);
    }

    dowloadSurvey(){
        let _this = this;
        let filename = _this._getOutputFilename();
        _this.stein.downloadJson(filename, _this._generateSurveyResult());
    }

    uploadSurvey(callback){
        this.stein.uploadJson(serverUploadUrl, this._getOutputFilename(), this._generateSurveyResult(), callback);
    }

    _generateSurveyResult(){
        var _this = this;

        var r = {
            id: _this.data.id,
            date: _this.data.date,
			useragent: navigator.userAgent,
			publicIp: _this.data.publicIp,
            privateIp: _this.data.privateIp,
            totalTime: _this.data.endTime - _this.data.startTime,
            startTime: _this.data.startTime,
            endTime: _this.data.endTime,
            totalSystemQuestionsTime: 0,
            totalSystemQuestionsReadingTime: 0,
            totalSystemQuestionsAnsweringTime: 0,
            totalSystemQuestionsEventsNumber: 0,
            userConfiguration: _this.data.userConfiguration,
            urlParams: _this.data.urlParams,
            initialQuestions: _this.data.initialQuestions.map(function(q){ return q.toOutput();}),
            systemQuestions: _this.data.systemQuestions.map(function(q){ return q.toOutput();}),
            finalQuestions: _this.data.finalQuestions.map(function(q){ return q.toOutput();}),
            systemQuestionsEvents : {},
            systemQuestionsMousemove : {}
        };

        _this.data.systemQuestions.forEach(function(q){
            r.totalSystemQuestionsReadingTime += q.readingTime;
            r.totalSystemQuestionsAnsweringTime += q.answeringTime;
            r.totalSystemQuestionsEventsNumber += q.events.length;

            r.systemQuestionsEvents[q.id] = q.events;
            r.systemQuestionsMousemove[q.id] = q.mouseMotion;
        });
        r.totalSystemQuestionsTime = r.totalSystemQuestionsReadingTime + r.totalSystemQuestionsAnsweringTime;

       return r;
    }
}
/*
*
*
*/
;window.Stein.test = new class {
    constructor(){
        let _this = this;

        this.stein = Stein;
        this.localStorageKey = "SteinTest";
    }

    start(){
        let _this = this;
        let lastUrl = localStorage.getItem(_this.localStorageKey);
        if(lastUrl == undefined || lastUrl == null) lastUrl = "";
        let url = window.prompt("Insert the url of the system", lastUrl);
        localStorage.setItem(_this.localStorageKey, url);
        _this.stein.setIframeContent("system-iframe", url, _this.stein.lib);
        
        let iframe = document.getElementById("system-iframe");
        let eventContainer = d3.select(".container-right");
        

        d3.select("#system-iframe").on("load", function(){
            _this.stein.watchEvents(iframe.contentWindow, function(e){
                let myEvent = _this.stein.parseEvent(e, "test");
                if(myEvent == null) return;
                let s = JSON.stringify(myEvent, null, "\t").replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;'); 
                eventContainer.style("opacity", 0);
                eventContainer.html(s);
                eventContainer.transition().duration(400).style("opacity", 1);
            });
        });

    }
}


/**
 * 
 */
class SteinQuestion{
    
    static get MouseEventType(){
        return {
            MouseMove: "mousemove",
            Click: "click",
        }
    }
    constructor(obj){
        this.id = obj.id;
        this.text = obj.text;
        this.responseType = obj.responseType;
        this.options = obj.options;
        this.images = obj.images;
        this.mandatory = obj.mandatory;
        
        //used in system questions
        this.dataType = ("dataType" in obj) ? obj.dataType : undefined;
        this.beforeFunction = ("beforeFunction" in obj) ? obj.beforeFunction : undefined;
        this.afterFunction = ("afterFunction" in obj) ? obj.afterFunction : undefined;
        this.trackMouse = ("trackMouse" in obj) ? obj.trackMouse : undefined;
        this.trackMouseInterval = ("trackMouseInterval" in obj) ? obj.trackMouseInterval : undefined;
        this.askForConfidence = ("askForConfidence" in obj) ? obj.askForConfidence : false;

        this.afterResult = ("afterResult" in obj) ? obj.afterResult : undefined;
        
        this.events = ("events" in obj) ? obj.events : [];
        this.eventsNumber = ("eventsNumber" in obj) ? obj.eventsNumber : 0;
        this.response = ("response" in obj) ? obj.response : null;
        this.confidence = ("confidence" in obj) ? obj.confidence : null;
        this.completed = ("completed" in obj) ? obj.completed : false;
        
        this.mouseMotion = ("mouseMotion" in obj) ? obj.mouseMotion : [];
        this.timestamps = ("timestamps" in obj) ? obj.timestamps : [];
        this.elapsedTime = ("elapsedTime" in obj) ? obj.elapsedTime : 0;
        this.readingTime = ("readingTime" in obj) ? obj.readingTime : 0;
        this.answeringTime = ("answeringTime" in obj) ? obj.answeringTime : 0;

        this.originalData = ("originalData" in obj) ? obj.originalData : obj;
        
        this.lastMouseEventTimestamp = 0;

        //console.log(this)
    }

    

    toOutput(){}

    setStartTime(){
        var t = parseInt(new Date().getTime()/1000);
        this.timestamps.push({
            start: t,
            end: null
        });
    }

    setEndTime(){
        var t = parseInt(new Date().getTime()/1000);
        this.timestamps[this.timestamps.length -1].end = t;
        this.elapsedTime += this.timestamps[this.timestamps.length -1].end - this.timestamps[this.timestamps.length -1].start;
        //this.answeringTime += this.timestamps[this.timestamps.length -1].end - this.timestamps[this.timestamps.length -1].start;
    }

    setCompleted(bool=true){
        this.completed = bool;
    }

    fireEvent(event){}

    fireMousemoveEvent(x, y, systemWidth, systemHeight, target){
        if(!this.trackMouse) return;
        let timestamp = new Date().getTime();
        if(timestamp < this.lastMouseEventTimestamp + this.trackMouseInterval) return;
        this.lastMouseEventTimestamp = timestamp;
        target = d3.select(target);
        let targetId = target.attr("id");
        let targetClass = target.attr("class");
        if(targetClass != null) targetClass = targetClass.split(" ").join(".");
        let d = [x, y, systemWidth, systemHeight, targetId, targetClass];
        this.mouseMotion.push(d);
    }

}
/**
 * 
 */
class SteinInitialQuestion extends SteinQuestion{
    static get ResponseType(){
        return {
            SmallText: "small-text",
            LargeText: "large-text",
            MultipleChoice: "multiple-choice",
            CheckBoxes: "checkboxes",
            ImageMultipleChoice: "image-multiple-choice",
            ImageCheckBoxes: "image-checkboxes",
        };
    }
    constructor(obj){
        super(obj);
        if(this.response == null){
            let types = this.constructor.ResponseType;
            let values = [types.MultipleChoice, types.ImageMultipleChoice, types.CheckBoxes, types.ImageCheckBoxes];
            if(values.includes(this.responseType)) this.response = [];
        }
    }

    toOutput(){
        var _this = this;
        var r = {
            id: _this.id,
            responseType: _this.responseType,
            response: _this.response,
        };
        return r;
    }
}
/**
 * 
 */
class SteinFinalQuestion extends SteinQuestion{
    static get ResponseType(){
        return {
            SmallText: "small-text",
            LargeText: "large-text",
            MultipleChoice: "multiple-choice",
            CheckBoxes: "checkboxes",
            ImageMultipleChoice: "image-multiple-choice",
            ImageCheckBoxes: "image-checkboxes",
        };
    }
    constructor(obj){
        super(obj);
        if(this.response == null){
            let types = this.constructor.ResponseType;
            let values = [types.MultipleChoice, types.ImageMultipleChoice, types.CheckBoxes, types.ImageCheckBoxes];
            if(values.includes(this.responseType)) this.response = [];
        }
    }

    toOutput(){
        var _this = this;
        var r = {
            id: _this.id,
            responseType: _this.responseType,
            response: _this.response,
        };
        return r;
    }
}
/**
 * 
 */
class SteinSystemQuestion extends SteinQuestion{
    static get ResponseType(){
        return {
            SmallText: "small-text",
            LargeText: "large-text",
            MultipleChoice: "multiple-choice",
            CheckBoxes: "checkboxes",
            ImageMultipleChoice: "single-image-choice",
            ImageCheckBoxes: "image-checkboxes",
            UserInteractionList: "auto-computed-list",
            UserInteractionSingleResponse: "user-interaction-exclusive-list"
        };
    }
    constructor(obj){
        super(obj);
        if(this.response == null){
            let types = this.constructor.ResponseType;
            let values = [types.MultipleChoice, types.ImageMultipleChoice, types.CheckBoxes, types.ImageCheckBoxes, types.UserInteractionList];
            if(values.includes(this.responseType)) this.response = [];
        }
    }

    toOutput(){
        var _this = this;
        var r = {
            id: _this.id,
            responseType: _this.responseType,
            response: _this.response,
            confidence: _this.confidence,
            totalTime: _this.elapsedTime,
            readingTime: _this.elapsedTime - _this.readingTime,
            answeringTime: _this.answeringTime,
            timestamps: [],
            afterResult: _this.afterResult
        };

        _this.timestamps.forEach(function(t){
            r.timestamps.push([t.start, t.end]);
        });
        return r;
    }
    

    fireEvent(e, contributeToAnswer = true, callback){
        // name, timestamp, datatype, data
        let _this = this;
        let event = JSON.parse(JSON.stringify(e));
		let dataTypeToString = event.dataTypeToString;
        delete event.dataTypeToString;
        
        if(event.timestamp == undefined) event.timestamp = new Date().getTime();
        if(event.dataType == undefined || event.dataType == "undefined") event.dataType = null;
        if(event.data == undefined) event.data = null;

        //console.log(event);

        /*
        let toString = "(function(d){ return d.toString(); })";
        if(event.dataTypeToString != undefined){
            toString = event.dataTypeToString;
            delete event.dataTypeToString
        } 
        */
        _this.events.push(event);
        _this.eventsNumber = _this.events.length;
        
        //calcolo i tempi di lettura in base al primo evento che arriva
        if(_this.events.length == 1){
            _this.readingTime = 0;
            for(var i=0; i<_this.timestamps.length-1; i++){
                if(_this.timestamps[i].end == null){
                    console.error("null end timestamp");
                    continue;
                }
                _this.readingTime += _this.timestamps[i].end - _this.timestamps[i].start;
            }
            _this.readingTime += parseInt(event.timestamp/1000) - _this.timestamps[_this.timestamps.length-1].start;
        }

        

        var responseUpdated = false;
        if(event.dataType == _this.dataType && contributeToAnswer){
            let data = Array.isArray(event.data) ? event.data : [event.data]; //create array of response element
            const previousResponse = JSON.parse(JSON.stringify(_this.response));
            const newResponse = data.map(d => eval(`${dataTypeToString}.call(this, ${JSON.stringify(d)})`));
            
            //nuova gestioen delle rispose modificate per radviz
            if(_this.responseType == SteinSystemQuestion.ResponseType.UserInteractionList){
                _this.response = newResponse;
            }
            else if(_this.responseType == SteinSystemQuestion.ResponseType.UserInteractionSingleResponse){
                _this.response = (newResponse.length == 0) ?  [] : [newResponse[newResponse.length-1]]; // return last element
            }
            responseUpdated = true;
            
            /* Vecchia gestione delle risposte. modificata per radviz
            console.log(data)
            
            if(_this.responseType == SteinSystemQuestion.ResponseType.UserInteractionList){
                //if(!Array.isArray(event.data)) event.data = [event.data];
                data.forEach(function(d){
                    var foundIndex = -1;
                    for(var i=0; i<_this.response.length; i++){
                        let s = eval(dataTypeToString + ".call(this, " + JSON.stringify(d) + ")");
                        if(s == _this.response[i]){
                            foundIndex = i;
                            break;
                        }
                    }
                    if(foundIndex == -1) _this.response.push(d);
                    else _this.response.splice(foundIndex, 1);
                });
                responseUpdated = true;
            }
            else if(_this.responseType == SteinSystemQuestion.ResponseType.UserInteractionSingleResponse){
                
				_this.response = data.map(function(x){
                    return eval(dataTypeToString + ".call(this, " + JSON.stringify(x) + ")");
                });
                
                responseUpdated = true;
            }
            */
        }
        if(callback != undefined) callback.call(this, responseUpdated);
    }
}







