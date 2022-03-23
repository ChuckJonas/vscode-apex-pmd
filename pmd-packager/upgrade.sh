VERSION=$(curl -s https://api.github.com/repos/pmd/pmd/releases/latest | grep '.tag_name' | sed 's:.*/::' | sed 's:",::')
echo $VERSION
echo -n $VERSION > pmd-version.txt
sed -i "" "s|version\>[0-9\.]*\<|version>$VERSION<|g" pom.xml
#./mvnw clean package -Dpmd.dist.bin.baseDirectory=pmd -Dpmd.version=$VERSION
rm -rf ../bin/pmd/*
#bsdtar --strip-components=1 -xvf target/pmd.zip -C ../bin/pmd

DOWNLOAD_URL="https://github.com/pmd/pmd/releases/download/pmd_releases%2F$VERSION/pmd-bin-$VERSION.zip"
echo "url=${DOWNLOAD_URL}"

#curl -O https://github.com/pmd/pmd/releases/download/pmd_releases%2F$VERSION/pmd-bin-$VERSION.zip
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
curl $DOWNLOAD_URL -L -o ${DIR}/pmd.zip
bsdtar --strip-components=1 -xvf ${DIR}/pmd.zip -C ${DIR}/pmd
rm ${DIR}/pmd.zip