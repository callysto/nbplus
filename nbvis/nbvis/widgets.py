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

from traitlets import Unicode, Int, Float, Dict, validate, List
from ipywidgets import DOMWidget
from IPython.display import Javascript, HTML

module_directory = os.path.dirname(os.path.abspath(__file__))

class D3(DOMWidget):
    _view_module = Unicode('d3_view').tag(sync=True)
    _view_module_version = Unicode('0.0.0').tag(sync=True)
    _view_name = Unicode('D3View').tag(sync=True)
    name = Unicode().tag(sync=True)
    height = Int().tag(sync=True)
    value = Float(default_value=0.).tag(sync=True)
    filename = Unicode().tag(sync=True)
    variables = List(default_value=[]).tag(sync=True)

    def __init__(self, *args, **kwargs):
        super(D3, self).__init__(*args, **kwargs)
        if self.variables != []:
            for var in self.variables:
                self.add_traits(**{var: Float(default_value=0.).tag(sync=True)})
        with open(os.path.join(module_directory, 'js/d3.js'), 'r') as d3:
            display(Javascript(d3.read()))

class MathBox(DOMWidget):
    _view_module = Unicode('mathbox_view').tag(sync=True)
    _view_module_version = Unicode('0.0.0').tag(sync=True)
    _view_name = Unicode('MathBoxView').tag(sync=True)
    name = Unicode().tag(sync=True)
    height = Int().tag(sync=True)
    config = Dict().tag(sync=True)
    value = Float(default_value=0.).tag(sync=True)
    filename = Unicode().tag(sync=True)
    variables = List(default_value=[]).tag(sync=True)

    def __init__(self, *args, **kwargs):
        super(MathBox, self).__init__(*args, **kwargs)
        if self.variables != []:
            for var in self.variables:
                self.add_traits(**{var: Float(default_value=0.).tag(sync=True)})
        with open(os.path.join(module_directory, 'js/mb.js'), 'r') as mb:
            display(Javascript(mb.read()))

"""
class BouncySlider(DOMWidget):
    _view_module = Unicode('bouncy_slider').tag(sync=True)
    _view_module_version = Unicode('0.0.0').tag(sync=True)
    _view_name = Unicode('bouncySliderView').tag(sync=True)
    value = Float().tag(sync=True)
    left = Float().tag(sync=True)
    right = Float().tag(sync=True)

    def __init__(self, *args, **kwargs):
        super(BouncySlider, self).__init__(*args, **kwargs)
        with open(os.path.join(module_directory, 'js/bouncySlider.js'), 'r') as slider:
            display(Javascript(slider.read()))
        with open(os.path.join(module_directory, 'css/bouncySlider.css'), 'r') as styles:
            display(HTML('<style>' + styles.read() + '</style>'))
"""
