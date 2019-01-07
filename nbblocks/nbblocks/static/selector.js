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
                  
                  d3.select("#header").style("filter", "blur(9px)");
                  d3.select("#site").style("filter", "blur(9px)");
                  d3.select("div.modal-dialog").style("width", (2*siteWidth/3).toString() + "px");
                  // loadTemplates($("div.modal-body").width());
              };
          };
        }
    }

    // create the block selector object
    var s = new selector("blocks");

    var templates = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

    var siteWidth = parseInt(d3.select("#site").style("width")),
        siteHeight = parseInt(d3.select("#site").style("height")),
        menuHeight = parseInt(d3.select("#menubar").style("height"));
    
    var blockConfigUrl = "https://raw.githubusercontent.com/callysto/notebook-templates/master/blockConfig.json";
    getTemplates(blockConfigUrl);
    
    function getTemplates(url) {
        // from config list of blocks, get each template url
        d3.json(url).then(function(blocks) {
            
            // specify arrangement and source URLs for notebook templates
            console.log(blocks);
            
            
        });
        
        // use Promise.all to retrieve blocks html AND blocks metadata
        // ...
        
        // for each block, create a template button
        
        /*
        var url = "https://gist.githubusercontent.com/ericeasthope/7ce5cef54da6a020d9f074fd650f949c/" +
                  "raw/f6dcdbf8b3c30fb3398f2c545586677285b6d643/requestsBlockTest.html"

         d3.html(url)
           .then(
          function(data){
            createTemplateButtons(data, container, padding, paperWidth, paperHeight);
          },

          function(error){
              console.log(error);
          });
        */
    }
    
    function insertBlock() {
        
        // parse block metadata to get each of its cells
        // ...
        
        // insert the content of each of the cells
        // ...
        
        // execute the cells that have been added
        // ...
        
    }

    function loadTemplates(width) {

        // use the same padding on the dialog popover as the notebook container
        var padding = 25; //parseInt(d3.select("div#notebook-container")
                         //        .style("padding"), 10);

        // get the number of available templates
        var numberOfTemplates = templates.length,
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

        var url = "https://gist.githubusercontent.com/ericeasthope/7ce5cef54da6a020d9f074fd650f949c/" +
                  "raw/f6dcdbf8b3c30fb3398f2c545586677285b6d643/requestsBlockTest.html"

         d3.html(url)
           .then(
          function(data){
            createTemplateButtons(data, container, padding, paperWidth, paperHeight);
          },

          function(error){
              console.log(error);
          });
    }

  function createTemplateButtons(data, container, padding, paperWidth, paperHeight) {

        // append evenly spaced rectangles for each template
        var block = container
                       .selectAll("blocks")
                           .data(templates)
                       .enter()

        var blocksWrap = block.append("div")
                              .classed("blocks-wrap", true)
                            .style("margin-left", padding.toString() + "px")
                            .style("margin-bottom", padding.toString() + "px")
                            .style("width", paperWidth.toString() + "px")
                            .style("height", paperHeight.toString() + "px")
                              .on("mouseover", function() {
                                  var fader = d3.select(this).select(".fader");
                                  fader.style("opacity", "0");
                               })
                               .on("mouseout", function() {
                                  var fader = d3.select(this).select(".fader");
                                  fader.transition()
                                       .duration(125)
                                       .style("opacity", "1");
                               })
        .on("click", function() {
                                   console.log(this, "clicked");
                               }),


        blockFrame = blocksWrap.append("iframe")
                    .classed("block", true)
                      .attr("scrolling", "no")
                           .style("width", (2*paperWidth).toString() + "px")
                           .style("height", (2*paperHeight).toString() + "px"),

        fader = blocksWrap.append("span")
          .classed("fader", true)
          .style("height", (paperHeight).toString() + "px");

      blockFrame.each(function() {
          d3.select(this).node().contentDocument
            .write(data.documentElement.innerHTML);
      });
  }

  return s;
  }
);
