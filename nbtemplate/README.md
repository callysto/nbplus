# nbtemplate
An extension for loading custom templates into Jupyter notebooks.

In any code cell within a Jupyter notebook (Python 3),

```
!pip install --upgrade --force-reinstall --user git+git://github.com/callysto/nbplus.git#egg=nbtemplate\&subdirectory=nbtemplate
!jupyter nbextension install --py --user nbtemplate
!jupyter nbextension enable --py --user nbtemplate
```

To disable `nbtemplate`,

```
!jupyter nbextension disable --py --user nbtemplate
```
