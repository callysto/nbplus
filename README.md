# nbplus

[nbplus](https://github.com/callysto/nbplus) (working title) a collection of Callysto-made Python modules for Creators wanting greater interactivity and visual aesthetic in Jupyter notebooks. The tools here reflect a desire for aggregation of reusable code and uniformity in how we develop interactive content.

## Getting Started

Submodules are installed separately.

Use the following command, replacing `<submodule>` with the name of a subdirectory in this repository:

`pip install --upgrade --force-reinstall --user git+git://github.com/callysto/nbplus.git#egg=<submodule>\&subdirectory=<submodule>`

Once installed, import a submodule by referring to itself.

e.g.

```python
from nbvis.classes import D3, Vis
from geogebra.ggb import *
```

See the [training manual]() for documentation and use cases.

## Contributing

Create and develop upon a new branch, and submit pull requests to our `master` branch for review.

Well-behaved objects are aptly named (_what does the object do?_) and readily expose effective code so that incoming learners may transparently access their underlying functionality.

## Authors

* [**Pacific Institute for the Mathematical Sciences**](http://www.pims.math.ca) - *PIMS is dedicated to promoting excellence in the mathematical sciences, enriching public education, and creating partnerships with similar organizations around the world.* 

* [**Cybera**](https://www.cybera.ca) - *Cybera provides supercomputing services.* 

See also the list of [contributors](https://github.com/callysto/nbplus/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

* This project is funded by Canada's CanCode Grant.
* We appreciate Fernando Perez and his team at Berkeley for maintaining Jupyter, thank you meeting with us to provide project insights and collaboration.
* A special thanks to all of the teachers whose collaboration and support has been a key part of the project.
