VERSION=$(curl -s https://api.github.com/repos/pmd/pmd/releases/latest | grep '.tag_name' | sed 's:.*/::' | sed 's:",::')
echo $VERSION
echo -n $VERSION > pmd-packager/pmd-version.txt
sed -i "" "s|version\>[0-9\.]*\<|version>$VERSION<|g" pmd-packager/pom.xml
./mvnw clean package -Dpmd.dist.bin.baseDirectory=pmd -Dpmd.version=$VERSION
rm -rf ../bin/pmd/*
bsdtar --strip-components=1 -xvf target/pmd.zip -C ../bin/pmd
