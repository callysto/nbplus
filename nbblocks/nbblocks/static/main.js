// file nbblocks/main.js
/* Template and "block" selectors in Jupyter notebooks
   Assembled by Eric Easthope for Callysto
   MIT License
*/

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

define(["d3", "d3-selection-multi", "require", "jquery", "base/js/namespace", "../nbblocks/selector"],
  function(d3, multi, requirejs, $, Jupyter, selector) {
    "use strict";

    // define default values for config parameters
    var params = { dummyConfig: undefined };

    var initialize = function () {
        // update params with any specified in the server's config file
        $.extend(true, params, Jupyter.notebook.config.nbblocks);
        
        // find relative url path to custom style sheets, generate style tag
        var cssPath = Jupyter.notebook.base_url + "nbextensions/nbblocks/popoverStyles.css",
            cssTag = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + cssPath + "\">";

        // append custom style sheets
        $("head").append(cssTag);

        // var overviewVisible = false;

        // select menubar container
        var menuContainer = d3.select("div.container-fluid");
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

        // get reorder icon as svg from Ionicons
        d3.svg("https://ionicons.com/ionicons/svg/md-list-box.svg")
          .then(icon => addButton(icon));

        function addButton(iconSvg) {
            // import icon svg path data as a node
            var iconNode = document.importNode(iconSvg.querySelector("svg"), true);

            // give the icon a unique id
            d3.select(iconNode)
              .attr("id", "block-selector");

            // insert the icon node before the modal indicator
            menuContainer.node()
                         .insertBefore(iconNode, d3.select("#modal_indicator").node());

            // set icon width and height, set icon placement
            var icon = menuContainer.select("svg#block-selector")
                .attrs({
                    width: indicatorHeight,
                    height: indicatorHeight
                })
                .styles({
                    fill: "#777",
                    float: "right",
                    "margin-left": "5px",
                    "margin-right": "5px"
                })
                .classed("navbar-text", true);

            // change color on mouseover
            icon
                .on("mouseover", () => icon.style("fill", "#333"))
                .on("mouseout", () => icon.style("fill", "#777"));

            // show overview when clicked
            icon.on("click", function() {
                selector.show();
                // overviewVisible ? layout.hideCells() : layout.showCells()
                // overviewVisible = !overviewVisible;
            });

            // add a mouseover tooltip to the icon
            icon
                .append("title")
                .text("Insert a block");
        }
    };

    // called when nbextension is to be loaded
    var load_ipython_extension = function () {
        console.info("* nbblocks initialized with config");

        // once config loaded, do everything else
        // a Javascript Promise object is loaded
        return Jupyter.notebook.config.loaded.then(initialize);
    }

  // return object to export public methods
  return { load_ipython_extension: load_ipython_extension };
  }
);
