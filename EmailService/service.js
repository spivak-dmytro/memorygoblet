import nodeMailer from 'nodemailer';

const EmailService = async (saga) => {
  const sendEmail = async (emailData) => {
    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    await saga.putToQueue('email.sent', emailData);
  }

  const sendVerificationEmail = async (user) => {
    const emailData = {
      to: user.email,
      subject: 'Verify your email',
      text: `Click the link below to verify your email: ${process.env.FRONTEND_URL}/verify-email/${user.id}`
    }

    await sendEmail(emailData);
  }

  return {
    sendEmail,
    sendVerificationEmail,
  }
}

export default EmailService;
