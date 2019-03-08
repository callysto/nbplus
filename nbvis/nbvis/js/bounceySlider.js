/* ...
*/

requirejs.undef("bouncey_slider");
requirejs.config({
    paths: {
        "d3": "//d3js.org/d3.v5.min"
    }
});

define("bouncey_slider", ["@jupyter-widgets/base", "d3"], function(widgets, d3) {
    var render = function() {
        bounceySliderView.__super__.render.apply(this, arguments);
        this._value_changed();
        this.listenTo(this.model, "change:value", this._value_changed, this);
        
        d3.select("div.output_subarea")
          .style("max-width", "unset");
        
        var el = d3.select(this.el);
        
        var width = d3.select(".output_area")
                          .node().getBoundingClientRect().width -
                        d3.select(".out_prompt_overlay")
                          .node().getBoundingClientRect().width,
            height = 150;
        
        var svg = el.append("svg")
                    .attr("id", "slider")
                    .attr("width", width)
                    .attr("height", height);
        
        var g = svg.append("g")
                   .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
        
        var xScale = d3.scaleLinear()
                .domain(d3.extent([this.model.get("left"), this.model.get("right")]))
                .range([-width/2 + width/5, width/2 - width/5]);

        var xAxis = d3.axisBottom(xScale)
                .ticks(width/200)
                .tickSize(0)
                .tickPadding(15)

        g.append("g")
            .attr("opacity", 2/3)
            .call(xAxis);
        
        var data = [{}];
        
        console.log(this.model.get("value"));
        
        var simulation = d3.forceSimulation(data)
                .force("x", d3.forceX().x(xScale(this.model.get("value"))))
                .alphaDecay(3e-2)
                .velocityDecay(2/10);

        var node = g.selectAll(".node")
                    .data(data)
                .enter().append("circle")
                    .attr("r", d => d.radius ? d.radius : 8);
        
        node.on("dblclick", () => {
            simulation.force("x", d3.forceX().x(0));
            simulation.alpha(1).restart();
        });
        
        node.call((() => {
                return d3.drag()
                    .on("start", d => {
                        if (!d3.event.active) simulation.alpha(1).restart();
                        d.fx = d.x;
                    })
                    .on("drag", d => { d.fx = d3.event.x; })
                    .on("end", d => {
                        if (d3.event.sourceEvent.altKey) {
                            simulation.force("x", d3.forceX().x(d.fx));
                            simulation.alpha(1).restart();
                        }
                        d.fx = null;
                });
        })());
        
        simulation.on("tick", () => {
            node.attr("cx", d => d.x)
            this.model.set("value", xScale.invert(node.attr("cx")));
            this.touch(); // !? impedes kernel
        });
    }
    
    var whenValueChanges = function() {
        var old_value = this.model.previous("value"),
            new_value = this.model.get("value");
        // console.log("Value changed to", new_value);
    }
    
    var bounceySliderView = widgets.DOMWidgetView.extend({
        render: render,
        _value_changed: whenValueChanges
    });
    
    return { bounceySliderView: bounceySliderView }
});