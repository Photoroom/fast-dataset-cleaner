from setuptools import setup, find_packages

with open("README.md", "r") as readme:
    long_description = readme.read()

with open("requirements.txt", "r") as req:
    install_requires = req.read().split("\n")


setup(
    name="fast-dataset-cleaner",
    version="1.0.0",
    author="Thomas Chabal",
    author_email="t.chabal@hotmail.fr",
    description="Web platform for fast image dataset cleaning",
    keywords="annotation,dataset cleaning,binary annotation,fast dataset cleaner,image dataset",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/PhotoRoom/fast-dataset-cleaner",
    packages=find_packages(),
    include_package_data=True,
    scripts=['scripts/fast-dataset-cleaner'],
    install_requires=install_requires,
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
