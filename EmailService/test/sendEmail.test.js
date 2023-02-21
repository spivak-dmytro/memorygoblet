import nodeMailer from 'nodemailer';
import sinon from 'sinon';
import EmailService from '../service';

describe('EmailService', () => {
  let sendMailStub;

  beforeEach(() => {
    sendMailStub = sinon.stub(nodeMailer, 'createTransport').returns({
      sendMail: sinon.stub().yields(null, { response: 'success' }),
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('sendEmail', () => {
    it('should send email and put to queue', async () => {
      const sagaMock = {
        putToQueue: sinon.stub(),
      };
      const emailData = {
        to: 'test@example.com',
        subject: 'Test email',
        text: 'This is a test email',
      };
      const emailService = await EmailService(sagaMock);
      await emailService.sendEmail(emailData);
      sinon.assert.calledOnce(sendMailStub);
      sinon.assert.calledWith(sendMailStub, {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      sinon.assert.calledWith(sendMailStub().sendMail, {
        from: process.env.EMAIL_USER,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
      });
      sinon.assert.calledWith(sagaMock.putToQueue, 'email.sent', emailData);
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email', async () => {
      const sagaMock = {
        putToQueue: sinon.stub(),
      };
      const user = {
        id: '123',
        email: 'test@example.com',
      };
      const emailService = await EmailService(sagaMock);
      await emailService.sendVerificationEmail(user);
      sinon.assert.calledOnce(sendMailStub);
      sinon.assert.calledWith(sendMailStub, {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      sinon.assert.calledWith(sendMailStub().sendMail, {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verify your email',
        text: `Click the link below to verify your email: ${process.env.FRONTEND_URL}/verify-email/${user.id}`,
      });
      sinon.assert.calledWith(sagaMock.putToQueue, 'email.sent', {
        to: user.email,
        subject: 'Verify your email',
        text: `Click the link below to verify your email: ${process.env.FRONTEND_URL}/verify-email/${user.id}`,
      });
    });
  });
});
