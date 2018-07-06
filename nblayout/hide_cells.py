#!/usr/bin/env python
# hide_cells.py

'''
Append toolbar controls and toggles to set the
visibility of cells in Jupyter notebooks

Adds a new cell metadata attribute to hidden cells

Assembled by Eric Easthope
'''

import os
from nbvis.classes import Vis
from IPython.display import HTML, Javascript

module_directory = os.path.dirname(os.path.abspath(__file__))

style_filepath = os.path.join(module_directory, 'src/toggle_style.css')
toggle_filepath = os.path.join(module_directory, 'src/add_toggles.js')
toolbar_filepath = os.path.join(module_directory, 'src/append_toolbar.js')

with open(style_filepath, 'r') as f:
    display(HTML(f.read()))

with open(toolbar_filepath, 'r') as toolbar:
    with open(toggle_filepath, 'r') as toggles:
        Vis(js=toolbar.read() + '\n' + toggles.read());
