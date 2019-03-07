#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Minimal code cell hiding using HTML styles and D3.js

   Eric Easthope
   
   MIT License
   Assembled for Callysto
"""

from setuptools import setup, find_packages

def main():
    setup(
        name='nbhide',
        version='0.0.0',
        author='Eric Easthope',
        license='MIT',
        packages=['nbhide'],
        include_package_data=True,
        install_requires=[]
    )

if __name__ == '__main__':
    main()
