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
        install_requires=[]
    )

if __name__ == '__main__':
    main()
