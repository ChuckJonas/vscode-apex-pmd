#!/bin/bash

# exit with error on the first failing command
set -e

VERSION="$1"
if [ -z "$VERSION" ]; then
    VERSION=$(curl -s https://api.github.com/repos/pmd/pmd/releases/latest | jq --raw-output ".tag_name" | sed 's:.*/::')
fi

TARGETDIR="../bin/pmd"
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
./mvnw clean package -Dpmd.dist.bin.baseDirectory=pmd -Dpmd.version="$VERSION"
unzip -d "$TARGETDIR/.." -q target/pmd.zip
echo "$VERSION" > "$TARGETDIR/VERSION"
npm pkg set config.pmdVersion="$VERSION"
