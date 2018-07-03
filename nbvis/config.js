requirejs.config({
    paths: !paths
});

var modules = !modules;

requirejs(["d3-require", "topojson"], (d3, topojson) => {
    d3.require(...modules).then(d3 => {
        !code
    });
});
