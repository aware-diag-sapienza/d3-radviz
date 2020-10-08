// Adapted from https://benclinkinbeard.com/d3tips/make-any-chart-responsive-with-one-function/
import * as d3 from 'd3';

export function responsiveSquare(svg) {
  const container = d3.select(svg.node().parentNode)
  svg.call(resize)
  d3.select(window).on(`resize.${container.attr('id')}`, resize)
  function resize() {
    const w = parseInt(container.node().getBoundingClientRect().width),
          h = parseInt(container.node().getBoundingClientRect().height),
          s = Math.min(w, h)
    svg.attr('width', s)
    svg.attr('height', s)
  }
}
