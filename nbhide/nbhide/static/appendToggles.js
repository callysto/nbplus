requirejs.config({
    "paths": {
        "d3": "//d3js.org/d3.v5.min"
    }
});

requirejs(["d3"], d3 => {

    var eyeOn, eyeOff;

    // get all existing cell elements as an array
    var cellElements = Array.from(Jupyter.notebook.get_cells()).map(cell => cell.element[0]);

    // get (in pixels) the width of the right notebook margin and the notebook's padding
    var notebookContainer = d3.select("#notebook-container"),
        rightMarginWidth = parseInt(notebookContainer.style("margin-right"), 10),
        notebookPadding = parseInt(notebookContainer.style("padding"), 10);

    // get toggle icons
    Promise.all([
        d3.svg("https://ionicons.com/ionicons/svg/md-eye.svg"),
        d3.svg("https://ionicons.com/ionicons/svg/md-eye-off.svg")
    ])
    .then(([iconOn, iconOff]) =>  {
        eyeOn = iconOn; eyeOff = iconOff;

        // select each cell and append a toggle
        d3.selectAll(cellElements).each(function() {
            addToggle(d3.select(this), iconOn, iconOff, rightMarginWidth, notebookPadding, false);
        });
    })

    // append a toggle for every newly created cell
    Jupyter.notebook.events.on('create.Cell', function(evt, data) {
        d3.select(data.cell.element[0]).call(d => addToggle(d, eyeOn, eyeOff, rightMarginWidth, notebookPadding, false));
    });

    function addToggle(cell, iconOn, iconOff, marginWidth, padding, clicked) {
        // set icon width to be one sixth of the margin width
        var iconWidth = marginWidth/6;

        // remove the previous label
        cell.selectAll("label").remove();

        // get cell width, get cell height
        var cellWidth = cell.node().getBoundingClientRect().width,
            cellHeight = cell.node().getBoundingClientRect().height;

        // get selected cell
        var thisCell = Jupyter.notebook.get_cells().filter(c => c.element[0] === cell.node())[0];

        // add a "hidden" parameter to the cell's metadata if it is undefined
        if (typeof thisCell._metadata.hidden === "undefined") {
            thisCell._metadata.hidden = true;
        }

        // (boolean) metadata for visibility of cell
        var hidden = thisCell._metadata.hidden;

        // append cell icon
        var label = cell
                        .append("label")
                            .style("width", iconWidth.toString() + "px")
                            .style("height", iconWidth.toString() + "px")
                            .style("position", "absolute")
                            .style("margin-bottom", "0px")
                            .style("fill", "#777")
                            .style("opacity", clicked ? 1 : 0)
                            .style("left", (cellWidth + padding + marginWidth / 2 - iconWidth/2).toString() + "px")
                            .style("top", "-webkit-calc(50% - 12.5px)")
                            .html(hidden ?
                                      iconOff.querySelector("svg").outerHTML :
                                      iconOn.querySelector("svg").outerHTML);

        // change colour on mouseover
        label.on("mouseover", () => label.style("fill", "#333"));
        label.on("mouseout", () => label.style("fill", "#777"));

        // append checkbox behaviour
        var checkbox = label
                           .append("input")
                               .attr("type", "checkbox")
                               .style("display", "none")
                               .style("margin", "0px")
                               .property("checked", thisCell._metadata.hidden);

        // change label when icon is clicked
        checkbox.on("change", function() {
            thisCell._metadata.hidden = !hidden;
            addToggle(cell, iconOn, iconOff, marginWidth, padding, true);
        });
    }
});
