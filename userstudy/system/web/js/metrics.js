class RadVizMetrics{
  constructor(radviz){
    this.data = radviz.data().entries.map(e => d3.values(e.dimensions))
    this.points = radviz.data().entries.map(e => [e.x1, e.x2])
    this.labels = radviz.data().attributes.length != 0 ? radviz.data().attributes[0].values : null

    this.dataDistances_euc = null
    this.dataDistances_cos = null
    this.pointsDistances = null
    this.pointsRadialDistances = null
  }

  __cosineSimilarity(u, v) {
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
    return sym
  }

  __euclideanDistance(u, v){
    let result = 0
    for(let i=0; i<u.length; i++) result += Math.pow(u[i] - v[i], 2)
    return Math.sqrt(result)
  }

  __normalizeRow(row){
    let sum = d3.sum(row)
    if(sum != 0) row = row.map(d => d /= sum)
    return row
  }

  __stress(C, L){
    let N = 0
    let D = 0
    for(let i=0; i<C.length; i++){
      for(let j=i; j<C.length; j++){
        N += Math.pow(C[i][j] - L[i][j], 2)
        D += Math.pow(C[i][j], 2)
      }
    }
    return Math.sqrt(N / D)
  }

  getDataDistances(type="euclidean"){  //type = {"euclidean", "cosine"}
    if(type=="euclidean"){
      if(this.dataDistances_euc == null){
        this.dataDistances_euc = new Array(this.data.length).fill(null).map(d => new Array(this.data.length).fill(null))
        for(let i=0; i<this.data.length; i++){
          for(let j=i; j<this.data.length; j++){
            let dist = 0
            if(i!=j) dist = this.__euclideanDistance(this.data[i], this.data[j])
            this.dataDistances_euc[i][j] = dist
            this.dataDistances_euc[j][i] = dist
          }
        }
        this.dataDistances_euc = this.dataDistances_euc.map(row => this.__normalizeRow(row))
      }
      return this.dataDistances_euc
    }
    if(type=="cosine"){
      if(this.dataDistances_cos == null){
        this.dataDistances_cos = new Array(this.data.length).fill(null).map(d => new Array(this.data.length).fill(null))
        for(let i=0; i<this.data.length; i++){
          for(let j=i; j<this.data.length; j++){
            let dist = 0
            if(i!=j) dist = 1 - this.__cosineSimilarity(this.data[i], this.data[j])
            this.dataDistances_cos[i][j] = dist
            this.dataDistances_cos[j][i] = dist
          }
        }
        this.dataDistances_cos = this.dataDistances_cos.map(row => this.__normalizeRow(row))
      }
      return this.dataDistances_cos
    }
  }

  getPointsDistances(){ //pairwise distances
    if(this.pointsDistances == null){
      this.pointsDistances = new Array(this.data.length).fill(null).map(d => new Array(this.data.length).fill(null))
      for(let i=0; i<this.data.length; i++){
        for(let j=i; j<this.data.length; j++){
          let dist = 0
          if(i!=j) dist = this.__euclideanDistance(this.points[i], this.points[j])
          this.pointsDistances[i][j] = dist
          this.pointsDistances[j][i] = dist
        }
      }
      this.pointsDistances = this.pointsDistances.map(row => this.__normalizeRow(row))
    }
    return this.pointsDistances
  }

  getPointsRadialDistances(){ //distances from center
    if(this.pointsRadialDistances == null){
      let center = [0,0]
      this.pointsRadialDistances = this.points.map(p => this.__euclideanDistance(p, center))
    }
    return this.pointsRadialDistances
  }

  projectionError(type="euclidean"){ //type = {"euclidean", "cosine"}
    if(type == "euclidean") return this.__stress(this.getDataDistances("euclidean"), this.getPointsDistances())
    if(type == "cosine") return this.__stress(this.getDataDistances("cosine"), this.getPointsDistances())
  }

  clumping50(points){
    return 1 - d3.quantile(this.getPointsRadialDistances(), 0.5)
  }
  
  clumping75(points){
    return 1 - d3.quantile(this.getPointsRadialDistances(), 0.75)
  }
  
  meanDistances(points){
    return d3.mean(this.getPointsRadialDistances())
  }

  dbindex(){
    if(this.labels == null) return NaN
    var clusters = {};
    this.points.forEach((p, i) => {
        let l = this.labels[i]
        if(!clusters.hasOwnProperty(l)){
            clusters[l] = {
                points: [],
                centroid: null,
                avgInterDistance: null
            };
        }
        clusters[l].points.push(p);
    });
    var n = d3.keys(clusters).length;
    //
    d3.keys(clusters).forEach(c => {
      clusters[c].centroid = [
        d3.mean(clusters[c].points, (p) => p[0] ),
        d3.mean(clusters[c].points, (p) => p[1] )
      ];
      clusters[c].avgInterDistance = d3.mean(clusters[c].points, 
          p => this.__euclideanDistance(p, clusters[c].centroid)
      );
    });
    //
    let result = 0
    d3.keys(clusters).forEach((c0,i) => {
      var val = -Infinity;
      d3.keys(clusters).forEach((c1,j) => {
          if(i == j) return;
          var temp = (clusters[c0].avgInterDistance + clusters[c1].avgInterDistance)/this.__euclideanDistance(clusters[c0].centroid, clusters[c1].centroid)
          val = Math.max(val, temp);
      });
      result += val;
    });
    result = result / n;
    return result;
  }
}
