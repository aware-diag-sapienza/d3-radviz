import { BaseType, Selection } from 'd3-selection';

/**
 * Data type used internally by radviz.
 * @property angles: angles of axes in radials
 * @property attributes: list of categorical attributes
 * @property dimensions: list of numerical dimensions
 * @property attributes: list of data points from the original data, stored as lists of
 *                       normalized values
 * @property original: reference to original data
 */
export type RadVizData = {
  angles: number[],
  attributes: string[],
  dimensions: string[],
  entries: any[],
  original: any[]
};

export type RadViz = {
  /**
   * Uploads the dataset in the radviz adding the classification_attributes for the clusters.
   * The classification_attribute is an optional input. By default the numeric values are saved as
   * dimensions, contrary the not numeric values are saved as attributes.
   * @param dataset                   tabular dataset
   * @param classificationAttribute   optional attribute used for classifcation
   * */
  data(dataset: any[], classificationAttribute?: string): RadViz;

  /**
   * Returns the transformed data used by the generator.
   */
  data(): RadVizData;

  /**
   * Return the unique index of the radviz used for the multiple instantiation in the same page of
   * the radviz.
   */
  getIndex(): number;

  /**
   * Sets the anchor points of the radviz as the dimension arrangement array passed. If dimension
   * arrangement is null, the Original Dimension Arrangement is applied.
   * @param dimensionArrangement an array containing the index of the dimension (e.g., [4,2,1,3,0])
   */
  updateRadviz(dimensionArrangement: string[]): void;

  /**
   * Assign name attribute to the color scale classification.
   * @param nameAttribute dimension used for color classification
   */
  setColorClassification(nameAttribute: string): void;

  /**
   * Set the margin equal to size.
   * @param size margin between radviz and the border of the canvas
   */
  setMargin(size: number): void;

  /**
   * Set the levels of the grid to number.
   * @param number number of circular grid marks used by radviz
   */
  setLevel(number: number): void;

  /**
   * Set the radius of the points to size.
   * @param size radius of points
   */
  setRadiusPoints(size: number): void;

  /**
   * Increase the radius of the points of 0.25.
   */
  increaseRadius(): void;

  /**
   * Decrease the radius of the points of 0.25.
   */
  decreaseRadius(): void;

  /**
   * Add one level to the grid.
   */
  increaseLevelGrid(): void;

  /**
   * Remove one level from the grid.
   */
  decreaseLevelGrid(): void;

  /**
   * Change the color of the points, by default each point encodes the value of Effectiveness Error,
   * but it is possible to encodes the classification attribute of the dataset.
   */
  setQuality(): void;

  /**
   * Returns true, if the color points encode the classification attribute. False otherwise.
   */
  getQuality(): boolean;


  setColorPoint(flag: number);

  /**
   * Set the customized_function to the drag-and-drop event of the anchor points.
   * @param customizedFunction callback called whenever drag interaction completed
   */
  setFunctionDragEnd(customizedFunction: (angles: number[]) => void);

  /**
   * Set the customized_function to the click event of the points.
   * @param customizedFunction callback called whenever a point is clicked
   */
  setFunctionClick(customizedFunction: (angles: number[], datum: any, selection: Selection<BaseType, unknown, HTMLElement, any>) => void);

  /**
   * Set the customized_function to the mouse-over event of the points.
   * @param customizedFunction callback called whenever the cursor is moved over a point
   */
  setFunctionMouseOver(customizedFunction: (angles: number[], selection: Selection<BaseType, unknown, HTMLElement, any>) => void);

  /**
   * Set the customized_function to the mouse-out event of the points.
   * @param customizedFunction callback called whenever the cursor is moved out of a point
   */
  setFunctionMouseOut(customizedFunction: (selection: Selection<BaseType, unknown, HTMLElement, any>) => void);

  /**
   * Set the customized_function to the contect menu event of the points.
   * @param customizedFunction callback called whenever the context menu appears.
   */
  setFunctionContextMenu(customizedFunction: (angles: number[]) => void);

  /**
   * Set the customized_function to update the result of the Effectiveness Error for the current
   * Dimension Arrangement.
   * @param customizedFunction
   */
  setFunctionUpdateResults(customizedFunction: (meanError: number) => void);
}

/**
 * Constructs a new radviz generator with the default settings.
 */
export function radviz(): RadViz;
export function radvizDA(): any;