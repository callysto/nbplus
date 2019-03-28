# nblayout

Control the default layout and style of Jupyter notebooks.

#### Install:

In a code cell:

```bash
!pip install --upgrade --force-reinstall --user \
    git+git://github.com/callysto/nbplus.git@nblayout#egg=nblayout\&subdirectory=nblayout
```

## nbhide

An extension for selective hiding of code cells in Jupyter notebooks.

#### Usage:

With `nblayout` installed, in a code cell:

```python
import nblayout.nbhide
```

Then, begin another code cell that you wish to hide with the `%%hide` cell magic:

```python
%%hide
# your code here
```

Double-click the cell outline to reveal its contents. Click the eye on the toolbar to toggle code cell visibility.

[See an example](https://github.com/callysto/nbplus/blob/master/examples/nblayout.ipynb)

## nbmore
An extension to toggle the visibility of supplementary (non-essential) text.

#### Usage:

With `nblayout` installed, in a code cell:

```python
import nblayout.nbmore
```

Then, begin a supplementary Markdown cell with `<div class="hideMe">`:

```md
<div class="hideMe">
Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ...
```

Make the next cell a code cell with only the `%toggleMore` line magic.

```python
%toggleMore
```

Once it is run, a "More" button will toggle visibility of the Markdown above it.
