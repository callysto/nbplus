#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''Offload and execute reusable/modular code from specialized notebooks
   Any "patch notebook" must contain

       ```
       %store -r patch_in
       # do something with the patch_in variable
       patch_out = <a variable to use elsewhere>
       %store patch_out
       ```

   I want to immerse documentation in source code,
   so I'm turning notebooks into self-contained and
   self-described packages.

   Eric Easthope

   MIT License
   Assembled for Callysto
'''

import os

from IPython import get_ipython
from IPython.utils import io

import requests
from json import loads

ip = get_ipython()
package_directory, package_filename = os.path.split(__file__)

def load_nb(path, patch_in):
    with io.capture_output() as captured:
        ip.user_ns['patch_in'] = patch_in
        ip.run_line_magic('store', 'patch_in')
        ip.run_line_magic('run', path)
        ip.run_line_magic('store', '-r patch_out')
        return ip.user_ns['patch_out'];

def patch(name, patch_in, verbose=False, force_retrieve=False):
    nb_name = name[::-1].split('/')[0][::-1] + ('.ipynb' if '.ipynb' not in name else '')
    patch_path = os.path.join(package_directory, 'patches', nb_name)

    if os.path.exists(patch_path) and not force_retrieve:
        if verbose: print("Found '%s' in default patches" % nb_name)
        return load_nb(patch_path, patch_in);

    elif os.path.exists('patches/%s' % nb_name):
        if verbose: print("Found '%s' in patches/" % nb_name)
        return load_nb('patches/%s' % nb_name, patch_in);

    elif (name.startswith('https') and
          name.endswith('.ipynb') and (not
              os.path.exists('patches/%s' % nb_name) or
              force_retrieve)):

        if verbose: print("Retrieving '%s' %s" % (nb_name, '(forcefully)' if force_retrieve else ''))
        r = requests.get(name)
        if r.status_code != 200:
            raise requests.HTTPError("Failed to download a notebook from '%s'" % r.url);
        if not os.path.isdir('patches'):
            os.mkdir('patches')
        with open('patches/%s' % nb_name, 'w') as nb:
            nb.write(r.text)
        return load_nb('patches/%s' % nb_name, patch_in);

    else:
        raise FileNotFoundError("'%s' not found" % nb_name);
