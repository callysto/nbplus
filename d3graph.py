#!/usr/bin/env python
# d3.graph.py

'''
Constructor classes to generate force-directed graphs via D3.js

Assembled by Eric Easthope
MIT License https://opensource.org/licenses/MIT
'''

from IPython.display import HTML, Javascript
from json import dumps

# -- d3.js parent class, "requires" d3, executes constructor javascript -- #
class D3:
    def __init__(self):
        self.js = ""; # stores javascript
        self.required = False

    # "sums" the javascript of separate constructors
    def __add__(self, constructor):
        superStructure = D3()
        try:
            superStructure.tag = self.tag
        except AttributeError: pass
        superStructure.js = self.get() + constructor.get()
        return superStructure;

    def get(self):
        return self.js;

    def make(self):
        # adds html tags if they exist
        try:
            display(HTML(self.tag))
        except AttributeError: pass

        # requirejs configuration for d3v4
        require = ('\n' + '// -- import d3 -- //' + '\n' +
                   'require.config({paths: {d3: "//d3js.org/d3.v4.min"}});' + '\n' +
                   'requirejs(["d3"], d3 => {' + '\n') if not self.required else ''

        # inject javascript
        d3Code = require + (self.js if self.js != '' else 'window.d3 = d3;')
        d3Code += '\n\n'+'});' if not self.required else ''

        self.required = True
        self.js = d3Code

        # execute self.js
        display(Javascript(self.js));

# -- svg constructor class -- #
class SVG(D3):
    def __init__(self, height, centerOrigin=True):
        D3.__init__(self)                # inherits D3 class methods/variables
        self.height = height             # copies height parameter
        self.centerOrigin = centerOrigin # place origin at center (defaults to True)

        # html tag, substitutes self.height
        self.tag = '<svg width = "100%%" height = "%s"></svg>' % self.height

        # svg container/dimensions
        svgHeader = '// -- svg container/dimensions -- //'
        svg = 'var svg = d3.select("svg")'

        clearSvg = 'svg.selectAll("*").remove()'
        getWidth = 'var width = +svg.node().getBoundingClientRect().width'
        getHeight = 'var height = +svg.attr("height")'

        # place origin
        origin = ('\n' '// -- place origin -- //' '\n'
                  'var origin = svg.append(\"g\")')

        transform = 'var transform = \"translate(\"+width/2+\",\"+height/2+\")\"'
        transformOrigin = 'origin.attr("transform", transform)'

        self.structure = (
            [svgHeader, svg, clearSvg, getWidth, getHeight] +
           ([origin] + [transform, transformOrigin] if centerOrigin else [])
        )
        for s in self.structure:
            self.js += '\n' + s + (';' if s[-1] != '/' else '')
        self.js += '\n';

# -- force-(directed/undirected) graph constructor class -- $
class Graph(D3):
    def __init__(self, directed=False):
        D3.__init__(self)        # inherits D3 class methods/variables
        # self.directed = directed # if True, expects edge directions
        self.constraints, self.forces, self.nodes, self.edges = [], [], [], [];

    def get(self):
        self.js = ''
        if self.edges != []:
            self.js += ('\n' '// -- edge data -- //' '\n')
            self.js += 'var edges = %s;' % dumps(self.edges, indent=4)+'\n\n'
            self.js += self.edgeElement+';'+'\n'

        if self.nodes != []:
            self.js += ('\n' '// -- node data -- //' '\n')
            self.js += 'var nodes = %s;' % dumps(self.nodes, indent=4)+'\n\n'
            self.js += self.nodeElement+';'+'\n'

        if self.forces != []:
            self.js += ('\n' '// -- force directed graph simulation parameters -- //' '\n')
            self.js += 'var simulation = d3.forceSimulation()'
            for force in self.forces:
                self.js += '\n\t'+force

        if self.constraints != []:
            self.js += '\n'
            for constraint in self.constraints:
                self.js += '\n'+'simulation'+constraint
                self.js += ';'

        self.js += ('\n' 'simulation.nodes(nodes);' if self.nodes != [] else '')
        self.js += ('\n' 'simulation.force("link").links(edges);' if self.edges != [] else '')
        return self.js;

    def addForce(self, **kwargs):
        if kwargs:
            for key, value in kwargs.items():
                nameGuess = (value['name']
                                 if 'name' in value.keys()
                                 else key.replace('force', '').lower())
                force = '.force('
                force += '\"'+nameGuess+'\"'+', '+'d3.'+key+'()'
                force += ''.join('.'+k+'('+str(v)+')' for k, v in value.items() if k != 'name')
                force += ')'
                self.forces.append(force);

    def addNode(self, data, style=None, tooltip=False):
        self.nodes += (data if type(data) is list
                            else [data] if type(data) is dict
                            else [])

        self.nodeElement = '// -- node display parameters -- //'
        self.nodeElement += '\n'+'var node = origin.selectAll(".node")'
        self.nodeElement += '\n\t'+'.data(nodes)'
        self.nodeElement += '\n\t'+'.enter().append("circle")'

        if style is None:
            self.nodeElement += '\n\t\t'+'.attr("r", d => d.radius ? d.radius : 8)'
        else:
            for key, value in style.items():
                if key != 'title':
                    self.nodeElement += '\n\t\t'+'.attr(\"%s\", %s)' % (key, value)
            if 'title' in style.keys():
                self.nodeElement += '\n'+'node.append(\"title\").text(%s)' % style['title']
            elif tooltip:
                self.nodeElement += '\n'+'node.append(\"title\").text(d => d.id)'

    def addEdge(self, data, style=None):
        self.edges += (data if type(data) is list
                            else [data] if type(data) is dict
                            else [])

        self.edgeElement = '// -- edge display parameters -- //'
        self.edgeElement += '\n'+'var edge = origin.selectAll("line")'
        self.edgeElement += '\n\t'+'.data(edges)'
        self.edgeElement += '\n\t'+'.enter().append("line")'

        if style is None:
            self.edgeElement += '\n\t\t'+'.attr("stroke-width", d => d.value)'
            self.edgeElement += '\n\t\t'+'.attr("stroke", "#e9e9e9")'
        else:
            for key, value in style.items():
                self.edgeElement += '\n\t\t'+'.attr(\"%s\", %s)' % (key, value)

    def changeFriction(self, mu):
        self.constraints.append('.velocityDecay(%d)' % mu);

    def addTime(self):
        constraint = '.on("tick", () => {'
        if self.nodes != []:
            constraint += '\n\t'+'node'
            constraint += '\n\t'+'\t.attr("cx", d => d.x).attr("cy", d => d.y)'
        if self.edges != []:
            constraint += '\n\t'+'edge'
            constraint += '\n\t'+'\t.attr("x1", d => d.source.x).attr("y1", d => d.source.y)'
            constraint += '\n\t'+'\t.attr("x2", d => d.target.x).attr("y2", d => d.target.y)'
        constraint += '\n'+'})'
        self.constraints.append(constraint);
