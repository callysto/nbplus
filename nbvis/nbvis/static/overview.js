var cellElement = this.element.parents(".cell"),
    cellIndex = Jupyter.notebook.get_cell_elements().index(cellElement),
    cellDiv = d3.select(Jupyter.notebook.get_cell(cellIndex).element[0]);

var notebookContainer = d3.select("#notebook-container"),
    siteContainer = document.getElementById("site"),
    leftMargin = d3.select('.input_prompt');

notebookContainer.selectAll('.movers').remove();

var notebookContainerWidth = notebookContainer.node().getBoundingClientRect().width,
    leftMarginWidth = leftMargin.node().getBoundingClientRect().width,
    cellWidth = cellDiv.node().getBoundingClientRect().width,
    padding = parseInt(notebookContainer.style("padding"), 10);

var width = notebookContainerWidth - 2*padding,
    height = siteContainer.getBoundingClientRect().height;

var marginAndPadding = leftMarginWidth + padding,
    rightMargin = width - cellWidth + padding,
    viewWidth = rightMargin - marginAndPadding,
    viewTop = siteContainer.scrollTop + height/2 - viewWidth/2,
    viewLeft = cellWidth + padding + rightMargin/2 - viewWidth/2;

var mover = d3.select("#notebook-container")
    .append('div')
    .attr('id', 'mover')
    .attr('class', 'movers')
    .style('border', '1px solid #cfcfcf')
    .style('position', 'absolute')
    .style('width', viewWidth.toString() + 'px')
    .style('height', viewWidth.toString() + 'px')
    .style('top', viewTop.toString() + 'px')
    .style('left', viewLeft.toString() + 'px')

siteContainer.onscroll = () => {
    mover.transition()
         .duration(500)
         .style('top', (siteContainer.scrollTop + height/2 - viewWidth/2).toString() + 'px')
}