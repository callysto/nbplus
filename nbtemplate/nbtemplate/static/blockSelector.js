// specify path to D3.js
requirejs.config({ "paths": { "d3": "//d3js.org/d3.v5.min" } });

// require D3.js, then implement the template selector
requirejs(["d3"], d3 => {
    d3.json("https://raw.githubusercontent.com/callysto/notebook-templates/master/blockConfig.json").then(function(config) {

        var blocksConfig = config.blocks;
        var blocksButton = $("ul.nav.navbar-nav");
        var blocksDropdown = $("<li/>")
                               .addClass("dropdown")
                                 .appendTo(blocksButton);
        var blocksLink = $("<a/>")
                           .attr("href", "#")
                           .attr("data-toggle", "dropdown")
                           .addClass("dropdown-toggle")
                           .text("Blocks")
                             .appendTo(blocksDropdown);

        var blocksList = $("<ul/>")
                           .attr("id", "blocks_menu")
                           .addClass("dropdown-menu")
                             .appendTo(blocksDropdown);

        function addItem(obj, parent) {
            var listItem = $("<li/>");
            var listLink = $("<a/>");

            for (var key in obj) {
                if (key === "id" || key === "title") listItem.attr(key, obj[key]);
                if (key === "text") listLink.text(obj[key]);
                if (key === "url") listLink.on("click", function() {
                  // get template notebook from URL
                  Promise
                      .all([d3.json(obj["url"])])
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
                });
            }

            if (obj["submenu"].length > 0) {
                listItem
                  .addClass("dropdown-submenu");

                var submenuList = $("<ul/>")
                                    .addClass("dropdown-menu")
                                      .appendTo(listItem);

                for (var j = 0; j < obj["submenu"].length; j++) {
                    addItem(obj["submenu"][j], submenuList);
                }
            }

            listLink
              .attr("href", "#")
                .appendTo(listItem);

            listItem
              .appendTo(parent);
        }

        for (var i = 0; i < blocksConfig.length; i++) {
            addItem(blocksConfig[i], blocksList);
        };
    });
});
