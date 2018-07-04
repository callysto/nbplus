from IPython import get_ipython
from IPython.core import magic_arguments
from IPython.core.magic import Magics, magics_class, cell_magic

from .classes import Vis

@magics_class
class visMagics(Magics):
    """
    Magics to queue and execute JavaScript visualization code
    """

    @cell_magic
    @magic_arguments.magic_arguments()
    @magic_arguments.argument('--queue',
          action='store_true',
          help='Add cell body to a list of code to run later'
    )
    @magic_arguments.argument('--reset',
          action='store_true',
          help='Reset d3_code to an empty list before code added from current cell body'
    )
    @magic_arguments.argument('--now',
          action='store_true',
          help='Run code from current cell body immediately'
    )
    def d3(self, line, cell):
        """
        """

        args = magic_arguments.parse_argstring(self.d3, line)
        if args.reset:
            ip.user_ns['d3_code'] = []
            print('Initialized d3_code container!')
        if args.now:
            Vis(js=cell, now=True)
        if args.queue:
            try:
                if cell in ip.user_ns['d3_code']:
                    index = ip.user_ns['d3_code'].index(cell)
                    print('Duplicate code not added to D3 visualization queue ...')
                    Vis(js='\n'.join(i for i in ip.user_ns['d3_code'][:index+1]), now=True)
                else:
                    ip.user_ns['d3_code'].append(cell)
                    print('Code added to D3 visualization queue ...')
                    Vis(js=cell, now=True)
            except KeyError:
                ip.user_ns['d3_code'] = []
                ip.user_ns['d3_code'].append(cell)
                print('Initialized d3_code container!')
                print('Code added to D3 visualization queue ...');

    @cell_magic
    @magic_arguments.magic_arguments()
    @magic_arguments.argument('--queue',
          action='store_true',
          help='Add cell body to a list of code to run later'
    )
    @magic_arguments.argument('--reset',
          action='store_true',
          help='Reset mathbox_code to an empty list before code added from current cell body'
    )
    @magic_arguments.argument('--now',
          action='store_true',
          help='Run code from current cell body immediately'
    )
    def mathbox(self, line, cell):
        """
        """

        args = magic_arguments.parse_argstring(self.mathbox, line)
        if args.reset:
            ip.user_ns['mathbox_code'] = []
            print('Initialized mathbox_code container!')
        if args.now:
            Vis(js=cell, now=True)
        if args.queue:
            try:
                if cell in ip.user_ns['mathbox_code']:
                    index = ip.user_ns['mathbox_code'].index(cell)
                    print('Duplicate code not added to MathBox visualization queue ...')
                    Vis(js='\n'.join(i for i in ip.user_ns['mathbox_code'][:index+1]), now=True)
                else:
                    ip.user_ns['mathbox_code'].append(cell)
                    print('Code added to MathBox visualization queue ...')
                    Vis(js=cell, now=True)
            except KeyError:
                ip.user_ns['mathbox_code'] = []
                ip.user_ns['mathbox_code'].append(cell)
                print('Initialized mathbox_code container!')
                print('Code added to MathBox visualization queue ...');

ip = get_ipython()
ip.register_magics(visMagics)
