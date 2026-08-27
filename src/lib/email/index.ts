/**
 * WARDEN Email Service — SMTP configuration and helpers.
 * Server-side only. Never import this from client components.
 */

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// ── Configuration ─────────────────────────────────────────────────

const SMTP_HOST = process.env.SMTP_HOST ?? "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "465", 10);
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_APP_PASSWORD = process.env.SMTP_APP_PASSWORD ?? "";
const FROM_ADDRESS = process.env.WARDEN_EMAIL ?? "";

// ── Status ────────────────────────────────────────────────────────

export type EmailConfigStatus =
  | "EMAIL_NOT_CONFIGURED"
  | "SMTP_CONNECTION_FAILED"
  | "SMTP_AUTH_FAILED"
  | "EMAIL_SEND_FAILED"
  | "READY";

export interface SendEmailResult {
  success: boolean;
  status: EmailConfigStatus;
  message?: string;
  messageId?: string;
}

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Check whether SMTP credentials are present.
 * Does NOT verify connectivity — only checks env vars.
 */
export function isEmailConfigured(): boolean {
  return Boolean(
    SMTP_HOST &&
      SMTP_PORT > 0 &&
      SMTP_USER &&
      SMTP_APP_PASSWORD &&
      FROM_ADDRESS,
  );
}

/**
 * Create a reusable SMTP transporter (lazily).
 * Returns null if not configured.
 */
let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for 587
      auth: {
        user: SMTP_USER,
        pass: SMTP_APP_PASSWORD,
      },
    });
  }
  return _transporter;
}

/**
 * Verify SMTP connection and authentication.
 * Use this before sending real emails.
 */
export async function verifyConnection(): Promise<SendEmailResult> {
  if (!isEmailConfigured()) {
    return {
      success: false,
      status: "EMAIL_NOT_CONFIGURED",
      message:
        "SMTP credentials not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_APP_PASSWORD and WARDEN_EMAIL.",
    };
  }

  try {
    const transporter = getTransporter();
    await transporter.verify();
    return {
      success: true,
      status: "READY",
      message: "SMTP connection verified successfully.",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const isAuth = msg.toLowerCase().includes("auth") || msg.toLowerCase().includes("credentials");
    return {
      success: false,
      status: isAuth ? "SMTP_AUTH_FAILED" : "SMTP_CONNECTION_FAILED",
      message: isAuth
        ? "SMTP authentication failed. Check SMTP_USER and SMTP_APP_PASSWORD."
        : `SMTP connection failed: ${msg}`,
    };
  }
}

// ── Send ──────────────────────────────────────────────────────────

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

/**
 * Send a single email via SMTP.
 * Returns detailed result including status and messageId on success.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!isEmailConfigured()) {
    return {
      success: false,
      status: "EMAIL_NOT_CONFIGURED",
      message: "SMTP not configured. Cannot send email.",
    };
  }

  try {
    const transporter = getTransporter();
    const mailOptions: nodemailer.SendMailOptions = {
      from: FROM_ADDRESS,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html ?? input.text,
    };
    if (input.replyTo) {
      mailOptions.replyTo = input.replyTo;
    }
    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      status: "READY",
      message: "Email sent successfully.",
      messageId: info.messageId,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("sendEmail error:", msg);
    return {
      success: false,
      status: "EMAIL_SEND_FAILED",
      message: `Failed to send email: ${msg}`,
    };
  }
}