import { Message, Stan, SubscriptionOptions } from "node-nats-streaming";
import { Subjects } from "./Subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];

  abstract onMessage(data: T["data"], msg: Message): Promise<void>;

  abstract queueGroupName: string;

  protected ackWait: number = 5 * 1000;

  constructor(protected client: Stan) {}

  subscriptionOption(): SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName);
  }

  parseMessage(msg: Message): string {
    const messgage = msg.getData() as string;

    return messgage;
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOption()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Event received #${msg.getSequence}, ${this.subject} / ${this.queueGroupName}`
      );

      const data = this.parseMessage(msg);

      this.onMessage(data, msg);
    });
  }
}
