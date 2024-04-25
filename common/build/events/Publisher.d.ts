import { Stan } from "node-nats-streaming";
import { Subjects } from "./Subjects";
interface Event {
    subject: Subjects;
    data: any;
}
export declare abstract class Publisher<T extends Event> {
    protected client: Stan;
    abstract subject: T["subject"];
    constructor(client: Stan);
    publish(data: Event["data"]): Promise<void>;
}
export {};
