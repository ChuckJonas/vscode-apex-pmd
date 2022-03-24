DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "DIR={$DIR}"

VERSION=$(<${DIR}/pmd-version.txt)
echo "VERSION=${VERSION}"

DOWNLOAD_URL="https://github.com/pmd/pmd/releases/download/pmd_releases%2F$VERSION/pmd-bin-$VERSION.zip"
echo "URL=${DOWNLOAD_URL}"

# ./mvnw clean package -Dpmd.dist.bin.baseDirectory=pmd -Dpmd.version=$VERSION
rm -rf ${DIR}/../bin/pmd/*
# bsdtar --strip-components=1 -xvf target/pmd.zip -C ../bin/pmd

curl ${DOWNLOAD_URL} -L -o ${DIR}/../bin/pmd.zip
bsdtar --strip-components=1 -xvf ${DIR}/../bin/pmd.zip -C ${DIR}/../bin/pmd
rm ${DIR}/../bin/pmd.zip