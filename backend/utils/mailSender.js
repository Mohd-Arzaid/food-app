import dns from "dns/promises";
import nodemailer from "nodemailer";

const sendOnce = async (email, title, body) => {
  const host = process.env.MAIL_HOST;
  const { address } = await dns.lookup(host, { family: 4 });

  const transporter = nodemailer.createTransport({
    host: address,
    port: 587,
    secure: false,
    servername: host,
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 20000,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: `"Arzaid Website" <${process.env.MAIL_USER}>`,
    to: email,
    subject: title,
    html: body,
  });
};

const mailSender = async (email, title, body) => {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const info = await sendOnce(email, title, body);
      console.log(`Email sent on attempt ${attempt}:`, info.response);
      return info;
    } catch (error) {
      lastError = error;
      console.log(`Mail attempt ${attempt} failed:`, error.message);
    }
  }

  console.log(lastError?.message);
  throw new Error("Failed to send email");
};

export default mailSender;
