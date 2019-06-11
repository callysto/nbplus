#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
Setup the `play_button` submodule

Eric Easthope
MIT License
Assembled for Callysto
'''

from setuptools import setup, find_packages

def main():
    setup(
        name='play_button',
        version='0.0.0',
        author='Eric Easthope',
        license='MIT',
        packages=['play_button'],
        include_package_data=True,
        install_requires=[]
    )

if __name__ == '__main__':
    main()