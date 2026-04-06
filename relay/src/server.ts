import express from "express";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";

const {
  PORT = "3000",
  API_KEY,
  MAIL_HOST = "smtp.hostinger.com",
  MAIL_PORT = "465",
  MAIL_USER,
  MAIL_PASS,
  ALLOWED_EMAILS = "",
} = process.env;

if (!API_KEY || !MAIL_USER || !MAIL_PASS) {
  console.error("missing env: API_KEY, MAIL_USER, MAIL_PASS");
  process.exit(1);
}

const allowed = new Set(
  ALLOWED_EMAILS.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
);

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT),
  secure: true,
  auth: { user: MAIL_USER, pass: MAIL_PASS },
});

const app = express();
app.use(express.json({ limit: "256kb" }));
app.use(rateLimit({ windowMs: 60_000, max: 20 }));

app.get("/health", (_req, res) => res.send("ok"));

app.post("/send-assignment", async (req, res) => {
  if (req.header("X-API-Key") !== API_KEY) return res.sendStatus(401);

  const { to, subject, html } = req.body ?? {};
  if (!to || !subject || !html) return res.status(400).send("missing fields");
  if (allowed.size && !allowed.has(String(to).toLowerCase())) {
    return res.status(403).send("recipient not allowed");
  }

  try {
    await transporter.sendMail({ from: MAIL_USER, to, subject, html });
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.status(500).send("send failed");
  }
});

app.listen(Number(PORT), () => console.log(`relay on :${PORT}`));
