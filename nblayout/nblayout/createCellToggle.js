/* ...
*/

requirejs.config({paths: {"d3": "//d3js.org/d3.v5.min"}});
requirejs(["d3"], d3 => {

    // select menubar container
    var menuContainer = d3.select("div.container-fluid");
    var kernelIndicator = d3.select("#kernel_indicator");

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

    window.clearSelection = () => {
        if (window.getSelection) window.getSelection().removeAllRanges()
        else if (document.selection) document.selection.empty();
    }

    window.toggleCellVisibility = (cell, visible) => {
        var cellElement = cell.element[0],
            innerCell = cellElement.getElementsByClassName("inner_cell")[0],
            inputArea = cellElement.getElementsByClassName("input_area")[0];
        inputArea.style.display = visible ? "unset" : "none";
        innerCell.style.backgroundColor = visible ? "unset" : "#cfcfcf";
        innerCell.style.opacity = visible ? "unset" : 1/10;
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
                if (cell._metadata.hidden) {
                    window.toggleCellVisibility(cell, cellsHidden ? true : false);
                }
            });
            cellsHidden = !cellsHidden;
        });

        svg.append("title")
           .text("Hide/Show cells");
    });
});
