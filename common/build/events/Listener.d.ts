import { Message, Stan, SubscriptionOptions } from "node-nats-streaming";
import { Subjects } from "./Subjects";
interface Event {
    subject: Subjects;
    data: any;
}
export declare abstract class Listener<T extends Event> {
    protected client: Stan;
    abstract subject: T["subject"];
    abstract onMessage(data: T["data"], msg: Message): void;
    abstract queueGrouoName: string;
    protected ackWait: number;
    constructor(client: Stan);
    subscriptionOption(): SubscriptionOptions;
    parseMessage(msg: Message): string;
    listen(): void;
}
export {};
