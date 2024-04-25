import { Message } from "node-nats-streaming";
import { Subjects } from "./Subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];

  abstract onMessage(data: T["data"], msg: Message): void;

  abstract queueGrouoName: string;
}
