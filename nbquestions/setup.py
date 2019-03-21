from setuptools import setup

with open("README.md", "r") as f:
    long_description = f.read()

setup(name='nbquestions',
      version='0.0.1',
      description='Helper functions for creating questions',
      long_description=long_description,
      long_description_content_type="text/markdown",
      url='http://github.com/callysto/nbplus',
      author='Cameron Mann',
      author_email='cameron.mann@cybera.ca',
      license='MIT',
      packages=['nbquestions'],
      install_requires=[])
