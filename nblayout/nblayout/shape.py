#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Change the HTML formatting of notebook cells

   Eric Easthope

   MIT License
   Assembled for Callysto
"""

import os

from IPython import get_ipython
from IPython.display import display, Javascript
from IPython.core.magic import Magics, magics_class, cell_magic

module_directory = os.path.dirname(os.path.abspath(__file__))

@magics_class
class ShapeCell(Magics):
    @cell_magic
    def sidebyside(self, line, cell):
        sbs_filepath = os.path.join(module_directory, 'sideBySide.js')
        with open(sbs_filepath, 'r') as sbs:
            display(Javascript(sbs.read()))
        get_ipython().run_cell(cell)
get_ipython().register_magics(ShapeCell);
