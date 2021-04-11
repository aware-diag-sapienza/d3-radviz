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
    console.log("min", min, "max", max);
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
        angles: []
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
            index: i
        };
        for (const d of data.dimensions) entry.dimensions[d.id] = d.values[i];
        for (const a of data.attributes) entry.attributes[a.id] = a.values[i];
        for (const o of data.original) entry.original[o.id] = o.values[i];
        data.entries.push(entry);
    }

    data.angles = assignAnglestoDimensions(data.dimensions.map((d) => d.id));
    return data;
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

    data.angles = assignAnglestoDimensions(data.dimensions.map((d) => d.id));
    return data;
}

export function assignAnglestoDimensions(dimensions) {
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


        real_dimensions.push({
            'value': d,
            'index': i,
            'start': start_a,
            'end': end_a,
            'drag': false,
            'x1': x1,
            'x2': x2,
        });
    });

    return real_dimensions;
}