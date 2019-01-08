requirejs.config({
    paths: {
        "d3": "//d3js.org/d3.v5.min",
        "d3-selection-multi": "//d3js.org/d3-selection-multi.v1.min"
    },
    map: {
        "*": {
            "d3-color": "d3",
            "d3-dispatch": "d3",
            "d3-ease": "d3",
            "d3-interpolate": "d3",
            "d3-selection": "d3",
            "d3-timer": "d3",
            "d3-transition": "d3"
        }
    }
});

define(["d3", "d3-selection-multi", "base/js/dialog"],
  function (d3, multi, dialog) {
    "use strict";
    let instance = null;
    class selector {

        // give overview class its attributes, check for duplicate instances
        constructor(name) {
            this.name = name;
            this.order = [];
            if (!instance) instance = this;
            return instance;
        }

        show() {
          var div = document.createElement("div");
          d3.select(div)
            .attr("id", "blocks-wrapper");

          var popup = dialog.modal({
              title: 'Select a Block',
              body: div,
              buttons: {
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
                  // hide if escape key pressed
                  d3.select("body")
                    .on("keydown", function() {
                      if (d3.event.keyCode == 27) {
                          d3.select(".modal").select("button.close").on("click")();
                          $("button.close").click();
                      }
                  });
                  
                  // hide if clicked anywhere in modal background
                  d3.select(".modal")
                    .on("click", function() {
                      d3.select(".modal").select("button.close").on("click")();
                      $("button.close").click();
                  });
                  
                  // hide if close button clicked
                  d3.select(".modal")
                    .classed("block-selector", true)
                    .select("button.close")
                    .style("opacity", 1)
                    .style("font-size", "27px")
                    .style("line-height", "none")
                    .on("click", function() {
                      d3.select("#header").style("filter", "none");
                      d3.select("#site").style("filter", "none");
                  });
                  
                  var titleHeader = d3.select(".modal")
                    .select(".modal-title").node();
                  
                  titleHeader.outerHTML = titleHeader.outerHTML.replace("4", "2");
                  
                  d3.select("#header").style("filter", "blur(3px)");
                  d3.select("#site").style("filter", "blur(3px)");
                  d3.select("div.modal-dialog").style("width", (2*siteWidth/3).toString() + "px");
                  loadTemplates($("div.modal-body").width());
              };
          };
        }
    }

    // create the block selector object
    var s = new selector("blocks");

    var blocks = [];

    var siteWidth = parseInt(d3.select("#site").style("width")),
        siteHeight = parseInt(d3.select("#site").style("height")),
        menuHeight = parseInt(d3.select("#menubar").style("height"));
    
    var blockConfigUrl = "https://raw.githubusercontent.com/callysto/notebook-templates/master/blockConfig.json";
    getTemplates(blockConfigUrl);
    
    function getTemplates(url) {
        // from config list of blocks, get each template url
        d3.json(url).then(function(config) {
            
            var htmls = config.blocks.map(block => {
                blocks.push({id: block.text});
                
                var url = block.url.split('.').slice(0, -1).join('.') + ".html";
                return d3.html(url);
            });
            
            var ipynbs = config.blocks.map(block => d3.json(block.url));
            
            // use Promise.all to retrieve blocks html AND blocks metadata
            Promise.all(htmls)
                   .then(data => {
                data.map((html, i) => {
                    blocks[i].html = html;
                },
                        error => {});
            });
            
            Promise.all(ipynbs)
                   .then(data => {
                data.map((ipynb, i) => {
                    blocks[i].ipynb = ipynb;
                },
                        error => {});
            });
            
            console.log(blocks);
        });
    }
    
    function insertBlock(block) {
        
        // parse block metadata to get each of its notebook cells
        var cells = block.ipynb.cells;
        
        cells.forEach(cell => {
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
    }

    function loadTemplates(width) {

        // use the same padding on the dialog popover as the notebook container
        var padding = 25; //parseInt(d3.select("div#notebook-container")
                         //        .style("padding"), 10);

        // get the number of available templates
        var numberOfTemplates = blocks.length,
            templatesPerRow = 3,
            numberOfRows = Math.ceil(numberOfTemplates/templatesPerRow);

        // set width/height of template buttons to have the same aspect ratio as the icon
        var paperWidth = (width - 100 - padding * (templatesPerRow + 1))/templatesPerRow,
            paperHeight = Math.sqrt(2) * paperWidth;

        var containerHeight = 2*(siteHeight - menuHeight)/3;

        var wrapper = d3.select("#blocks-wrapper")
                        .style("overflow-y", "scroll");
        var container = wrapper.append("div")
                                    .attr("id", "blocks-container")
                                    .classed("blocks-container noselect", true)
                                    // .style("height", containerHeight.toString() + "px");
        
        if (blocks.length > 0) createTemplateButtons(container, padding, paperWidth, paperHeight);
    }

  function createTemplateButtons(container, padding, paperWidth, paperHeight) {

        // append evenly spaced rectangles for each template
        var block = container
                       .selectAll("blocks")
                           .data(blocks)
                       .enter()

        var blocksWrap = block.append("div")
                              .classed("blocks-wrap", true)
                            .style("margin-left", padding.toString() + "px")
                            .style("margin-bottom", padding.toString() + "px")
                            .style("width", (paperWidth).toString() + "px")
                            .style("height", paperHeight.toString() + "px")
                              .on("mouseover", function() {
                                    d3.select(this).select("iframe").node().contentWindow
                                           .scroll({ top: 2500, left: 0, behavior: 'smooth' });
                               })
                               .on("mouseout", function() {
                                   d3.select(this).select("iframe").node().contentWindow
                                           .scroll({ top: 0, left: 0, behavior: 'smooth' });
                               })
                        
        .on("click", function(d) {
            console.log(d, "clicked");
            insertBlock(d);
        });

        var blockFrame = blocksWrap.append("iframe")
                    .classed("block", true)
                    .style("border", 0)
                    .attr("allowTransparency", true)
                      .attr("scrolling", "no")
                           .style("width", (2*paperWidth).toString() + "px")
                           .style("height", (2*paperHeight).toString() + "px");
        
      /*
        var fader = blocksWrap.append("span")
            .classed("fader", true)
            .style("height", (paperHeight).toString() + "px");
            */

      blockFrame.each(function(d) {
          var html = d3.select(this).node().contentDocument.documentElement;
          d3.select(html).html(d.html.documentElement.innerHTML);
          
          // strip input and output prompts
          d3.select(html)
            .select("body")
            .selectAll(".prompt")
              .style("display", "none");
          
          // reduce font-size
          d3.select(html)
            .select("body")
            .select(".reveal").style("font-size", "100%");
          
          d3.select(html)
            .select("body")
            .style("bottom", "unset")
            .style("background", "none transparent");
          
          d3.select(html)
            .select("body")
            .selectAll(".input_area")
            .style("background", "none transparent");
          
          // uses `each` to iterate through and render elements one at a time
          /*
          var mathRenderNodes = d3.select(html)
                                 .select("body")
                                   .select("section")
                                   .select("section")
                                     .selectAll(".cell");
          
          // typeset the contents of each iframe
          mathRenderNodes.each(function (d, i) {
              MathJax.Hub.Queue(["Typeset", MathJax.Hub, this]);
          });
          */
          
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select(html).node()]);
      });
  }

  return s;
  }
);
