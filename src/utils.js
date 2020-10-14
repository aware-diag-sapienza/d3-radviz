// Adapted from https://benclinkinbeard.com/d3tips/make-any-chart-responsive-with-one-function/
import { select } from 'd3-selection';

export function responsiveSquare(svg) {
    const container = select(svg.node().parentNode);
    svg.call(resize);
    select(window).on(`resize.${container.attr('id')}`, resize);
    function resize() {
        const w = parseInt(container.node().getBoundingClientRect().width),
            h = parseInt(container.node().getBoundingClientRect().height),
            s = Math.min(w, h);
        svg.attr('width', s);
        svg.attr('height', s);
    }
}
