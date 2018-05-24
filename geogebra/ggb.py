from IPython.display import display, HTML, Javascript


class GGB():
    def __init__(self):
        self.counter = 0
        self.db = dict()
        self.last = ''

        ggbRequire = ('''
            require.config({
                paths: {
                    ggb: "https://cdn.geogebra.org/apps/deployggb"
                }
            });

            require(["ggb"]);
        ''')

        display(Javascript(ggbRequire))

        return

    def src(self, source: str, type: str, instanceName=''):
        if instanceName is '':
            self.last = 'ggb_' + str(self.counter) + 'e'
            self.counter += 1
        else:
            self.last = 'ggb_' + instanceName + 'e'

        self.db[self.last] = GGBInstance(source, type=type, instanceName=self.last)
        return self.db[self.last]

    def file(self, filename: str, instanceName=''):
        return self.src(filename, 'filename', instanceName)

    def material(self, material_id: str, instanceName=''):
        return self.src(material_id, 'material_id', instanceName)

    def base64(self, code: str, instanceName=''):
        return self.src(code, 'ggbBase64', instanceName)

    def app(self, name='classic', instanceName=''):
        return self.src(name, 'appName', instanceName)


class GGBInstance():
    def __init__(self, source: str, type: str, instanceName: str):
        self.instanceName = instanceName
        self.params = dict()
        self.paramsList = []
        self.paramsString = ''

        self.params[type] = '\"%s\"' % source
        return

    def setOption(self, name: str, value):
        self.params[name] = value
        return self

    def width(self, width: int):
        self.setOption('width', width)
        return self

    def height(self, height: int):
        self.setOption('height', height)
        return self

    def options(self, **kwargs):
        if kwargs is not None:
            for key, val in kwargs.items():
                if GGBInstance.isGGBNumberType(key):
                    self.setOption(key, val)
                elif GGBInstance.isGGBBoolType(key):
                    self.setOption(key, str(val).lower())
                else:
                    self.setOption(key, '\"%s\"' % val)
        return self

    def draw(self):
        self.paramsList = list(map(
            lambda kv: '\"%s\" : %s' % (kv[0], kv[1]),
            self.params.items()
        ))
        self.paramsString = ', '.join(self.paramsList)

        display(HTML('<div id=\"%s\"></div>' % self.instanceName))

        display(Javascript(
            'var %s = new GGBApplet({%s}, \"%s\", true); %s.inject(); ' % (self.instanceName, self.paramsString, self.instanceName, self.instanceName)
        ))
        return self

    def debug(self):
        print('Options: %s' % self.paramsString)
        return

    @staticmethod
    def isGGBStringType(key):
        return key in [
            'appName',
            'width',
            'height',
            'material_id',
            'filename',
            'ggBase64',
            'borderColor',
            'customToolbar',
            'perspective',
            'algebraInputPosition',
            'scaleContainerClass',
            'rounding',
            'language',
            'country',
            'ggbOnInitParam',
            'data-param-id'
        ]

    @staticmethod
    def isGGBNumberType(key):
        return key in [
            'width',
            'height',
            'capturingThreshold',
            'scale',
            'showAnimationButton',
            'showFullscreenButton',
            'showSuggestionButtons',
            'showStartTooltip',
            'butonShadows',
            'buttonRounding'
        ]

    @staticmethod
    def isGGBBoolType(key):
        return key in [
            'enableRightClick',
            'enableLabelDrags',
            'enableShiftDragZoom',
            'errorDialogsActive',
            'showMenuBar',
            'showToolBar',
            'showToolBarHelp',
            'showAlgebraInput',
            'showResetIcon',
            'allowStyleBar',
            'useBrowserForJS',
            'showLogging',
            'enableFileFeatures',
            'enable3d',
            'enableCAS',
            'preventFocus',
            'allowUpscale',
            'playButton'
        ]

    def setVisible(self, obj, tf):
        display(Javascript('%s.setVisible(\"%s\", %s)' % (self.instanceName, obj, str(tf).lower())))
        return
