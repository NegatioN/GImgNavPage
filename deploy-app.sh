#!/usr/bin/env bash
IMAGE_NAME=containers.schibsted.io/finntech/node-example-app
VERSION=$(git rev-parse HEAD)
SHA_TAG=$IMAGE_NAME:$VERSION
LATEST_TAG=$IMAGE_NAME:latest

docker build --pull --tag $SHA_TAG --tag $LATEST_TAG . \
  && docker push $SHA_TAG \
  && docker push $LATEST_TAG \
  && echo UPLOADED DOCKER IMAGE $SHA_TAG \
  && mvn deploy:deploy-file \
    -Durl=https://mavenproxy.finntech.no/finntech-internal-snapshot \
    -Dfile=fiaas.yml \
    -DgroupId=no.finntech.node-example-app \
    -DartifactId=node-example-app-fiaas \
    -Dversion=$VERSION-SNAPSHOT
