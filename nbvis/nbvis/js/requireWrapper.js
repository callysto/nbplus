// ...

requirejs.config({paths: #paths});

var submodules = #submodules;

const waitForView = (viewId) => {
    return new Promise((resolve, reject) => {
        var start = null;
        window.requestAnimationFrame(step);
        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = timestamp - start,
                el = document.getElementById(viewId);

            if (progress < 3000 && !el) { window.requestAnimationFrame(step); }
            else { resolve(el); }
        }
  });
};

requirejs(#modules, #moduleNames => {#d3_require});
