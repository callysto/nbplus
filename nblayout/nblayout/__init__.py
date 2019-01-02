#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
"""

def _jupyter_server_extension_paths():
    return [{
        'module':'nblayout'
    }];

def _jupyter_nbextension_paths():
    return [
        dict(
            section='notebook',
            src='static',           # path is relative to `nblayout` directory
            dest='nblayout',        # directory in `nbextension/` namespace
            require='nblayout/main' # _also_ in `nbextension/` namespace
        ),
        dict(
            section='notebook',
            src='static',
            dest='nblayout',
            require='nblayout/overview'
        ),
        dict(
            section='notebook',
            src='static',
            dest='nblayout',
            require='nblayout/layout'
        )
    ];

def load_jupyter_server_extension(nbapp):
    nbapp.log.info('* Jupyter loaded nblayout');
