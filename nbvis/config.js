requirejs.config({
    paths: #paths
});

requirejs(#requires, (#require_names) => {
    d3.require(...#modules).then(d3 => {
        #code
    });
});
