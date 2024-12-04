export interface EmailProvider {
    sendEmail(to: string, subject: string, body: string): Promise<boolean>;
  }
  
  export class MockEmailProviderA implements EmailProvider {
    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
      console.log(`ProviderA: Sending email to ${to}...`);
      if (Math.random() < 0.7) {
        throw new Error('ProviderA: Random Failure');
      }
      return true;
    }
  }
  
  export class MockEmailProviderB implements EmailProvider {
    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
      console.log(`ProviderB: Sending email to ${to}...`);
      if (Math.random() < 0.5) {
        throw new Error('ProviderB: Random Failure');
      }
      return true;
    }
  }
  