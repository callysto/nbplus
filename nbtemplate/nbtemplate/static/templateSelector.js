/* Jupyter notebook parsing and template conversion for the `nbtemplate` extension
   Assembled by Eric Easthope
   */

// IIFE
(function () {

// specify path to d3.js
requirejs.config({ "paths": { "d3": "//d3js.org/d3.v5.min" } });

// require d3.js, get template selector data, then ...
requirejs(["d3"], d3 => {
    d3.json("https://raw.githubusercontent.com/callysto/notebook-templates/master/templateConfig.json")
      .then(function(config) {

  /** TEMPLATE ICON CONFIG **/

  // specify arrangement and source URLs for notebook templates
  var templates = config.templates;

  // select menubar container
  var container = d3.select("div.container-fluid");
  var kernelIndicator = d3.select("#kernel_indicator");

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

  // insert container for template icon
  var templateSelector = container
                             .insert("svg", "#modal_indicator")
                                 .attr("width", (1/Math.sqrt(2))*height)
                                 .attr("height", height)
                             .classed("navbar-text", true)
                                 .style("float", "right")
                                 .style("margin-left", "5px")
                                 .style("margin-right", "5px");

  // append a rectangle with an aspect ratio of square root of 2 (ISO)
  var templateIcon = templateSelector
                         .append("rect")
                             .attr("x", 0)
                             .attr("y", 0)
                             .attr("width", (1/Math.sqrt(2))*height)
                             .attr("height", height)
                             .style("fill", "#777");

  // set icon mouseover behaviour
  templateIcon
      .on("mouseover", function () {
          d3.select(this).style("fill", "#333");
      });

  // set icon mouseout behaviour
  templateIcon
      .on("mouseout", function () {
          d3.select(this).style("fill", "#777");
      });

  // add a mouseover tooltip for template icon
  templateIcon
      .append("title")
      .text("Add Template");

  // show template selector via dialog popover when icon clicked
  templateIcon.on("click", function() {
      if (d3.event != null && d3.event.altKey) {
          if (d3.select("#notebook-container").selectAll(".movers").size() >= 1) {
            d3.select("#notebook-container").selectAll(".movers").remove();
            d3.selectAll(".cell")
              .style("width", "100%");
          }
          else { showOveriew(); }
      }
      else {
          showSelector();
      }
  });

  // initialize selected template and template index variables
  var selectedTemplate, selectedIndex;

  function showOveriew() {

      // adjust width of cells
      d3.selectAll(".cell")
        .style("width", "66%");

      // get a cell from which to sample width
      var sampleCell = Jupyter.notebook.get_cells()[0],
          sampleElement = d3.select(sampleCell.element[0]),
          sampleWidth = sampleElement.node().getBoundingClientRect().width,
          samplePadding = parseInt(sampleElement.style("padding"), 10);

      var notebookContainer = d3.select("#notebook-container"),
          containerWidth = notebookContainer.node().getBoundingClientRect().width,
          containerPadding = parseInt(notebookContainer.style("padding"), 10),
          containerMargin = parseInt(notebookContainer.style("margin-right"), 10);

      var rightAlign = (containerPadding + containerMargin).toString() + "px",
          overviewWidth = containerWidth - 2*containerPadding - sampleWidth - containerPadding + samplePadding;

      var siteContainer = d3.select("#site"), // document.getElementById("site")
          siteHeight = siteContainer.node().getBoundingClientRect().height;

      d3.selectAll(".movers").remove();

      function setMoverTop() {
          var notebookHeight = d3.select("#notebook").node().getBoundingClientRect().height
          var moverTop = (siteContainer.property("scrollTop") + siteHeight/2 - overviewWidth/2).toString() + "px";
          var scrollLineTop = siteContainer.property("scrollTop")/(notebookHeight-siteHeight)*overviewWidth;

          mover.style('top', moverTop);
          scrollLine.attr("y1", scrollLineTop)
                    .attr("y2", scrollLineTop);
        }

      var mover = notebookContainer
                      .append('div')
                      .attr("id", "mover")
                      .attr('class', 'movers')
                      .style('border', '1px solid #cfcfcf')
                      .style('width', overviewWidth.toString() + "px")
                      .style('height', overviewWidth.toString() + "px")
                      .style("position", "absolute")
                      .style("right", rightAlign);

      var svg = mover.append("svg")
                     .attr("id", "mover-svg");

      svg.attr("width", "100%")
         .attr("height", "100%");

      var scrollLine = svg.append("line")
                          .attr("x1", "0")
                          .attr("x2", overviewWidth)
                          .attr("y1", overviewWidth/2)
                          .attr("y2", overviewWidth/2)
                          .style("stroke", "#cfcfcf")
                          .style("stroke-width", "1");

      setMoverTop();
      siteContainer.on("scroll", setMoverTop);
  }

  function showSelector() {

      requirejs(["base/js/dialog"], function(dialog) {
          var div = document.createElement("div");
          d3.select(div)
            .attr("id", "template-wrapper");

          var popup = dialog.modal({
              title: 'Select a Template',
              body: div,
              buttons: {
                  'Choose': { id: 'chooseTemplate' },
                  'Close': {}
              },
              notebook: Jupyter.notebook,
              keyboard_manager: Jupyter.keyboard_manager
          });

          getDialogWidth();
          function getDialogWidth() {
              if (!$("div.modal-body").width()) {
                  window.requestAnimationFrame(getDialogWidth);
              }
              else {
                  loadTemplates($("div.modal-body").width(), div);
              };
          };
      });
  }

  function insertTemplate(templateUrl) {

      // get template notebook from URL
      Promise
          .all([d3.json(templateUrl)])
          .then(curriculum => {

              // get notebook cells
              var templateCells = curriculum[0].cells;

              templateCells.forEach(cell => {

                  // get template cell type
                  var cellType = cell.cell_type

                  // get current notebook cells, get largest index
                  var allCells = Jupyter.notebook.get_cells(),
                      indexOfLastCell = allCells.length - 1;

                  // create a clone of the template cell, insert at the bottom of the current notebook
                  var newCell = Jupyter.notebook.insert_cell_below(cellType, indexOfLastCell);
                  newCell.set_text(cell.source.join(""));

                  // execute the clone of the template cell
                  newCell.execute();
              });
          });
  }

  function createTemplateButtons(width, div, padding, paperWidth, paperHeight, numberOfRows, templatesPerRow) {

        /* append svg container with width of dialog popover,
           set height to fit all template buttons
           */
        var svg = d3
                      .select(div)
                          .append("svg")
                              .attr("width", width)
                              .attr("height", numberOfRows * (paperHeight + padding) + padding);

        // set colour scheme for unspecified templates
        var color = d3.scaleOrdinal(d3.schemePastel1);

        // append evenly spaced rectangles for each template
        var rect = svg
                       .selectAll("rect")
                           .data(templates)
                       .enter().append("rect")
                           .attr("x", (d, i) => (i % templatesPerRow + 1) *
                                                padding + paperWidth * (i % templatesPerRow))
                           .attr("y", (d, i) => Math.floor(i/templatesPerRow) *
                                                paperHeight + padding *
                                                Math.floor(i/templatesPerRow) + padding)
                           .attr("width", paperWidth)
                           .attr("height", paperHeight)
                           .attr("fill", (d, i) => color(i));

        // highlight a template button when clicked
        rect
            .on("click", function(d, i) {
                rect
                    .style("stroke-width", 2)
                    .style("stroke", "#333")
                    .style("stroke-opacity", e => d.id === e.id ? 1 : 0);
                selectedTemplate = d;
                selectedIndex = i;
            });

        // select a template when its button is double-clicked
        rect
            .on("dblclick", function(d, i) {
                d3.select(this).attr("data-dismiss", "modal");
                $(d3.select(this).node()).click();
                console.log("Add templates from", selectedTemplate);
                insertTemplate(d.url);
            });

        // add a mouseover tooltip for each template
        rect
            .append("title")
            .text(d => d.id);
  }

  function loadTemplates(width, div) {

        // use the same padding on the dialog popover as the notebook container
        var padding = parseInt(d3.select("div#notebook-container")
                                 .style("padding"), 10);

        // get the number of available templates
        var numberOfTemplates = templates.length,
            templatesPerRow = 4,
            numberOfRows = Math.ceil(numberOfTemplates/templatesPerRow);

        // set width/height of template buttons to have the same aspect ratio as the icon
        var paperWidth = (width - padding * (templatesPerRow + 1))/templatesPerRow,
            paperHeight = Math.sqrt(2) * paperWidth;

        createTemplateButtons(width, div, padding, paperWidth,
                              paperHeight, numberOfRows, templatesPerRow);

        // insert specified template elements when "Choose" button is clicked
        var chooseButton = d3
                               .select("#chooseTemplate")
                                   .attr("data-dismiss", null)
                                   .on("click", function() {
                                       if (selectedTemplate) {
                                           d3.select(this).attr("data-dismiss", "modal");
                                           $(d3.select(this).node()).click();
                                           console.log("Add templates from", selectedTemplate);
                                           insertTemplate(selectedTemplate.url);
                                       }
                                   });
  }
    });
});

// IIFE
})();
