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

define(["d3", "d3-selection-multi", "../nbtemplate/overview"],
  function (d3, multi, overview) {
    "use strict";
    let instance = null;
    class layout {
        
        // give overview class its attributes, check for duplicate instances
        constructor(name) {
            this.name = name;
            this.order = [];
            if (!instance) instance = this;
            return instance;
        }
        
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
                /*
                var headerList = this.cells[i].inner_cell
                        ? [].slice.call(cells[i].inner_cell[0].querySelectorAll("h1, h2, h3, h4, h5, h6"))
                        : null;
                */
                
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
    
    // select overview element
    var mover = d3.select("#mover");
    
    // select svg within overview element
    var svg = mover.select("#mover-svg"),
        width = svg.node().getBoundingClientRect().width,
        height = svg.node().getBoundingClientRect().height;
    
    // initialize container for cell "node" data
    var nodes = [];
    
    // keep track of which cell is selected, keep track of its index
    var selectedCell = Jupyter.notebook.get_selected_cell(),
        selectedIndex = Jupyter.notebook.get_selected_index();
    
    // keep track of initial y coordinate of dragged cells
    var initialY;
    
    // d3 force simulation parameters
    var simulation = d3.forceSimulation(nodes)
            .alphaDecay(1e-2)
            .velocityDecay(7/10)
            .force("y", d3.forceY()
                .strength(9/10)
                .y(d => d.yOffset))
            .on("tick", ticked);
    
    // set cell visualization height
    var cellHeight = 25;
    
    // sample the height of header text for the visualization, then remove
    var sampleText = svg.append("text")
                        .attr("dy", -cellHeight)
                        .style("font-size", cellHeight.toString())
                        .text("test");
    var headerHeight = sampleText.node().getBoundingClientRect().height+1/2; // why the off-by-one error?
    sampleText.remove();
    
    Jupyter.notebook
        .events.on("create.Cell", (evt, data) => {
            if (overviewVisible) {
                overview.restyle();
                overview.resize();
                overview.setTop();
            }
            simulation.alpha(1).restart();
            console.log("Create cell at index", data.index);
        
            var maxIdx = d3.max(nodes, d => d.id);

            nodes.push({
                "id": maxIdx+1,
                "idx": data.index,
                "type": data.cell.cell_type,
            });

            l.order.splice(data.index, 0, maxIdx+1);
            console.log("Cell created", l.order, nodes);

            for (var i=0; i<nodes.length; i++) {
                nodes[i].order = l.order.indexOf(nodes[i].id);
            }

            setYOrder(l.order);
            simulation.nodes(nodes);
    });
    
    Jupyter.notebook
       .events.on("delete.Cell", (evt, data) => {
           if (overviewVisible) {
               // overview.restyle();
               overview.resize();
               overview.setTop();
           }
           simulation.alpha(1).restart();
           console.log("Delete cell at index", data.index);
        
           var deleteId = l.order.splice(data.index, 1);
           nodes.splice(deleteId, 1);

           for (var i=0; i<l.order.length; i++) {
               if (l.order[i] > deleteId) l.order[i]--;
           }
           for (var i=0; i<nodes.length; i++) {
               if (nodes[i].id > deleteId) nodes[i].id--;
           }
           for (var i=0; i<nodes.length; i++) {
               nodes[i].order = l.order.indexOf(nodes[i].id);
           }

           console.log("Cell deleted", nodes, l.order);

           setYOrder(l.order);
           simulation.nodes(nodes);
       });
    
    // set nodes to reflect correct cell ordering
    function setYOrder(order) {
        // refresh height in case the svg size changing
        height = svg.node().getBoundingClientRect().height;
        
        var spacing = 3*cellHeight/2,
            yOffset = nodes.length % 2 == 0 ? spacing/2 : 0,
            iOffset = -Math.floor(nodes.length/2);
        
        for (var i=iOffset; i<nodes.length+iOffset; i++) {
            nodes[i-iOffset].yOffset = height/2 + (nodes[i-iOffset].order+iOffset)*spacing - cellHeight/2 + yOffset;
        }
        console.log(order, nodes);
    }
    
    function dragstart(d) {
        // show a lock element if one does not already exist
        if (d3.select(this).select("#lock").empty()) l.showLock(this);
        
        // "reheat" simulation
        if (!d3.event.active) simulation.alpha(1).restart();
        
        // enter command mode
        Jupyter.notebook.command_mode();
        
        // (for testing only) make corresponding cell element translucent
        d3.select(Jupyter.notebook.get_cells()[d.order].element[0]).style("opacity", 1/2);
        
        // set initial y coordinate
        initialY = d.yOffset;
        
        // select the corresponding cell
        Jupyter.notebook.select(d.order);
        selectedCell = Jupyter.notebook.get_selected_cell();
    }
    
    function dragging(d) {
        // keep simulation "hot" while dragging
        simulation.alpha(1);
        
        // get id of node being dragged
        var draggedId = d3.event.subject.id;
        
        // remove forcing on dragged element
        simulation.force("y", d3.forceY()
                .strength(d => draggedId === d.id
                              ? 0
                              : 9/10)
                .y(d => d.yOffset));
        
        // if cell is movable then move node, keep track of node's new y coordinate
        if (cellMovable) {
            var yDrag = (d.y = d3.event.y);
            d3.select(this)
              .attr("translate", d => "transform(0," + yDrag + ")");
        }
        
        // get displacement of node from its initial yOffset value
        var cellDelta = yDrag - initialY,
            threshold = 3*cellHeight/2;
        
        if (d.order != l.order.length-1 && cellDelta/threshold > 1) {
            console.log("Move cell", l.order[d.order] , "at index", d.order, "down");
            Jupyter.notebook.move_selection_down();
            
            // swap order of adjacent cells
            l.order[d.order] = l.order.splice(d.order+1, 1, l.order[d.order])[0];
            
            // update selected index
            selectedIndex += 1;
            
            // overwrite cell order
            for (var i=0; i<nodes.length; i++) nodes[i].order = l.order.indexOf(nodes[i].id);
        
            // update cell y offsets
            setYOrder(l.order);

            // update new reference for initial y coordinate to reflect change of order
            initialY = d.yOffset;

            // push node data updates to simulation
            simulation.nodes(nodes);
        }
        else if (d.order != 0 && cellDelta/threshold < -1) {
            console.log("Move cell", l.order[d.order] , "at index", d.order, "up");
            Jupyter.notebook.move_selection_up();

            // swap order of adjacent cells
            l.order[d.order] = l.order.splice(d.order-1, 1, l.order[d.order])[0];
            
            // overwrite cell order
            for (var i=0; i<nodes.length; i++) nodes[i].order = l.order.indexOf(nodes[i].id);
        
            // update cell y offsets
            setYOrder(l.order);
        
            // update new reference for initial y coordinate to reflect change of order
            initialY = d.yOffset;
            
            // push node data updates to simulation
            simulation.nodes(nodes);
        }
    }
    
    function dragend(d) {
        // remove the lock and path elements unconditionally
        d3.select(this).select("#lock").remove();
        path.remove();
        
        // stop the unlock "countdown" timers
        t.stop();
        
        // make cell "unmovable" again
        cellMovable = false;
        
        // "reheat" simulation
        simulation.alpha(1).restart();
        
        // (for testing only) make all cell element opaque
        d3.select("#notebook-container").selectAll("div")
                                        .style("opacity", 1);
        
        // l.orderCells();
        
        simulation.force("y", d3.forceY()
                .strength(9/10)
                .y(d => d.yOffset));
    }
    
    function ticked() {
        
        // set selected index
        selectedIndex = Jupyter.notebook.get_selected_index();
        
        // push node data updates to simulation
        simulation.nodes(nodes);
        
        // data join nodes to svg elements
        var u = svg.selectAll("g")
                   .data(nodes);
        
        // remove old svg elements 
        u.exit()
         .remove();
        
        var text = u.select("text");
        var rect = u.select("rect");
        
        // enter new svg elements, bind drag behaviour
        var gEnter = u.enter().append("g")
                .call(d3.drag()
                        .on("start", dragstart)
                        .on("drag", dragging)
                        .on("end", dragend));
        
        // enter new rectangles, set size
        var rectEnter = gEnter.append("rect")
                .attrs({
                    width: width/2,
                    height: cellHeight
                })
                .style("opacity", 0)
                .transition().duration(250)
                    .style("opacity", 1);
        
        // enter new text
        var textEnter = gEnter.append("text");
        
        // merge old rectangles with the new, set styles
        rect.merge(rectEnter)
            .style("fill", d => d.type == "code" ? "#f7f7f7" : "#fff")
            .style("stroke", (d, i) => {
                if (d.order === selectedIndex) {
                    return Jupyter.notebook.get_selected_cell().mode == "command"
                                ? "#42A5F5"
                                : "#66BB6A";
                }
                else return "#cfcfcf";
            })
            .style("shape-rendering", "crispEdges");
        
        // merge old text with the new, set styles
        text.merge(textEnter)
            .attrs({
                x: headerHeight/4,
                y: headerHeight/2,
                "alignment-baseline": "middle"
            })
            .styles({
                "font-weight": "bold",
                "font-size": cellHeight.toString() + "px"
            })
            .text(d => d.id);
        
        // merge old svg elements with the new, translate to corresponding positions
        u.merge(gEnter)
         .attr("transform", d => "translate(" + (width/2 - width/4)
                                              + ","
                                              + (d.y ? d.y : 0)
                                              + ")"
        );
    }
    
    // create the overview object
    var l = new layout("cells");
    
    // instantiate cell locking variables
    var t, path, arc, lock, lockIcon;
    
    // keep track of when cells are unlocked, i.e. "movable"
    var cellMovable = false;
    
    // get lock and unlock icons as svg from Ionicons
    Promise
        .all([
            d3.svg("https://ionicons.com/ionicons/svg/md-lock.svg")
        ])
        .then(lockIcons => {
            lockIcon = lockIcons[0]
        });
    
  return l;
  }
);
