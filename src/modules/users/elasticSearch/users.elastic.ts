import UserDTO from '../../../dtos/UserDTO';
import client from '../../../factory/elastic_search_factory';
import { User } from '../../../models';

export const matchAnyFields = async term => {    
    const result = await client.search({
        index: 'users',
        body: {
            query: {
                multi_match: {
                    query: term,
                    fields: ['email', 'firebase_uuid', 'firebase_message_token']
                }
            }
        }
    })    

    const results = makeResponse(result)
    return results;
}

export const createIndex = async user => {
    const result = await client.index({
        index: 'users',
        id: user.uuid,
        body: user
    })
    return result;
}

export const deleteIndex = async userId => {
    const user = await User.findByPk(userId)

    const result = await client.delete({
        index: 'users',
        id: user.uuid
    })

    return result;

}

export const updateIndex = async user => {
    const result = await client.update({
        index: "users",
        type: "_doc",
        id: user.uuid,
        body: { doc: user }
      })
      return result
}

const makeResponse = rawResult => {
    const results = rawResult.body.hits.hits.map(i => ({ id: i['_id'], user: new UserDTO(i["_source"]), score: i['_score'] }))
    return results
}
