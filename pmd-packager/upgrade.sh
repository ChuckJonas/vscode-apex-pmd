VERSION=$(curl -s https://api.github.com/repos/pmd/pmd/releases/latest | jq --raw-output ".tag_name" | sed 's:.*/::')
VERSION="6.55.0"
echo $VERSION
./mvnw clean package -Dpmd.dist.bin.baseDirectory=pmd -Depmd.version=$VERSION
rm -rf ../bin/pmd/*
# tar --strip-components=1 -xvf target/pmd.zip -C ../bin/pmd
unzip target/pmd.zip && mv pmd ../bin