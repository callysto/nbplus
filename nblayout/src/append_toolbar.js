
var data = [
    {
        "order": 0,
        "cellType": "code",
        "title": "Toggle Code",
        "active": true
    },

    {
        "order": 1,
        "cellType": "markdown",
        "title": "Toggle Markdown",
        "active": true
    },

    {
        "order": 2,
        "cellType": "math",
        "title": "Toggle Math",
        "active": true
    }
];

var color = d3.scaleOrdinal(d3.schemeCategory10);

var container = d3.select("div.container-fluid");
var kernelIndicator = d3.select("#kernel_indicator");

container.selectAll("svg").remove();

var width = kernelIndicator
                .node()
                    .getBoundingClientRect()
                    .width;

var height = kernelIndicator
                .node()
                    .getBoundingClientRect()
                    .height;

var icon = kernelIndicator.select("#kernel_indicator_icon");
var r = icon
            .node()
                .getBoundingClientRect()
                .width/2;

var svg = container.insert("svg", "#modal_indicator")
                   .attr("id", "cell_toggles")
                   .attr("width", width)
                   .attr("height", height)
                   .classed("navbar-text", true)
                       .style("float", "right")
                       .style("margin-left", "5px");

var templateSelector = container.insert("svg", "#modal_indicator")
                                .attr("width", (1/Math.sqrt(2))*height)
                                .attr("height", height)
                                .classed("navbar-text", true)
                                    .style("float", "right")
                                    .style("margin-left", "5px")
                                    .style("margin-right", "5px");

var templateIcon = templateSelector.append("rect")
                                       .attr("x", 0)
                                       .attr("y", 0)
                                       .attr("width", (1/Math.sqrt(2))*height)
                                       .attr("height", height)
                                       .style("fill", color(4))
                                       .on("mouseover", function () {
                                           d3.select(this)
                                                 .transition()
                                                 .duration(250)
                                                 .ease(d3.easeExpOut)
                                                 .style("fill-opacity", 1/4);
                                       })
                                       .on("mouseout", function () {
                                           d3.select(this)
                                                 .transition()
                                                 .duration(250)
                                                 .ease(d3.easeExpOut)
                                                 .style("fill-opacity", 1);
                                       });
templateIcon.on("click", () => {
    window.templates = [
        { id: 'firstTemplate' },
        { id: 'secondTemplate' },
        { id: 'thirdTemplate' },
        { id: 'fourthTemplate' },
        { id: 'fifthTemplate' },
        { id: 'sixthTemplate' },
        { id: 'seventhTemplate' },
        { id: 'eighthTemplate' }
    ]

    // requirejs.config({ paths: { d3: "//d3js.org/d3.v5.min" } })
    requirejs(
        ["base/js/dialog"],
        function(dialog) {
            var div = document.createElement("div");

            d3.select(div)
              .attr("id", "template-wrapper");

            var popup = dialog.modal({
                title: 'Select a Template',
                body: div,
                buttons: {
                    'Choose': {id: 'chooseTemplate'},
                    'Close': {}
                },
                notebook: Jupyter.notebook,
                keyboard_manager: Jupyter.keyboard_manager
            });

            getDialogWidth();

            function getDialogWidth() {
                if (!$("div.modal-body").width()) {
                    window.requestAnimationFrame(getDialogWidth);
                } else {
                    loadTemplates($("div.modal-body").width());
                }
            };

            function loadTemplates(width) {
                var color = d3.scaleOrdinal(d3.schemePastel1);

                var svg = d3.select(div)
                            .append("svg")
                                .attr("width", width);

                var padding = 15;

                var numberOfTemplates = templates.length,
                    templatesPerRow = 4,
                    numberOfRows = Math.ceil(numberOfTemplates / templatesPerRow);

                console.log("Make", numberOfRows, "rows ...");

                var paperWidth = (width - padding * (templatesPerRow + 1)) / templatesPerRow,
                    paperHeight = Math.sqrt(2) * paperWidth;

                svg.attr("height", numberOfRows * (paperHeight + padding) + padding);

                var selectedTemplate;
                var chooseButton = d3.select("#chooseTemplate")
                                     .attr("data-dismiss", null)
                                     .on("click", function() {
                                         if (selectedTemplate) {
                                             d3.select(this).attr("data-dismiss", "modal");
                                             $(d3.select(this).node()).click();
                                             console.log("Make notebook from Template", i, "...");
                                         }
                                     });

                var rect = svg.selectAll("rect")
                                  .data(templates)
                              .enter().append("rect")
                                      .attr("x", (d, i) => ((i % templatesPerRow) + 1) * padding + paperWidth * (i % templatesPerRow))
                                      .attr("y", (d, i) => Math.floor(i / templatesPerRow) * paperHeight + padding * Math.floor(i / templatesPerRow) + padding)
                                      .attr("width", paperWidth)
                                      .attr("height", paperHeight)
                                      .attr("fill", (d, i) => color(i))
                                      .on("click", function(d, i) {
                                          rect.style("stroke-width", 2)
                                              .style("stroke", "#000")
                                              .style("stroke-opacity", 0)
                                              .transition()
                                                  .duration(500)
                                                  .ease(d3.easeExpOut)
                                                  .style("stroke-opacity", e => d.id === e.id ? 1 : 0);
                                          selectedTemplate = i;
                                      })
                                      .on("dblclick", function(d, i) {
                                          d3.select(this).attr("data-dismiss", "modal");
                                          $(d3.select(this).node()).click();
                                          console.log("Make notebook from Template", i, "...");
                                          if (i === 0) {
                                              $.getScript('src/js/add_banners.js', function() {});
                                          }
                                      });
            }
        });
                                       });

