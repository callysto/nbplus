
"""
Jupyter notebook magic to add a "toggle more" button to have 
extra text cell.
"""

from __future__ import print_function
from IPython.core.magic import Magics, magics_class, line_magic
from IPython import get_ipython

@magics_class
class nbmore(Magics):

    @line_magic
    def toggleMore(self, line):
        raw_code = '''%%html
                    <button onclick='toggleMore()'>More</button>
                    <script>
                     var cells = document.getElementById('notebook-container');
                     $(cells).find('.hideMe').closest('div.cell').hide('0');
                    function toggleMore() {
                      setTimeout(function() {
                        var index = 0;
                        var cells = document.getElementById('notebook-container');
                        for (var cell of cells.childNodes) {
                            if ($(cell).hasClass('selected'))
                                break;
                            index++;
                        }
                        $(cells.childNodes[index - 1]).toggle('500');
                        }, 100);
                    }
                    </script>'''
        self.shell.run_cell(raw_code, store_history=False)

ip = get_ipython()
ip.register_magics(MyMagics)
