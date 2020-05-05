# Apex-only Distribution

Sample project which shows how to create a binary distribution stripped down to one language module (Apex).
The difference with other branches in this repo is that this only repackages the pmd distribution without adding new rules. This may be useful in tools that integrate PMD, eg IDE plugins.

You can build the project using maven:

```
$ ./mvnw clean verify
```

This results in a zip file: `target/pmd-apex-bin-6.23.0.zip`. It can be installed [like any pmd distribution](https://pmd.github.io/latest/pmd_userdocs_installation.html#installation) but only contains the Apex module (and no designer).

## Customize the build

### PMD Version

The PMD version is controlled by the property `pmd.version` in the pom.xml. It's set to 6.23.0 by default, but you can change that:
* To build a specific version: `./mvnw clean package -Dpmd.version=6.25.0`
* To update the property to the latest released version: `./mvnw versions:update-properties` (this will modify the pom file)

### Dependencies


The dependencies are described here in the [`/project/dependencies`](pom.xml#L81-L87) element in the pom.xml.

Maven resolves the necessary transitive dependencies itself and packs only those.

To add a dependency on another PMD module, first find out the maven artifact ID of the module (eg `pmd-visualforce` for the VF language). Then you can add a `dependency` element under `/project/dependencies` in the pom:
```xml
    <dependency>
      <groupId>net.sourceforge.pmd</groupId>
      <artifactId>pmd-visualforce</artifactId>
      <version>${pmd.version}</version>
    </dependency>
```

Rebuild the project `./mvnw clean verify` to update the build.

### ZIP name

The final ZIP name is controlled by the property `pmd.dist.zipName`. On the maven command-line, this is overridable like so:

```
./mvnw clean verify -Dpmd.dist.zipName=pmd
```

This will build a zip named `pmd.zip`. The default value of this property includes the `pmd.version` used, which might not be what you want.













