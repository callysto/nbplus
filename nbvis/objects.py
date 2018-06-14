#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Some functions/classes to require and wrap relevant D3.js and/or MathBox.js code in Jupyter"""

# Copyright (c) 2018 Eric Easthope
# Distributed under the terms of the MIT License
# https://opensource.org/licenses/MIT

import os

from IPython.display import Javascript, clear_output
from IPython.core.magic import register_cell_magic
from IPython import get_ipython

from json import dumps
import asyncio
import types
from inspect import isclass, isfunction, getmembers

paths = {
    "d3":                "//d3js.org/d3.v5.min",
    "d3-force-magnetic": "//unpkg.com/d3-force-magnetic@0.8.0/dist/d3-force-magnetic.min",
    "d3-force-surface":  "//unpkg.com/d3-force-surface@0.5.5/dist/d3-force-surface.min",
    "mathBox":           "//cdn.rawgit.com/unconed/mathbox/eaeb8e15/build/mathbox-bundle"
}

#=== Helper functions ===#

"""Convert lisp-case to camelCase"""
def camelCase(column):
    first, *rest = column.split('-')
    return first + ''.join(word.capitalize() for word in rest)

def makeDataContainer(name='dataSets'):
    """
    Make a named data container if it does not exist,
    then clear output area to remove unnecessary whitespace.
    """
    display(Javascript('if (!window.%s) {' % name + 'window.%s = {};' % name + '}'))
    clear_output()
    return;

def addData(data, name='data'):
    """
    Add a named data set to a data container,
    then clear output area to remove unnecessary whitespace.
    """
    display(Javascript('dataSets.%s = ' % name + dumps(data)))
    clear_output()
    return;

def inspectData(name='data'):
    """Clear output area, then get and display a named data set from a data container."""
    display(Javascript('element.text(dataSets.%s);' % name))
    clear_output(wait=True)
    return;

#=== Visualize object ===#

class Visualize(object):
    """."""
    def __init__(self, instances):
        self.sources = ['d3', 'mathBox']
        self.js = ""
        self.instances = [instances] if type(instances) == str else instances

        for i in self.instances:
            d3Instance = [instance for instance in D3.instances if i == instance.name]
            mbInstance = [instance for instance in MathBox.instances if i == instance.name]

            instance = (d3Instance + mbInstance)[0]
            instanceName = instance.__class__.__name__
            print('Found {} instance of'.format(instanceName), '"{}"'.format(i), '...')

            self.js += instance._view.js
            if instance._require != []:
                print("Now requiring", ', '.join(r for r in instance._require), '...')
                self.sources += ['{}'.format(r) for r in instance._require]
        #else:
        #    print('Unrecognized D3 object called', '"{}"'.format(name), 'not added to visualization ...')

        module_dir = os.path.dirname(os.path.abspath(__file__))
        mb_filepath = os.path.join(module_dir, 'mb.js')
        with open(mb_filepath, 'r') as mathBoxWrapper:
            mb =  mathBoxWrapper.read()
            self.js += mb

        try:
            for code in get_ipython().user_ns['mathbox_code']:
                self.js += "\n" + code + "\n"
        except KeyError: pass

        try:
            for code in get_ipython().user_ns['d3_code']:
                self.js += "\n" + code + "\n"
        except KeyError: pass

        subPaths = {k:v for k, v in paths.items() if k in self.sources}
        self.requireConfig  = "requirejs.config({\n\npaths: %s\n\n});" % dumps(subPaths, indent=4)
        self.requireWrapper = "requirejs({}, ({}) => {{{}}});".format(
            dumps(self.sources),
            ', '.join(camelCase(s) for s in self.sources if s != 'mathBox'),
            "\n" + self.js + "\n"
        )
        # print(self.requireConfig + "\n\n" + self.requireWrapper)
        display(Javascript(self.requireConfig + "\n\n" + self.requireWrapper));

#=== Data object ===#

