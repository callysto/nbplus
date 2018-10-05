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
                if (key === "click") listLink.on(key, new Function(obj[key]));
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
