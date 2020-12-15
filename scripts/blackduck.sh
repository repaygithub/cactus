#!/bin/bash
set -eo pipefail

echo 'Testing -- is this the token?'
echo ${BLACKDUCK_TOKEN}

bash <(curl -s -L https://detect.synopsys.com/detect.sh) \
    --detect.source.path=${WORKSPACE} \
    --detect.yarn.prod.only=true \
    --detect.project.name="github.com/repaygithub/cactus" \
    --detect.project.version.name="master" \
    --detect.code.location.name="cactus" \
    --detect.project.version.phase="RELEASED" \
    --blackduck.url="https://repay.blackducksoftware.com" \
    --blackduck.api.token=${BLACKDUCK_TOKEN} \
    --detect.project.version.distribution=SAAS \
    --detect.cleanup=true \