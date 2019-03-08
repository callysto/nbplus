#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
"""

from setuptools import setup, find_packages

def main():
    setup(
        name='nblayout',
        version='0.0.1',
        author='Eric Easthope',
        packages=find_packages(),
        include_package_data=True,

        data_files=[
            # like `jupyter nbextension install --sys-prefix`
            ("share/jupyter/nbextensions/nblayout", [
                "nblayout/static/main.js",
            ]),

            # like `jupyter nbextension install --sys-prefix`
            ("share/jupyter/nbextensions/nblayout", [
                "nblayout/static/overview.js",
            ]),

	        # like `jupyter nbextension install --sys-prefix`
            ("share/jupyter/nbextensions/nblayout", [
                "nblayout/static/layout.js",
            ]),

            # like `jupyter nbextension enable --sys-prefix`
            ("etc/jupyter/nbconfig/notebook.d", [
                "jupyter-config/nbconfig/notebook.d/nblayout.json"
            ]),

            # like `jupyter serverextension enable --sys-prefix`
            ("etc/jupyter/jupyter_notebook_config.d", [
                "jupyter-config/jupyter_notebook_config.d/nblayout.json"
        ])
    ],
    zip_safe=False
    )

if __name__ == '__main__':
    main()
