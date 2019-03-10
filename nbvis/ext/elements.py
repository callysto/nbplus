#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Python classes to import and configure JavaScript to append HTML elements
Assembled by Eric Easthope for Callysto
MIT License
"""

import os
module_directory = os.path.dirname(os.path.abspath(__file__))
elements_filepath = os.path.join(module_directory, 'js/elements.js')
mb_filepath = os.path.join(module_directory, 'js/mb.js')

class Element:
    """Generates JavaScript code for an SVG/Canvas element"""
    def __init__(self, height=None, element_type='svg', name='none'):
        if element_type == 'svg':
            element = (open(elements_filepath, 'r').read()
                           .replace('#element_type', '"%s"' % element_type)
                           .replace('#name', '"%s"' % name)
                           .replace('#height', '"{}px"'.format(height))
                           .replace('#width', '"100%"')
                      )
            
        if element_type == 'canvas':
            element = (open(elements_filepath, 'r').read()
                           .replace('#element_type', '"%s"' % element_type)
                           .replace('#name', '"%s"' % name)
                           .replace('#height', '"{}px"'.format(height))
                      )

            width = 'parseFloat(window.getComputedStyle(element[0]).width)'
            padding = 'parseFloat(window.getComputedStyle(element[0]).paddingRight)'
            element = element.replace('#width', width + " - \n" + 17*" " +
                                                "2*" + padding +
                                                ' + "px"')

        if element_type == 'mb':
            element = (open(mb_filepath, 'r').read()
                           .replace('#height', '"{}px"'.format(height))
                           .replace('#width', '"100%"')
                      )
        
        self.js = element