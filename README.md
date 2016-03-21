Swagger to Elasticsearch mapper
===

Convert your swagger model definitions to Elasticsearch mappings format.

    npm i zanona/swagger-es-mapper

```js
var map = require('swagger-es-mapper'),
    swaggerDefs = require('./swagger.json').definitions,
    esMappings = map(swaggerDefs); //just add to ES via PUT Index API
```

    npm i zanona/swagger-es-mapper -g
    swagger-es-mapper <path/to/swagger.json> <definitions-path> > mappings.json

In your Swagger defintiion, use the `x-es` extension for adding custom
configuration to your fields, like:

```yaml
...
definitions:
  User:
    properties:
      bio:     { type: string, x-es: { analyzer: english }}
      email:   { type: string, x-es: { index: not_analyzed }}
  Post:
    x-es:      { _parent:  { type: user }}
    properties:
      title:   { type: string, x-es: { analyzer: english }}
      picture: { type: string, format: uri }
...
```

By default, some field types and formats directly apply ES options as:

    type: string, format: [date|date-time]  => type: date
    type: string, format: geo_*  => type: geo_*
    type: string, format: uri    => index: no
    type: string, format: uuid   => index: not_analyzed
    type: string, format: email  => index: not_analyzed
