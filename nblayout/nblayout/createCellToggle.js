/* ...
*/

requirejs.config({
    paths: {
        "d3-require": "//cdn.jsdelivr.net/npm/d3-require@1?"
    }
});

if (typeof Jupyter !== "undefined") {
    requirejs(["d3-require"], d3 => {
        d3.require("d3-selection", "d3-fetch").then(d3 => {

            // select menubar container
            var menuContainer = d3.select("div.container-fluid"),
                kernelIndicator = d3.select("#kernel_indicator");

            // get height of kernel indicator
            var indicatorHeight = kernelIndicator
                                   .node()
                                       .getBoundingClientRect()
                                       .height;

            var cellsHidden = true;

            var svg = d3.select(element[0]).append("svg")
                    .attr("id", "toggle-svg")
                    .attr("width", indicatorHeight)
                    .attr("height", indicatorHeight)
                        .style("float", "right")
                        .style("margin-left", "5px")
                        .style("margin-right", "5px")
                    .classed("navbar-text", true);

            var circle = svg.append("circle")
                   .attr("cx", indicatorHeight/2)
                   .attr("cy", indicatorHeight/2)
                   .attr("r", indicatorHeight)
                   .attr("fill", "#cfcfcf");

            function addIcon(graphic) {
                var iconNode = document.importNode(graphic.querySelector("svg"), true);
                var icon = d3.select(iconNode)
                        .attr("id", "toggle-hiding")
                        .attr("fill", "#777");
                svg.node().appendChild(iconNode);

                // insert the icon node before the modal indicator
                menuContainer.selectAll("#toggle-svg").remove();
                menuContainer.node()
                             .insertBefore(svg.node(), d3.select("#modal_indicator").node());

                return icon;
            }

            Promise.all([
                d3.svg("https://ionicons.com/ionicons/svg/md-eye-off.svg"),
                d3.svg("https://ionicons.com/ionicons/svg/md-eye.svg")
            ]).then(icons => {
                circle.style("opacity", 0);

                var icon = addIcon(icons[0]);

                svg.on("mouseover", () => icon.style("fill", "#333"))
                   .on("mouseout", () => icon.style("fill", "#777"));

                svg.on("click", function() {
                    svg.select("#toggle-hiding").remove();
                    icon = addIcon(icons[cellsHidden ? 1 : 0]);
                    Jupyter.notebook.get_cells().forEach((cell, idx) => {
                        if (cell._metadata.hide_cell) {
                            window.toggleCellVisibility(cell.element[0], cellsHidden ? true : false);
                        }
                    });
                    cellsHidden = !cellsHidden;
                });

                svg.append("title")
                   .text("Hide/Show cells");
            });
        });
    });
}

window.clearSelection = () => {
    if (window.getSelection) window.getSelection().removeAllRanges()
    else if (document.selection) document.selection.empty();
}

window.toggleCellVisibility = (cellElement, visible) => {
    var innerCell = cellElement.getElementsByClassName("inner_cell")[0],
        inputArea = cellElement.getElementsByClassName("input_area")[0];

    inputArea.style.display = visible ? "unset" : "none";
    innerCell.style.backgroundColor = visible ? "unset" : "#cfcfcf";
    innerCell.style.opacity = visible ? "unset" : 1/10;
}
