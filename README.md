# aas-core3.0rc02-react-editor

Edit AAS files (serialized as JSON) without bells and whistles.

## Usage

TODO

## Contributing Guide

### Issues

Please report bugs or feature requests by [creating GitHub issues].

[creating GitHub issues]: https://github.com/aas-core-works/aas-core3.0rc02-react-editor/issues

### In Code

If you want to contribute in code, pull requests are welcome!

Please do [create a new issue] before you dive into coding.
It can well be that we already started working on the feature, or that there are upstream or downstream complexities involved which you might not be aware of.

[create a new issue]: https://github.com/aas-core-works/aas-core3.0rc02-react-editor/issues

#### Coding Guidelines

We use [eslint] and [prettier] for code style and formatting.

[eslint]: https://eslint.org/
[prettier]: https://prettier.io/

##### Imports

We import all the external libraries and prefix them with the name of the library.
We do *not* directly import symbols from external libraries.
This makes the code easier to follow assuming that not all the readers are familiar with all the external libraries.

The `react` library is imported as `React` (`import * as React from 'react'`).
We found this to be a widespread practice on Internet.

Symbols from *the same directory* are imported without a qualified name prefix.
All the internal modules are imported with the qualified name prefix.

Here is an example:
```typescript
import * as aas from '@aas-core-works/aas-core3.0rc02-typescript'
import * as React from 'react'

import * as model from '../../model'
import * as newinstancing from '../../newinstancing.generated'

import {HelpLink} from './HelpLink'
import {ListItem} from './ListItem'
```

If an imported module name conflicts with many names in the importee module, append `Module`.
For example, `import * as fieldsModule from './components/fields'`.
In general, avoid this as much as possible for readability.

##### Casing

Components and their file names are written in upper `CamelCase`.

Non-UI modules are written all `lowercase`, without separators.

CSS classes are written in `kebab-case`.
They are all prefixed with `aas-*`.

### Assets

Since we use [Vite] and want to publish the app as a web page which could be used off-line from a file system, we want to embed all the assets in the distribution.
Therefore, we put all the assets in `src/assets/` directory, and bundle them automatically with Vite.
This is implemented in [vite.config.ts](vite.config.ts) by including `viteSingleFile` plugin and setting `renderBuiltUrl`.

### Run the Development Server

We use `npm` to manage dependencies.

Install dependencies with:

```
npm install
```

Run the development server:

```
npm run dev
```

... and follow the instructions on the screen.

### Generate Code

See [codegen/README.md](codegen/README.md) for how to generate the code based on the AAS meta-model.

### Pre-commit Checks

Please run:

```
npm run lint && npm run build && npm run test
```

... before every commit.

To automatically re-format the code:

```
npm run format
```

### Pull Requests

**Feature branches.** We develop using the feature branches, see [this section of the Git book].

[this section of the Git book]: https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows

If you are a member of the development team, create a feature branch directly within the repository.

Otherwise, if you are a non-member contributor, fork the repository and create the feature branch in your forked repository.
See [this GitHub tutorial] for more guidance.

[this GitHub tutorial]: https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork

**Branch Prefix.** Please prefix the branch with your Github user name (*e.g.*, `mristin/Add-some-feature`).

**Continuous Integration.** GitHub will run the continuous integration (CI) automatically through GitHub actions.
The CI includes running the tests, inspecting the code, re-building the documentation *etc.*

### Commit Message

The commit messages follow the guidelines from https://chris.beams.io/posts/git-commit:

* Separate subject from body with a blank line,
* Limit the subject line to 50 characters,
* Capitalize the subject line,
* Do not end the subject line with a period,
* Use the imperative mood in the subject line,
* Wrap the body at 72 characters, and
* Use the body to explain *what* and *why* (instead of *how*).

## Changelog

TODO