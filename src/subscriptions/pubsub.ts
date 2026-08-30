import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const NOTIFICATION_ADDED = 'NOTIFICATION_ADDED';
export const CHAT_MESSAGE_ADDED = 'CHAT_MESSAGE_ADDED';

export default pubsub;
