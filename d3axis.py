#!/usr/bin/env python
# d3axis.py

'''
Constructor classes to generate axes via D3.js

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
    def __init__(self, height='width', centerOrigin=False):
        D3.__init__(self)                                      # inherits D3 class methods/variables
        self.height = str(height) if height != '' else 'width' # copies height parameter
        self.centerOrigin = centerOrigin                       # place origin at center (defaults to False)

        # html tag, sets self.height if it is known
        self.tag = ('<svg width = "100%%"%s></svg>' %
                   (' height = "%s"' % self.height if self.height.isdigit() else ''))

        # svg container/dimensions
        svgHeader = '// -- svg container/dimensions -- //'
        svg = 'var svg = d3.select("svg")'

        # remove all elements from svg, set svg width
        clearSvg = 'svg.selectAll("*").remove()'
        getWidth = 'var width = +svg.node().getBoundingClientRect().width'
        
        # get svg height if it is a number, otherwise set svg height to string (defaults to 'width')
        getHeight = ('var height = ' +
                    ('+svg.attr("height")' if self.height.isdigit() else self.height))
        if not self.height.isdigit(): getHeight += (';\n' 'svg.attr("height", height)')

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
        
# -- axis constructor class -- #
class Axis(D3):
    def __init__(self, margins = { 'top': '30', 'right': 'width/3', 'bottom': '30', 'left': 'width/3'}):
        D3.__init__(self) # inherits D3 class methods/variables
        self.margins = margins
        self.axes = []
        
    def get(self):
        self.js = ''
        if self.axes != []:
            for axis in self.axes:
                self.js += axis
        return self.js
        
    def addAxis(self, direction='x', domain=[-1,1], codomain=[-1,1]):
        axis = ''
        axis += 'var '+direction+'Scale = d3.scaleLinear()'
        axis += '\n\t'+'.domain(d3.extent(%s))' % domain
        axis += ('\n\t'+'.range([-%s/2 + %s, %s/2 - %s]);' %
                 ('width' if direction == 'x' else 'height',
                  self.margins['left'] if direction == 'x' else self.margins['bottom'],
                  'width' if direction == 'x' else 'height',
                  self.margins['right'] if direction == 'x' else self.margins['top'])
                )
        axis += '\n\n'
        
        axis += 'var '+direction+'Axis = d3.axis'+('Bottom' if direction == 'x' else 'Left')+'('+direction+'Scale)'
        axis += '\n\t'+'.ticks(%s)' % ('width/200' if direction == 'x' else 'height/100')
        axis += '\n\t'+'.tickSize(0)'
        axis += '\n\t'+'.tickPadding(15)'
        axis += '\n\n'
        
        axis += 'origin.append("g")'
        axis += '\n\t'+'.attr("opacity", 2/3)'
        axis += '\n\t'+'.call('+direction+'Axis);'
        axis += '\n\n'
        self.axes += axis;