#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Minimal code cell hiding and
   other notebook layout controls using HTML styles, jQuery, and D3.js

   Eric Easthope
   Vincent Cote

   MIT License
   Assembled for Callysto
"""

from setuptools import setup, find_packages

def main():
    setup(
        name='nblayout',
        version='0.0.0',
        author='Eric Easthope & Vincent Cote',
        license='MIT',
        packages=['nblayout'],
        include_package_data=True,
        install_requires=[]
    )

if __name__ == '__main__':
    main()
