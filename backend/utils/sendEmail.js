// utils/sendEmail.js
const { Resend } = require('resend');
/*
const resend = new Resend(process.env.RESEND_API_KEY);
async function sendEmail({ to, subject, html }) {

  try {
    const response = await resend.emails.send({
      from: 
        'no-reply@foodrecall.xyz',
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

module.exports = { sendEmail }*/
/*
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, html }) {
  try {
    if (!to || to.length === 0) {
      throw new Error('No recipients found');
    }

    const audience = await resend.audiences.create({
      name: `FoodRecall Audience ${Date.now()}`, 
      contacts: to.map(email => ({ email })),
    });
    console.log(`Audience created with ID: ${audience.id}`)

    
    const broadcast = await resend.broadcasts.create({
      audienceId: audience.id,
      from: 'no-reply@foodrecall.xyz',
      subject,
      html,
    });

    
    const response = await resend.broadcasts.send(broadcast.id, {
      scheduledAt: 'now',
    });

    console.log(`Broadcast sent to ${to.length} recipients`);
    return response;
  } catch (error) {
    console.error('Resend Broadcast Error:', error?.message || error);
    throw error;
  }
}

module.exports = { sendEmail };*/

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ recipients, subject, html, batchSize = 2, delayMs = 1000 }) {
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    await Promise.all(
      batch.map(email =>
        resend.emails.send({
          from: 'FoodRecall <newsletter@foodrecall.xyz>',
          to: email,
          subject,
          html,
        })
      )
    );
    console.log(`Batch ${i / batchSize + 1} sent (${batch.length} emails)`);
    await new Promise(r => setTimeout(r, delayMs));  // pause before next batch
  }
}


module.exports = { sendEmail };