module.exports = function (defs) {
    var mappings = {};
    function parseField(field, oField) {
        var oFormat = oField.format || '',
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

        if (oFormat.match(/^geo_/)) {
            field.type = oFormat;
        }
        if (oFormat.match(/date|date-time/)) {
            field.type = 'date';
        }
        if (oFormat.match(/uuid|email/)) {
            field.index = 'not_analyzed';
        }
        if (oFormat === 'uri') {
            field.index = 'no';
        }
        Object.assign(field, oField['x-es']);
    }
    function parseProps(props, oProps) {
        Object.keys(oProps).forEach(function (fieldName) {
            props[fieldName] = {};
            var field = props[fieldName],
                oField = oProps[fieldName];
            parseField(field, oField);
        });
    }
    Object.keys(defs).forEach(function (type) {
        mappings[type.toLowerCase()] = {};
        var model = mappings[type.toLowerCase()],
            props,
            oProps;

        //Add before properties so es attrs are displayed first
        Object.assign(model, defs[type]['x-es']);

        model.properties = {};
        props = model.properties;
        oProps = defs[type].properties;

        parseProps(props, oProps);
    });
    return { mappings: mappings };
};
