import { Stan } from "node-nats-streaming";
import { Subjects } from "./Subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];

  constructor(protected client: Stan) {}

  publish(data: Event["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (error) => {
        if (error) {
          return reject(error);
        }
      });

      return resolve();
    });
  }
}
