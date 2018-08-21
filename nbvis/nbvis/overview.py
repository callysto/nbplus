#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Assembled by Eric Easthope
"""

import os

from IPython.display import HTML, Javascript
from .classes import Vis

module_directory = os.path.dirname(os.path.abspath(__file__))

style_filepath = os.path.join(module_directory, 'overview.css')
js_filepath = os.path.join(module_directory, 'overview.js')

with open(style_filepath, 'r') as overview_style:
    display(HTML("<style>" + overview_style.read() + "</style>"))
    
with open(js_filepath, 'r') as js_style:
    Vis(js=js_style.read())