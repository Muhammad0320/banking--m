"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
class Publisher {
    constructor(client) {
        this.client = client;
    }
    publish(data) {
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
exports.Publisher = Publisher;
