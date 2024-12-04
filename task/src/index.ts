import { MockEmailProviderA, MockEmailProviderB } from './EmailProvider';
import { EmailService } from './EmailService';

(async () => {
  const providers = [new MockEmailProviderA(), new MockEmailProviderB()];
  const emailService = new EmailService(providers);

  const emailId = await emailService.sendEmail(
    'test@example.com',
    'Hello',
    'This is a test email.'
  );

  console.log(`Email ID: ${emailId}`);

  setTimeout(() => {
    const status = emailService.getEmailStatus(emailId);
    console.log('Email Status:', status);
  }, 5000);
})();
