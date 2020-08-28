from setuptools import setup, find_packages

with open("README.md", "r") as readme:
    long_description = readme.read()

with open("requirements.txt", "r") as req:
    install_requires = req.read().split("\n")


setup(
    name="fast-dataset-cleaner",
    version="1.0.0",
    author="Thomas Chabal",
    author_email="thomas@photoroom.com",
    description="Web platform for fast image dataset cleaning",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/PhotoRoom/fast-dataset-cleaner",
    scripts=['scripts/fast-dataset-cleaner'],
    # package_dir = {'':'src'},
    packages=find_packages(),
    package_data = {
        '': ['*.js', '*.html', '*.css', '*.json', '*.png', '*.ico'],
    },
    # include_package_data=True,
    install_requires=install_requires,
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
