#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Show the order of and allow the re-ordering of notebook cells

   Eric Easthope

   MIT License
   Assembled for Callysto
"""

import os

from IPython import get_ipython
from IPython.display import display, Javascript, Markdown
from IPython.core.magic import Magics, magics_class, cell_magic

module_directory = os.path.dirname(os.path.abspath(__file__))

toggle_filepath = os.path.join(module_directory, "createCellToggle.js")
with open(toggle_filepath, 'r') as createCellToggle:
	display(Javascript(createCellToggle.read()))
