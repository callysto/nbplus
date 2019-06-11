/**
  * Add a "play" button to the Jupyter notebook menubar with `import play_button.play`
  * Click the button (optionally, while holding the Alt/Option key) to run (and scroll through) all cells
  */

/* Configure RequireJS URL paths */
requirejs.config({
  paths: {
    "d3-require": "//cdn.jsdelivr.net/npm/d3-require@1?",
  }
});

/* Check if we are in a Jupyter instance */
if (typeof Jupyter !== "undefined") {
  requirejs(["d3-require"], d3 => {
    d3.require("d3-selection", "d3-fetch").then(d3 => {
      /* Once D3.js submodules are loaded, add icon to Jupyter menubar */

      // Select menubar HTML elements
      var menuContainer = d3.select("div.container-fluid"),
          kernelIndicator = d3.select("#kernel_indicator");

      // Get height of kernel indicator
      var indicatorHeight = kernelIndicator
                              .node()
                                .getBoundingClientRect()
                                .height;

      // Remove the "play" button if it is already on the menubar
      menuContainer.selectAll("#play-button").remove();
        
      // Append an SVG element to the menubar to contain the "play" button's SVG data
      var playButton = menuContainer
                         .insert("svg", "#modal_indicator")
                         .attr("id", "play-button")
                         .attr("width", indicatorHeight)
                         .attr("height", indicatorHeight)
                         .style("float", "right")
                         .style("margin-left", "5px")
                         .style("margin-right", "5px")
                         .classed("navbar-text", true);
                         
       // For testing: Append a circle to check that the SVG element is properly appended to the menubar
       var circle = playButton
                      .append("circle")
                      .attr("cx", indicatorHeight/2)
                      .attr("cy", indicatorHeight/2)
                      .attr("r", indicatorHeight)
                      .attr("fill", "#cfcfcf");
      
      // Retrieve the "play" button's SVG data to produce an icon
      d3.svg("https://ionicons.com/ionicons/svg/ios-play.svg")
        .then(icon => {
          circle.style("opacity", 0);
          
          // Select the "play" button's SVG data's node
          var iconNode = document.importNode(icon.querySelector("svg"), true);
          
          // Give the "play" button icon a color
          var icon = d3.select(iconNode)
                       .attr("fill", "#777");
          
          // Append the "play" button icon to its container
          playButton.node().appendChild(iconNode);

          // Add icon color changes on mouseover
          playButton
            .on("mouseover", () => icon.style("fill", "#333"))
            .on("mouseout", () => icon.style("fill", "#777"));
          
          // Add icon tooltip data
          playButton.append("title")
                    .text("Run all cells");

          // Add icon click behaviour
          playButton.on("click", function() {
            console.log("Play");
              
            // Get Jupyter notebook cells
            var cells = Jupyter.notebook.get_cells();
              
            // Get code cells, get Markdown cells
            var codeCells = cells.filter(c => c.cell_type == "code"),
                markdownCells = cells.filter(c => c.cell_type == "markdown");
            
            // Render Markdown cells, execute code cells
            for (var i=0; i<markdownCells.length; i++) markdownCells[i].render();
            for (var i=0; i<codeCells.length; i++) codeCells[i].execute();
          });
      });
    });
  });
}
