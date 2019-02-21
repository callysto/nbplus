from setuptools import setup, find_packages

def main():
    setup(
        name='nbmore',
        version='0.0.dev0',
        author='Vincent Cote',
        packages=find_packages(),
        include_package_data=True,
        install_requires=[]
    )

if __name__ == '__main__':
    main()