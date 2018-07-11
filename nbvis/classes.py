#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Assembled by Eric Easthope
"""

import os
from json import dumps

from IPython import get_ipython
from IPython.display import Javascript

# set RequireJS paths
paths = {
    "d3-require": "//unpkg.com/d3-require@1.0.4/dist/d3-require.min",
    "topojson": "//unpkg.com/topojson-client@3?",
    "mathBox": "//cdn.rawgit.com/unconed/mathbox/eaeb8e15/build/mathbox-bundle"
}

# list default D3 modules
modules = [
    "d3-array", "d3-axis", "d3-brush", "d3-chord",
    "d3-collection", "d3-color", "d3-contour", "d3-dispatch",
    "d3-drag", "d3-dsv", "d3-ease",
    "d3-fetch", "d3-force", "d3-format",
    "d3-geo", "d3-hierarchy", "d3-interpolate",
    "d3-path", "d3-polygon", "d3-quadtree",
    "d3-random", "d3-scale", "d3-scale-chromatic",
    "d3-selection", "d3-shape", "d3-time",
    "d3-time-format", "d3-timer", "d3-transition",
    "d3-voronoi", "d3-zoom"
]

module_directory = os.path.dirname(os.path.abspath(__file__))

def getVariableName(var):
    """Retrieve the names of variables in the global scope corresponding to var"""
    return [tpl[0] for tpl in filter(lambda x: var is x[1], get_ipython().user_ns.items())]

def camelCase(column):
    """Convert lisp-case to camelCase"""
    first, *rest = column.split('-')
    return first + ''.join(word.capitalize() for word in rest)

class Vis:
    """
    Wraps multiple D3 or MathBox class instances,
    executes pending JavaScript code
    """

    def __init__(self, *args, js="", silent=True, now=False):
        """
        """

        # make container for RequireJS sources
        self.require = ["d3-require", "topojson", "mathBox"]

        # make container for custom RequireJS modules
        self.modules = modules

        # make container for JavaScript code
        self.js = js

        # make container for class instances
        self.instances = []

        """
        add each argument that is a D3 or MathBox class instance to self.instances,
        raise an exception otherwise
        """
        for idx, arg in enumerate(args):
            if isinstance(arg, D3) or isinstance(arg, MathBox):
                self.instances += [arg]
            else:
                name = [v for v in getVariableName(arg) if not v.startswith('_')][0]
                msg = '"{}" is not a valid class instance'.format(name)
                raise TypeError(msg)

        """
        """
        for i in self.instances:
            if not silent:
                print('Found {} instance of "{}" ...'.format(i.__class__.__name__, i.name))

            try:
                self.js += i._view.js
            except AttributeError: pass

            if i._require != []:
                self.modules += [r for r in i._require]
                if not silent:
                    print("Requiring", ', '.join('"{}"'.format(r) for r in i._require), '...')

        if not now:
            """
            """
            if len(MathBox.instances) > 0:
                mb_filepath = os.path.join(module_directory, 'mb.js')
                with open(mb_filepath, 'r') as mathBoxWrapper:
                    mb =  mathBoxWrapper.read()
                    self.js += mb

                try:
                    for code in get_ipython().user_ns['mathbox_code']:
                        self.js += "\n" + code + "\n"
                except KeyError: pass

            """
            """
            if len(D3.instances) > 0:
                try:
                    for code in get_ipython().user_ns['d3_code']:
                        self.js += "\n" + code + "\n"
                except KeyError: pass

        """
        """
        config_filepath = os.path.join(module_directory, 'config.js')
        display(Javascript(
            open(config_filepath, "r").read()
                                   .replace("#paths", dumps(paths))
                                   .replace("#requires", str(self.require))
                                   .replace("#require_names", ", ".join(["d3", "topojson"]))
                                   .replace("#modules", str(self.modules))
                                   .replace("#code", self.js)
        )
               );

class D3:
    """
    Instantiates and identifies a D3 structure,
    allows specification of other RequireJS modules
    """

    instances = []

    @classmethod
    def reset(cls):
        """
        """

        cls.instances = []
        print('Reset D3 visualization stack!')

    def __init__(self, name, silent=True):
        """
        """

        # name instance with an identifier
        self.name = name

        # make container for JavaScript code
        self.js = ""

        # make container for other RequireJS modules
        self._require = []

        self.isDuplicate = any(self.name == i.name for i in self.__class__.instances)
        if not self.isDuplicate or self.name == 'null':
            self.__class__.instances.append(self)
            if not silent: print('New D3 object "{}" added to instances ...'.format(self.name))
        else:
            indexOfOriginal = next(i for i, c in enumerate(self.__class__.instances) if self.name == c.name)
            self.__class__.instances[indexOfOriginal] = self
            if not silent: print('Replaced duplicate D3 object "{}" ...'.format(self.name))

    def svg(self, height):
        """Sets SVG as view element for visualization"""
        self._view = SVG(height=height, name=self.name)
        return self;

    def canvas(self, height):
        """Sets Canvas as view element for visualization"""
        self._view = Canvas(height=height, name=self.name)
        return self;

    def require(self, *args):
        """
        """

        self._require = list(set(list(args) + self._require))

class MathBox:
    """
    Instantiates and identifies a MathBox structure,
    allows specification of other RequireJS modules
    """

    instances = []

    @classmethod
    def reset(cls):
        """
        """

        cls.instances = []
        print('Reset MathBox visualization stack!')

    def __init__(self, name, silent=True):
        """
        """

        # name instance with an identifier
        self.name = name

        # make container for JavaScript code
        self.js = ""

        # make container for other RequireJS modules
        self._require = []

        self.isDuplicate = any(self.name == i.name for i in self.__class__.instances)
        if not self.isDuplicate or self.name == 'null':
            self.__class__.instances.append(self)
            if not silent: print('New MathBox object "{}" added to instances ...'.format(self.name))
        else:
            indexOfOriginal = next(i for i, c in enumerate(self.__class__.instances) if self.name == c.name)
            self.__class__.instances[indexOfOriginal] = self
            if not silent: print('Replaced duplicate MathBox object "{}" ...'.format(self.name))

    def canvas(self, height):
        """Sets Canvas as view element for visualization"""
        self._view = Canvas(height=height, name=self.name)
        return self;

    def require(self, *args):
        """
        """

        self._require = list(set(list(args) + self._require))

class SVG:
    """
    Generates JavaScript code for an SVG element
    """

    def __init__(self, height=None, name='none'):
        svg_filepath = os.path.join(module_directory, 'svg.js')
        self.js = (
            open(svg_filepath, "r").read()
                                   .replace("#name", '"#%s"' % name)
                                   .replace("#width", '"100%"')
                                   .replace("#height", str(height))
        )

class Canvas:
    """
    Generates JavaScript code for a Canvas element
    """

    def __init__(self, height=None, name='none'):
        canvas_filepath = os.path.join(module_directory, 'canvas.js')
        self.js = (
            open(canvas_filepath, "r").read()
                                      .replace("!width", '"100%"')
                                      .replace("!height", str(height))
        )
