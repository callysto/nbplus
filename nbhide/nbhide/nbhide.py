#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Minimal code cell hiding using HTML styles and D3.js

   Hide code cells with the %%hide magic,
   click the eye in the toolbar to toggle visibility
   
       ```
       %%hide
       <contents of code cell>
       ```
   
   Eric Easthope
   
   MIT License
   Assembled for Callysto
"""

from IPython import get_ipython
from IPython.display import display, Javascript, Markdown
from IPython.core.magic import Magics, magics_class, cell_magic

@magics_class
class HideCell(Magics):
    
    def __init__(self, shell):
        super(HideCell, self).__init__(shell)

    @cell_magic
    def hide(self, line, cell):
        display(Javascript(filename="hideCell.js"))
        get_ipython().run_cell(cell)

display(Javascript(filename="createCellToggle.js"))
get_ipython().register_magics(HideCell)
