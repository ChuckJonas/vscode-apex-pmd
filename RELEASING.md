# Releasing

Steps to do when releasing a new version of this extension. These steps can be automated.

## Preparation

0. Review the current `CHANGELOG.md`: Is it complete? Are there (breaking) changes, that would require to bump the
    major version?

1. Define the version that shall be released. This is referenced as `RELEASE_VERSION` later on.
    ```shell
    RELEASE_VERSION=x.y.z
    NEXT_VERSION=x.y.z+1
    RELEASE_DATE=$(date +%Y-%m-%d)
    ```
2. Update `package.json` with `RELEASE_VERSION`, run `npm install` in order to update `package-lock.json`:

    ```shell
    npx json --in-place -f package.json -e "this.version=\"${RELEASE_VERSION}\""
    npm install
    ```
3. Update `CHANGELOG.md` - replace `[Unreleased]` with `[RELEASE_VERSION] - YYYY-MM-DD`.

    ```shell
    sed -i "s/^## \[Unreleased\]/## [${RELEASE_VERSION}] - ${RELEASE_DATE}/" CHANGELOG.md
    sed -i "s/^\(\*\*Full Changelog\*\*: https:\/\/github.com\/ChuckJonas\/vscode-apex-pmd\/compare\/v[0-9]\+\.[0-9]\+\.[0-9]\+\.\.\.\)HEAD$/\1v${RELEASE_VERSION}/" CHANGELOG.md
    ```
4. Commit the changes to master branch and create a new tag. The tag is `RELEASE_VERSION` prefixed with `v`.
    
    ```shell
    git add --update
    git commit -m "v${RELEASE_VERSION}"
    git tag "v${RELEASE_VERSION}"
    ```
5. Update `package.json` with the next development version, e.g. if RELEASE_VERSION is 0.6.2, then
    the next version is 0.6.3-snapshot.0. Run `npm install`.
    
    ```shell
    npx json --in-place -f package.json -e "this.version=\"${NEXT_VERSION}-snapshot.0\""
    npm install
    ```
6. Update `CHANGELOG.md` and add a new `[Unreleased]` section:

    ```
    ## [Unreleased]

    ### Added
    ### Changed
    ### Deprecated
    ### Removed
    ### Fixed
    ### New Contributors

    **Full Changelog**: https://github.com/ChuckJonas/vscode-apex-pmd/compare/v${RELEASE_VERSION}...HEAD
    ```

    As a script:

    ```shell
    START=$(grep -n -E "^## " CHANGELOG.md | head -1 | cut -d ':' -f 1)
    START=$((START - 1))
    INTRO=$(head -n "$START" CHANGELOG.md)
    REST=$(tail -n "+$START" CHANGELOG.md)
    echo "${INTRO}

    ## [Unreleased]

    ### Added
    ### Changed
    ### Deprecated
    ### Removed
    ### Fixed
    ### New Contributors

    **Full Changelog**: https://github.com/ChuckJonas/vscode-apex-pmd/compare/v${RELEASE_VERSION}...HEAD
    ${REST}" > CHANGELOG.md
    ```

7. Commit the changes to master branch.

    ```shell
    git add --update
    git commit -m "Prepare next development version v${NEXT_VERSION}"
    ```

## Perform the release
1. Push the changes and the tag. Wait for Github Actions to build the extension. Download the extension from Github Actions workflow.
    ```shell
    git push origin master
    git push origin tag "v${RELEASE_VERSION}
    ```
2. Create a new Release on github based on the tag. Copy the release notes from `CHANGELOG.md`, upload the
    extension package `apex-pmd-RELEASE_VERSION.vsix`.
    - Manual: Go to <https://github.com/ChuckJonas/vscode-apex-pmd/releases/new>
    - When automated, we can use [softprops/action-gh-release](https://github.com/softprops/action-gh-release)
3. Publish the extension in Visual Studio Code Marketplace
    - Manual: Go to <https://marketplace.visualstudio.com/manage/publishers/chuckjonas>
    - Using a script:
    ```shell
    export VSCE_PAT=....
    npx vsce login
    npx vsce publish --packagePath apex-pmd-${RELEASE_VERSION}.vsix
    ```
