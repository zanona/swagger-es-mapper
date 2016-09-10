module.exports = function (defs, type) {
  const mappings = {};
  function parseField(field, oField) {
    const oFormat = oField.format || '',
          fieldType = oField.type;

    if (oField.properties) {
      field.properties = {};
      return parseProps(field.properties, oField.properties);
    }
    if (oField.type === 'array') {
      if (oField.items.properties) {
        field.type = 'nested';
        field.properties = {};
        /*eslint no-use-before-define: 0*/
        return parseProps(field.properties, oField.items.properties);
      } else {
        return parseField(field, oField.items);
      }
    }

    field.type = fieldType;
    if (oFormat.match(/float|double|byte|integer|long/)) { field.type = oFormat; }
    if (oFormat.match(/^geo_/))          { field.type  =  oFormat; }
    if (oFormat.match(/date|date-time/)) { field.type  = 'date'; }
    if (oFormat.match(/uuid|email/))     { field.index = 'not_analyzed'; }
    if (oFormat === 'uri')               { field.index = 'no'; }

    Object.assign(field, oField['x-es']);

    // ENABLE DOC_VALUES ON
    // NUMERIC, DATE, BOOLEAN, BINARY, GEO AND NOT-ANALYZED STRINGS
    // BY DEFAULT
    // NO NEED IN ES 2.x
    // if (field.index === 'not_analyzed'
    //  || field.type.match(/byte|short|integer|long|float|double|boolean|date|geo/)
    // ) { field.doc_values = true; }
  }
  function parseProps(props, oProps) {
    Object.keys(oProps).forEach((fieldName) => {
      props[fieldName] = {};
      const field = props[fieldName],
            oField = oProps[fieldName];
      if (oField['x-es'] && oField['x-es'].type === 'completion') {
        props[fieldName] = Object.assign(field, oField['x-es']);
        return;
      }
      parseField(field, oField);
    });
  }
  function parseType($type) {
    mappings[$type.toLowerCase()] = {};
    const model = mappings[$type.toLowerCase()];
    var props, oProps;

    //Add before properties so es attrs are displayed first
    Object.assign(model, defs[$type]['x-es']);

    model.properties = {};
    props = model.properties;
    oProps = defs[$type].properties;

    parseProps(props, oProps);
  }
  type ? parseType(type) : Object.keys(defs).forEach(parseType);
  return { mappings };
};
