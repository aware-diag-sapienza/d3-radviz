import { min, max, sum, quantile } from 'd3-array'

const getDimensionValues = (dimension, entries) => {
    const values = entries.map(e => +e[dimension]);
    return {
        numeric: !values.some(isNaN),
        values: !values.some(isNaN) ? values : entries.map(e => e[dimension])
    };
};

const minMaxNormalization = (values) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    let checkDivision = function(v, mi, ma) {
        if ((v - mi) == 0 || (ma - mi) == 0) return 0;
        else return (v - mi) / (ma - mi);
    };
    return values.map(v => checkDivision(v, min, max));
};

const normalizeVector = (v) => {
    const vSum = sum(v);
    const vLen = Math.sqrt(sum(v.map(d => d*d)));
    //return v.map(d => d / vSum); //sum 1
    return v.map(d => d / vLen); // len 1
}

const cosinesim = (A,B) => {
    var dotproduct=0;
    var mA=0;
    var mB=0;
    for(let i = 0; i < A.length; i++){
        dotproduct += (A[i] * B[i]);
        mA += (A[i]*A[i]);
        mB += (B[i]*B[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = (dotproduct)/((mA)*(mB))
    return similarity;
}

export function checkData(data) {
    // TODO: update checkData
    return 'entries' in data && 'dimensions' in data && 'attributes' in data;
}

export function checkDataset(dataset) {
    // TODO: update checkDataset
    return Array.isArray(dataset);
}

export function loadDataset(dataset, name) {
    let classification = null;
    if (arguments.length == 2) classification = name;
    if (!checkDataset(dataset)) throw new TypeError('Invalid input');
    const data = {
        entries: [],
        dimensions: [],
        attributes: [],
        original: [],
        angles: [],
        representativeEntry: {},
        dimensionsDominance: [],
        dimensionsDominanceMean: []
    };
    Object.keys(dataset[0]).forEach(k => {
        let { numeric, values } = getDimensionValues(k, dataset);
        data['original'].push({
            id: k,
            values: values
        });
        if (classification != k) {
            data[numeric ? 'dimensions' : 'attributes'].push({
                id: k,
                values: numeric ? minMaxNormalization(values) : values
            });
        } else {
            data['attributes'].push({
                id: k,
                values: values
            });
        }

    });
    if (!data.dimensions.length) throw new Error('At least one numerical attribute is required');

    for (let i = 0; i < dataset.length; i++) {
        let entry = {
            id: `p${i}`,
            dimensions: {},
            attributes: {},
            original: {},
            vector: [],
            x1: 0,
            x2: 0,
            selected: false,
            errorE: 0,
            index: i,
            outlier: false,
            representativeSimilarity: 0
        };
        for (const d of data.dimensions) entry.dimensions[d.id] = d.values[i];
        for (const a of data.attributes) entry.attributes[a.id] = a.values[i];
        for (const o of data.original) entry.original[o.id] = o.values[i];
        entry.vector = normalizeVector(Object.values(entry.dimensions));
        data.entries.push(entry);
    }
    
    // Representative Entry
    data.representativeEntry = computeRepresentativeEntry(data.entries) 
    // Dimensions Dominanice
    data.dimensionsDominance = computeDimensionsDominance(data.representativeEntry)
    // Similarities & Outliers 
    const similarities = computeSimilarities(data.entries, data.representativeEntry)
    const outliers = computeOutliers(similarities)
    for(let i=0; i<data.entries.length; i++){
        data.entries[i].representativeSimilarity = similarities[i]
        data.entries[i].outlier = outliers[i]
    }
    // generate angles for the visualization
    data.angles = assignAnglestoDimensions(data.dimensions.map((d) => d.id),data);
    //
    return data
}


function computeRepresentativeEntry(entries){
    const dims = Object.keys(entries[0].dimensions)
    let rv = Array(dims.length).fill(0)
    for(let i=0; i<entries.length; i++){
        for(let j=0; j<dims.length; j++){
            rv[j] += entries[i].vector[j]
        }
    }
    rv = rv.map(v => v / entries.length)
    //rv = normalizeVector(rv)

    const representativeEntry = {
        id: 'rp',
        dimensions: {},
        vector: rv,
        x1: 0,
        x2: 0
    };
    dims.forEach((d, j) => {
        representativeEntry.dimensions[d] = representativeEntry.vector[j]
    })
    return representativeEntry
}

function computeDimensionsDominance(representativeEntry){
    const dims = Object.keys(representativeEntry.dimensions);
    const dominance = representativeEntry.vector.map((v, i) => {
      return {
          id: dims[i],
          val: v
      }
    })
    .sort((a, b) => b.val - a.val)
    .map((d, i) => { return {...d, dominance: i}});
    return dominance
}


function computeSimilarities(entries, representativeEntry){
    const similarities = entries.map(e => cosinesim(e.vector, representativeEntry.vector))
    return similarities
}

function computeOutliers(similarities){
    const sortedSim = similarities.map(d => d).sort() //copy and sort

    const distribution = {
        min: min(sortedSim),
        q1: quantile(sortedSim, 0.25),
        median: quantile(sortedSim, 0.5),
        q3: quantile(sortedSim, 0.75),
        max: max(sortedSim),
        wMin: null,
        wMax: null
    }
    distribution.iqr = distribution.q3 - distribution.q1
    distribution.wMin = Math.max(distribution.q1 - (1.5 * distribution.iqr), distribution.min)
    distribution.wMax =  Math.min(distribution.q3 + (1.5 * distribution.iqr), distribution.max)
    
    const outliers = similarities.map(s => (s < distribution.wMin || s > distribution.wMax))
    return outliers
}


export function reloadDataset(dataset, attr) {
    if (!checkDataset(dataset)) throw new TypeError('Invalid input');
    const data = {
        entries: [],
        dimensions: [],
        attributes: [],
        original: [],
        angles: []
    };
    Object.keys(dataset[0]).forEach(k => {
        let { numeric, values } = getDimensionValues(k, dataset);
        data['original'].push({
            id: k,
            values: values
        });
        if (k == attr) {
            data['attributes'].push({
                id: k,
                values: values
            });
        } else {
            data[numeric ? 'dimensions' : 'attributes'].push({
                id: k,
                values: numeric ? minMaxNormalization(values) : values
            });
        }
    });
    if (!data.dimensions.length) throw new Error('At least one numerical attribute is required');

    for (let i = 0; i < dataset.length; i++) {
        let entry = {
            dimensions: {},
            attributes: {},
            original: {},
            x1: 0,
            x2: 0,
            selected: false,
            errorE: 0,
            index: i
        };
        for (const d of data.dimensions) entry.dimensions[d.id] = d.values[i];
        for (const a of data.attributes) entry.attributes[a.id] = a.values[i];
        for (const o of data.original) entry.original[o.id] = o.values[i];
        data.entries.push(entry);
    }

    data.angles = assignAnglestoDimensions(data.dimensions.map((d) => d.id),data);
    return data;
}

export function assignAnglestoDimensions(dimensions,data) {
    console.log(data)
    
    let real_dimensions = [];
    dimensions.forEach(function(d, i) {
        let start_a = -1;
        let end_a = (((360 / dimensions.length) * Math.PI) / 180) * (i + 1);
        let x2, x1;
        if (i == 0) {
            start_a = 0;
            x2 = 0;
            x1 = Math.sin((Math.PI / 2) + (start_a));
        } else {
            start_a = (((360 / dimensions.length) * Math.PI) / 180) * (i);
            if (start_a == 1.5707963267948966) {
                x1 = 0;
            } else {
                x1 = Math.sin((Math.PI / 2) + (start_a));
            }
            if (start_a == 3.141592653589793) {
                x2 = 0;
            } else {
                x2 = Math.cos((-Math.PI / 2) + (start_a));
            }
        }

        let index_dominance = data.dimensionsDominance.findIndex(function(post, index) {
            if(post.id == d)
                return true;
        });

        let lab_dom = (dom, nam) => `${dom+1}-${nam}`

        real_dimensions.push({
            'value': d,
            'index': i,
            'start': start_a,
            'end': end_a,
            'drag': false,
            'x1': x1,
            'x2': x2,
            'dominance':index_dominance,
            'labeldominance':lab_dom(index_dominance,d),
        });
        console.log(real_dimensions)
    });

    return real_dimensions;
}