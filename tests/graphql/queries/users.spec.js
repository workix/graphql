import { request, gql } from 'graphql-request'

const endpoint = `http://localhost:4000/graphql`

describe("GRAPHQL - [Users]", () => {
    describe("Queries", () => {
        it("AllUsers with no Parameters", async () => {
            const query = gql`{
                users: allUsers {
                  id
                  createdAt
                  updatedAt
                  uuid
                  activated
                  email
                  firebaseMessageToken
                  firebaseUUID
                }
              }
              `
            const { users } = await request(endpoint, query)

            expect(users.length).toBeGreaterThanOrEqual(100);
            expect(users[0]).toHaveProperty('id');
            expect(users[0]).toHaveProperty('createdAt');
            expect(users[0]).toHaveProperty('updatedAt');
            expect(users[0]).toHaveProperty('uuid');
            expect(users[0]).toHaveProperty('activated');
            expect(users[0]).toHaveProperty('email');
            expect(users[0]).toHaveProperty('firebaseMessageToken');
            expect(users[0]).toHaveProperty('firebaseUUID');
        })

        it("AllUsers with Parameters", async () => {
          const query = gql`query AllUsersWithParams($start: Int, $max: Int) {
            users: allUsers(start: $start, max: $max) {
              id
              createdAt
              updatedAt
              uuid
              activated
              email
              firebaseMessageToken
              firebaseUUID
            }
          }
          `
          const { users } = await request(endpoint, query, {start: 0, max: 1})

          expect(users.length).toBeGreaterThan(0);
          expect(users.length).toBeLessThan(2);
          expect(users[0]).toHaveProperty('id');
          expect(users[0]).toHaveProperty('createdAt');
          expect(users[0]).toHaveProperty('updatedAt');
          expect(users[0]).toHaveProperty('uuid');
          expect(users[0]).toHaveProperty('activated');
          expect(users[0]).toHaveProperty('email');
          expect(users[0]).toHaveProperty('firebaseMessageToken');
          expect(users[0]).toHaveProperty('firebaseUUID');
      })
    })

    
})

