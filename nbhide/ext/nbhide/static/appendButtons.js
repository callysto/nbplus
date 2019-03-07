/* Create toolbar buttons for the `nbhide` extension
   Assembled by Eric Easthope
   */

// specify path to D3.js
requirejs.config({ "paths": { "d3": "//d3js.org/d3.v5.min" } });

// require D3.js, then add the toolbar buttons
requirejs(["d3"], d3 => {
    
    // specify order, id, title, and source URLs for buttons
    var buttons = [
        {
            id: "code",
            title: "Hide/Show Code",
            url: "https://ionicons.com/ionicons/svg/md-code.svg"
        },
        {
            id: "markdown",
            title: "Hide/Show Markdown",
            url: "https://ionicons.com/ionicons/svg/logo-markdown.svg"
        },
        {
            id: "play",
            title: "Play Notebook",
            url: "https://ionicons.com/ionicons/svg/md-play.svg"
        }
    ];
    
    // select menubar container
    var container = d3.select("div.container-fluid"),
        kernelIndicator = d3.select("#kernel_indicator");
    
    // get width of kernel indicator
    var width = kernelIndicator
                    .node()
                        .getBoundingClientRect()
                        .width;

    // get height of kernel indicator
    var height = kernelIndicator
                    .node()
                        .getBoundingClientRect()
                        .height;
    
    // create a container for all toolbar buttons
    var buttonContainer = container
                              .insert("svg", "#modal_indicator")
                                  .attr("id", "cellControlButtons")
                                  .attr("width", width)
                                  .attr("height", height)
                              .classed("navbar-text", true)
                                  .style("float", "right")
                                  .style("margin-left", "5px");

    // (boolean) configure default hide/show behaviour 
    window.codeActive = true;
    window.markdownActive = true;
    
    // keep track of current code and markdown cells in notebook
    var codeCells, markdownCells;
    updateCells();
    
    // get toggle icons, then 
    Promise
        .all(buttons.map(d => d3.svg(d.url)))
        .then(icons => {
            for (var i = 0; i < icons.length; i++) {
                addButton(icons[i], buttons[i].id, buttons[i].title, [(-width+i*width)/icons.length, 0]);
            };
    });
    
    function addButton(iconSvg, id, title, shift) {
        // create a container for the button
        var button = buttonContainer
                         .append("g")
                             .style("fill", "#777");
        
        // set the html of the container to be the SVG icon
        button.html(iconSvg.querySelector("svg").outerHTML);
        
        // get button width, get button height
        var buttonWidth = button.node().getBoundingClientRect().width,
            buttonHeight = button.node().getBoundingClientRect().height;
        
        // translate the button to its own position
        button.attr("transform", "translate(" + shift + ")");
        
        // cover the SVG icon with a transparent and clickable rectangle
        var rect = button
                       .insert("rect")
                           .attr("x", width/2 - buttonWidth/2)
                           .attr("y", height/2 - buttonHeight/2)
                           .attr("width", buttonWidth)
                           .attr("height", buttonHeight)
                           .style("fill", "#000")
                           .style("opacity", 0);
        
        // change color on mouseover
        rect
            .on("mouseover", () => button.style("fill", "#333"))
            .on("mouseout", () => button.style("fill", "#777"));
        
        // call a unique function when a button is clicked
        rect
            .on("click", () => {
                switch (id) {
                    case "code": toggleCode(button); break;
                    case "markdown": toggleMarkdown(button); break;
                    case "play": togglePlay(); break;
                }
        });
        
        // (default) initialize nonempty notebooks with all code cells hidden
        if (id === "code" && Jupyter.notebook.get_cells().length > 1) toggleCode(button);
        
        // add a mouseover tooltip for each button
        rect
            .append("title")
            .text(title);
    }
    
    function toggleCode(button) {
        updateCells();
        
        // if holding option/alt, display the hide/show toggles
        if (d3.event != null && d3.event.altKey) showToggles(true);

        if (codeActive) {
            showToggles(false);
            codeCells.each(function () {
                
                // select each cell by filtering
                var thisCell = Jupyter
                                   .notebook
                                   .get_cells()
                                       .filter(c => c.element[0] === this)[0];
                // hide cell if it is toggled
                if (thisCell._metadata.hidden) {
                    $(d3.select(this)
                        .select(".input").node())
                        .hide("250");
                }
            });
        }
        
        // if code cells are not visible, show them all
        else if (!codeActive) {
            codeCells.each(function () {
                $(d3.select(this)
                    .select(".input").node())
                    .show("250");
            });
        }
        
        codeActive = !codeActive;
        button.style("opacity", codeActive ? 1 : 1/3);
    }

    function toggleMarkdown(button) {
        updateCells();
        
        // if holding option/alt, display the hide/show toggles
        if (d3.event != null && d3.event.altKey) showToggles(true);

        // if markdown cells are visible, hide any that are toggled
        if (markdownActive) {
            showToggles(false)
            markdownCells.each(function () {
                
                // select each cell by filtering
                var thisCell = Jupyter
                                   .notebook
                                   .get_cells()
                                       .filter(c => c.element[0] === this)[0];

                // hide cell if it is toggled
                if (thisCell._metadata.hidden) {
                    $(d3.select(this)
                        .select(".inner_cell").node())
                        .hide("250");
                }
            });
        }
        
        // if markdown cells are not visible, show them all
        else if (!markdownActive) {
            markdownCells.each(function () {
                $(d3.select(this)
                    .select(".inner_cell").node())
                    .show("250");
            });

        }
        
        markdownActive = !markdownActive;
        button.style("opacity", markdownActive ? 1 : 1/3);
    }

    function togglePlay() {
       var cells = Jupyter.notebook.get_cells();

       // code cells, counter for code cell executions
       var codeCells = cells.filter(c => c.cell_type == "code"), 
           markdownCells = cells.filter(c => c.cell_type == "markdown");
       
       var codeCellsExecuted = 0;
       
       // render markdown cells, execute code cells
       for (var i=0; i<markdownCells.length; i++) markdownCells[i].render();
       for (var i=0; i<codeCells.length; i++) codeCells[i].execute();
       
       Jupyter.notebook.events.on("kernel_idle.Kernel", () => {
          if (codeCellsExecuted < codeCells.length) {
             var cell = codeCells[codeCellsExecuted];
             codeCellsExecuted++;
             document.getElementById("site").scrollTo({
                top: cell.element[0].offsetTop,
                behavior: "smooth"
             });
          }
       });
    }
    
    function showToggles(show) {
        editingToggles = show ? true : false;        
        d3.selectAll("label")
              .transition()
              .duration(250)
              .style("opacity", show ? 1 : 0);
    }
    
    function updateCells() {
        codeCells = d3.selectAll('div.code_cell');
        markdownCells = d3.selectAll('div.text_cell');
    }
});
