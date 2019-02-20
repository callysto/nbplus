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
  var indicatorWidth = kernelIndicator
                           .node()
                               .getBoundingClientRect()
                               .width;

  // get height of kernel indicator
  var indicatorHeight = kernelIndicator
                            .node()
                                .getBoundingClientRect()
                                .height;

  // insert container for template icon
  var templateSelector = container
                             .insert("svg", "#modal_indicator")
                                 .attr("width", (1/Math.sqrt(2))*indicatorHeight)
                                 .attr("height", indicatorHeight)
                             .classed("navbar-text", true)
                                 .style("float", "right")
                                 .style("margin-left", "5px")
                                 .style("margin-right", "5px");

  // append a rectangle with an aspect ratio of square root of 2 (ISO)
  var templateIcon = templateSelector
                         .append("rect")
                             .attr("x", 0)
                             .attr("y", 0)
                             .attr("width", (1/Math.sqrt(2))*indicatorHeight)
                             .attr("height", indicatorHeight)
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
          containerHeight = notebookContainer.node().getBoundingClientRect().height,
          containerPadding = parseInt(notebookContainer.style("padding"), 10),
          containerMargin = parseInt(notebookContainer.style("margin-right"), 10);

      var rightAlign = (containerPadding + containerMargin).toString() + "px",
          overviewWidth = containerWidth - 2*containerPadding - sampleWidth - containerPadding + samplePadding,
          overviewHeight = 1.41*overviewWidth;

      var siteContainer = d3.select("#site"), // document.getElementById("site")
          siteHeight = siteContainer.node().getBoundingClientRect().height;

      d3.selectAll(".movers").remove();

      function setMoverTop() {
          // var notebookHeight = d3.select("#notebook").node().getBoundingClientRect().height
          var moverTop = (siteContainer.property("scrollTop") + Math.min(siteHeight/2,containerHeight/2) - overviewWidth/2);
          // var scrollLineTop = siteContainer.property("scrollTop")/(notebookHeight-siteHeight)*overviewWidth;

          mover.style('top', moverTop.toString() + "px");
          //scrollLine.attr("y1", scrollLineTop)
          //          .attr("y2", scrollLineTop);
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
      
      
      
      
      
      
/// *** START *** ///

/* svg container & centre line */
var svg = d3.select("#mover-svg");
svg.selectAll("*").remove();
    
var width = svg.node().getBoundingClientRect().width,
    height = svg.node().getBoundingClientRect().height;

var color = d3.scaleSequential(d3.interpolateSpectral);
    
var line = svg.append("line")
              .attr("x1", "0")
              .attr("x2", width)
              .attr("y1", height/2)
              .attr("y2", height/2)
              .style("stroke", "#000")
              .style("stroke-width", "1")
              .style("opacity", 0);
    
// end svg container & centre line
    
/*  get initial cell data */
var nodes = [],
    cells = Jupyter.notebook.get_cells(),
    cellOrder = [];

var cellHeight = height/cells.length/2;
    
for (var i=0; i<cells.length; i++) {
    var headerList = cells[i].inner_cell ? [].slice.call(cells[i].inner_cell[0].querySelectorAll("h1, h2, h3, h4, h5, h6")) : null;
    // console.log(headerList);
    nodes.push({
        "id": i,
        "idx": i,
        "type": cells[i].cell_type,
        "title": headerList && headerList.length != 0 ? headerList[0].innerText : "",
        "hidden": cells[i]._metadata.hidden,
        // "offsetTop": cells[i].element[0].offsetTop
    });
    // console.log(nodes);
}
    
// var h = site.scrollHeight - site.clientHeight;
// .style('top', (site.scrollTop -height/2 + site.clientHeight/2).toString() + 'px')

for (var i=0; i<nodes.length; i++) cellOrder.push(i);
setYOrder(cellOrder);
// end get initial cell data
    
Jupyter.notebook
       .events.on("create.Cell", (evt, data) => {
           simulation.alpha(1).restart();
           
           if (d3.select("#notebook-container").selectAll('.movers').size() >= 1) {
              // adjust width of cells
              d3.selectAll(".cell")
                .style("width", "66%");
               
           }
           console.log("Create cell at index", data.index);
           
           var maxIdx = d3.max(nodes, d => d.id);
           var cells = Jupyter.notebook.get_cells();

           nodes.push({
               "id": maxIdx+1,
               "idx": data.index,
               "type": data.cell.cell_type, // cells[data.index].cell_type,
               "hidden": cells[i]._metadata.hidden,
           });
           
           //! fix indexing after node inserted
           // nodes.filter(d => data.index == d.idx)[0].idx++;
           
           cellOrder.splice(data.index, 0, maxIdx+1);
           console.log("Cell created", cellOrder, nodes);
           
           for (var i=0; i<nodes.length; i++) {
               nodes[i].idx = cellOrder.indexOf(nodes[i].id);
           }
           
           setYOrder(cellOrder);
           simulation.nodes(nodes);
       });
    
Jupyter.notebook
       .events.on("delete.Cell", (evt, data) => {
           simulation.alpha(1).restart();
           console.log("Delete cell at index", data.index);
           var deleteId = cellOrder[data.index];
           console.log("Delete id", deleteId);
           var deleteId = cellOrder.splice(data.index, 1);
           
           nodes.splice(deleteId, 1);
           
           for (var i=0; i<cellOrder.length; i++) {
               if (cellOrder[i] > deleteId) cellOrder[i]--;
           }
           for (var i=0; i<nodes.length; i++) {
               if (nodes[i].id > deleteId) nodes[i].id--;
           }
           for (var i=0; i<nodes.length; i++) {
               nodes[i].idx = cellOrder.indexOf(nodes[i].id);
           }
           
           console.log("Cell deleted", nodes, cellOrder);
           
           setYOrder(cellOrder);
           simulation.nodes(nodes);
       });
    
/**/
var index = -1,
    cellOffsets = [];

for (var i=0; i<cells.length; i++) {
    cellOffsets.push(cells[i].element[0].offsetTop);
}
    
// console.log(cellOffsets);
    
var site = d3.select("#site"),
    siteHeight = site.node().getBoundingClientRect().height;
site.on("wheel", scrolled);
    
function moveLineToCell(index) {
    var currentNode = nodes.filter(d => d.idx == index)[0];
    if (currentNode) {
        line.interrupt();
        line.transition()
            .duration(250)
            .style("opacity", 1)
            .attr("y1", currentNode.y)
            .attr("y2", currentNode.y);
    }
    else {
        line.interrupt();
        line.transition()
            .duration(250)
            .style("opacity", 0)
    }
}
    
function scrolled () {
    var scrollTop = site.node().scrollTop,
        containerHeight = d3.select("#notebook-container").node().getBoundingClientRect().height;
    
    if (containerHeight - (scrollTop + siteHeight) < 0) {
        moveLineToCell(cellOffsets.length-1);
        // console.log("Over cell", cellOffsets.length-1);
    }
    else {
        for (var i=0; i<cellOffsets.length; i++) {
            if (scrollTop > cellOffsets[i] && scrollTop < cellOffsets[i+1]) {
                moveLineToCell(i);
                // console.log("Over cell", i);
                break;
            }
        }
    }
}
    
function getCellOffsets() {
    cells = Jupyter.notebook.get_cells();
    cellOffsets = [];
    for (var i=0; i<cells.length; i++) {
        cellOffsets.push(cells[i].element[0].offsetTop);
    }
}

/* drag behaviour */
var initialY,
    dragY,
    selectedCell;
    
function dragstarted(d) {
    if (!d3.event.active) simulation.alpha(1).restart();
    Jupyter.notebook.command_mode();
    initialY = d.forceY;
    console.log("Initial y coordinate", initialY);
    d3.select(Jupyter.notebook.get_cells()[d.idx].element[0]).style("opacity", 1/2);
    
    Jupyter.notebook.select(d.idx);
    selectedCell = Jupyter.notebook.get_selected_cell();
}

function dragged(d) {
    
    simulation.force("y", d3.forceY()
                            .strength(d => d3.event.subject.id == d.id ? 0 : 9/10)
                            .y(d => d.forceY)
                    );
    
    var yShift = (d.y = d3.event.y);
    d3.select(this).attr("translate", d => "transform(0," + yShift + ")");
    
    var cellDisplacement = yShift-initialY,
        threshold = 2*cellHeight;
    
    if (d.idx != cellOrder.length-1 && cellDisplacement/threshold > 1) {
        console.log("Move cell", cellOrder[d.idx] , "at index", d.idx, "down");
        Jupyter.notebook.move_selection_down();
        
        // swap order of adjacent cells
        cellOrder[d.idx] = cellOrder.splice(d.idx+1, 1, cellOrder[d.idx])[0];
        
        for (var i=0; i<nodes.length; i++) nodes[i].idx = cellOrder.indexOf(nodes[i].id);
        setYOrder(cellOrder);
        initialY = d.forceY;
        simulation.nodes(nodes);
    }
    else if (d.idx != 0 && cellDisplacement/threshold < -1) {
        console.log("Move cell", cellOrder[d.idx] , "at index", d.idx, "up");
        Jupyter.notebook.move_selection_up();
        
        // swap order of adjacent cells
        cellOrder[d.idx] = cellOrder.splice(d.idx-1, 1, cellOrder[d.idx])[0];
        
        for (var i=0; i<nodes.length; i++) nodes[i].idx = cellOrder.indexOf(nodes[i].id);
        setYOrder(cellOrder);
        initialY = d.forceY;
        simulation.nodes(nodes);
    }
}

function dragended(d) {
    simulation.alpha(1).restart();
    getCellOffsets();
    console.log("Drag end", cellOrder);
    d3.select("#notebook-container").selectAll("div").style("opacity", 1);
    simulation.force("y", d3.forceY()
                            .strength(9/10)
                            .y(d => d.forceY));
    
}
// end drag behaviour

/* force simulation parameters */
var simulation = d3.forceSimulation(nodes)
    .alphaDecay(1e-3)
    .velocityDecay(7/10)
    .force("y", d3.forceY()
                  .strength(9/10)
                  .y(d => d.forceY));
    
simulation
    .on("tick", () => {
        var selectedIndex = Jupyter.notebook.get_selected_index();
        
        var u = svg.selectAll("g")
                   .data(nodes);
        
        var gEnter = u.enter().append("g")
                   .call(d3.drag()
                     .on("start", dragstarted)
                     .on("drag", dragged)
                     .on("end", dragended));
        
        var text = u.select("text");
        var title = u.select("title");
        var rect = u.select("rect");

        var rectEnter = gEnter.append("rect")
         .attr("width", width/2)
         .attr("height", cellHeight)
         .style("shape-rendering", "crispEdges")
        
        rect.merge(rectEnter)
            .style("fill", d => d.type == "code" ? "#f7f7f7" : "#fff")
            .style("opacity", d => d.hidden ? 1/5 : 1)
            .style("stroke", (d, i) => {
                if (d.idx == selectedIndex) {
                    return Jupyter.notebook.get_selected_cell().mode == "command" ? "#42A5F5" : "#66BB6A"
                }
                else return "#cfcfcf"; 
            });
        
        var textEnter = gEnter.append("text");
        var titleEnter = gEnter.append("title");
        
        text.merge(textEnter)
            .attr("y", cellHeight/2)
            .attr("x", cellHeight/4)
            .style("font-weight", "bold")
            .style("alignment-baseline", "middle")
            .style("font-size", (cellHeight*0.9).toString() + "px")
            .text(d => d.title);

        title.merge(titleEnter)
            .text(d => d.title);
        
        u.merge(gEnter)
         .attr("transform", function(d) {
                       var x = width/2 - width/4,
                           y = d.y - cellHeight/2;
                       return "translate(" + x + "," + y + ")";
                   })
         .on("dblclick", (d) => {
             Jupyter.notebook.select(d.idx);
             selectedCell = Jupyter.notebook.get_selected_cell();
             document.getElementById("site").scrollTo({
                 top: selectedCell.element[0].offsetTop,
                 behavior: "smooth"
             });
         });
        
        u.exit()
         .remove();
    });
// end force simulation parameters

function setYOrder(order) {
  var spacing = cellHeight*2,
      yOffset = nodes.length % 2 == 0 ? spacing/2 : 0,
      iOffset = -Math.floor(nodes.length/2);

  for (var i=iOffset; i<nodes.length+iOffset; i++) {
      nodes[i-iOffset].forceY = height/2 + (nodes[i-iOffset].idx+iOffset)*spacing + yOffset;
  }
  console.log(order, nodes);
}
      
      
      
      
/// *** *** ///
      
      
      
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
                              .attr("width", indicatorWidth)
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
        var paperWidth = (indicatorWidth - padding * (templatesPerRow + 1))/templatesPerRow,
            paperHeight = Math.sqrt(2) * paperWidth;

        createTemplateButtons(indicatorWidth, div, padding, paperWidth,
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
