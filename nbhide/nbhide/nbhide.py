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

import os

from IPython import get_ipython
from IPython.display import display, Javascript, Markdown
from IPython.core.magic import Magics, magics_class, cell_magic

module_directory = os.path.dirname(os.path.abspath(__file__))

@magics_class
class HideCell(Magics):
	def __init__(self, shell):
		super(HideCell, self).__init__(shell)

	@cell_magic
	def hide(self, line, cell):
		hide_cell_filepath = os.path.join(module_directory, "hideCell.js")
		with open(hide_cell_filepath, 'r') as hideCell:
			display(Javascript(hideCell.read()))
		get_ipython().run_cell(cell)

toggle_filepath = os.path.join(module_directory, "createCellToggle.js")
with open(toggle_filepath, 'r') as createCellToggle:
	display(Javascript(createCellToggle.read()))
get_ipython().register_magics(HideCell)
