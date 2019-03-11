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
from json import dumps

from IPython import get_ipython
from IPython.display import display, Javascript, Markdown
from IPython.core import magic_arguments
from IPython.core.magic import Magics, magics_class, cell_magic

module_directory = os.path.dirname(os.path.abspath(__file__))

submodules = [
    "d3-scale-chromatic", "d3-collection", "d3-array",   "d3-axis",
    "d3-interpolate",     "d3-color",      "d3-contour", "d3-dispatch",
    "d3-brush",           "d3-chord",      "d3-drag",    "d3-dsv",
    "d3-ease",            "d3-fetch",      "d3-force",   "d3-format",
    "d3-hierarchy",       "d3-geo",        "d3-path",    "d3-polygon",
    "d3-quadtree",        "d3-random",     "d3-scale",   "d3-selection",
    "d3-time-format",     "d3-shape",      "d3-time",    "d3-timer",
    "d3-transition",      "d3-voronoi",    "d3-zoom"
]

@magics_class
class Require(Magics):

    @cell_magic
    @magic_arguments.magic_arguments()
    @magic_arguments.argument('--d3', '-d3',
          action='store_true',
          help='To require D3.js'
    )
    @magic_arguments.argument('--mathbox', '-mb',
          action='store_true',
          help='To require MathBox.js'
    )
    def require(self, line, cell):
        paths = {
            "d3": "//unpkg.com/d3-require@1?",
            "mathbox": "//unpkg.com/mathbox@0.1.0?"
        }

        for arg in line.split(' '):
            if '"' in arg or "'" in arg:
                arg_without_quotes = arg.replace('"', '').replace("'", '')

                global submodules
                submodules += [arg_without_quotes] if arg_without_quotes not in submodules else []
                line = line.replace(arg, '')

        args = magic_arguments.parse_argstring(self.require, line)
        hide_cell_filepath = os.path.join(module_directory, 'js/requireWrapper.js')
        with open(hide_cell_filepath, 'r') as requireWrapper:
            js = requireWrapper.read()

            modules = []
            for arg in vars(args).keys():
                if vars(args)[arg]:
                    modules.append(arg)
                else:
                    del paths[arg]

            if len(modules) > 0:
                js = (js.replace('#paths', dumps(paths))
                        .replace('#submodules', dumps(submodules) if 'd3' in modules else '[]')
                        .replace('#modules', dumps(modules))
                        .replace('#moduleNames', '(%s)' % ', '.join(modules))
                        .replace('#d3_require',
                            'd3.require(...submodules).then(d3 => {\n\n#code\n\n});\n' if 'd3' in modules
                                                                              else '\n\n#code\n\n')
                        .replace('#code', cell))
                print(js)
                display(Javascript(js))
            else:
                print('WARNING: No requirements specified, %%require will behave as %%js.')
                display(Javascript(cell))

get_ipython().register_magics(Require)
