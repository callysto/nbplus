def _jupyter_server_extension_paths():
    return [{
        "module": "nbhide"
    }];

def _jupyter_nbextension_paths():
    return [
        dict(
            section='notebook',
            src='static',                  # path is relative to `nbhide` directory
            dest='nbhide',                 # directory in `nbextension/` namespace
            require='nbhide/appendButtons' # _also_ in `nbextension/` namespace
        ),
        dict(
            section='notebook',
            src='static',                      # path is relative to `nbhide` directory
            dest='nbhide',                     # directory in `nbextension/` namespace
            require='nbhide/appendToggles' # _also_ in `nbextension/` namespace
        )
    ];

def load_jupyter_server_extension(nbapp):
    nbapp.log.info("nbhide enabled!");
