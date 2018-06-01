#!/usr/bin/env python
# nbshaper.py

'''
Jupyter magic commands to modify cell layout

Assembled by Eric Easthope
MIT License https://opensource.org/licenses/MIT
'''

from IPython.core.magic import Magics, magics_class, line_magic
from IPython.display import HTML, Javascript

@magics_class
class styleMagics(Magics):
    @line_magic
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
        display(Javascript(js));

ip = get_ipython()
ip.register_magics(styleMagics);
