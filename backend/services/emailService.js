const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(options) {
    try {
      const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      const info = await this.transporter.sendMail(message);
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Email send error:', error);
      throw error;
    }
  }

  async sendVerificationEmail(to, verificationUrl, name) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">Welcome to ContentCraft AI!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Verify Email</a>
        <p>Or copy and paste this link:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The ContentCraft AI Team</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Verify Your Email - ContentCraft AI',
      html,
    });
  }

  async sendPasswordResetEmail(to, resetUrl, name) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
        <p>Or copy and paste this link:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The ContentCraft AI Team</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Password Reset - ContentCraft AI',
      html,
    });
  }

  async sendWelcomeEmail(to, name) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">Welcome to ContentCraft AI!</h2>
        <p>Hi ${name},</p>
        <p>We're excited to have you on board! ContentCraft AI is your all-in-one platform for creating, managing, and optimizing content with the power of AI.</p>
        <h3>Here's what you can do:</h3>
        <ul>
          <li>Generate content with AI in seconds</li>
          <li>Predict virality before you post</li>
          <li>Monitor trending topics in real-time</li>
          <li>Schedule posts across multiple platforms</li>
          <li>Analyze performance with detailed analytics</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Get Started</a>
        <p>Best regards,<br>The ContentCraft AI Team</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Welcome to ContentCraft AI!',
      html,
    });
  }
}

module.exports = new EmailService();