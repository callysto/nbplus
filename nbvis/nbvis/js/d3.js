/* ...
*/

requirejs.config({
    paths: {
      d3: "//d3js.org/d3.v5.min"
    }
});

define("d3_view", ["@jupyter-widgets/base", "d3"], (widgets, d3) => {
    var render = function() {
        D3View.__super__.render.apply(this, arguments);

        // listen for changes to the widget "value"
        this._value_changed();
        this.listenTo(this.model, "change:value", this._value_changed, this);

        // get the widget model
        var model = this.model;

        // make a container for D3 content, append to widget view
        var div = document.createElement("div");
        this.el.appendChild(div);

        // set the container height, set container id
        div.style.height = model.get("height").toString() + "px";
        d3.select(div).attr("id", model.get("name"));

        // !important: these global variables must go away someday
        window[model.get("name") + "Model"] = model;
        window[model.get("name") + "D3"] = d3;

        // !important: prompt the container to resize
        window.dispatchEvent(new Event("resize"));

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

    var D3View = widgets.DOMWidgetView.extend({
        render: render,
        _value_changed: whenValueChanges
    });

    return { D3View: D3View }
    }
);
