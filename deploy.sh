/bin/bash

npm install -g serverless
npm install serverless-offline serverless-stack-output

serverless deploy --stage $env --package $CODEBUILD_SRC_DIR/artifacts/dev -v