#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
"""

from setuptools import setup, find_packages

def main():
    setup(
        name='nbblocks',
        version='0.0.1',
        author='Eric Easthope',
        packages=find_packages(),
        include_package_data=True,

        data_files=[
            # like `jupyter nbextension install --sys-prefix`
            ("share/jupyter/nbextensions/nbblocks", [
                "nbblocks/static/main.js",
            ]),

            # like `jupyter nbextension install --sys-prefix`
            ("share/jupyter/nbextensions/nbblocks", [
                "nbblocks/static/selector.js",
            ]),
            
            # like `jupyter nbextension install --sys-prefix`
            ("share/jupyter/nbextensions/nbblocks", [
                "nbblocks/static/popoverStyles.css",
            ]),

            # like `jupyter nbextension enable --sys-prefix`
            ("etc/jupyter/nbconfig/notebook.d", [
                "jupyter-config/nbconfig/notebook.d/nbblocks.json"
            ]),

            # like `jupyter serverextension enable --sys-prefix`
            ("etc/jupyter/jupyter_notebook_config.d", [
                "jupyter-config/jupyter_notebook_config.d/nbblocks.json"
        ])
    ],
    zip_safe=False
    )

if __name__ == '__main__':
    main()
    
