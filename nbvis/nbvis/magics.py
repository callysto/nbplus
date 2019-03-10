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
        args = magic_arguments.parse_argstring(self.require, line)
        hide_cell_filepath = os.path.join(module_directory, 'js/requireWrapper.js')
        with open(hide_cell_filepath, 'r') as requireWrapper:
            js = requireWrapper.read()

            modules = []
            for arg in vars(args).keys():
                if vars(args)[arg]:
                    modules.append(arg)

            if len(modules) > 0:
                js = (js.replace('#modules', dumps(modules))
                        .replace('#moduleNames', '(%s)' % ', '.join(modules))
                        .replace('#code', cell))
                display(Javascript(js))
            else:
                print('WARNING: No requirements specified, %%require will behave as %%js.')
                display(Javascript(cell))

get_ipython().register_magics(Require)
