#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
"""

def _jupyter_server_extension_paths():
    return [{
        'module':'nbblocks'
    }];

def _jupyter_nbextension_paths():
    return [
        dict(
            section='notebook',
            src='static',             # path is relative to `nbblocks` directory
            dest='nbblocks',        # directory in `nbextension/` namespace
            require='nbblocks/main' # _also_ in `nbextension/` namespace
        ),
        dict(
            section='notebook',
            src='static',
            dest='nbblocks',
            require='nbblocks/selector'
        )
    ];

def load_jupyter_server_extension(nbapp):
    nbapp.log.info('* Jupyter loaded nbblocks');
