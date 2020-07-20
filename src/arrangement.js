export const radvizDA = (function(){
    /*
    *
    */
    this.maxMeanDistanceHeuristic = function(data){
        const set = data.dimensions.map(d => d.values)
        const entriesSum = set[0].map((_, entryIndex) => 
            [...new Array(set.length)].map((_, dimensionIndex) =>
            set[dimensionIndex][entryIndex]
            )
        ).map(valueDimensions => valueDimensions.reduce((sumValues, currentValue) => sumValues + currentValue))
        console.log('set', set)
        console.log('entriesSum', entriesSum)
        const dimensionsSum = set.map(dimension => dimension.reduce((a, b) => a + b, 0))
        const dimensionsByRank = dimensionsSum.map((sum, i) => ({i, sum})).sort((a,b) => a.sum <= b.sum ? 1 : -1).map(o => o.i)
        const normalizedSet = set.map(dimensionValues => dimensionValues.map((entryValue, entryIndex) => entriesSum[entryIndex] > 0 ? entryValue / entriesSum[entryIndex] : 0))
        let availablePositions = [...new Array(set.length)].map((_, i) => i)
        const assignedPositions = []
        console.log('dimensionsSum', dimensionsSum)
        console.log('dimensionsByRank', dimensionsByRank)
        console.log('normalizedSet', normalizedSet)
        console.log('availablePositions', availablePositions)
        console.log('--- END INIT ---')
        let pointsAssignedPositions = [...new Array(set[0].length)].map(_ => [0, 0])
        const arrangement = [...new Array(set.length)].fill(null)
        for (const [rankIndex, dimensionIndex] of dimensionsByRank.entries()) {
            let currentPosition
            if (rankIndex === 0) {
            currentPosition = 0
            }
            else if (rankIndex === dimensionsByRank.length - 1) {
            currentPosition = availablePositions[0]
            }
            else {
            let currentDimensionValues = normalizedSet[dimensionIndex]
            let othersDimensionsByRank = dimensionsByRank.slice(rankIndex + 1)
            let othersDimensionsValues = othersDimensionsByRank.map(otherDimensionIndex => normalizedSet[otherDimensionIndex])
            let othersMeanValues = othersDimensionsValues[0].map((_, entryIndex) => 
                othersDimensionsByRank.map((_, otherDimensionIndex) => 
                othersDimensionsValues[otherDimensionIndex][entryIndex]
                )
            ).map(valueDimensions => valueDimensions.reduce((sumValues, currentValue) => 
                sumValues + currentValue) / othersDimensionsByRank.length
            )
            console.log('currentDimensionValues', currentDimensionValues)
            console.log('othersDimensionsByRank', othersDimensionsByRank)
            console.log('othersDimensionsValues', othersDimensionsValues)
            console.log('othersMeanValues', othersMeanValues)
            let currentMagnitude = -Infinity
            for (const possiblePosition of availablePositions) {
                console.log('possiblePosition', possiblePosition)
                let otherPositions = availablePositions.filter(pos => pos !== possiblePosition)
                console.log('otherPositions', otherPositions)
                let pointsPossiblePositions = pointsAssignedPositions.map(point => point.slice())
                pointsPossiblePositions = pointsPossiblePositions.map(([x1, x2], entryIndex) => [
                x1 + normalizedSet[dimensionIndex][entryIndex] * Math.cos(2 * Math.PI * possiblePosition / set.length), 
                x2 + normalizedSet[dimensionIndex][entryIndex] * Math.sin(2 * Math.PI * possiblePosition / set.length)
                ])
                for (const otherPosition of otherPositions) {
                pointsPossiblePositions = pointsPossiblePositions.map(([x1, x2], entryIndex) => [
                    x1 + othersMeanValues[entryIndex] * Math.cos(2 * Math.PI * otherPosition / set.length), 
                    x2 + othersMeanValues[entryIndex] * Math.sin(2 * Math.PI * otherPosition / set.length)
                ])
                }
                console.log('pointsPossiblePositions', pointsPossiblePositions)
                let possibleMagnitude = pointsPossiblePositions.map(([x1, x2]) => Math.sqrt(Math.pow(x1, 2) + Math.pow(x2, 2))).reduce((p, c) => p + c, 0) / pointsPossiblePositions.length
                console.log('possibleMagnitude', possibleMagnitude)
                if (possibleMagnitude > currentMagnitude) {
                currentPosition = possiblePosition
                currentMagnitude = possibleMagnitude
                }
            }
            console.log('currentPosition', currentPosition)
            }
            arrangement[currentPosition] = dimensionIndex
            assignedPositions.push(currentPosition)
            availablePositions.splice(availablePositions.indexOf(currentPosition), 1)
            pointsAssignedPositions = pointsAssignedPositions.map(([x1, x2], entryIndex) => [
            x1 + normalizedSet[dimensionIndex][entryIndex] * Math.cos(2 * Math.PI * currentPosition / set.length), 
            x2 + normalizedSet[dimensionIndex][entryIndex] * Math.sin(2 * Math.PI * currentPosition / set.length)
            ])
            console.log('availablePositions', availablePositions)
            console.log('pointsAssignedPositions', pointsAssignedPositions)
            console.log('arrangement', arrangement)
        }
        return arrangement
    }
    /*
    *
    */
    this.minEffectivenessErrorHeuristic = function(data, k=null){
        function arrangementCost(costMatrix, arr){
            let cost = 0;
            for(let i=0; i<arr.length; i++){
                let j = (i+1)%arr.length;
                cost += costMatrix[arr[i]][arr[j]];
            }
            return cost;
        }
        function arrangementSwap(arr, i, j){
            let result = arr.slice(); //JSON.parse(JSON.stringify(arr));
            let tmp = result[i];
            result[i] = result[j];
            result[j] = tmp;
            return result; 
        }
        ///

        console.log(data)
        console.log(data.dimensions.map(d=> d.id))
        let m = data.entries.length;
        let n = data.dimensions.length;
        if(k == null) k = 10;
        let C = Array(n).fill(null).map(()=>Array(n).fill(0));
        for(let j=0; j<n; j++) C[j][j] = Infinity; //fill diagonal with infinity
        for(let i=0; i<m; i++){
            let delta = 0;
            for(let dim1=0; dim1<n; dim1++){
                for(let dim2=0; dim2<n; dim2++){
                    delta += Math.abs(data.dimensions[dim1].values[i] - data.dimensions[dim2].values[i])
                }
            }
            for(let dim1=0; dim1<n; dim1++){
                for(let dim2=0; dim2<n; dim2++){
                    if(dim1 == dim2) continue;
                    if(delta != 0) C[dim1][dim2] += Math.abs(data.dimensions[dim1].values[i] - data.dimensions[dim2].values[i]) / delta;
                }
            }  
        }
        ////
        let resultArrangement = null;
        let resultArrangementCost = Infinity;
        for(let startDim=0; startDim<n; startDim++){
            let arrangement = [startDim];
            while(arrangement.length != n){ //add a dimension on each loop iteration
                let bestCost = Infinity;
                let bestDim = null;
                let bestPosition = null;
                for(let dim=0; dim<n; dim++){
                    if(arrangement.includes(dim)) continue;
                    let leftCost = C[arrangement[0]][dim];
                    let rightCost = C[arrangement[arrangement.length-1]][dim];
                    let currentBestCost = Math.min(leftCost, rightCost);
                    let currentBestPosition = leftCost < rightCost ? -1 : 1;
                    if(currentBestCost < bestCost){
                        bestDim = dim;
                        bestCost = currentBestCost;
                        bestPosition = currentBestPosition;
                    }
                }
                if(bestPosition == -1) arrangement.unshift(bestDim);
                else arrangement.push(bestDim);
                ///optimize
                if(arrangement.length > 2){
                    let A = arrangement.slice(); 
                    let steps = 0;
                    let improved = true;
                    while(improved && steps < k){
                        improved = false;
                        steps++;
                        let bestA = null;
                        let bestCost = arrangementCost(C, A);
                        for(let i=0; i<A.length; i++){
                            let j=(i+1)%A.length;
                            let tmpA = arrangementSwap(A, i, j);
                            let tmpCost = arrangementCost(C, tmpA);
                            if(tmpCost < bestCost){
                                bestA = tmpA;
                                bestCost = tmpCost;
                            }
                        }
                        if(bestA != null){
                            A = bestA;
                            improved = true;
                        }
                    }
                    arrangement = A;
                }
            }
            let currentCost = arrangementCost(C, arrangement);
            if(currentCost < resultArrangementCost){
                resultArrangement = arrangement;
                resultArrangementCost = currentCost;
            }
        }
        /// 0 as first dimension in the arrangement
        while(resultArrangement[0] != 0){
            let dim = resultArrangement.shift();
            resultArrangement.push(dim);
        }
        if(resultArrangement[1] > resultArrangement[resultArrangement.length-1]){
            let dim = resultArrangement.shift();
            resultArrangement.reverse();
            resultArrangement.unshift(dim);
        }
        return resultArrangement;
  
    }
    /*
    *
    */
   return this;
}).apply({});
/*
// lasciare, magari serve in futuro
function fractionalRanking(entry){
        ///faccio il rannking dell'array di valori passato
        //https://en.wikipedia.org/wiki/Ranking
        function round(value, decimals) {
            return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }
    
        let d = entry.map((v,i) => {
            return {
                value: round(v, 8), 
                index: i, 
                rank: null,
                multiple: false
            };
        }).sort((a,b) => a.value - b.value);
        
        for(let i=0; i<d.length; i++) d[i].rank = (i+1);
        let i = 0;
        while(i < d.length){
            if(i != d.length-1){
                let equalRanks = [d[i].rank];
                for(let j=i+1; j<d.length; j++){
                    if(d[i].value == d[j].value){
                        equalRanks.push(d[j].rank);
                    }
                    else break;
                }
                if(equalRanks.length > 1){
                    let r = d3.mean(equalRanks);
                    for(let j=i; j<i+equalRanks.length; j++){
                        d[j].rank = r;
                    }
                    i += equalRanks.length;
                }
                else i++;
            }
            else i++;
        }
        return d.sort((a,b) => a.index - b.index).map(el => el.rank);
    }
*/