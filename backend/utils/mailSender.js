import dns from "dns/promises";
import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {
    const host = process.env.MAIL_HOST;
    const { address } = await dns.lookup(host, { family: 4 });

    const transporter = nodemailer.createTransport({
      host: address,
      port: 587,
      secure: false,
      servername: host,
      connectionTimeout: 20000,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Arzaid Website" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });
    console.log(info);
    return info;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to send email");
  }
};

export default mailSender;
