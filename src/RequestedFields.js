
const graphqlFields = require('graphql-fields');
import { difference, union, snakeCase } from 'lodash';

export class RequestedFields{

    getFields(info, options) {
        let fields = Object.keys(graphqlFields(info))
        fields = fields.map(f => snakeCase(f))   
           
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
            fields = fields.map(f => snakeCase(f))  
            transformed = (options.keep) ? union(fields,options.keep) : fields
            transformed = (options.exclude) ? difference(fields, options.exclude) : transformed;
            map.set(k, transformed)
        })      
        return map;
    }        

}