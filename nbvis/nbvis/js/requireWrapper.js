// ...

requirejs.config({
  paths: {
    d3: "//d3js.org/d3.v5.min",
    mathbox: "//unpkg.com/mathbox@0.1.0?"
  }
})

requirejs(#modules, #moduleNames => { #code });
