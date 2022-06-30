
const graphqlFields = require('graphql-fields');
import { difference, union } from 'lodash';

export class RequestedFields{

    getFields(info, options) {
        let fields = Object.keys(graphqlFields(info))        
        if(!options){ return fields}
        fields = (options.keep) ? union(fields,options.keep) : fields        
        return (options.exclude)
            ? difference(fields, options.exclude)
            : fields;
    }

    getFieldsWithSubfields(info, options) {        
        const graphqlfields = graphqlFields(info, {}, { processArguments: true })
        const keys = Object.keys(graphqlfields)        
        const map = new Map()  
        let fields;
        let transformed;
        keys.forEach(k => {               
            fields = Object.keys(graphqlfields[k])
            transformed = (options.keep) ? union(fields,options.keep) : fields
            transformed = (options.exclude) ? difference(fields, options.exclude) : transformed;
            map.set(k, transformed)
        })      
        return map;
    }        

}