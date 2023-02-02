"""A setuptools based setup module.

See:
https://packaging.python.org/en/latest/distributing.html
https://github.com/pypa/sampleproject
"""
import os

from setuptools import setup, find_packages

# pylint: disable=redefined-builtin

here = os.path.abspath(os.path.dirname(__file__))

with open(os.path.join(here, "requirements.txt"), encoding="utf-8") as fid:
    install_requires = [line for line in fid.read().splitlines() if line.strip()]

setup(
    name="aas-core3.0rc02-react-editor-codegen",
    version="0.0.1",
    license="License :: OSI Approved :: MIT License",
    keywords="asset administration shell code generation industry 4.0 industrie i4.0",
    packages=find_packages(exclude=["continuous_integration"]),
    install_requires=install_requires,
    # fmt: off
    extras_require={
        "dev": [
            "black==22.12.0",
            "mypy==0.991",
            "pylint==2.15.10",
            "coverage>=7.1.0,<8",
        ]
    }
)
