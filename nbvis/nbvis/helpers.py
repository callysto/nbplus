#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Helper functions for use in classes.py
Assembled by Eric Easthope
"""

from IPython import get_ipython

def getVariableName(var):
    """Retrieve the names of variables in the global scope corresponding to var"""
    return [tpl[0] for tpl in filter(lambda x: var is x[1], get_ipython().user_ns.items())]

def camelCase(column):
    """Convert lisp-case to camelCase"""
    first, *rest = column.split('-')
    return first + ''.join(word.capitalize() for word in rest)
