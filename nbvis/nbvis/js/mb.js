// ...

requirejs.config({
    paths: {
      "mathbox": "//unpkg.com/mathbox@0.1.0?"
    }
});

define("mathbox_view", ["@jupyter-widgets/base", "mathbox"], (widgets, mathbox) => {
    var render = function() {
        MathBoxView.__super__.render.apply(this, arguments);
        this._value_changed();
        this.listenTo(this.model, "change:value", this._value_changed, this);

        var model = this.model;

        var div = document.createElement("div");
        div.id = model.get("name");
        this.el.appendChild(div);

        var raw_config = model.get("config");
        if (raw_config.hasOwnProperty("plugins")) {
            if (raw_config.plugins.indexOf("controls") !== -1 &&
                raw_config.hasOwnProperty("controls")) {
                    if (raw_config.controls.klass === "THREE.OrbitControls") {
                        raw_config.controls.klass = THREE.OrbitControls;
                    }
            }
        }

        var config = Object.assign(
            {element: this.el.firstChild},
            raw_config
        );

        // append a MathBox canvas to the div, set its colour and dimensions
        // identify three.js bootstrap
        var mathbox = mathBox(config),
            three = mathbox.three;
        three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);
        mathbox.three.element.style.width = "100%";
        mathbox.three.element.style.height = model.get("height")
                                                  .toString() + "px";
        if (mathbox.fallback) throw "WebGL error";

        // !important: prompt the canvas to resize
        window.dispatchEvent(new Event("resize"));

        /*
        // check if element is visible in browser window
        function isInViewport(element) {
            var rect = element.getBoundingClientRect(),
                html = document.documentElement,
                w = window.innerWidth || html.clientWidth,
                h = window.innerHeight || html.clientHeight;
            return rect.top < h && rect.left < w && rect.bottom > 0 && rect.right > 0;
        }

        // run update/render loop only for visible elements
        document.getElementById("site").onscroll = (e) => {
            if (three.element.offsetParent === null) {
                three.destroy();
                return;
            }
            var visible = isInViewport(three.canvas);
            if (three.Loop.running != visible) {
                visible ? three.Loop.start() : three.Loop.stop();
            }
        }
        */

        three.Loop.start();

        // !important: these global variables must go away someday
        window[model.get("name") + "Model"] = model;
        window[model.get("name") + "MathBox"] = mathbox;

        /*
        console.log("Filename is", model.get("filename"));
        if (model.get("filename")) {
            $.getScript(model.get("filename") + ".js", function(data) {});
        }
        */
    }

    var whenValueChanges = function() {
        var oldValue = this.model.previous("value"),
            newValue = this.model.get("value");
    }

    var MathBoxView = widgets.DOMWidgetView.extend({
        render: render,
        _value_changed: whenValueChanges
    });

    return { MathBoxView: MathBoxView }
    }
);
