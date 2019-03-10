// file nbvis/js/config.js
/* RequireJS configuration for the nbvis module
    + custom on-the-fly requires via d3-require
   Assembled by Eric Easthope for Callysto
   MIT License
*/

requirejs.config({
    paths: #paths
});

var modules = #modules;

requirejs(#requires, (#require_names) => { #d3_require?
});