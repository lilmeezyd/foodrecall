// utils/sendEmail.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
async function sendEmail({ to, subject, html }) {
  console.log(to)
console.log(subject)

  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.error('Resend Error:', error);
    throw error;
  }
}

module.exports = { sendEmail }
