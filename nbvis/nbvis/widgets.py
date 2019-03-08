#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""...

       ```
       ...
       ```

   Eric Easthope

   MIT License
   Assembled for Callysto
"""

import os

from traitlets import Unicode, Int, Float, Dict, validate
from ipywidgets import DOMWidget
from IPython.display import Javascript

module_directory = os.path.dirname(os.path.abspath(__file__))

class D3(DOMWidget):
    _view_module = Unicode('D3').tag(sync=True)
    _view_module_version = Unicode('0.0.0').tag(sync=True)
    _view_name = Unicode('D3View').tag(sync=True)
    name = Unicode().tag(sync=True)
    height = Int().tag(sync=True)
    # config = Dict().tag(sync=True)
    value = Float().tag(sync=True)
    filename = Unicode().tag(sync=True)

class BounceySlider(DOMWidget):
    _view_module = Unicode('bouncey_slider').tag(sync=True)
    _view_module_version = Unicode('0.0.0').tag(sync=True)
    _view_name = Unicode('bounceySliderView').tag(sync=True)
    value = Float().tag(sync=True)
    left = Float().tag(sync=True)
    right = Float().tag(sync=True)

class MathBox(DOMWidget):
    _view_module = Unicode('MathBox').tag(sync=True)
    _view_module_version = Unicode('0.0.0').tag(sync=True)
    _view_name = Unicode('MathBoxView').tag(sync=True)
    name = Unicode().tag(sync=True)
    height = Int().tag(sync=True)
    config = Dict().tag(sync=True)
    value = Float().tag(sync=True)
    filename = Unicode().tag(sync=True)

with open(os.path.join(module_directory, 'js/d3.js'), 'r') as d3:
    display(Javascript(d3.read()))

'''
with open('bounceySlider.js', 'r') as bouncey_slider:
    display(Javascript(bouncey_slider.read()))
''';

with open(os.path.join(module_directory, 'js/mb.js'), 'r') as mb:
    display(Javascript(mb.read()))
