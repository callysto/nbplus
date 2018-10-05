#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
Adds a button to the toolbar to inject template elements into Jupyter notebooks
'''

from setuptools import setup, find_packages

def main():
    setup(
        name='nbtemplate',
        version='0.0.dev0',
        author='Eric Easthope',
        packages=find_packages(),
        include_package_data=True,
        
        data_files=[
            # like `jupyter nbextension install --sys-prefix`
            ("share/jupyter/nbextensions/nbtemplate", [
                "nbtemplate/static/main.js",
            ]),
            
            # like `jupyter nbextension install --sys-prefix`
            ("share/jupyter/nbextensions/nbtemplate", [
                "nbtemplate/static/templateSelector.js",
            ]),

	    # like `jupyter nbextension install --sys-prefix`
            ("share/jupyter/nbextensions/nbtemplate", [
                "nbtemplate/static/blockSelector.js",
            ]),
            
            # like `jupyter nbextension enable --sys-prefix`
            ("etc/jupyter/nbconfig/notebook.d", [
                "jupyter-config/nbconfig/notebook.d/nbtemplate.json"
            ]),
            
            # like `jupyter serverextension enable --sys-prefix`
            ("etc/jupyter/jupyter_notebook_config.d", [
                "jupyter-config/jupyter_notebook_config.d/nbtemplate.json"
        ])
    ],
    zip_safe=False
    )

if __name__ == '__main__':
    main()