icon.on('click', () => {
    Jupyter.notebook.kernel.interrupt();
})

icon.on('dblclick', () => {
    Jupyter.notebook.kernel.restart();
    Jupyter.notebook.execute_all_cells();
})

var maxOrder = d3.max(data, d => d.order);

var circle = svg.selectAll("circle")
                    .data(data)
                .enter().append("circle")
                    .attr("r", d => 0)
                    .attr("cx", d => (d.order + 1/2) * width/(maxOrder+1))
                    .attr("cy", d => height/2)

                    .style("fill", d => color(d.order/maxOrder))
                    .style("stroke", "#000")
                    .style("stroke-width", "0px")

                    .on("mouseover", function(d) {
                        d3.select(this)
                          .transition()
                          .duration(250)
                          .ease(d3.easeExpOut)
                          .attr("r", 5*r/4);
                    })

                    .on("mouseout", function(d) {
                        d3.select(this)
                          .transition()
                          .duration(250)
                          .ease(d3.easeExpOut)
                          .attr("r", r);
                    });

circle.on("click", function(d) {
    var active = d.active ? false : true;
    d.active ?
        cellOff(d.cellType) :
        cellOn(d.cellType);

    d3.select(this)
      .transition()
      .duration(250)
      .ease(d3.easeExpOut)
      .style("opacity", active ? 1 : 1/4);
    d.active = active;
});

circle
    .transition()
    .duration(500)
    .ease(d3.easeBackOut)
    .attr("r", d => r);

circle
   .append("title")
   .text(d => d.title);

function cellOn(cellType) {
    console.log("Show all", cellType, "cells");

    var codeCells = d3.selectAll('div.code_cell'),
        textCells = d3.selectAll('div.text_cell');

    var markdownCells = textCells.filter(function () {
            return d3.select(this).select('div.MathJax_Display').node() == null;
        }),
        mathjaxCells = textCells.filter(function () {
            return d3.select(this).select('div.MathJax_Display').node() != null;
        });

    if (cellType === "code") {
        codeCells.each(function () {
            $(d3.select(this).select(".input").node()).show("250");
        });
    }

    else if (cellType === "markdown") {
        var textCells = d3.selectAll('div.text_cell');
        var markdownCells = textCells.filter(function () {
            return d3.select(this).select('div.MathJax_Display').node() == null;
        });
        markdownCells.each(function () {
            $(d3.select(this).node()).show('250');
        });
    }

    else if (cellType === "math") {
        var textCells = d3.selectAll('div.text_cell');
        var mathjaxCells = textCells.filter(function () {
            return d3.select(this).select('div.MathJax_Display').node() != null;
        });
        mathjaxCells.each(function () {
            $(d3.select(this).node()).show('250');
        });
    };

    d3.selectAll("span[title='Hide Cell']")
            .transition()
                .duration(250)
                .style("opacity", 1/4);
}

function cellOff(cellType) {
    console.log("Hide all", cellType, "cells");

    var codeCells = d3.selectAll('div.code_cell'),
        textCells = d3.selectAll('div.text_cell');

    var markdownCells = textCells.filter(function () {
            return d3.select(this).select('div.MathJax_Display').node() == null;
        }),
        mathjaxCells = textCells.filter(function () {
            return d3.select(this).select('div.MathJax_Display').node() != null;
        });

    if (cellType === "code") {
        codeCells.each(function () {
            if (d3.select(this)
                      .select("input[type=checkbox]")
                      .property("checked")) {
                $(d3.select(this).select(".input").node()).hide("250");
            }
        });
    }

    else if (cellType === "markdown") {
        markdownCells.each(function () {
            if (d3.select(this)
                      .select("input[type=checkbox]")
                      .property("checked")) {
                $(d3.select(this).node()).hide('250');
            }
        });
    }

    else if (cellType === "math") {
        mathjaxCells.each(function () {
            if (d3.select(this)
                      .select("input[type=checkbox]")
                      .property("checked")) {
                $(d3.select(this).node()).hide('250');
            }
        });
    };

    d3.selectAll("span[title='Hide Cell']")
            .transition()
                .duration(250)
                .style("opacity", 0);
    // $(d3.selectAll("span[title='Hide Cell']").node()).hide('250');
}
