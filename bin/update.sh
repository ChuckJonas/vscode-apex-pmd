DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
rm -rf ${DIR}/pmd/*
VERSION=$(curl -s https://api.github.com/repos/pmd/pmd/releases/latest | jq --raw-output ".tag_name")
DOWNLOAD_URL=$(curl -s https://api.github.com/repos/pmd/pmd/releases/latest | jq --raw-output ".assets[].browser_download_url" | grep pmd-bin)
echo "version=${VERSION}"
echo "url=${DOWNLOAD_URL}"
curl $DOWNLOAD_URL -L -o ${DIR}/pmd.zip
bsdtar --strip-components=1 -xvf ${DIR}/pmd.zip -C ${DIR}/pmd
rm ${DIR}/pmd.zip
