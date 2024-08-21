# Public Devops

This project is a wrapper of the more complex project @vega-studio/node-devops.

This has many of the same commands as that project, but has a reduced version of
helper methods and processes that exists in the vega-studio project.

If you wish to utilize the full toolset, please contact geniant at geniant.com
or one of it's team members for details on the full devops suite.

# Releasing this project

This project performs updates with some simple steps:

- Update `devops` version in `package.json`
- Run `bun run update` to update all files that are public for this project.
- Commit changes with a semver commit: (Release x.x.x)

Now to make the release official:

- Update the package.json version to match the devops version
- Tag the current commit

```sh
git tag -a <version> -m "Release <version"
```

- Push the tags and force push current state to the release branch

```sh
git push origin --tags
git push -f origin dev:release
```

- Run pr release to make the release PRs into main and dev for final sync

```sh
bun run pr release
```
