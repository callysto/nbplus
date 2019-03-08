/* ...
*/

requirejs.undef("D3");
requirejs.config({
    paths: {"d3": "//d3js.org/d3.v5.min"}
});

define("D3", ["@jupyter-widgets/base", "d3"],
    function(widgets, d3) {

        var render = function() {
            D3View.__super__.render.apply(this, arguments);
            this._value_changed();
            this.listenTo(this.model, "change:value", this._value_changed, this);

            var model = this.model;

            var div = document.createElement("div");
            this.el.appendChild(div);

            // !important: prompt the div to resize
            window.dispatchEvent(new Event("resize"));

            div.style.height = model.get("height").toString() + "px";

            //
            console.log("Do D3 stuff");

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
                console.log("Pause visualization");
                /*
                if (three.element.offsetParent === null) {
                    three.destroy();
                    return;
                }
                var visible = isInViewport(three.canvas);
                if (three.Loop.running != visible) {
                    visible ? three.Loop.start() : three.Loop.stop();
                }
                */
            }

            // !important: these global variables must go away someday
            window[model.get("name") + "Model"] = model;
            window[model.get("name") + "D3"] = d3;

            console.log("Filename is", model.get("filename"));
            if (model.get("filename")) {
                $.getScript(model.get("filename") + ".js", function(data) {});
            }
        }

        var whenValueChanges = function() {
            var old_value = this.model.previous("value"),
                new_value = this.model.get("value");
        }

        var D3View = widgets.DOMWidgetView.extend({
            render: render,
            _value_changed: whenValueChanges
        });

        return { D3View: D3View }
    }
      );
