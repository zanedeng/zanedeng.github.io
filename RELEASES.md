# Releases

The release and versioning of our packages is done using [changesets](https://github.com/changesets/changesets).

Our CI is configured to automatically bump the version and publish the packages on all new commits in `master` branch that contains a new changeset added.

## Adding changesets

We use the `changeset-bot` to comment on PRs when a changeset is found or not.
In case the change you are making is only on documentation or you don't want to publish a new package version for the change, you don't need to do anything and can merge the PR once it's approved.

But in case you want a new version to be published, you will need to add a changeset, for that you can:

### Through CLI

- run `pnpm changeset` on the root of the repository.
- it starts a wizard showing packages that had changes from `master` branch, and which kind of bump should be applied (major, minor or patch), and also ask for a description of the change.
- it creates a file in the `.changeset` folder that needs to be commited to the branch.
- `changeset-bot` will show that information in its comment on the PR.
- when the PR is merged it will trigger the release job on our CI and a new version will be published.
