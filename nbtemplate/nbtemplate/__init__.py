#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
'''

def _jupyter_server_extension_paths():
    return [{
        'module':'nbtemplate'
    }];

def _jupyter_nbextension_paths():
    return [
        dict(
            section='notebook',
            src='static',             # path is relative to `nbtemplate` directory
            dest='nbtemplate',        # directory in `nbextension/` namespace
            require='nbtemplate/main' # _also_ in `nbextension/` namespace
        ),
        dict(
            section='notebook',
            src='static',                         # path is relative to `nbtemplate` directory
            dest='nbtemplate',                    # directory in `nbextension/` namespace
            require='nbtemplate/templateSelector' # _also_ in `nbextension/` namespace
        )
    ];

def load_jupyter_server_extension(nbapp):
    nbapp.log.info('Loaded nbtemplate!');
