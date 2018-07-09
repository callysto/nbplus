from IPython.display import HTML, Javascript

style = """
    <style>
        div.input { width: 66% }
        div.output_wrapper { width: 66% }
        div.text_cell { width: 66% }
    </style>
    """

js = """
    requirejs.config({
        paths: { "d3": "//d3js.org/d3.v5.min" }
    });
    requirejs(["d3"], d3 => {
        var cellElement = this.element.parents(".cell"),
            cellIndex = Jupyter.notebook.get_cell_elements().index(cellElement),
            cellDiv = Jupyter.notebook.get_cell(cellIndex).element[0],
            width = d3.select(cellDiv).node().getBoundingClientRect().width;

        var container = d3.select("#notebook-container")
        console.log(container.selectAll('.movers'))
        container.selectAll('.movers').remove();

        var siteContainer =  document.getElementById('site'),
            height = siteContainer.getBoundingClientRect().height;
        
        var leftMargin = d3.select('.input_prompt').node().getBoundingClientRect().width;
        
        var mover = d3.select("#notebook-container")
            .append('div')
            .attr('class', 'movers')
            .style('border', '1px solid #cfcfcf')
            .style('position', 'absolute')
            .style('width', (0.34*width-leftMargin).toString() + 'px')
            .style('height', (2*height/3).toString() + 'px')
            .style('top', (siteContainer.scrollTop + height/6).toString() + 'px')
            .style('left', (leftMargin/2 + 0.66*width).toString() + 'px')
           
        var moverWidth = mover.node().getBoundingClientRect().width,
            moverHeight = mover.node().getBoundingClientRect().height;
            
        // Populate a grid of n×m values where -2 ≤ x ≤ 2 and -2 ≤ y ≤ 1.
            var n = parseInt(moverWidth), m = parseInt(moverHeight), values = new Array(n * m);
            for (var j = 0.5, k = 0; j < m; ++j) {
              for (var i = 0.5; i < n; ++i, ++k) {
                values[k] = goldsteinPrice(i / n * 4 - 2, 1 - j / m * 3);
              }
        }

        var svg = mover.append('svg').attr('width', '100%').attr('height', '100%')

        var thresholds = d3.range(1, 21)
            .map(function(p) { return Math.pow(2, p); });

        var contours = d3.contours()
            .size([n, m])
            .thresholds(thresholds);

        var color = d3.scaleLog()
            .domain(d3.extent(thresholds))
            .interpolate(function() { return d3.interpolateYlGnBu; });

        svg.selectAll("path")
          .data(contours(values))
          .enter().append("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(moverWidth / n)))
            .attr("fill", function(d) { return color(d.value); });

        function goldsteinPrice(x, y) {
          return (1 + Math.pow(x + y + 1, 2) * (19 - 14 * x + 3 * x * x - 14 * y + 6 * x * x + 3 * y * y))
              * (30 + Math.pow(2 * x - 3 * y, 2) * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y * y));
        }

        siteContainer.onscroll = () => {
            mover.transition()
                 .duration(500)
                 .style('top', (siteContainer.scrollTop + height/6).toString() + 'px')
        }
    });
    """

def overview():
    display(HTML(style))
    display(Javascript(js))