#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Show the order of and allow the re-ordering of notebook cells

   Eric Easthope

   MIT License
   Assembled for Callysto
"""

import os

from IPython import get_ipython
from IPython.display import display, Javascript

module_directory = os.path.dirname(os.path.abspath(__file__))

overview_filepath = os.path.join(module_directory, 'overview.js')
with open(overview_filepath, 'r') as overview:
	display(Javascript(overview.read()))
