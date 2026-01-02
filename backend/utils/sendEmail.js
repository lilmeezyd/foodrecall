// utils/sendEmail.js
const { Resend } = require("resend");
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

async function sendEmail({
  recipients,
  subject,
  html,
  batchSize = 2,
  delayMs = 1000,
}) {
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    await Promise.all(
      batch.map((email) =>
        resend.emails.send({
          from: "FoodRecall <newsletter@foodrecall.xyz>",
          to: email,
          subject,
          html,
        })
      )
    );
    console.log(`Batch ${i / batchSize + 1} sent (${batch.length} emails)`);
    await new Promise((r) => setTimeout(r, delayMs)); // pause before next batch
  }
}

async function sendEmails({
  recipients,
  subject,
  results,
  batchSize = 2,
  delayMs = 1000,
}) {
  const link = "https://foodrecall.xyz";

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    await Promise.allSettled(
      batch.map((emailObj) =>
        resend.emails.send({
          from: "FoodRecall <newsletter@foodrecall.xyz>",
          to: emailObj.email,
          subject,
          headers: {
            "List-Unsubscribe": `<https://foodrecall.vercel.app/unsubscribe?token=${emailObj._id}>`,
          },
          html: `
<!DOCTYPE html>
<html>
<head>
<style>
body 
{ margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, Helvetica, sans-serif; }
  .container 
  { max-width: 650px; margin: 30px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.08); }
    .header { background: #b91c1c; color: white; padding: 24px; text-align: center; } 
    .content { padding: 24px; color: #333; } 
    .recall-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #fafafa; } 
    .recall-card strong { color: #111827; } .btn { display: inline-block; margin-top: 12px; padding: 10px 18px; background: #dc2626; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; } 
    .footer { text-align: center; font-size: 12px; color: #6b7280; padding: 20px; }
.unsubscribe-btn {
  display:inline-block;
  margin-top:14px;
  padding:8px 14px;
  background:#e5e7eb;
  color:#374151 !important;
  border-radius:6px;
  text-decoration:none;
}
</style>
</head>
<body>
  ${results
    .map(
      (entry) => `
    <div class="recall-card"> 
      <p><strong>Reason:</strong> ${entry.reason_for_recall}</p> 
      <p><strong>Company:</strong> ${entry.recalling_firm}</p> 
      <p><strong>Date:</strong> ${entry.report_date?.slice(0, 4)}-${entry.report_date?.slice(4, 6)}-${entry.report_date?.slice(6)}</p> 
      <a class="btn" href="${link}/recalls/fda/${entry.recall_number}"> View Recall Details </a> 
      </div> `
    )
    .join("")}

  <br />
  <div class="footer"> 
  <p>You are receiving this email because you subscribed to FDA recall alerts.</p> 
  <a class="unsubscribe-btn" href="${`https://foodrecall.vercel.app/unsubscribe?token=${emailObj._id}`}"> Unsubscribe </a>
     Copyright © Food Recall App ${new Date().getFullYear()} 
     </div>
</body>
</html>
`,
        })
      )
    );

    await new Promise((r) => setTimeout(r, delayMs));
  }
}

module.exports = { sendEmail, sendEmails };
