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

from IPython import get_ipython
from IPython.display import HTML
from IPython.core.magic import Magics, magics_class, line_magic

from ipywidgets import Label, jslink

@magics_class
class Connector(Magics):
    
    def __init__(self, shell):
        super(Connector, self).__init__(shell)
        self.variables = {}
        self.connections = []
        self.ns = get_ipython().user_ns
        
        with open('connectorStyles.css', 'r') as styles:
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
        connectors = line.replace(' ', '').split(':')
        left = self.variables[connectors[0]]
        right = self.ns[connectors[1]]
        link = jslink((left, 'value'), (right, 'value'))
        
        connection = (connectors[1], connectors[0])
        self.connections += [connection] if connection not in self.connections else []
        
        self.variables[connectors[1]] = right
        
        self.ns[connectors[1]].observe(lambda d: self.on_change(d, connectors[0]), 'value')
        self.ns[connectors[1]].value = float(self.variables[connectors[0]].value)
        
        return right;
    
    def on_change(self, d, variable):
        self.ns[variable] = d['new'];

get_ipython().register_magics(Connector)