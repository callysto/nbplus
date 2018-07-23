#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Python classes to import and configure JavaScript to append HTML elements
Assembled by Eric Easthope
"""

import os
module_directory = os.path.dirname(os.path.abspath(__file__))

class SVG:
    """Generates JavaScript code for an SVG element"""
    def __init__(self, height=None, name='none'):
        svg_filepath = os.path.join(module_directory, 'static/svg.js')
        self.js = (
            open(svg_filepath, "r").read()
                                   .replace("#name", '"%s"' % name)
                                   .replace("#width", '"100%"')
                                   .replace("#height", str(height))
        )

class Canvas:
    """Generates JavaScript code for a Canvas element"""
    def __init__(self, height=None, name='none'):
        canvas_filepath = os.path.join(module_directory, 'static/canvas.js')
        self.js = (
            open(canvas_filepath, "r").read()
                                      .replace("!width", '"100%"')
                                      .replace("!height", str(height))
        )