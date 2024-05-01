import { Stan } from 'node-nats-streaming';
import nats from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error(' Client is not initialized before connection ');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS !');
        console.log('Gotten 2');

        resolve();
      });

      this.client.on('error', (err: any) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
