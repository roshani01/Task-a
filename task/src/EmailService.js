"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
class EmailService {
    constructor(providers) {
        this.rateLimit = 5; // Max 5 emails per second
        this.queue = [];
        this.statusMap = new Map();
        this.providers = providers;
    }
    sendEmail(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = `${to}:${subject}`; // Unique identifier
            if (this.statusMap.has(id)) {
                console.log(`Email already sent or in progress: ${id}`);
                return id; // Idempotency
            }
            this.statusMap.set(id, { id, status: 'pending', attempts: 0 });
            this.queue.push({ to, subject, body });
            yield this.processQueue();
            return id;
        });
    }
    processQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.queue.length > 0) {
                if (this.queue.length > this.rateLimit) {
                    yield new Promise((resolve) => setTimeout(resolve, 1000)); // Rate limiting
                }
                const email = this.queue.shift();
                if (email) {
                    yield this.trySendEmail(email.to, email.subject, email.body);
                }
            }
        });
    }
    trySendEmail(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = `${to}:${subject}`;
            const status = this.statusMap.get(id);
            if (!status)
                return;
            for (let i = 0; i < this.providers.length; i++) {
                const provider = this.providers[i];
                status.attempts++;
                try {
                    yield provider.sendEmail(to, subject, body);
                    status.status = 'success';
                    this.statusMap.set(id, status);
                    console.log(`Email sent successfully using provider ${i + 1}`);
                    return;
                }
                catch (error) {
                    status.lastError = error.message;
                    console.warn(`Provider ${i + 1} failed: ${error}`);
                    if (i === this.providers.length - 1) {
                        console.warn(`All providers failed for email: ${id}`);
                        status.status = 'failed';
                    }
                }
                // Exponential backoff
                const backoffTime = Math.pow(2, status.attempts) * 100;
                yield new Promise((resolve) => setTimeout(resolve, backoffTime));
            }
        });
    }
    getEmailStatus(id) {
        return this.statusMap.get(id);
    }
}
exports.EmailService = EmailService;
