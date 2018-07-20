#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Jupyter notebook magics to queue and execute D3 and MathBox code
Assembled by Eric Easthope
"""

from IPython import get_ipython
from IPython.core import magic_arguments
from IPython.core.magic import Magics, magics_class, cell_magic

from .classes import Vis

@magics_class
class nbvisMagics(Magics):
    
    @cell_magic
    @magic_arguments.magic_arguments()
    @magic_arguments.argument('--queue',
          action='store_true',
          help='Add cell code to a list of D3 code for later execution'
    )
    @magic_arguments.argument('--reset',
          action='store_true',
          help='Reset d3_code to an empty list before appending code from current cell'
    )
    def d3(self, line, cell):
        args = magic_arguments.parse_argstring(self.d3, line)
        
        # initialize d3_code container if it does not exist
        if 'd3_code' not in ip.user_ns.keys():
            ip.user_ns['d3_code'] = []
            print('Initialized d3_code container!')
            
        # reset d3_code container if it exists
        elif args.reset and 'd3_code' in ip.user_ns.keys():
            ip.user_ns['d3_code'] = []
            print('Reinitialized d3_code container!')
            
        # execute code cell immediately
        if not args.queue: Vis(js=cell, _now=True)
            
        # queue code cell for later execution
        elif args.queue and cell not in ip.user_ns['d3_code']:
            ip.user_ns['d3_code'].append(cell)
            print('Code added to D3 visualization queue ...')
        
        # reject duplicate code cells
        elif cell in ip.user_ns['d3_code']:
            print('Duplicate code not added to D3 visualization queue ...')

    @cell_magic
    @magic_arguments.magic_arguments()
    @magic_arguments.argument('--queue',
          action='store_true',
          help='Add cell code to a list of MathBox code for later execution'
    )
    @magic_arguments.argument('--reset',
          action='store_true',
          help='Reset mathbox_code to an empty list before appending code from current cell'
    )
    def mathbox(self, line, cell):
        args = magic_arguments.parse_argstring(self.mathbox, line)
        
        # initialize mathbox_code container if it does not exist
        if 'mathbox_code' not in ip.user_ns.keys():
            ip.user_ns['mathbox_code'] = []
            print('Initialized mathbox_code container!')
            
        # reset mathbox_code container if it exists
        elif args.reset and 'mathbox_code' in ip.user_ns.keys():
            ip.user_ns['mathbox_code'] = []
            print('Reinitialized mathbox_code container!')
            
        # execute code cell immediately
        if not args.queue: Vis(js=cell, _now=True)
            
        # queue code cell for later execution
        elif args.queue and cell not in ip.user_ns['mathbox_code']:
            ip.user_ns['mathbox_code'].append(cell)
            print('Code added to MathBox visualization queue ...')
        
        # reject duplicate code cells
        elif cell in ip.user_ns['mathbox_code']:
            print('Duplicate code not added to MathBox visualization queue ...')

ip = get_ipython()
ip.register_magics(nbvisMagics)
