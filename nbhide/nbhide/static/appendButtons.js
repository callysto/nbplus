requirejs.config({
    "paths": {
        "d3": "//d3js.org/d3.v5.min"
    }
});

requirejs(["d3"], d3 => {
    var container = d3.select("div.container-fluid");
    var kernelIndicator = d3.select("#kernel_indicator");

    var width = kernelIndicator
                    .node()
                        .getBoundingClientRect()
                        .width;

    var height = kernelIndicator
                    .node()
                        .getBoundingClientRect()
                        .height;

    // configure default display behaviour (boolean)
    var codeActive = false,
        markdownActive = true;

    var codeCells = d3.selectAll('div.code_cell'),
        markdownCells = d3.selectAll('div.text_cell');

    // (default) initialize nonempty notebook with all code cells hidden
    if (Jupyter.notebook.get_cells().length > 1) {
        codeCells.each(function () {
            $(d3.select(this).select(".input").node()).hide("250");
        });
    }
    else { codeActive = !codeActive; }

    var buttonContainer = container.insert("svg", "#modal_indicator")
                                 .attr("id", "cellControlButtons")
                                 .attr("width", width)
                                 .attr("height", height)
                              .classed("navbar-text", true)
                                  .style("float", "right")
                                  .style("margin-left", "5px");

    d3.svg("https://ionicons.com/ionicons/svg/md-code.svg").then(function(svg) {
        var button = buttonContainer.append("g")

        button.style("fill", "#777");
        button.style("opacity", codeActive ? 1 : 1/4);
        button.html(svg.querySelector("svg").outerHTML);

        var buttonWidth = button.node().getBoundingClientRect().width,
            buttonHeight = button.node().getBoundingClientRect().height;

        button.attr("transform", "translate(" + [-width/3, 0] + ")");

        var rect = button.insert("rect")
                           .attr("x", width/2 - buttonWidth/2)
                           .attr("y", height/2 - buttonHeight/2)
                           .attr("width", buttonWidth)
                           .attr("height", buttonHeight)
                           .style("opacity", 0);

        rect.on("mouseover", () => button.style("fill", "#333"));
        rect.on("mouseout", () => button.style("fill", "#777"));
        rect.on("click", function() {
            if (codeActive) {
                codeCells.each(function () {
                    $(d3.select(this).select(".input").node()).hide("250");
                });
                codeActive = !codeActive;
            }
            else if (!codeActive) {
                codeCells.each(function () {
                    $(d3.select(this).select(".input").node()).show("250");
                });
                codeActive = !codeActive;
            }
            button.style("opacity", codeActive ? 1 : 1/4);
        });
    });

    d3.svg("https://ionicons.com/ionicons/svg/logo-markdown.svg").then(function(svg) {
        var button = buttonContainer
                             .append("g")
                                 .attr("transform", "translate(" + [0, 0] + ")")
                                 .style("fill", "#777")

        button.style("opacity", markdownActive ? 1 : 1/4);
        button.html(svg.querySelector("svg").outerHTML);

        var buttonWidth = button.node().getBoundingClientRect().width,
            buttonHeight = button.node().getBoundingClientRect().height;

        var rect = button.insert("rect")
                           .attr("x", width/2 - buttonWidth/2)
                           .attr("y", height/2 - buttonHeight/2)
                           .attr("width", buttonWidth)
                           .attr("height", buttonHeight)
                           .style("opacity", 0);

        rect.on("mouseover", () => button.style("fill", "#333"));
        rect.on("mouseout", () => button.style("fill", "#777"));
        rect.on("click", function() {
            if (markdownActive) {
                markdownCells.each(function () {
                    $(d3.select(this).node()).hide('250');
                });
                markdownActive = !markdownActive;
            }
            else if (!markdownActive) {
                markdownCells.each(function () {
                    $(d3.select(this).node()).show('250');
                });
                markdownActive = !markdownActive;
            }
            button.style("opacity", markdownActive ? 1 : 1/4);
        });
    });

    d3.svg("https://ionicons.com/ionicons/svg/md-play.svg").then(function(svg) {
        var button = buttonContainer.append("g");

        button.style("fill", "#777");
        button.style("opacity", markdownActive ? 1 : 1/4);
        button.html(svg.querySelector("svg").outerHTML);

        var buttonWidth = button.node().getBoundingClientRect().width,
            buttonHeight = button.node().getBoundingClientRect().height;

        button.attr("transform", "translate(" + [width/3, 0] + ")")

        var rect = button.insert("rect")
                           .attr("x", width/2 - buttonWidth/2)
                           .attr("y", height/2 - buttonHeight/2)
                           .attr("width", buttonWidth)
                           .attr("height", buttonHeight)
                           .style("opacity", 0);

        rect.on("mouseover", () => button.style("fill", "#333"));
        rect.on("mouseout", () => button.style("fill", "#777"));
        rect.on("click", function() {
          // Jupyter.notebook.kernel.interrupt();
          Jupyter.notebook.execute_all_cells();
        });
    });
});
