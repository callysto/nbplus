#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Offload and execute reusable/modular code from specialized notebooks

   (See patch_kit.py for further documentation)

   Eric Easthope

   MIT License
   Assembled for Callysto
"""

from setuptools import setup, find_packages

def main():
    setup(
        name='patch_kit',
        version='0.0.0',
        author='Eric Easthope',
        license='MIT',
        packages=['patch_kit'],
        include_package_data=True,
        install_requires=[]
    )

if __name__ == '__main__':
    main()
