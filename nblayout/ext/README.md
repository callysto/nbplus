# nblayout
An extension for controlling the layout of Jupyter notebooks

In any code cell within a Jupyter notebook (Python 3),

```
!pip install --upgrade --force-reinstall --user git+git://github.com/callysto/nbplus.git#egg=nblayout\&subdirectory=nblayout
!jupyter nbextension install --py --user nblayout
!jupyter nbextension enable --py --user nblayout
```

To disable `nblayout`,

```
!jupyter nbextension disable --py --user nblayout
```
