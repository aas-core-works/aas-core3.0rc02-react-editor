# Code Generation

## Run

Change to `{repository root}/codegen/` directory.

Create a virtual environment on Windows and activate it:

```
python -m venv venv
venv\Scripts\activate
```

... or on Linux/Mac:

```
python -m venv venv
source venv/bin/activate
```

Install the dependencies.
The pinned aas-core-codegen has requirement specifiers in its `setup.py` which current pip, setuptools and wheel reject.
So first install older versions of these, and then install without build isolation, so that pip builds with them:

```
python -m pip install --upgrade "pip<24.1" "setuptools<67" "wheel<0.40"
pip3 install --no-build-isolation -e .
```

Run the main script:

```
python codegen/main.py
```

The files will be automatically overwritten in the correct location in the repository.

## Develop

Change to `{repository root}/codegen/` directory.

Create a virtual environment on Windows and activate it:

```
python -m venv venv
venv\Scripts\activate
```

... or on Linux/Mac:

```
python -m venv venv
source venv/bin/activate
```

Install the development dependencies.
The pinned aas-core-codegen has requirement specifiers in its `setup.py` which current pip, setuptools and wheel reject.
So first install older versions of these, and then install without build isolation, so that pip builds with them:

```
python -m pip install --upgrade "pip<24.1" "setuptools<67" "wheel<0.40"
pip3 install --no-build-isolation -e .[dev]
```

Develop.

Mark code which is specific to *this* version of the meta-model with `# SPECIFIC-IMPLEMENTATION` comment.
This helps future readers to distinguish between general generation and meta-model-specific bits.

Run your pre-commit checks:

```
python continuous_integration/precommit.py
```

For auto-healing (*e.g.*, automatic re-format), run:

```
python continuous_integration/precommit.py --overwrite
```
