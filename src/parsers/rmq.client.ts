import * as amqp from "amqplib";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Represents an RabbitMQ client service for sending messages.
 */
@Injectable()
export class RmqClient {
    private readonly uri: string;

    private connections = new Map<string, { connection: amqp.Connection; channel: amqp.Channel }>();

    constructor(private readonly config: ConfigService) {
        this.uri = `amqp://${this.config.get("RABBIT_USER")}:${this.config.get("RABBIT_PASSWORD")}@${this.config.get(
            "RABBIT_HOST",
        )}:${this.config.get("RABBIT_PORT")}`;
    }

    private async createConnection(queue: string) {
        const connection = await amqp.connect(this.uri);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        this.connections.set(queue, { connection, channel });
    }

    private async closeConnection(queue: string) {
        const { connection, channel } = this.connections.get(queue);
        await channel.close();
        await connection.close();
    }

    private async getOrCreateConnection(queue: string) {
        if (!this.connections.has(queue)) {
            await this.createConnection(queue);
        }
        return this.connections.get(queue);
    }

    /**
     * Sends a message to a RabbitMQ queue.
     *
     * @param queue - The name of the RabbitMQ queue.
     * @param message - The message to be sent (should be serializable to JSON).
     */
    public async sendMessage(queue: string, message: any) {
        const { channel } = await this.getOrCreateConnection(queue);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }
}
