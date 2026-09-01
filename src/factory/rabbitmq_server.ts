import { connect, Connection, Channel } from "amqplib";

export default class RabbitmqServer {
    uri: string;
    conn?: Connection;
    channel?: Channel;

    constructor(uri: string) {
        this.uri = uri;
    }

    async start() {
        this.conn = await connect(this.uri);
        this.channel = await this.conn.createChannel();
        return this;
    }

    async publishInQueue(queue: string, message: string) {
        return this.channel?.sendToQueue(queue, Buffer.from(message));
    }

    async publishInExchange(exchange: string, routingKey: string, message: string) {
        return this.channel?.publish(exchange, routingKey, Buffer.from(message));
    }

    async consume(queue: string, callback: (msg: any) => void, prefetchCount: number = 10) {
        if (this.channel && prefetchCount > 0) {
            await this.channel.prefetch(prefetchCount);
        }
        return this.channel?.consume(queue, message => {
            if (message) {
                callback(message);
                this.channel?.ack(message);
            }
        });
    }
}