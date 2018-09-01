/* Create hide/show cell toggles for the `nbhide` extension
   Assembled by Eric Easthope
   */

// specify path to D3.js
requirejs.config({ "paths": { "d3": "//d3js.org/d3.v5.min" } });

// require D3.js, then add the cell toggles
requirejs(["d3"], d3 => {
    
    // initialize variables for toggle icons
    var toggleOn, toggleOff;
    
    // (boolean) true when toggles are visible
    window.editingToggles = false;

    // get all existing cell elements as an array
    var cellElements = Array
                           .from(Jupyter.notebook.get_cells())
                               .map(cell => cell.element[0]);

    // get (in pixels) the width of the right notebook margin and the notebook's padding
    var notebookContainer = d3.select("#notebook-container"),
        rightMarginWidth = parseInt(notebookContainer.style("margin-right"), 10),
        notebookPadding = parseInt(notebookContainer.style("padding"), 10);
    
    // set icon width to be one sixth of the margin width
    var iconWidth = rightMarginWidth/4;

    // get toggle icons
    Promise
        .all([
            d3.svg("https://ionicons.com/ionicons/svg/md-eye.svg"),
            d3.svg("https://ionicons.com/ionicons/svg/md-eye-off.svg")
        ])
        .then(([iconOn, iconOff]) => {
            toggleOn = iconOn;
            toggleOff = iconOff;

            // append a toggle to each cell
            for (var i = 0; i < cellElements.length; i++) {
                addToggle(d3.select(cellElements[i]), iconOn, iconOff, false);
            };
    });
    
    // append a toggle for every newly created cell
    Jupyter.notebook.events.on('create.Cell', function(evt, data) {
        addToggle(d3.select(data.cell.element[0]), toggleOn, toggleOff, false);
    });
    
    function addToggle(cell, iconOn, iconOff, clicked) {
        
        // get cell width, get cell height
        var cellWidth = cell.node().getBoundingClientRect().width,
            cellHeight = cell.node().getBoundingClientRect().height;
        
        // remove the previous label
        cell
            .selectAll("label")
            .remove();
        
        // get selected cell
        var thisCell = Jupyter
                           .notebook
                           .get_cells()
                               .filter(c => c.element[0] === cell.node())[0];
        
        // add a "hidden" parameter to the cell's metadata if it is undefined
        if (typeof thisCell._metadata.hidden === "undefined") {
            thisCell._metadata.hidden = false;
        }
        
        // (boolean) metadata for visibility of cell
        else {
            var hidden = thisCell._metadata.hidden;
        }
        
        // append cell icon
        var label = cell
                        .append("label")
                            .style("width", iconWidth.toString() + "px")
                            .style("height", iconWidth.toString() + "px")
                            .style("position", "absolute")
                            .style("margin-bottom", "0px")
                            .style("fill", "#777")
                            .style("opacity", clicked ? 1 : 0)
                            .style("left", (cellWidth + notebookPadding +
                                            rightMarginWidth/2 - iconWidth/2).toString() + "px")
                            .style("top", "-webkit-calc(50% - 12.5px)") // why 12.5 ?
                            .html(hidden ?
                                      iconOff.querySelector("svg").outerHTML :
                                      iconOn.querySelector("svg").outerHTML);
        
        // change colour and opacity on mouseover 
        label
            .on("mouseover", () => {
                label
                    .style("fill", "#333")
                    .style("opacity", 1);
            })
            .on("mouseout", () => {
                label
                    .style("fill", "#777")
                    .style("opacity", editingToggles ? 1 : 0);
            });
        
        // add a mouseover tooltip for each toggle
        label
            .select("svg")
                .append("title")
                .text("Hide/Show Cell");
        
        // append checkbox behaviour
        var checkbox = label
                           .append("input")
                               .attr("type", "checkbox")
                               .style("display", "none")
                               .style("margin", "0px")
                                   .property("checked", thisCell._metadata.hidden);

        // change label when icon is clicked
        checkbox
            .on("change", function() {
            
                // show cell if cell currently hidden
                if (hidden) {
                    $(cell
                        .select(thisCell.cell_type === "code" ?
                                ".input" :
                                ".inner_cell").node())
                        .show("250");
                }
            
                // hide cell if cell currently visible
                else if (!hidden) {
                    $(cell
                        .select(thisCell.cell_type === "code" ?
                                ".input" :
                                ".inner_cell").node())
                        .hide("250");
                }
                thisCell._metadata.hidden = !hidden;
                addToggle(cell, iconOn, iconOff, true);
            });
    }
})