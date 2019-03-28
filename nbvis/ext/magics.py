#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Jupyter notebook magics to queue and execute D3.js and MathBox.js code
Assembled by Eric Easthope for Callysto
MIT License
"""

from .classes import Vis

from IPython import get_ipython
from IPython.core import magic_arguments
from IPython.core.magic import Magics, magics_class, cell_magic

@magics_class
class nbvisMagics(Magics):

    @cell_magic
    @magic_arguments.magic_arguments()
    @magic_arguments.argument('--queue', '-q',
          action='store_true',
          help='Add code from this cell to a list of D3.js code for later execution'
    )
    @magic_arguments.argument('--reset',
          action='store_true',
          help='Reset D3.js code container to an empty list before appending code from this cell'
    )
    def d3(self, line, cell):
        args = magic_arguments.parse_argstring(self.d3, line)

        if 'd3_code' not in ip.user_ns.keys():
            """Initialize d3_code container if it does not exist"""
            ip.user_ns['d3_code'] = []
            print('Initialized d3_code container!')
            
        elif args.reset and 'd3_code' in ip.user_ns.keys():
            """Reset d3_code container if it exists"""
            ip.user_ns['d3_code'] = []
            print('Reinitialized d3_code container!')

        if not args.queue:
            """Execute code cell immediately"""
            Vis(js=cell, _now=True)

        elif args.queue and cell not in ip.user_ns['d3_code']:
            """Queue code cell for later execution"""
            ip.user_ns['d3_code'].append(cell)
            print('Code added to D3 visualization queue ...')

        elif cell in ip.user_ns['d3_code']:
            """Reject duplicate code cells"""
            print('Duplicate code not added to D3 visualization queue ...')

    @cell_magic
    @magic_arguments.magic_arguments()
    @magic_arguments.argument('--queue', '-q',
          action='store_true',
          help='Add code from this cell to a list of MathBox.js code for later execution'
    )
    @magic_arguments.argument('--reset',
          action='store_true',
          help='Reset MathBox.js code container to an empty list before appending code from this cell'
    )
    def mathbox(self, line, cell):
        args = magic_arguments.parse_argstring(self.mathbox, line)

        if 'mathbox_code' not in ip.user_ns.keys():
            """Initialize mathbox_code container if it does not exist"""
            ip.user_ns['mathbox_code'] = []
            print('Initialized mathbox_code container!')

        elif args.reset and 'mathbox_code' in ip.user_ns.keys():
            """Reset mathbox_code container if it exists"""
            ip.user_ns['mathbox_code'] = []
            print('Reinitialized mathbox_code container!')

        if not args.queue:
            """Execute code cell immediately"""
            Vis(js=cell, _now=True)

        elif args.queue and cell not in ip.user_ns['mathbox_code']:
            """Queue code cell for later execution"""
            ip.user_ns['mathbox_code'].append(cell)
            print('Code added to MathBox visualization queue ...')

        elif cell in ip.user_ns['mathbox_code']:
            """Reject duplicate code cells"""
            print('Duplicate code not added to MathBox visualization queue ...')

ip = get_ipython()
ip.register_magics(nbvisMagics)
