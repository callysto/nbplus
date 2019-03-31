# nbplus

[nbplus](https://github.com/callysto/nbplus) is a collection of Callysto-made Python packages for Creators wanting greater interactivity and aesthetic in Jupyter notebooks. The tools here reflect a desire for reusable code and uniformity in how we develop interactive content.

## Getting Started

Packages are installed separately. Available packages are:

* `auto_package` (iteratively install remote packages, see a [demo](https://github.com/callysto/nbplus/blob/master/examples/auto-package.ipynb))
* `geogebra` (use GeoGebra visualizations in notebooks)
* `nbvis` (create reactive D3 and MathBox visualizations)
* `nblayout` (control and toggle code and Markdown cells)
* `nbtemplate` (load remote notebook snippets)
* `nbquestions` (create question/answer cells)
* `patch_kit` (process notebook data through remote notebooks)

Use the following command, replacing `<submodule>` with the name of one of the submodules above:

`pip install --user git+git://github.com/callysto/nbplus.git#egg=<submodule>\&subdirectory=<submodule>`

Restart the kernel after any installation, and import a submodule by referring to itself.

e.g.

```python
from nbvis.widgets import BouncySlider
from geogebra.ggb import *
```

See the [training manual](https://training.callysto.ca/extensions/nbplus) for documentation and use cases.

## Contributing

Create and develop upon a new branch, then submit pull requests to our `master` branch for review. Be sure to describe what the contribution achieves, and include sample code for others to learn from.

## Authors

* [**Pacific Institute for the Mathematical Sciences**](http://www.pims.math.ca) - *PIMS is dedicated to promoting excellence in the mathematical sciences, enriching public education, and creating partnerships with similar organizations around the world.*

* [**Cybera**](https://www.cybera.ca) - *Cybera provides supercomputing services.*

See [all contributors](https://github.com/callysto/nbplus/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) for details.

## Acknowledgments

* This project is funded by Canada's CanCode Grant.
* We appreciate Fernando Perez and his team at Berkeley for maintaining Jupyter, thank you meeting with us to provide project insights and collaboration.
* A special thanks to all of the teachers whose collaboration and support has been a key part of the project.
