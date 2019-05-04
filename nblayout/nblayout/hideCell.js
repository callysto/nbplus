/* ...
*/

(function () {
    requirejs.config({
        paths: {
            "d3-require": "//cdn.jsdelivr.net/npm/d3-require@1?",
        }
    });

    var inNotebook = (typeof Jupyter !== "undefined"),
        cellElement = element.parents(".cell")[0];

    requirejs(["d3-require"], d3 => {
        d3.require("d3-selection").then(d3 => {
            var toggleVisibility = (cellElement, visible) => {
                var innerCell = cellElement.getElementsByClassName("inner_cell")[0],
                    inputArea = cellElement.getElementsByClassName("input_area")[0];

                inputArea.style.display = visible ? "unset" : "none";
                innerCell.style.backgroundColor = visible ? "unset" : "#cfcfcf";
                innerCell.style.opacity = visible ? "unset" : 1/10;
            }

            var clearSelection = () => {
                if (window.getSelection) window.getSelection().removeAllRanges()
                else if (document.selection) document.selection.empty();
            }

            if (inNotebook) {
                console.log("In a Jupyter notebook");
                var cellIndex = Jupyter.notebook.get_cell_elements().index(cellElement),
                    cell = Jupyter.notebook.get_cell(cellIndex);
                cell._metadata.cellHidden = true;
            }
            else {
                console.log("Not in a Jupyter notebook");
                d3.select(cellElement)
                  .selectAll("span")
                  .remove();

                var cellText = d3.select(cellElement)
                                 .select("pre")
                                 .text()
                                 .substring(1);

                d3.select(cellElement)
                  .select("pre")
                  .text(cellText);
            }

            console.log("Hide", cellElement, cell);
            if (inNotebook) {
                cellElement = element.parents(".cell")[0];
            }

            d3.select(cellElement)
              .select(".input_area")
              .style("display", "none");

            d3.select(cellElement)
              .select(".inner_cell")
              .style("background-color", "#cfcfcf")
              .style("opacity", 1/10)
              .on("dblclick", function() {
                  if (typeof cell !== "undefined") cell._metadata.cellHidden = false;
                  console.log("Show cell");
                  toggleVisibility(cellElement, true);
                  console.log("Clear selection");
                  clearSelection();
              });
        });
    });
})();
