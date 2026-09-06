import { getTestApp, setupE2EDatabase, graphqlRequest, request } from './helpers/e2e_setup';
import { Express } from 'express';

describe('E2E: Social, Conexões, Mensageria, Feed, Grupos e Eventos (100% de Cobertura)', () => {
  let app: any;
  let tokens: any;
  let candidateUserId: number = 1;
  let companyUserId: number = 2;

  let createdPostId: string;
  let createdCommentId: string;
  let connectionRequestId: string;
  let directMessageId: string;
  let createdGroupId: string;
  let createdEventId: string;

  beforeAll(async () => {
    app = getTestApp();
    tokens = await setupE2EDatabase();
  });

  describe('1. Fluxo Social Feed, Posts, Reações e Comentários', () => {
    it('deve criar um post na rede social via createPost', async () => {
      const mutation = `
        mutation CreatePost($authorId: ID!, $content: String!) {
          createPost(authorId: $authorId, content: $content) {
            id
            authorId
            content
            reactionsCount
            commentsCount
          }
        }
      `;

      const res = await graphqlRequest(app, mutation, {
        authorId: String(candidateUserId),
        content: 'Olá comunidade Workix! Iniciando nova jornada de testes E2E completos.'
      }, tokens.candidateToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.createPost).toBeDefined();
      expect(res.body.data.createPost.content).toContain('Workix');
      createdPostId = res.body.data.createPost.id;
    });

    it('deve consultar o feed social via socialFeed', async () => {
      const query = `
        query SocialFeed($userId: ID!) {
          socialFeed(userId: $userId) {
            id
            authorId
            content
          }
        }
      `;

      const res = await graphqlRequest(app, query, {
        userId: String(candidateUserId)
      }, tokens.candidateToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.socialFeed).toBeDefined();
      expect(Array.isArray(res.body.data.socialFeed)).toBe(true);
      expect(res.body.data.socialFeed.length).toBeGreaterThan(0);
    });

    it('deve reagir a um post via reactToPost', async () => {
      const mutation = `
        mutation ReactToPost($postId: ID!, $userId: ID!, $type: String!) {
          reactToPost(postId: $postId, userId: $userId, type: $type) {
            id
            postId
            userId
            type
          }
        }
      `;

      const res = await graphqlRequest(app, mutation, {
        postId: createdPostId,
        userId: String(companyUserId),
        type: 'LIKE'
      }, tokens.companyToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.reactToPost).toBeDefined();
      expect(res.body.data.reactToPost.type).toBe('LIKE');
    });

    it('deve comentar em um post via commentOnPost e listar comentários via postComments', async () => {
      const commentMutation = `
        mutation CommentOnPost($postId: ID!, $authorId: ID!, $content: String!) {
          commentOnPost(postId: $postId, authorId: $authorId, content: $content) {
            id
            postId
            authorId
            content
          }
        }
      `;

      const resComment = await graphqlRequest(app, commentMutation, {
        postId: createdPostId,
        authorId: String(companyUserId),
        content: 'Parabéns pela iniciativa de qualidade!'
      }, tokens.companyToken);

      expect(resComment.status).toBe(200);
      expect(resComment.body.data.commentOnPost).toBeDefined();
      createdCommentId = resComment.body.data.commentOnPost.id;

      const queryComments = `
        query PostComments($postId: ID!) {
          postComments(postId: $postId) {
            id
            content
            authorId
          }
        }
      `;

      const resList = await graphqlRequest(app, queryComments, {
        postId: createdPostId
      }, tokens.candidateToken);

      expect(resList.status).toBe(200);
      expect(resList.body.data.postComments.length).toBeGreaterThan(0);
      expect(resList.body.data.postComments[0].content).toContain('qualidade');
    });
  });

  describe('2. Fluxo de Conexões e Networking', () => {
    it('deve enviar solicitação de conexão via sendConnectionRequest', async () => {
      const mutation = `
        mutation SendRequest($requesterId: ID!, $recipientId: ID!) {
          sendConnectionRequest(requesterId: $requesterId, recipientId: $recipientId) {
            id
            requesterId
            recipientId
            status
          }
        }
      `;

      const res = await graphqlRequest(app, mutation, {
        requesterId: String(candidateUserId),
        recipientId: String(companyUserId)
      }, tokens.candidateToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.sendConnectionRequest).toBeDefined();
      connectionRequestId = res.body.data.sendConnectionRequest.id;
    });

    it('deve listar solicitações pendentes e aceitar via acceptConnectionRequest', async () => {
      const query = `
        query PendingRequests($userId: ID!) {
          pendingConnectionRequests(userId: $userId) {
            id
            requesterId
            recipientId
            status
          }
        }
      `;

      const resQuery = await graphqlRequest(app, query, {
        userId: String(companyUserId)
      }, tokens.companyToken);

      expect(resQuery.status).toBe(200);
      expect(resQuery.body.data.pendingConnectionRequests.length).toBeGreaterThan(0);

      const acceptMutation = `
        mutation AcceptRequest($requestId: ID!, $recipientId: ID!) {
          acceptConnectionRequest(requestId: $requestId, recipientId: $recipientId) {
            id
            userId1
            userId2
          }
        }
      `;

      const resAccept = await graphqlRequest(app, acceptMutation, {
        requestId: connectionRequestId,
        recipientId: String(companyUserId)
      }, tokens.companyToken);

      expect(resAccept.status).toBe(200);
      expect(resAccept.body.data.acceptConnectionRequest).toBeDefined();
    });

    it('deve listar conexões ativas via myConnections', async () => {
      const query = `
        query MyConnections($userId: ID!) {
          myConnections(userId: $userId) {
            id
            userId1
            userId2
          }
        }
      `;

      const res = await graphqlRequest(app, query, {
        userId: String(candidateUserId)
      }, tokens.candidateToken);

      expect(res.status).toBe(200);
      expect(res.body.data.myConnections.length).toBeGreaterThan(0);
    });
  });

  describe('3. Fluxo de Mensageria Direta (Chat)', () => {
    it('deve enviar uma mensagem direta via sendDirectMessage', async () => {
      const mutation = `
        mutation SendDM($senderId: ID!, $recipientId: ID!, $content: String!) {
          sendDirectMessage(senderId: $senderId, recipientId: $recipientId, content: $content) {
            id
            senderId
            recipientId
            content
            read
          }
        }
      `;

      const res = await graphqlRequest(app, mutation, {
        senderId: String(candidateUserId),
        recipientId: String(companyUserId),
        content: 'Olá, tenho interesse na vaga publicada!'
      }, tokens.candidateToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.sendDirectMessage).toBeDefined();
      expect(res.body.data.sendDirectMessage.content).toContain('interesse na vaga');
      expect(res.body.data.sendDirectMessage.read).toBe(false);
      directMessageId = res.body.data.sendDirectMessage.id;
    });

    it('deve listar histórico de mensagens diretas via directMessages', async () => {
      const query = `
        query GetDMs($userId1: ID!, $userId2: ID!) {
          directMessages(userId1: $userId1, userId2: $userId2) {
            id
            senderId
            recipientId
            content
            read
          }
        }
      `;

      const res = await graphqlRequest(app, query, {
        userId1: String(candidateUserId),
        userId2: String(companyUserId)
      }, tokens.candidateToken);

      expect(res.status).toBe(200);
      expect(res.body.data.directMessages.length).toBeGreaterThan(0);
    });

    it('deve marcar mensagem como lida via markDirectMessageAsRead', async () => {
      const mutation = `
        mutation MarkRead($messageId: ID!, $recipientId: ID!) {
          markDirectMessageAsRead(messageId: $messageId, recipientId: $recipientId) {
            id
            read
          }
        }
      `;

      const res = await graphqlRequest(app, mutation, {
        messageId: directMessageId,
        recipientId: String(companyUserId)
      }, tokens.companyToken);

      expect(res.status).toBe(200);
      expect(res.body.data.markDirectMessageAsRead.read).toBe(true);
    });
  });

  describe('4. Fluxo de Notificações', () => {
    it('deve listar notificações do usuário e marcar como lida', async () => {
      const query = `
        query GetNotifications($userId: ID!) {
          myNotifications(userId: $userId) {
            id
            title
            body
            read
          }
          unreadNotificationsCount(userId: $userId)
        }
      `;

      const res = await graphqlRequest(app, query, {
        userId: String(companyUserId)
      }, tokens.companyToken);

      expect(res.status).toBe(200);
      expect(res.body.data.myNotifications).toBeDefined();
    });
  });

  describe('5. Fluxo de Comunidades e Grupos', () => {
    it('deve criar um grupo via createGroup e publicar via createGroupPost', async () => {
      const createMutation = `
        mutation CreateGroup($ownerId: ID!, $name: String!, $description: String, $privacy: String) {
          createGroup(ownerId: $ownerId, name: $name, description: $description, privacy: $privacy) {
            id
            name
            description
            privacy
          }
        }
      `;

      const resCreate = await graphqlRequest(app, createMutation, {
        ownerId: String(companyUserId),
        name: 'Tech Leaders & Developers',
        description: 'Grupo exclusivo para discussões sobre engenharia de software.',
        privacy: 'PUBLIC'
      }, tokens.companyToken);

      expect(resCreate.status).toBe(200);
      expect(resCreate.body.data.createGroup).toBeDefined();
      expect(resCreate.body.data.createGroup.name).toBe('Tech Leaders & Developers');
      createdGroupId = resCreate.body.data.createGroup.id;

      // Candidato entra no grupo
      const joinMutation = `
        mutation JoinGroup($groupId: ID!, $userId: ID!) {
          joinGroup(groupId: $groupId, userId: $userId) {
            id
            groupId
            userId
            status
          }
        }
      `;

      const resJoin = await graphqlRequest(app, joinMutation, {
        groupId: createdGroupId,
        userId: String(candidateUserId)
      }, tokens.candidateToken);

      expect(resJoin.status).toBe(200);
      expect(resJoin.body.data.joinGroup).toBeDefined();

      // Posta no grupo
      const postMutation = `
        mutation CreateGroupPost($groupId: ID!, $authorId: ID!, $content: String!) {
          createGroupPost(groupId: $groupId, authorId: $authorId, content: $content) {
            id
            groupId
            content
          }
        }
      `;

      const resPost = await graphqlRequest(app, postMutation, {
        groupId: createdGroupId,
        authorId: String(candidateUserId),
        content: 'Qual a opinião de vocês sobre TDD no ecossistema Node/TS?'
      }, tokens.candidateToken);

      expect(resPost.status).toBe(200);
      expect(resPost.body.data.createGroupPost.content).toContain('TDD');
    });
  });

  describe('6. Fluxo de Eventos e Webinars', () => {
    it('deve criar um evento via createEvent e registrar participante via attendEvent', async () => {
      const createEventMutation = `
        mutation CreateEvent($organizerId: ID!, $title: String!, $description: String, $eventType: String, $startTime: DateTime!, $locationOrUrl: String) {
          createEvent(organizerId: $organizerId, title: $title, description: $description, eventType: $eventType, startTime: $startTime, locationOrUrl: $locationOrUrl) {
            id
            title
            eventType
            locationOrUrl
          }
        }
      `;

      const resEvent = await graphqlRequest(app, createEventMutation, {
        organizerId: String(companyUserId),
        title: 'Workix Tech Summit 2026',
        description: 'Conferência online sobre carreiras e desenvolvimento.',
        eventType: 'ONLINE',
        startTime: new Date(Date.now() + 86400000).toISOString(),
        locationOrUrl: 'https://meet.workix.com/summit'
      }, tokens.companyToken);

      expect(resEvent.status).toBe(200);
      expect(resEvent.body.data.createEvent).toBeDefined();
      createdEventId = resEvent.body.data.createEvent.id;

      // Confirma presença
      const attendMutation = `
        mutation AttendEvent($eventId: ID!, $userId: ID!, $status: String) {
          attendEvent(eventId: $eventId, userId: $userId, status: $status) {
            id
            eventId
            userId
            status
          }
        }
      `;

      const resAttend = await graphqlRequest(app, attendMutation, {
        eventId: createdEventId,
        userId: String(candidateUserId),
        status: 'CONFIRMED'
      }, tokens.candidateToken);

      expect(resAttend.status).toBe(200);
      expect(resAttend.body.data.attendEvent.status).toBe('CONFIRMED');
    });
  });
});
