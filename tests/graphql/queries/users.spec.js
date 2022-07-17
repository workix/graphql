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
      const { users } = await request(endpoint, query, { start: 0, max: 1 })

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

    it("getUserById", async () => {
      const query = gql`query getUserById($id: ID!) {
          user: getUserById(id: $id) {
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
      const { user } = await request(endpoint, query, { id: 1 })

      expect(user).toHaveProperty('id', "1");
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
      expect(user).toHaveProperty('uuid');
      expect(user).toHaveProperty('activated');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('firebaseMessageToken');
      expect(user).toHaveProperty('firebaseUUID');
    })

    it("AllUsers paginated", async () => {
      const query = gql`query AllUsersPaginated($page: Int!, $limit: Int!) {
            paginated: allUsersPaginated(page: $page, limit: $limit) {
              users {
                id
                createdAt
                updatedAt
                uuid
                activated
                email
                firebaseMessageToken
                firebaseUUID
              }
              start
              end
              totalPages
              currentPage
              limitRows
              maxRows
            }
          }          
          `
      const { paginated } = await request(endpoint, query, { page: 1, limit: 10 })

      expect(paginated.users.length).toBeGreaterThan(0);
      expect(paginated.users.length).toBeLessThan(11);
      expect(paginated.users[0]).toHaveProperty('id');
      expect(paginated.users[0]).toHaveProperty('createdAt');
      expect(paginated.users[0]).toHaveProperty('updatedAt');
      expect(paginated.users[0]).toHaveProperty('uuid');
      expect(paginated.users[0]).toHaveProperty('activated');
      expect(paginated.users[0]).toHaveProperty('email');
      expect(paginated.users[0]).toHaveProperty('firebaseMessageToken');
      expect(paginated.users[0]).toHaveProperty('firebaseUUID');
    })




  })


})

