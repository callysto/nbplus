// ...

requirejs.config({paths: #paths});

var submodules = #submodules;

if (typeof window.waitForView === 'undefined') {
    window.waitForView = (viewId) => {
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
}

requirejs(#modules, #moduleNames => {
    Promise.all([
        #d3_require
    ])
    .then(function(#submoduleNames) {
        #code
    })
});
