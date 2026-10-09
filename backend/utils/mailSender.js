const mailSender = async (email, title, body) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Arzaid Website",
          email: process.env.MAIL_USER,
        },
        to: [{ email }],
        subject: title,
        htmlContent: body,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.log("Brevo error:", data);
      throw new Error(data?.message || "Failed to send email");
    }

    console.log("Email sent Successfully!", data);
    return data;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to send email");
  }
};

export default mailSender;
