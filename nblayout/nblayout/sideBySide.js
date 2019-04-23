/* ...
*/

requirejs.config({
    paths: {
        "d3-require": "//cdn.jsdelivr.net/npm/d3-require@1?"
    }
});

if (typeof Jupyter !== "undefined") $(document).ready(sideBySide)
else sideBySide();

function sideBySide() {
    var cellElement = element.parents(".cell")[0];

    requirejs(["d3-require"], d3 => {
        d3.require("d3-selection").then(d3 => {

            if (typeof Jupyter === "undefined") {
                d3.select(cellElement).selectAll("span").remove();
                var cellText = d3.select(cellElement).select("pre").text();
                cellText = cellText.substring(1);
                d3.select(cellElement)
                  .select("pre")
                  .text(cellText);
            }

            d3.select(cellElement)
              .style("flex-direction", "row");

            d3.select(cellElement)
              .select(".input")
              .style("width", "50%")
              .style("height", "100%");

            d3.select(cellElement)
              .select(".output_wrapper")
              .style("width", "50%");
        });
    });
}
