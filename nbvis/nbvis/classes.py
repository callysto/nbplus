#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Python classes to represent and display D3.js and MathBox.js instances
Assembled by Eric Easthope
"""

import os

from .constants import paths, modules
from .elements import SVG, Canvas
from .helpers import getVariableName

from json import dumps
from IPython.display import Javascript

module_directory = os.path.dirname(os.path.abspath(__file__))

class Vis:
    """
    Finds and wraps D3 and MathBox class instances,
    executes pending JavaScript code
    """

    def __init__(self, *args, js="", silent=True, _now=False):
        
        self.js = js         # make container for JavaScript code
        self.silent = silent # suppress print outputs

        # make container for default RequireJS modules
        self.require = [
            "d3-require",
            "topojson",
            "mathBox"
        ] 
        
        self.modules = modules # make container for custom RequireJS modules
        self.instances = []    # make container for class instances

        """
        Add arguments that are D3 or MathBox class instances to self.instances,
        otherwise raise an exception
        """
        for idx, arg in enumerate(args):
            if isinstance(arg, D3) or isinstance(arg, MathBox):
                self.instances += [arg]
            else:
                name = [v for v in getVariableName(arg) if not v.startswith('_')][0]
                msg = '"{}" is not a valid class instance'.format(name)
                raise TypeError(msg)

        """
        Iterate through tracked D3 and MathBox class instances,
        try to aggregate JavaScript code for HTML elements from each class instance,
        try to aggregate custom RequireJS modules
        """
        for i in self.instances:
            if not self.silent:
                print('Found {} instance of "{}" ...'.format(i.__class__.__name__, i.name))

            try:
                self.js += i._view.js
            except AttributeError: pass

            if i._require != []:
                self.modules += [r for r in i._require]
                if not self.silent:
                    print("Requiring", ', '.join('"{}"'.format(r) for r in i._require), '...')

        if not _now:
            """
            If at least one MathBox class instance exists,
            import a MathBox configuration file,
            aggregate queued MathBox.js code
            """
            if len(MathBox.instances) > 0:
                mb_filepath = os.path.join(module_directory, 'static/mb.js')
                with open(mb_filepath, 'r') as mathBoxWrapper:
                    mb =  mathBoxWrapper.read()
                    self.js += mb

                try:
                    for code in get_ipython().user_ns['mathbox_code']:
                        self.js += "\n" + code + "\n"
                except KeyError: pass

            """If at least one D3 class instance exists, aggregate queued D3.js code"""
            if len(D3.instances) > 0:
                try:
                    for code in get_ipython().user_ns['d3_code']:
                        self.js += "\n" + code + "\n"
                except KeyError: pass

        """
        Load RequireJS configuration file,
        replace any variable placeholders marked with #,
        execute pending JavaScript code
        """
        config_filepath = os.path.join(module_directory, 'static/config.js')
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
    Instantiates and identifies a structure for displaying D3.js code,
    allows specification of other RequireJS modules
    """

    instances = []

    @classmethod
    def reset(cls):
        """Resets tracking of existing D3 class instances"""
        cls.instances = []
        print('Reset list of D3 class instances!')

    def __init__(self, name, silent=True):
        
        self.name = name     # name instance with an identifier
        self.silent = silent # suppress print outputs, except duplicate warnings

        self.js = ""         # make container for JavaScript code
        self._require = []   # make container for other RequireJS modules

        self.isDuplicate = any(self.name == i.name for i in self.__class__.instances)
        if not self.isDuplicate or self.name == 'null':
            self.__class__.instances.append(self)
            if not self.silent: print('New D3 object "{}" added to instances ...'.format(self.name))
        else:
            indexOfOriginal = next(i for i, c in enumerate(self.__class__.instances) if self.name == c.name)
            self.__class__.instances[indexOfOriginal] = self
            print('Replaced duplicate D3 object "{}" ...'.format(self.name))

    def svg(self, height):
        """Sets SVG as view element for D3.js visualization"""
        self._view = SVG(height=height, name=self.name)
        return self;

    def canvas(self, height):
        """Sets Canvas as view element for D3.js visualization"""
        self._view = Canvas(height=height, name=self.name)
        return self;

    def require(self, *args):
        """Queue a module to be imported via RequireJS"""
        if not self.silent: print('Will require', ', '.join('"{}"'.format(arg) for arg in args), '...')
        self._require = list(set(list(args) + self._require))

class MathBox:
    """
    Instantiates and identifies a structure for displaying MathBox.js code,
    allows specification of other RequireJS modules
    """

    instances = []

    @classmethod
    def reset(cls):
        """Resets tracking of existing MathBox class instances"""
        cls.instances = []
        print('Reset list of MathBox class instances!')

    def __init__(self, name, silent=True):

        self.name = name     # name instance with an identifier
        self.silent = silent # suppress print outputs, except duplicate warnings
        
        self.js = ""         # make container for JavaScript code
        self._require = []   # make container for other RequireJS modules
        
        self.isDuplicate = any(self.name == i.name for i in self.__class__.instances)
        if not self.isDuplicate or self.name == 'null':
            self.__class__.instances.append(self)
            if not self.silent: print('New MathBox object "{}" added to instances ...'.format(self.name))
        else:
            indexOfOriginal = next(i for i, c in enumerate(self.__class__.instances) if self.name == c.name)
            self.__class__.instances[indexOfOriginal] = self
            print('Replaced duplicate MathBox object "{}" ...'.format(self.name))

    def canvas(self, height):
        """Sets Canvas as view element for visualization"""
        self._view = Canvas(height=height, name=self.name)
        return self;

    def require(self, *args):
        """Queue a module to be imported via RequireJS"""
        if not self.silent: [print('Will require', arg, '...') for arg in args]
        self._require = list(set(list(args) + self._require))
