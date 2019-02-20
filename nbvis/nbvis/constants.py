#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
A collection of unpkg paths and default D3.js modules for reference by RequireJS
Assembled by Eric Easthope
"""

paths = {
    "d3-require": "//unpkg.com/d3-require@1.0.4/dist/d3-require.min",
    "topojson":   "//unpkg.com/topojson-client@3?",
    "mathBox":    "//cdn.rawgit.com/unconed/mathbox/eaeb8e15/build/mathbox-bundle"
}

modules = [
    "d3-scale-chromatic", "d3-collection", "d3-array",   "d3-axis",
    "d3-interpolate",     "d3-color",      "d3-contour", "d3-dispatch",
    "d3-brush",           "d3-chord",      "d3-drag",    "d3-dsv",
    "d3-ease",            "d3-fetch",      "d3-force",   "d3-format",
    "d3-hierarchy",       "d3-geo",        "d3-path",    "d3-polygon",
    "d3-quadtree",        "d3-random",     "d3-scale",   "d3-selection",
    "d3-time-format",     "d3-shape",      "d3-time",    "d3-timer",
    "d3-transition",      "d3-voronoi",    "d3-zoom"
]
