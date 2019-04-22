/* Jupyter notebook cell overview for drag-and-drop cell manipulations

   Eric Easthope
   Developed for Callysto
   MIT license
*/

requirejs(["//cdn.jsdelivr.net/npm/d3-require@1?"], d3 => {
  d3.require(...["d3-fetch", "d3-selection", "d3-selection-multi"]).then(d3 => {
    "use strict";

    class Layout {

        // give class its attributes, check for duplicate instances
        constructor(name) {
            this.name = name;
            this.order = [];
            if (!layout_instance) layout_instance = this;
            return layout_instance;
        }
     }

     class Overview {

         // give class its attributes, check for duplicate instances
         constructor(name) {
             this.name = name;
             this.hidden = true;
             if (!overview_instance) overview_instance = this;
             return overview_instance;
         }

         show() {
             console.log("Show overview");

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
               var mover = notebookContainer
                             .append('div')
                             .attr("id", "mover")
                             .attr('class', 'movers')
                             .style('border', '1px solid #cfcfcf')
                             .style('width', overviewWidth.toString() + "px")
                             .style('height', overviewWidth.toString() + "px")
                             .style("position", "absolute")
                             .style("right", rightAlign);

               siteContainer.on("scroll", () => {
                   var moverTop = (siteContainer.property("scrollTop") + Math.min(siteHeight/2,containerHeight/2) - overviewWidth/2);
                   mover.style('top', moverTop.toString() + "px");
               });
               var moverTop = (siteContainer.property("scrollTop") + Math.min(siteHeight/2,containerHeight/2) - overviewWidth/2);
               mover.style('top', moverTop.toString() + "px");

               var mover_svg = mover.append("svg")
                              .attr("id", "mover-svg");

               mover_svg.attr("width", "100%")
                  .attr("height", "100%");
         }

         remove() {
             console.log("Remove overview");

             // adjust width of cells
             d3.selectAll(".cell")
               .style("width", "100%");
             d3.selectAll(".movers").remove();
         }
      }

    var layout_instance = null,
        overview_instance = null,
        layout = new Layout("cells"), // create the Layout object
        overview = new Overview("overview"); // create the Overview object

    // select menubar container
    var menuContainer = d3.select("div.container-fluid"),
        kernelIndicator = d3.select("#kernel_indicator");

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

    var svg = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
          .attrs({
                id: "toggle-overview",
                width: indicatorHeight,
                height: indicatorHeight
            })
            .styles({
                "float": "right",
                "margin-left": "5px",
                "margin-right": "5px"
            })
            .classed("navbar-text", true);

    var circle = svg.append("circle").attrs({
              cx: indicatorHeight/2,
              cy: indicatorHeight/2,
              r: indicatorHeight,
              fill: "#cfcfcf"
            });

    d3.svg("https://ionicons.com/ionicons/svg/md-reorder.svg")
      .then(iconSvg => {
        circle.style("opacity", 0);

        var icon = addIcon(iconSvg);

        svg.on("mouseover", () => icon.style("fill", "#333"))
           .on("mouseout", () => icon.style("fill", "#777"));

        svg.on("click", () => {
            if (overview.hidden) overview.show()
            else if (!overview.hidden) overview.remove();
            overview.hidden = !overview.hidden;
        });

        svg.append("title")
           .text("Hide/Show cell overview");
    });

    function addIcon(graphic) {
        var iconNode = document.importNode(graphic.querySelector("svg"), true);
        var icon = d3.select(iconNode)
                .attr("id", "toggle-overview")
                .attr("fill", "#777");
        svg.node().appendChild(iconNode);

        // insert the icon node before the modal indicator
        menuContainer.selectAll("#toggle-overview").remove();
        menuContainer.node()
                     .insertBefore(svg.node(), d3.select("#modal_indicator").node());

        return icon;
    }

     /*

     showCells() {
         simulation.alpha(1).restart();
         overview.restyle();
         overview.resize();
         overview.setTop();
         this.getCells();
         this.orderCells();
     }

     hideCells() {
         overview.unstyle();
         svg.selectAll("*").remove();
         nodes = [];
         simulation.nodes(nodes);
         simulation.alpha(1).restart();
     }

               getCells() {
                   this.cells = Jupyter.notebook.get_cells();

                   for (var i=0; i<this.cells.length; i++) {
                       //var headerList = this.cells[i].inner_cell
                        //       ? [].slice.call(cells[i].inner_cell[0].querySelectorAll("h1, h2, h3, h4, h5, h6"))
                      //         : null;

                       nodes.push({
                           id: i,
                           type: this.cells[i].cell_type,
                           order: i,
                           //title: headerList && headerList.length != 0
                           //        ? headerList[0].innerText
                           //        : "",
                           offsetTop: this.cells[i].element[0].offsetTop
                       });
                   }
                   return this.cells;
               }

               orderCells() {
                   if (this.order.length === 0) {
                       for (var i=0; i<nodes.length; i++) this.order.push(i);
                   }
                   setYOrder(this.order);
               }

               showLock(cell) {
                   // get height of "g" element corresponding to the cell
                   var gHeight = cell.getBoundingClientRect().height;

                   // import lock svg path data as a node
                   var lockNode = document.importNode(lockIcon.querySelector("svg"), true);

                   // append the icon node to the cell
                   cell.appendChild(lockNode);

                   // set icon width and height, set icon placement
                   lock = d3.select(cell).select("svg")
                           .attrs({
                               id: "lock",
                               width: cellHeight,
                               height: cellHeight,
                               x: -cellHeight/2 - width/16
                           })
                           .styles({
                               fill: "#777",
                               opacity: 0
                           });

                   // time in milliseconds for cell to unlock
                   var countdown = 500;

                   // set arc parameters for "countdown" animation
                   arc = d3.arc()
                       .innerRadius(9/10 * 2*cellHeight/3)
                       .outerRadius(2*cellHeight/3)
                       .startAngle(0);

                   // append the "countdown" path to encompass the lock icon
                   path = d3.select(cell).append("path")
                           .datum({endAngle: 2*Math.PI})
                           .attrs({
                               d: arc,
                               transform: "translate(" + (-width/16) + "," + (cellHeight/2) + ")",
                           })
                           .styles({
                               fill: "#c7c7c7",
                               opacity: 0
                           });

                   // fade in "countdown" path
                   path.interrupt();
                   path.transition()
                       .duration(250)
                       .style("opacity", 1);

                   // make lock visible
                   lock.interrupt();
                   lock.style("opacity", 1);

                   t = d3.timer(function(elapsed) {

                       var percent = Math.max((countdown-elapsed)/countdown, 0);
                       path.attr("d", arc({endAngle: percent * 2*Math.PI}));

                       if (elapsed > countdown) {
                           // make cell movable
                           cellMovable = true;

                           // stop the "countdown" timer
                           t.stop();

                           // fade out the lock icon
                           lock.transition()
                               .duration(125)
                               .style("opacity", 0);
                       }
                   }, parseInt(countdown/60));
               }
           }
           */
         });
});
