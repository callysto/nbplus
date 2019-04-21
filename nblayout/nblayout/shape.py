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
    def columns(self, line):
        js = '''
            var cellIndex = Jupyter.notebook.get_cell_elements().index(this.element.parents('.cell')),
                cellElement = Jupyter.notebook.get_cell(cellIndex).element[0],
                cellInput = cellElement.getElementsByClassName('input')[0],
                innerCell = cellElement.getElementsByClassName('inner_cell')[0],
                outputWrapper = cellElement.getElementsByClassName('output_wrapper')[0];

            cellElement.style.flexDirection = "row";
            cellInput.style.width = "50%";
            cellInput.style.height = "100%";
            innerCell.style.height = "100%";
            outputWrapper.style.width = "50%";
            '''
        display(Javascript(js))

# toggle_filepath = os.path.join(module_directory, "createCellToggle.js")
# with open(toggle_filepath, 'r') as createCellToggle:
# 	display(Javascript(createCellToggle.read()))
get_ipython().register_magics(ShapeCell);
