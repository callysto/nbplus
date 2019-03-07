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

define(["d3", "d3-selection-multi"],
  function (d3) {
    "use strict";
    let instance = null;
    class overview {
        
        // give overview class its attributes, check for duplicate instances
        constructor(name) {
            this.name = name;
            if (!instance) instance = this;
            return instance;
        }
        
        // make the overview window
        make() {
            this.width = overviewWidth;
            this.height = overviewHeight;
            
            // make overview container
            this.mover = container
                    .append("div")
                    .attrs({
                        id: "mover",
                        class: "movers"
                    })
                    .styles({
                        width: (this.width).toString() + "px",
                        height: (this.height).toString() + "px",
                        position: "absolute",
                        border: "1px solid #cfcfcf",
                        right: rightAlign,
                        opacity: 0
                    });
            
            // change y position of overview when scrolled
            site.on("scroll", () => { this.setTop(); });
            
            this.mover.append("svg")
                    .attrs({
                        id: "mover-svg",
                        width: "100%",
                        height: "100%"
                    });
        }
        
        // resize the overview window
        resize() {
            height = container.node().getBoundingClientRect().height;
            overviewHeight = Math.min(overviewWidth, height - 2*paddingNum);
            this.height = overviewHeight;
            d3.select("#mover") // .transition()
              // .duration(250) # cannot transition unless setYOrder accessible to .on("end", ...)
              .style("height", (this.height).toString() + "px");
        }
        
        setTop() {
            height = container.node().getBoundingClientRect().height;
            siteHeight = site.node().getBoundingClientRect().height;
            
            var shortTop = site.property("scrollTop") + paddingTop + height/2 - this.height/2,
                longTop = site.property("scrollTop") + siteHeight/2 - this.height/2;
            
            var moverTop = (height > siteHeight)
                    ? longTop
                    : shortTop;
            this.mover.style("top", moverTop.toString() + "px");
        }
        
        // change notebook container styles to fit overview window
        restyle() {
            
            // adjust width of cells
            d3.selectAll(".cell")
              .style("width", cellPercent);
            
            this.mover // .transition()
                // .duration(250)
                .style("opacity", 1);
            
            // resize window
            window.dispatchEvent(new Event("resize"));
        }
        
        // revert the effect of restyle
        unstyle() {
            
            // adjust width of cells
            d3.selectAll(".cell")
              .style("width", "100%");
            
            this.mover // .transition()
                // .duration(250)
                .style("opacity", 0);
            
            // resize window
            window.dispatchEvent(new Event("resize"));
        }
    }
    
    // get a cell from which to sample styles
    var sampleElement = d3.select(Jupyter.notebook.get_cells()[0].element[0]),
        sampleWidth = sampleElement.node().getBoundingClientRect().width,
        samplePaddingNum = parseInt(sampleElement.style("padding"), 10);
    
    // get site element
    var site = d3.select("#site"),
        siteHeight = site.node().getBoundingClientRect().height;
    
    // get notebook element, get top padding
    var nb = d3.select("#notebook"),
        paddingTop = parseInt(nb.style("padding-top"), 10);
    
    // get notebook container element 
    var container = d3.select("#notebook-container"),
        width = container.node().getBoundingClientRect().width,
        height = container.node().getBoundingClientRect().height,
        paddingNum = parseInt(container.style("padding"), 10),
        marginNum = parseInt(container.style("margin-right"), 10),
        rightAlign = (paddingNum + marginNum).toString() + "px";
    
    // set percent notebook container to allocate for cells
    var cellPercent = "66%";
    
    // compute width of overview so that it fits in window alongside cells
    var overviewWidth = width - 2*paddingNum
                              - (parseInt(cellPercent)/100)*sampleWidth
                              - paddingNum
                              + samplePaddingNum;
    
    // compute height of overview so that it fits in container
    var overviewHeight = Math.min(overviewWidth, height - 2*paddingNum);
    
    // create the overview object
    var o = new overview("notebook");
    o.make();
    o.resize();
    o.setTop();

  return o;
  }
);
