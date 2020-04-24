# d3-radviz
 
This d3-radviz is a d3.js plugin that implements RadViz visualization. The dimension arrangement (DA) follows the heuristic described in the paper which minimizes the effectiveness error that degradate the visualization of the radviz. In addition, functions are provided to customize dimension arrangement, interaction and design of the visualization.

<img alt="radviz" src="https://github.com/aware-diag-sapienza/d3-radviz/blob/master/dev/d3-radviz.png" width="960">

Source: CSM Dataset se qualcuno deve linkarlo.
## Installing

If you use NPM, `npm install d3-radviz`. Otherwise, download the [latest release](https://github.com/aware-diag-sapienza/d3-radviz/releases/latest).

```html
<script src="d3-radviz.js"></script>
<script>

var radviz = d3.radviz();

</script>
```

## Content

The plug-in implemented creates Radviz visualization a rectangle per dataset in [`example/data.csv`](example/data.csv) and the given width and height.

- [`src/arrangement.js`](src/arrangement.js) – There are the functions that perform the DA
- [`src/data.js`](src/data.js) – There are the functions that perform the operation on the data (es. loading of the dataset)
- [`src/index.js`](src/index.js) – Addition of the function implemented
- [`src/radviz.js`](src/radviz.js) – All the implementation of the RadViz
- [`src/utils.js`](src/utils.js) – Contains the addition utils (eg. responsive svg)
- [`dev/index.html`](dev/index.html)– The example to use the plugin
- [`dev/data`](dev/data) – Contains some samples datasey

## API Reference

API DOCUMENTATION


## API Reference

<a href="#radviz" name="radviz">#</a> d3.<b>radviz</b>() [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Constructs a new radviz generator with the default settings.

<a href="#radviz_update" name="radviz_update">#</a> <i>radviz</i>.<b>data</b>(<i>dataset,classification_attribute</i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Uploads the *dataset* in the radviz adding the *classification_attributes* for the clusters. The *classification_attribute* is an optional input.
By default the numeric values are saved as *dimensions*, contrary the not numeric values are saved as *attributes*.

The *data* structure contains the following objects:

* *radviz.data().angles* - the angles of the radviz visualization
* *radviz.data().attributes* - the attributes of the dataset, so the not numeric values or the *classification_attribute* before passed. 
* *radviz.data().dimensions* - the dimensions of the dataset, so the numeric values normalized with the min-max normalization.
* *radviz.data().entries* - all the entries of the dataset.
* *radviz.data().original* - all dataset with the original values.