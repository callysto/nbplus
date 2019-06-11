#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
Add a "play" button to the Jupyter notebook menubar with `import play_button.play`

Click the button (optionally, while holding the Alt/Option key) to run (and scroll through) all cells

Eric Easthope
MIT License
Assembled for Callysto
'''

import os

from IPython import get_ipython
from IPython.display import display, Javascript, Markdown
from IPython.core.magic import Magics, magics_class, cell_magic

# Get directory of `play_button` submodule
module_directory = os.path.dirname(os.path.abspath(__file__))

# Get filepath to "play" button JavaScript
play_button_filepath = os.path.join(module_directory, 'addPlayButton.js')

with open(play_button_filepath, 'r') as play_button:
    # Read and execute "play" button JavaScript from 'addPlayButton.js'
    js = play_button.read()
    display(Javascript(js))