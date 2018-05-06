# nbplus

A collection of classes and methods for Creators with intent to enable greater interactivity and visual aesthetic in Jupyter notebooks.

Well-behaved objects are aptly named (_what does the object do?_) and readily expose effective code so that incoming learners may transparently access their underlying functionality.

Create and develop upon a new branch to contribute. Push merge requests to the `staging` branch.

---

Modules may be imported via [packyou](https://github.com/llazzaro/packyou).

To install `packyou`, run `!pip install packyou --user` in a Python 3 notebook.

To import a class/method from a module, e.g. to import `D3` from`d3graph`, we first make `d3graph.py` visible to the Python kernel, then we import the specified class/method:

```
from packyou.github.callysto.nbplus import d3graph
from d3graph import D3
```

---
