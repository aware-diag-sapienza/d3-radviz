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

