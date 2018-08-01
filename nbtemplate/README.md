# nbtemplate

## Modifications

Here I've listed a few functional changes I needed to make, as well as my installation procedure as the instructions below did not work for me (nbtemplate was not included on the pip wheel). I note that the changes to `__init__.py` may be superfluous and the only real change to that file was changing relative paths. 

1. `__init__.py` was moved out of the nested `nbtemplate/nbtemplate` directory to `nbtemplate/` and the relative paths were updated accordingly. I note that this may not be required anymore, but I'm hesitant to change it now.
1. In order to get the `lab_template_helpers` imports to work from the injections, you'll need to run 
    ```bash
    python setup.py install --user
    ```
    from wherever your `nbplus/nbtemplate` is.
2. To get this install to work, I found it easier to just copy the `nbtemplate/` directory to `~./local/lib/python3.6/site-packages` manually, then run the following commands
        a. jupyter nbextension install --py --user nbtemplate
        b. jupyter nbextension enable --py --user nbtemplate

3. It would probably be better to update `setup.py` accordingly to make everything work more smoothly, but seeing as this is preliminary I opted to "take the path of least resistance" and do this all manually. 

Note: I've also included a file that will inject banners for you as well (the existing one did not work). 

Issues found/known

1. The "Choose" button on the template selector from `selector.js` does not work, and you need to double click to make your selection. 


An extension for loading custom templates into Jupyter notebooks.

---

In any code cell within a Jupyter notebook (Python 3),

```
!pip install --upgrade --force-reinstall --user git+git://github.com/callysto/nbplus.git#egg=nbplus
!jupyter nbextension enable --py --user nbtemplate
```

To disable `nbtemplate`,

```
!jupyter nbextension disable --py --user nbtemplate
```
