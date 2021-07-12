if (window.system == undefined) window.system = {}
system.optimization = (function() {
    const that = this;
  /*
  */
  // variabili this.nome variabile.
  const prefisso = "N__"
  
  this.indipendentDA = (points, list_dimension) =>{
    /*
    IndipendentDA from: 
    "Analyzing the role of dimension arrangement for data visualization in radviz"
    Di Caro et.al.
    */
    /*
    points = array of data points: [ {d1:3, d2:5, d3:7}, ...]
    dimension: list of dimensions to consider: [d2, d3]
    return an optimal disposition for the dimensions
    */
   let dimensions = [];
   
   list_dimension.forEach((dim)=>{
       dimensions.push(prefisso.concat(dim))
       //dimensions.push(dim)
   })

    var d = dimensions.length;
    var S = {};
    var maxSym = -Infinity;
    var maxSymD1 = null;
    var maxSymD2 = null;
    var R = [];
    //similarity
    function cosineSimilarity(u, v) {
        var udotv = 0;
        var umag = 0;
        var vmag = 0;
        for(var i=0; i<u.length; i++) {
          udotv += u[i] * v[i];
          umag += u[i]*u[i];
          vmag += v[i]*v[i];
        }
        umag = Math.sqrt(umag);
        vmag = Math.sqrt(vmag);
        var sym = udotv/(umag*vmag);
        return Math.floor(sym*1000);
    }
    //init
    dimensions.forEach((d1, i) => {
        dimensions.forEach((d2, j) => {
            if(j == i) return;
            if(!S.hasOwnProperty(d1)) S[d1] = {};
            var sym = cosineSimilarity(points.map( p => p[d1]), points.map( p => p[d2]));
            S[d1][d2] = sym;
            if(sym > maxSym){
                maxSym = sym;
                maxSymD1 = d1;
                maxSymD2 = d2;
            }
        })
   })
   R.push(maxSymD1);
   R.push(maxSymD2);
   maxSym = -Infinity;
   maxSymD1 = null;
   maxSymD2 = null;
   //loop
   while(R.length != d){
       //left
       maxSym = -Infinity;
       maxSymD2 = null;
       let d1 = R[0];
       d3.keys(S[d1]).forEach(d2 => {
            if(!R.includes(d2) && S[d1][d2] >= maxSym){
                maxSym = S[d1][d2];
                maxSymD2 = d2;
            }
       })
       R = [maxSymD2].concat(R);
       if(R.length == d) break;
       //right
       maxSym = -Infinity;
       maxSymD2 = null;
       d1 = R[R.length-1];
       d3.keys(S[d1]).forEach(d2 => {
            if(!R.includes(d2) && S[d1][d2] >= maxSym){
                maxSym = S[d1][d2];
                maxSymD2 = d2;
            }
        })
        R.push(maxSymD2);
   }
   return R.map((d)=> d.slice(3));
   //return R;
}

this.radvizPlusPlus = (points, list_dimension) => {
    /*
    
    */
    /*
    points = array of data points: [ {d1:3, d2:5, d3:7}, ...]
    dimension: list of dimensions to consider: [d2, d3]
    return an optimal disposition for the dimensions
    */
   let dimensions = [];
   
   list_dimension.forEach((dim)=>{
       dimensions.push(prefisso.concat(dim))
   })
    var d = dimensions.length;
    var D = {}; //distance
    var R = []; //result
    //
    function covariance(X, Y){
        var meanX = d3.mean(X);
        var meanY = d3.mean(Y);
        var n = X.length;
        var cov = 0;
        for(var i=0; i<n; i++){
            cov += (X[i]-meanX)*(Y[i]-meanY)/(n-1);
        }
        return cov;
    }
    function pearsonCorrelation(X, Y){
        var varX = d3.variance(X);
        var varY = d3.variance(Y);
        var cov = covariance(X,Y);
        return cov / (Math.sqrt(varX*varY));
    }
    function ahc(D){
        //agglomerative hierarchical clustering
        var clusters = [];
        class Cluster{
            constructor(elements){
                this.elements = elements
                this.id = JSON.stringify(this.elements);
                this.parentId = null;
            }
            distance(c){
                var res = 0;
                this.elements.forEach(e0 => {
                    c.elements.forEach(e1 => {
                        res += D[e0][e1];
                    })
                })
                res = res/(this.elements.length*c.elements.length)
                return res;
            }
        }    
        clusters.push([]);
        d3.keys(D).forEach(d => clusters[0].push(new Cluster([d])));
        var step = 0;
        while(clusters[clusters.length-1].length != 1){
            //find the two nearest clusters
            let minDist = Infinity;
            let minC0 = null;
            let minC1 = null;
            clusters[clusters.length-1].forEach((c0, i) => {
                clusters[clusters.length-1].forEach((c1, j) => {
                    if(i == j) return;
                    let d = c0.distance(c1);
                    if(d < minDist){
                        minDist = d;
                        minC0 = c0;
                        minC1 = c1;
                    }
                });
            });
            step++;
            var newCluster = new Cluster(minC0.elements.concat(minC1.elements));
            minC0.parentId = newCluster.id;
            minC1.parentId = newCluster.id;
            var layer = clusters[clusters.length-1].filter( c => c.id != minC0.id && c.id != minC1.id);
            layer.push(newCluster)
            clusters.push(layer);
        }
        var all = [];
        clusters.forEach(c => {
            c.forEach(e => {
                if(!all.map(d => d.id).includes(e.id)) all.push(e);
            })
        });
        var root = d3.stratify()
            .id(d => d.id)
            .parentId(d => d.parentId)
            (all);
        return root;
    }
    //init
    dimensions.forEach((d1, i) => {
        dimensions.forEach((d2, j) => {
            if(j == i) return;
            if(!D.hasOwnProperty(d1)) D[d1] = {};
            var corr = pearsonCorrelation(points.map( p => p[d1]), points.map( p => p[d2]));
            var dist = (1 - corr)/2;
            D[d1][d2] = dist;
        })
   })
   R = ahc(D);
   R = R.leaves().map(d => d.data.elements[0]);
   return R.map((d)=> d.slice(3));
}


this.DaviesBouldinIndex = (points, xLabel, yLabel,clusterLabel) => {
    var result = null;
    function euclideanDistance(p1, p2){
        return Math.sqrt(Math.pow(p2[xLabel] - p1[xLabel], 2) + Math.pow(p2[yLabel] - p1[yLabel], 2));
    }
    function clustersDistance(c1, c2){
        return euclideanDistance(c1.centroid, c2.centroid);
    }
    //
    var clusters = {};
    points.forEach(p => {
        if(!clusters.hasOwnProperty(p[clusterLabel])){
            clusters[p[clusterLabel]] = {
                points: [],
                centroid: null,
                avgInterDistance: null
            };
        }
        clusters[p[clusterLabel]].points.push(p);
    });
    var n = d3.keys(clusters).length;
    //
    d3.keys(clusters).forEach(c => {
        clusters[c].centroid = {};
        clusters[c].centroid[xLabel] = d3.mean(clusters[c].points, (p) => p[xLabel] );
        clusters[c].centroid[yLabel] = d3.mean(clusters[c].points, (p) => p[yLabel] );
        clusters[c].avgInterDistance = d3.mean(clusters[c].points, 
            p => euclideanDistance(p, clusters[c].centroid)
        );
    });
    //
    d3.keys(clusters).forEach((c0,i) => {
        var val = -Infinity;
        d3.keys(clusters).forEach((c1,j) => {
            if(i == j) return;
            var temp = (clusters[c0].avgInterDistance + clusters[c1].avgInterDistance)/clustersDistance(clusters[c0], clusters[c1]);
            val = Math.max(val, temp);
        });
        result += val;
    });
    result = result / n;
    return result;
}

this.download = (content, fileName, contentType)=> {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}


  return this;
}).call({})