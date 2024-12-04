import { EmailProvider } from './EmailProvider';

interface EmailStatus {
  id: string;
  status: 'pending' | 'success' | 'failed';
  attempts: number;
  lastError?: string;
}

export class EmailService {
  private providers: EmailProvider[];
  private rateLimit = 5; // Max 5 emails per second
  private queue: { to: string; subject: string; body: string }[] = [];
  private statusMap: Map<string, EmailStatus> = new Map();

  constructor(providers: EmailProvider[]) {
    this.providers = providers;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<string> {
    const id = `${to}:${subject}`; // Unique identifier
    if (this.statusMap.has(id)) {
      console.log(`Email already sent or in progress: ${id}`);
      return id; // Idempotency
    }

    this.statusMap.set(id, { id, status: 'pending', attempts: 0 });
    this.queue.push({ to, subject, body });
    await this.processQueue();
    return id;
  }

  private async processQueue() {
    while (this.queue.length > 0) {
      if (this.queue.length > this.rateLimit) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Rate limiting
      }

      const email = this.queue.shift();
      if (email) {
        await this.trySendEmail(email.to, email.subject, email.body);
      }
    }
  }

  private async trySendEmail(to: string, subject: string, body: string) {
    const id = `${to}:${subject}`;
    const status = this.statusMap.get(id);
    if (!status) return;

    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      status.attempts++;

      try {
        await provider.sendEmail(to, subject, body);
        status.status = 'success';
        this.statusMap.set(id, status);
        console.log(`Email sent successfully using provider ${i + 1}`);
        return;
      } catch (error) {
        status.lastError = (error as Error).message;
        console.warn(`Provider ${i + 1} failed: ${error}`);
        if (i === this.providers.length - 1) {
          console.warn(`All providers failed for email: ${id}`);
          status.status = 'failed';
        }
      }

      // Exponential backoff
      const backoffTime = Math.pow(2, status.attempts) * 100;
      await new Promise((resolve) => setTimeout(resolve, backoffTime));
    }
  }

  getEmailStatus(id: string): EmailStatus | undefined {
    return this.statusMap.get(id);
  }
}
