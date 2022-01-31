# d3-radviz
 
The d3-radviz is a d3.js plugin that implements RadViz plots. The dimension arrangement (DA) follows the heuristic described in the paper which minimizes the effectiveness error that degradate the visualization of the radviz. In addition, functions are provided to customize dimension arrangement, interaction and design of the visualization.
An example of the application can be seen in the [Demo](https://aware-diag-sapienza.github.io/d3-radviz/dev/index.html) or in the [Experimental Environment](https://aware-diag-sapienza.github.io/d3-radviz/prototype/index.html)

<img alt="radviz" src="https://github.com/aware-diag-sapienza/d3-radviz/blob/master/dev/d3-radviz.png" width="960">

Source: [CSM Dataset](https://archive.ics.uci.edu/ml/datasets/CSM+%28Conventional+and+Social+Media+Movies%29+Dataset+2014+and+2015).

## Citation Policy
 If you use this work in your research, please cite: 
> M. Angelini, G. Blasilli, S. Lenti, A. Palleschi and G. Santucci, "Effectiveness Error: Measuring and Improving RadViz Visual Effectiveness," in IEEE Transactions on Visualization and Computer Graphics, 
 DOI: [10.1109/TVCG.2021.3104879](https://doi.org/10.1109/TVCG.2021.3104879).

BibTex:
```
@ARTICLE{9514468,
  author={Angelini, Marco and Blasilli, Graziano and Lenti, Simone and Palleschi, Alessia and Santucci, Giuseppe},
  journal={IEEE Transactions on Visualization and Computer Graphics}, 
  title={Effectiveness Error: Measuring and Improving RadViz Visual Effectiveness}, 
  year={2021},
  volume={},
  number={},
  pages={1-1},
  doi={10.1109/TVCG.2021.3104879}}
```

## Installing

If you use NPM, `npm install d3-radviz`, here the [d3-radvix NPM page](https://www.npmjs.com/package/d3-radviz). Otherwise, download the [latest release](https://github.com/aware-diag-sapienza/d3-radviz/releases/latest).

```html
<script src="d3-radviz.js"></script>
<script>

var radviz = d3.radviz();

</script>
```

## Content

The plug-in implemented creates Radviz visualization.

- [`src/arrangement.js`](src/arrangement.js) – There are the functions that perform the DA
- [`src/data.js`](src/data.js) – There are the functions that perform the operation on the data (es. loading of the dataset)
- [`src/index.js`](src/index.js) – Addition of the function implemented
- [`src/radviz.js`](src/radviz.js) – All the implementation of the RadViz
- [`src/utils.js`](src/utils.js) – Contains the addition utils (eg. responsive svg)
- [`dev/index.html`](dev/index.html)– The example to use the plugin
- [`dev/data`](dev/data) – Contains some samples datasey

## API Reference

<a href="#radviz" name="radviz">#</a> d3.<b>radviz</b>() [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Constructs a new radviz generator with the default settings.

<a href="#radviz_data" name="radviz_data">#</a> <i>radviz</i>.<b>data</b>(<i>dataset,classification_attribute</i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Uploads the *dataset* in the radviz adding the *classification_attributes* for the clusters. The *classification_attribute* is an optional input.
By default the numeric values are saved as *dimensions*, contrary the not numeric values are saved as *attributes*.

<a href="#radviz_data" name="radviz_data">#</a> <i>radviz</i>.<b>data</b>() [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Returns the datates of the radviz. The *data* structure contains the following objects:

* *radviz.data().angles* - the angles of the radviz visualization
* *radviz.data().attributes* - the attributes of the dataset, so the not numeric values or the *classification_attribute* before passed. 
* *radviz.data().dimensions* - the dimensions of the dataset, so the numeric values normalized with the min-max normalization.
* *radviz.data().entries* - all the entries of the dataset.
* *radviz.data().original* - all dataset with the original values.

<a href="#radviz_updateRadviz " name="radviz_updateRadviz ">#</a> <i>radviz</i>.<b>updateRadviz </b>(<i>dimension arrangement</i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Sets the anchor points of the radviz as the *dimension arrangement* array passed. If *dimension arrangement* is null, the Original Dimension Arrangement is applied. 

* *dimension arrangement* - is an array containing the index of the dimension (e.g., [4,2,1,3,0])

<a href="#radviz_index" name="radviz_index">#</a> <i>radviz</i>.<b>getIndex</b>() [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Return the unique index of the radviz used for the multiple instantiation in the same page of the radviz.

<a href="#radviz_colorClassification" name="radviz_colorClassification">#</a> <i>radviz</i>.<b>setColorClassification</b>(<i>name attribute</i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Assign *name attribute* to the color scale classification. 

<a href="#radviz_Margin" name="radviz_Margin">#</a> <i>radviz</i>.<b>setMargin</b>(<i>size</i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Set the margin equal to *size*. 

<a href="#radviz_Level" name="radviz_Level">#</a> <i>radviz</i>.<b>setLevel</b>(<i>number</i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Set the levels of the grid to *number*. 

<a href="#radviz_RadiusPoints" name="radviz_RadiusPoints">#</a> <i>radviz</i>.<b>setRadiusPoints</b>(<i>size</i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Set the radius of the points to *size*. 

<a href="#radviz_increaseRadius" name="radviz_increaseRadius">#</a> <i>radviz</i>.<b>increaseRadius</b>() [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Increase the radius of the points of 0.25 . 

<a href="#radviz_decreaseRadius" name="radviz_decreaseRadius">#</a> <i>radviz</i>.<b>decreaseRadius</b>() [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Decrease the radius of the points of 0.25 . 

<a href="#radviz_increaseLevelGrid" name="radviz_increaseLevelGrid">#</a> <i>radviz</i>.<b>increaseLevelGrid</b>() [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Add one level to the grid. 

<a href="#radviz_decreaseLevelGrid" name="radviz_decreaseLevelGrid">#</a> <i>radviz</i>.<b>decreaseLevelGrid</b>() [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Remove one level to the grid. 

<a href="#radviz_setQuality" name="radviz_setQuality">#</a> <i>radviz</i>.<b>setQuality</b>() [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Change the color of the points, by default each point encodes the value of Effectiveness Error, but it is possible to encodes the classification attribute of the dataset.

From now on there are all the functions that can enrich the RadViz with custom functions related to the principal interaction that the user can perform on the RadViz chart like: 
- *DragEnd* of anchors
- *Click* of points inside RadViz
- *MouseOver* of points inside RadViz
- *MouseOut* of points inside RadViz
- *ContextMenu* of points inside RadViz
- *UpdateResults* after the application of a Dimension Arrangement to RadViz 


<a href="#radviz_setFunctionDragEnd" name="radviz_setFunctionDragEnd">#</a> <i>radviz</i>.<b>setFunctionDragEnd</b>(<i>customized_function </i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Set the *customized_function* to the drag-and-drop event of the anchor points. 

<a href="#radviz_setFunctionClick" name="radviz_setFunctionClick">#</a> <i>radviz</i>.<b>setFunctionClick</b>(<i>customized_function </i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Set the *customized_function* to the click event of the points. 

<a href="#radviz_setFunctionMouseOver" name="radviz_setFunctionMouseOver">#</a> <i>radviz</i>.<b>setFunctionMouseOver</b>(<i>customized_function </i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Set the *customized_function* to the mouse-over event of the points. 

<a href="#radviz_setFunctionMouseOut" name="radviz_setFunctionMouseOut">#</a> <i>radviz</i>.<b>setFunctionMouseOut</b>(<i>customized_function </i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Set the *customized_function* to the mouse-out event of the points. 

<a href="#radviz_setFunctionContextMenu" name="radviz_setFunctionContextMenu">#</a> <i>radviz</i>.<b>setFunctionContextMenu</b>(<i>customized_function </i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Set the *customized_function* to the contect menu event of the points. 

<a href="#radviz_setFunctionUpdateResults" name="radviz_setFunctionUpdateResults">#</a> <i>radviz</i>.<b>setFunctionUpdateResults</b>(<i>customized_function </i>) [<>](https://github.com/d3/d3-radviz/src/radviz.js "Source")

Set the *customized_function* to update the result of the Effectiveness Error for the current Dimension Arrangement. 

## Credits
 If you use this work in your research, please cite: 
> M. Angelini, G. Blasilli, S. Lenti, A. Palleschi and G. Santucci, "Effectiveness Error: Measuring and Improving RadViz Visual Effectiveness," in IEEE Transactions on Visualization and Computer Graphics, 
 DOI: [10.1109/TVCG.2021.3104879](https://doi.org/10.1109/TVCG.2021.3104879).

BibTex:
```
@ARTICLE{9514468,
  author={Angelini, Marco and Blasilli, Graziano and Lenti, Simone and Palleschi, Alessia and Santucci, Giuseppe},
  journal={IEEE Transactions on Visualization and Computer Graphics}, 
  title={Effectiveness Error: Measuring and Improving RadViz Visual Effectiveness}, 
  year={2021},
  volume={},
  number={},
  pages={1-1},
  doi={10.1109/TVCG.2021.3104879}}
```