#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Iteratively install remote dependencies using pip
   
   ```
   import auto_package
   dependencies = {
       'package-name': 'package-url'
   }
   for package in dependencies.items():
       %install $package
   ```

   Eric Easthope
   
   MIT License
   Assembled for Callysto
"""

from setuptools import setup, find_packages

def main():
    setup(
        name='auto_package',
        version='0.0.0',
        author='Eric Easthope',
        packages=find_packages()
    )

if __name__ == '__main__':
    main()
