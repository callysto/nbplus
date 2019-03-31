#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Configure line magic for auto_package

   Eric Easthope

   MIT License
   Assembled for Callysto
"""

import sys
import subprocess

from IPython import get_ipython
from IPython.core import magic_arguments
from IPython.core.magic import register_line_cell_magic

from ast import literal_eval as make_tuple

ip = get_ipython()

@register_line_cell_magic
@magic_arguments.magic_arguments()
@magic_arguments.argument('--quiet', '-q',
    action='store_true',
    help='Install packages without shell output'
)
def install(line='', cell=None):
    if line.startswith('-'):
        specifier = line.split(' ', 1)[1]
        args = magic_arguments.parse_argstring(install, line.split(' ')[0])
    else:
        specifier = line
        args = None

    try:
        s = make_tuple(specifier)
    except ValueError:
        s = [specifier, specifier]

    bash = [sys.executable, '-m',
            'pip', 'install',
            '--upgrade', '--force-reinstall', '--user',
            s[1].replace('\\', '')]
    try:
        result = subprocess.check_output(bash)
        if args is None:
            for l in result.splitlines():
                print(l.decode('utf-8'))
        elif args.quiet:
            print('Installed', "'%s'" % s[0])
            pass
    except subprocess.CalledProcessError:
        print('Failed to install', "'%s'" % s[0])
