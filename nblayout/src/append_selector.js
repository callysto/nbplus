
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
                                       .style("fill", "#fff")
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