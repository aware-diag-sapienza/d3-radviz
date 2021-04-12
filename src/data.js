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
            dimensions: {},
            attributes: {},
            original: {},
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
        data.entries.push(entry);
    }
    
    // Representative Entry
    data.representativeEntry = computeRepresentativeEntry(data.dimensions) 
    // Dimensions Dominanice
    data.dimensionsDominance = computeDimensionsDominance(data.entries)
    data.dimensionsDominanceMean = computeDimensionsDominanceMean(data.entries)
    // Similarities & Outliers 
    const sim = computeSimilarities(data.entries, data.representativeEntry)
    const outliers = computeOutliers(sim)
    for(let i=0; i<data.entries.length; i++){
        data.entries[i].representativeSimilarity = sim[i]
        data.entries[i].outlier = outliers[i]
    }

    // generate angles for the visualization
    data.angles = assignAnglestoDimensions(data.dimensions.map((d) => d.id),data);
    //
    return data
}

function computeRepresentativeEntry(dimensions){
    const representativeEntry = {
        dimensions: {},
        attributes: {},
        original: {},
        x1: 0,
        x2: 0,
        selected: false,
        errorE: 0,
        index: null
    };
    dimensions.forEach(d => {
        representativeEntry.dimensions[d.id] = sum(d.values)
    })
    dimensions.forEach(d => {
        representativeEntry.dimensions[d.id] /= sum(Object.keys(representativeEntry.dimensions), d => representativeEntry.dimensions[d])
    })
    return representativeEntry
}

function computeDimensionsDominance(entries){
    const dims = Object.keys(entries[0].dimensions)
    const freq = dims.map(d => 0)
    
    entries.forEach(e => {
        const values = dims.map(d => e.dimensions[d])
        const vMax = max(values)
        for(let i=0; i<values.length; i++){
            if(values[i] == vMax) freq[i]++
        }
    })

    let dominance = dims.map((d, i) => {
        return {
            id: d,
            count: freq[i]
        }
    }).sort((a, b) => b.count - a.count)
    dominance = dominance.map((d, i) => { return {...d, dominance: i}})
    return dominance
}

function computeDimensionsDominanceMean(entries){
    const dims = Object.keys(entries[0].dimensions)
    const freq = dims.map(d => 0)
    
    entries.forEach(e => {
        const values = dims.map(d => e.dimensions[d])
        const vMax = max(values)
        const discountedMean = (sum(values) - vMax) / values.length
        for(let i=0; i<values.length; i++){
            if(values[i] == vMax) freq[i] += vMax / discountedMean //max/media altri
        }
    })

    let dominance = dims.map((d, i) => {
        return {
            id: d,
            count: freq[i]
        }
    }).sort((a, b) => b.count - a.count)
    dominance = dominance.map((d, i) => { return {...d, dominance: i}})
    return dominance
}

function computeSimilarities(entries, representativeEntry){
    function cosinesim(A,B){
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

    const similarities = Array(entries.length).fill(0)
    const dims = Object.keys(entries[0].dimensions)
    const vr = dims.map(d => representativeEntry.dimensions[d])
    for(let i=0; i<entries.length; i++){
        const v = dims.map(d => entries[i].dimensions[d])
        similarities[i] = cosinesim(v, vr)
    }
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
    
    const outliers = similarities.map(s => (s<=distribution.wMin || s>=distribution.wMax))
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

        let index_dominance_mean = data.dimensionsDominanceMean.findIndex(function(post, index) {
            if(post.id == d)
                return true;
        });

        let lab_dom = function(dom,nam){
            if (dom>5) return nam;
            else return (dom+1) + '-' + nam
        }

        real_dimensions.push({
            'value': d,
            'index': i,
            'start': start_a,
            'end': end_a,
            'drag': false,
            'x1': x1,
            'x2': x2,
            'dominance':index_dominance,
            'meandomincance':index_dominance_mean,
            'labeldominance':lab_dom(index_dominance,d),
            'labelmeandominance':lab_dom(index_dominance_mean,d),
        });
    });

    return real_dimensions;
}