# nbhide
An extension for selective hiding of code and Markdown cells in Jupyter notebooks with a hidden toolbar.

In any code cell within a Jupyter notebook (Python 3),

```
!pip install --upgrade --force-reinstall --user git+git://github.com/callysto/nbplus.git#egg=nbplus
!jupyter nbextension enable --py --user nbhide
```

To disable `nbhide`,

```
!jupyter nbextension disable --py --user nbhide
```
