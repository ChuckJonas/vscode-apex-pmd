VERSION=$1
if [ -z "$VERSION" ]; then
    VERSION=$(curl -s https://api.github.com/repos/pmd/pmd/releases/latest | jq --raw-output ".tag_name" | sed 's:.*/::')
fi
echo $VERSION
./mvnw clean package -Dpmd.dist.bin.baseDirectory=pmd -Dpmd.version=$VERSION
rm -rf ../bin/pmd/*
bsdtar --strip-components=1 -xvf target/pmd.zip -C ../bin/pmd
