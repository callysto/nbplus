
var cellElements = Array.from(Jupyter.notebook.get_cells()).map(cell => cell.element[0]);

d3.selectAll(cellElements).each(function() {
    addToggle(d3.select(this));
});

Jupyter.notebook.events.on('create.Cell', function(evt, data) {
    d3.select(data.cell.element[0]).call(d => addToggle(d));
});

function addToggle(cell) {
    cell.selectAll("label").remove();

    var cellWidth = cell.node().getBoundingClientRect().width,
        cellHeight = cell.node().getBoundingClientRect().height;

    var padding = 15,
        toggleWidth = 50;

    var rightMarginWidth = parseInt(d3.select("#notebook-container")
                                      .style("margin-right"), 10);

    var label = cell.append("label")
                    .classed("switch", true)
                    .style("position", "absolute")
                    .style("width", toggleWidth.toString() + "px")
                    .style("height", "25px")
                    .style("margin-bottom", "0px")
                    .style("left", (cellWidth + padding + rightMarginWidth / 2 - toggleWidth/2).toString() + "px")
                    .style("top", "-webkit-calc(50% - 12.5px)");

    var thisCell = Jupyter.notebook.get_cells().filter(c => c.element[0] === cell.node())[0];

    if (typeof thisCell._metadata.hidden === "undefined") {
        thisCell._metadata.hidden = true;
    }

    var checkbox = label
                       .append("input")
                           .attr("type", "checkbox")
                           .property("checked", thisCell._metadata.hidden);

    checkbox.on("change", function() {
        var hidden = d3.select(this).property("checked");
        var thisCell = Jupyter.notebook.get_cells().filter(cell => cell.element[0] === this.parentNode.parentNode)[0];
        thisCell._metadata.hidden = hidden;
        console.log(thisCell._metadata);
    });

    var span = label.append("span")
                    .attr("title", "Hide Cell")
                    .style("opacity", 0.25)
                    .classed("slider round", true);
}
