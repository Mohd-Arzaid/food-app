const mailSender = async (email, title, body) => {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Arzaid Website <onboarding@resend.dev>",
        to: [email],
        subject: title,
        html: body,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.log("Resend error:", data);
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
