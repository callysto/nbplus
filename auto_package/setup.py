#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Iteratively install remote dependencies using pip
   The --quiet flag is optional, and produces minimal shell output.

   ```
   import auto_package
   dependencies = {
       'package-name': 'package-path'
   }
   for package in dependencies.items():
       %install --quiet $package
   ```

   Eric Easthope

   MIT License
   Assembled for Callysto
"""

from setuptools import setup

def main():
    setup(
        name='auto_package',
        version='0.0.0',
        author='Eric Easthope',
        py_modules=['auto_package'],
        entry_points='''
            [console_scripts]
            auto_package=auto_package:auto_package
            ''',
    )

if __name__ == '__main__':
    main()
