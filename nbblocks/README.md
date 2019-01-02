# nbblocks
An extension for loading custom templates into Jupyter notebooks.

In any code cell within a Jupyter notebook (Python 3),

```
!pip install --upgrade --force-reinstall --user git+git://github.com/callysto/nbplus.git#egg=nbblocks\&subdirectory=nbblocks
!jupyter nbextension install --py --user nbblocks
!jupyter nbextension enable --py --user nbblocks
```

To disable `nbblocks`,

```
!jupyter nbextension disable --py --user nbblocks
```
