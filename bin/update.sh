DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo $DIR

VERSION=$(<${DIR}/pmd-packager/pmd-version.txt)

DOWNLOAD_URL="https://github.com/pmd/pmd/releases/download/pmd_releases%2F$VERSION/pmd-bin-$VERSION.zip"
echo "version=${VERSION}"
echo "url=${DOWNLOAD_URL}"

#./mvnw clean package -Dpmd.dist.bin.baseDirectory=pmd -Dpmd.version=$VERSION
rm -rf ${DIR}/pmd/*
#bsdtar --strip-components=1 -xvf target/pmd.zip -C ../bin/pmd

curl ${DOWNLOAD_URL} -L -o ../bin/pmd.zip
bsdtar --strip-components=1 -xvf ../bin/pmd.zip -C ../bin/pmd
rm ../bin/pmd.zip