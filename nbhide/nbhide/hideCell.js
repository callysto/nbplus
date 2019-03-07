/* ...
*/

requirejs.config({paths: {"d3": "//d3js.org/d3.v5.min"}});
requirejs(["d3"], d3 => {
    var cellElement = this.element.parents(".cell")[0],
        cellIndex = Jupyter.notebook.get_cell_elements().index(cellElement),
        cell = Jupyter.notebook.get_cell(cellIndex);

    cell._metadata.hidden = true;
    
    d3.select(cellElement)
      .select(".input_area")
      .style("display", "none");
    
    d3.select(cellElement)
      .select(".inner_cell")
      .style("background-color", "#cfcfcf")
      .style("opacity", 1/10)
      .on("dblclick", function() {
          window.toggleCellVisibility(cell, true);
          window.clearSelection();
      });
});