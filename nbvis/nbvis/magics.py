#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Add a RequireJS magic
   Use --d3 or --mathbox to include D3 or MathBox resources
   Use --output to print the cell's JavaScript code

   ```
   %%require --d3 --output
   console.log("Hello", d3);
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
    @magic_arguments.argument('--output', '-o',
          action='store_true',
          help='Print all JavaScript used in cell'
    )
    def require(self, line, cell):
        paths = {
            "d3-require": "//cdn.jsdelivr.net/npm/d3-require@1?",
            "mathbox": "//unpkg.com/mathbox@0.1.0?"
        }

        custom_modules = []
        for arg in line.split(' '):
            if '"' in arg or "'" in arg:
                arg_without_quotes = arg.replace('"', '').replace("'", '')
                custom_modules += [arg_without_quotes]
                line = line.replace(arg, '')

        args = magic_arguments.parse_argstring(self.require, line)
        output = True if vars(args)['output'] else False

        hide_cell_filepath = os.path.join(module_directory, 'js/requireWrapper.js')
        with open(hide_cell_filepath, 'r') as requireWrapper:
            js = requireWrapper.read()

            modules = []
            for arg in [arg for arg in vars(args).keys() if arg != 'output']:
                if vars(args)[arg]:
                    modules.append(arg + ('-require' if arg == 'd3' else ''))
                else:
                    del paths[arg + ('-require' if arg == 'd3' else '')]
            moduleNames = [m.split('-')[0] for m in modules]

            if len(modules) > 0:
                js = (js.replace('#paths', dumps(paths))
                        .replace('#submodules', dumps(submodules) if 'd3-require' in modules else '[]')
                        .replace('#modules', dumps(modules))
                        .replace('#moduleNames', '(%s)' % ', '.join(moduleNames))
                        )

                custom_requires = ['d3.require(...submodules)'] + ['\n\td3.require("%s")' % r for r in custom_modules]
                if 'd3-require' in modules:
                    custom_modules.insert(0, 'd3')
                js = (js.replace('#d3_require', ','.join(custom_requires) if 'd3-require' in modules else '')
                        .replace('#submoduleNames', str(custom_modules).replace("'", '') if 'd3-require' in modules else '')
                        .replace('#code', cell)
                        )

                if output: print(js)
                display(Javascript(js))
            else:
                print('WARNING: No requirements specified, %%require will behave as %%js.')
                if output: print(cell)
                display(Javascript(cell))

get_ipython().register_magics(Require)
