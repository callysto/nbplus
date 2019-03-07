#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Offload and execute reusable/modular code from specialized notebooks
   Any "patch notebook" must contain
   
       ```
       %store -r patch_in
       <do something with patch_in>
       
       patch_out = <result>
       %store patch_out
       ```

   I wanted to immerse documentation in source code,
   so I'm over-specializing notebooks.
   
   Eric Easthope
   
   MIT License
   Assembled for Callysto
"""

import os.path

from IPython import get_ipython
from IPython.utils import io

ip = get_ipython()

def patch(name, patch_in):
    if os.path.isfile('%s.ipynb' % name):
        with io.capture_output() as captured:
            ip.user_ns['patch_in'] = patch_in
            ip.run_line_magic('store', 'patch_in')
            ip.run_line_magic('run', './%s.ipynb' % name)
            ip.run_line_magic('store', '-r patch_out')
            return ip.user_ns['patch_out'];
    else:
        raise FileNotFoundError("'%s.ipynb' not found" % name);