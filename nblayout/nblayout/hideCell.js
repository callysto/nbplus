/* ...
*/

if (typeof Jupyter !== "undefined") $(document).ready(hideCell)
else hideCell();

function hideCell() {
    var cellElement = element.parents(".cell")[0];

    if (typeof Jupyter !== "undefined") {
        var cellIndex = Jupyter.notebook.get_cell_elements().index(cellElement),
            cell = Jupyter.notebook.get_cell(cellIndex);
        cell._metadata.hide_cell = true;
    }

    requirejs(["d3-require"], d3 => {
        d3.require("d3-selection").then(d3 => {

            if (typeof Jupyter === "undefined") {
                d3.select(cellElement).selectAll("span").remove();
                var cellText = d3.select(cellElement).select("pre").text();
                cellText = cellText.substring(1);
                d3.select(cellElement)
                  .select("pre")
                  .text(cellText);
            }

            d3.select(cellElement)
              .select(".input_area")
              .style("display", "none");

            d3.select(cellElement)
              .select(".inner_cell")
              .style("background-color", "#cfcfcf")
              .style("opacity", 1/10)
              .on("dblclick", function() {
                  window.toggleCellVisibility(cellElement, true);
                  window.clearSelection();
              });
        });
    });
}
