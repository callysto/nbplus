#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Adds toolbar controls for (un)hiding of code and Markdown cells
"""

from setuptools import setup, find_packages

def main():
    setup(
        name='nbhide',
        version='0.0.dev0',
        author='Vincent Cote & Eric Easthope',
        packages=find_packages(),
        include_package_data=True,
        
        data_files=[
            # like `jupyter nbextension install --sys-prefix`
            ("share/jupyter/nbextensions/nbhide", [
                "nbhide/static/appendButtons.js",
            ]),
            
            # like `jupyter nbextension install --sys-prefix`
            ("share/jupyter/nbextensions/nbhide", [
                "nbhide/static/appendToggles.js",
            ]),
            
            # like `jupyter nbextension enable --sys-prefix`
            ("etc/jupyter/nbconfig/notebook.d", [
                "jupyter-config/nbconfig/notebook.d/nbhide.json"
            ]),
            
            # like `jupyter serverextension enable --sys-prefix`
            ("etc/jupyter/jupyter_notebook_config.d", [
                "jupyter-config/jupyter_notebook_config.d/nbhide.json"
            ])
        ]
    )

if __name__ == '__main__':
    main()
