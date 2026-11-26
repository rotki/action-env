# rotki/action-env

Loads the variables from a `.env` file into the job environment.

The action parses the file with Node's built-in
[`util.parseEnv`](https://nodejs.org/api/util.html#utilparseenvcontent) and exports every
variable through `GITHUB_ENV`, so the steps that run after it can read them. The step that runs
the action does not see them.

The step fails when the file does not exist or contains no variables.

## Inputs

| Input      | Required | Description                                         |
| ---------- | -------- | --------------------------------------------------- |
| `env_file` | yes      | Path to the `.env` file, relative to the workspace. |

## Usage

```yaml
steps:
  - uses: actions/checkout@v7
    with:
      persist-credentials: false

  - uses: rotki/action-env@v4
    with:
      env_file: .github/.env

  - run: echo "$EXAMPLE"
```

## File format

The usual `.env` syntax works:

```dotenv
# comments and blank lines are skipped
PLAIN=value
export EXPORTED=value
SINGLE='single quoted'
DOUBLE="double quoted, \n becomes a new line"
MULTILINE="first line
second line"
TRAILING=value # inline comments are removed
```

Values are taken as written. References such as `${OTHER}` are not expanded.

## Development

The action needs Node 24 and pnpm 12.

```bash
pnpm install
pnpm run all
```

`pnpm run all` type checks, lints, bundles `src/` into `dist/` with Rollup and runs the tests.
Commit the rebuilt `dist/` with your change; the `Check dist/` workflow fails when it is out of
date.

Maintainers and coding agents should also read [AGENTS.md](./AGENTS.md), which covers dependency
updates, workflow checks and releases.

## License

[AGPL-3.0](./LICENSE) License &copy; 2022- [Rotki Solutions GmbH](https://github.com/rotki)
