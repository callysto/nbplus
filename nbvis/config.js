requirejs.config({
    paths: !paths
});

var modules = !modules;

requirejs(["d3-require"], (d3) => {
    d3.require(...modules).then(d3 => {
        !code
    });
});