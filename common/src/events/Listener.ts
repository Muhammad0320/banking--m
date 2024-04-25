import { Message, Stan, SubscriptionOptions } from "node-nats-streaming";
import { Subjects } from "./Subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];

  abstract onMessage(data: T["data"], msg: Message): void;

  abstract queueGrouoName: string;

  protected ackWait: number = 5 * 1000;

  constructor(protected client: Stan) {}

  subscriptionOption(): SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGrouoName);
  }
}
