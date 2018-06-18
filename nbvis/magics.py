from IPython import get_ipython
from IPython.core import magic_arguments
from IPython.core.magic import Magics, magics_class, cell_magic

"""Magics to inject JavaScript"""
@magics_class
class vizMagics(Magics):
    @cell_magic
    @magic_arguments.magic_arguments()
    @magic_arguments.argument('--reset', '-r',
          action='store_true',
          help='Replace any elements of mathbox_code with the current cell body'
    )
    def mathbox(self, line, cell):
        args = magic_arguments.parse_argstring(self.mathbox, line)
        if args.reset:
            ip.user_ns['mathbox_code'] = []
        try:
            mathBoxCode = ip.user_ns['mathbox_code']
            if cell in mathBoxCode:
                print("Code duplicate! Not added to MathBox visualization stack.")
            else:
                ip.user_ns['mathbox_code'].append(cell)
                print("Code added to MathBox visualization stack!")
        except KeyError:
            ip.user_ns['mathbox_code'] = []
            ip.user_ns['mathbox_code'].append(cell)
            print("Created MathBox container.")
            print("Code added to MathBox visualization stack!");
    
    @cell_magic
    @magic_arguments.magic_arguments()
    @magic_arguments.argument('--reset', '-r',
          action='store_true',
          help='Replace any elements of d3_code with the current cell body'
    )
    def d3(self, line, cell):
        args = magic_arguments.parse_argstring(self.d3, line)
        if args.reset:
            ip.user_ns['d3_code'] = []
        try:
            if cell in ip.user_ns['d3_code']:
                print("Code duplicate! Not added to D3 visualization stack.")
            else:
                ip.user_ns['d3_code'].append(cell)
                print("Code added to D3 visualization stack!")
        except KeyError:
            ip.user_ns['d3_code'] = []
            ip.user_ns['d3_code'].append(cell)
            print("Created D3 container.")
            print("Code added to D3 visualization stack!");

ip = get_ipython()
ip.register_magics(vizMagics)