#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
"""

from setuptools import setup, find_packages

def main():
    setup(
        name='geogebra',
        packages=find_packages(),
        include_package_data=True,
        install_requires=[]
    )

if __name__ == '__main__':
    main()
