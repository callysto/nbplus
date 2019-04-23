#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Jupyter magics for watching JavaScript changes to variables,
   and for synchronizing state between visualization objects

   "Watch" variable values using %watch.

       ```
       x = 0
       %watch x
       ```

   Use %connect to synchronize a Jupyter widget to the variables value.
   Don't forget to display the connected widget!

       ```
       slider = BounceySlider(left=0, right=1)
       %connect x : slider
       slider
       ```

   The idea here is to allow for fast client-side synchronization of
   visualization objects, while allowing Python variables to be rapidly passed
   between the client and server.

   Eric Easthope

   MIT License
   Assembled for Callysto
"""

import os

from IPython import get_ipython
from IPython.display import HTML
from IPython.core.magic import Magics, magics_class, line_magic

from ipywidgets import Label, jslink

module_directory = os.path.dirname(os.path.abspath(__file__))

@magics_class
class Connector(Magics):

    def __init__(self, shell):
        super(Connector, self).__init__(shell)
        self.variables = {}
        self.connections = []
        self.ns = get_ipython().user_ns

        with open(os.path.join(module_directory, 'css/connectorStyles.css'), 'r') as styles:
            display(HTML('<style>' + styles.read() + '</style>'))

    @line_magic
    def watch(self, variable):
        variable = variable.replace(' ', '')
        if variable in self.ns.keys():
            value = self.ns[variable]
        else:
            raise NameError('name \'%s\' is not defined' % variable)

        label = Label(value=str(value))
        label.add_class('watch_variable')
        self.variables[variable] = label
        return label;

    @line_magic
    def connect(self, line):
        args = [l.replace('"', '') for l in line.split(' ') if ':' not in l]
        try:
            left = self.ns[args[0]]
            left_var = args[1]
            right = self.ns[args[2]]
            right_var = args[3]
        except (IndexError, KeyError):
            raise SyntaxError('widget class does not exist, or no widget class attribute specified, e.g. `%%connect widget1 "value" : widget2 "value"`')

        if (isinstance(left, (int, float, complex)) and
            args[0] not in self.variables.keys()):
            raise TypeError('the right input must be a widget. Use `%%watch %s` first.' % args[0])
        if (isinstance(right, (int, float, complex)) and
            args[2] not in self.variables.keys()):
            raise TypeError('the right input must be a widget. Use `%%watch %s` first.' % args[2])
        if args[0] in self.variables.keys():
            left = self.variables[args[0]]
        if args[2] in self.variables.keys():
            right = self.variables[args[2]]

        connection = (args[0], args[2])
        self.connections += [connection] if connection not in self.connections else []
        link = jslink((left, left_var), (right, right_var))

        # left.observe(lambda d: self.on_change(d, args[0]), left_var)
        # right.value = float(left.value)

    def on_change(self, d, variable):
        self.ns[variable] = d['new'];

get_ipython().register_magics(Connector)
