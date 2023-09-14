#!/bin/bash

rm -rf target
mkdir -p target
javac -cp "../../../../bin/pmd/lib/*" -d target --release 8 src/org/example/pmd/apex/MyCustomRule.java
jar --create --verbose --file custom-apex-pmd-rules.jar -C target org/example/pmd/apex/MyCustomRule.class
