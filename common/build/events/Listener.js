"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
class Listener {
    constructor(client) {
        this.client = client;
        this.ackWait = 5 * 1000;
    }
    subscriptionOption() {
        return this.client
            .subscriptionOptions()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDeliverAllAvailable()
            .setDurableName(this.queueGrouoName);
    }
    parseMessage(msg) {
        const messgage = msg.getData();
        return messgage;
    }
    listen() {
        const subscription = this.client.subscribe(this.subject, this.queueGrouoName, this.subscriptionOption());
        subscription.on("message", (msg) => {
            console.log(`Event received #${msg.getSequence}, ${this.subject} / ${this.queueGrouoName}`);
            const data = this.parseMessage(msg);
            this.onMessage(data, msg);
        });
    }
}
exports.Listener = Listener;
