import { BaseType, Selection } from 'd3-selection';

export type RadVizData = {
  angles: number[],
  attributes: string[],
  dimensions: string[],
  entries: any[],
  original: any[]
};

export type RadViz = {
  data(dataset: any[], classificationAttribute?: string): RadViz;
  data(): RadVizData;
  getIndex(): number;
  updateRadviz(dimensionArrangement: string[]): void;
  setColorClassification(nameAttribute: string): void;
  setMargin(size: number): void;
  setLevel(number: number): void;
  setRadiusPoints(size: number): void;
  increaseRadius(): void;
  decreaseRadius(): void;
  increaseLevelGrid(): void;
  decreaseLevelGrid(): void;
  setQuality(): void;
  getQuality(): boolean;
  setColorPoint(flag: number);
  setFunctionDragEnd(customizedFunction: (angles: number[]) => void);
  setFunctionClick(customizedFunction: (angles: number[], datum: any, selection: Selection<BaseType, unknown, HTMLElement, any>) => void);
  setFunctionMouseOver(customizedFunction: (angles: number[], selection: Selection<BaseType, unknown, HTMLElement, any>) => void);
  setFunctionMouseOut(customizedFunction: (selection: Selection<BaseType, unknown, HTMLElement, any>) => void);
  setFunctionContextMenu(customizedFunction: (angles: number[]) => void);
  setFunctionUpdateResults(customizedFunction: (meanError: number) => void);
}

export function radviz(): RadViz;
export function radvizDA(): any;