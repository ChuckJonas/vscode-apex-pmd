VERSION=$(curl -s https://api.github.com/repos/pmd/pmd/releases/latest | grep '.tag_name' | sed 's:.*/::' | sed 's:",::')
echo $VERSION

printf '%s' "$VERSION" > ./bin/pmd-version.txt
sed -i "" "s|version\>[0-9\.]*\<|version>$VERSION<|g" ./pmd-packager/pom.xml

# Keep the following lines for when we allow the user to override the PMD version used or we force the latest version
# DOWNLOAD_URL="https://github.com/pmd/pmd/releases/download/pmd_releases%2F$VERSION/pmd-bin-$VERSION.zip"
# DOWNLOAD_URL=$(curl -s https://api.github.com/repos/pmd/pmd/releases/latest | grep -m 1 '.browser_download_url' | sed 's:.*http:http:' | sed 's:",::' | sed 's:"::')
# echo "url=${DOWNLOAD_URL}"