class Data():
    def __init__(self, method, overwrite=False):
        self.js = ""
        self.method = method
        self.overwrite = overwrite

    def __enter__(self):
        if self.overwrite: self.js += ("window.data = [];" "\n" "console.log(\"Cleared data:\", data)")
        self.js += ("""
            function handle_output(out){
                console.log(out);
                var out_code = out.content.data["application/javascript"]
                console.log(out_code);
                eval(out_code);
            }

            function add_to_data(datum, callback) {
                data.push(datum);
                callback(datum)
            }

            function print_data() {
                updater();
                console.log(data);
            }

            var kernel = Jupyter.notebook.kernel;
            var callbacks = { iopub : { output : handle_output } }
            var msg_id = kernel.execute('data.loopNow()', callbacks, { silent: false });
            console.log("Python executed!");
            """)
        self.js += ("\n" "element[0].style.display = \"none\";")
        display(Javascript(self.js))
        return self;

    # stream loop function
    def loopNow(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(self.method())
        finally:
            loop.close()

    def __exit__(self, type, value, traceback):
        return;

#=== View containers ===#

class SVG(object):
    """."""
    def __init__(self, width='\"100%\"', height=None, name='none'):
        self.width = width
        self.height = height
        self.js = ("\n" "// -- append svg element -- //" "\n"
                   "d3.select(element[0]).append(\"svg\")"
                   "\n\t" ".attr(\"id\", \"%s\")"
                   "\n\t" ".attr(\"width\", %s)"
                   "\n\t" ".attr(\"height\", %s);" "\n") % (name, width, height)

class Canvas(object):
    """."""
    def __init__(self, width='\"100%\"', height=None, name='none'):
        self.width = width
        self.height = height
        self.js = ("\n" "// -- append svg element -- //" "\n"
                   "d3.select(element[0]).append(\"div\")"
                   "\n\t" ".attr(\"id\", \"%s\")"
                   "\n\t" ".attr(\"width\", %s)"
                   "\n\t" ".attr(\"height\", %s);" "\n") % (name, width, height)

#=== MathBox objects ===#

class MathBox(object):
    """."""
    instances = []

    @classmethod
    def reset(cls):
        cls.instances = []
        print('Reset MathBox visualization stack!')

    def __init__(self, name):
        self.js = ""
        self.name = name
        self._require = []

        self.isDuplicate = any(self.name == i.name for i in self.__class__.instances)
        if not self.isDuplicate:
            self.__class__.instances.append(self)
            print('New MathBox object called', '"{}"'.format(self.name), 'added to instances ...')
        else:
            indexOfOriginal = next(i for i, c in enumerate(self.__class__.instances) if self.name == c.name)
            self.__class__.instances[indexOfOriginal] = self
            print('MathBox object', '"{}"'.format(self.name), 'is a duplicate ... replacing ...')

    def canvas(self, width='\"100%\"', height=None):
        self._view = Canvas(width=width, height=height, name=self.name)
        return self;

    def require(self, *args):
        self._require = list(set(list(args) + self._require))

#=== D3 objects ===#

class D3(object):
    """."""
    instances = []

    @classmethod
    def reset(cls):
        cls.instances = []
        print('Reset D3 visualization stack!')

    def __init__(self, name):
        self.js = ""
        self.name = name
        self._require = []

        self.isDuplicate = any(self.name == i.name for i in self.__class__.instances)
        if not self.isDuplicate:
            self.__class__.instances.append(self)
            print('New D3 object called', '"{}"'.format(self.name), 'added to instances ...')
        else:
            indexOfOriginal = next(i for i, c in enumerate(self.__class__.instances) if self.name == c.name)
            self.__class__.instances[indexOfOriginal] = self
            print('D3 object', '"{}"'.format(self.name), 'is a duplicate ... replacing ...')

    def svg(self, width='\"100%\"', height=None):
        self._view = SVG(width=width, height=height, name=self.name)
        return self;

    def require(self, *args):
        self._require = list(set(list(args) + self._require))
