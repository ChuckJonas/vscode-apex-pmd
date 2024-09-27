#!/bin/bash

# exit with error on the first failing command
set -e

if [ "$1" = "latest" ]; then
    VERSION=$(curl -s https://api.github.com/repos/pmd/pmd/releases/latest | jq --raw-output '.tag_name | sub("pmd_releases/"; "")')
elif [ -z "$1" ] && [ -n "$npm_package_config_pmdVersion" ]; then
    # shellcheck disable=SC2154
    # npm provides the package.json as environment variables, but in lowercase
    VERSION="$npm_package_config_pmdVersion"
elif [ -n "$1" ]; then
    # using explicit VERSION
    VERSION="$1"
else
    echo "$0 [latest|7.6.0|....]"
    exit 1
fi

BASEDIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASEDIR"

TARGETDIR="$BASEDIR/../bin/pmd"
echo "Creating custom PMD $VERSION package in '$TARGETDIR' ..."

if [ -e "$TARGETDIR/VERSION" ]; then
    LOCALVERSION="$(cat "$TARGETDIR/VERSION")"
fi

if [ "$LOCALVERSION" = "$VERSION" ]; then
    echo "skipping - $LOCALVERSION is already prepared"
    exit 0
fi

rm -rf "$TARGETDIR"
mkdir -p "$TARGETDIR"
./mvnw --no-transfer-progress clean package -Dpmd.dist.bin.baseDirectory=pmd -Dpmd.version="$VERSION"
unzip -d "$TARGETDIR/.." -q target/pmd.zip
echo "$VERSION" > "$TARGETDIR/VERSION"
npm pkg set config.pmdVersion="$VERSION"
