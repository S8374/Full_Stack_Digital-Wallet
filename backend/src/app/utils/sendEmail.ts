/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { envVariables } from "../config/envVeriables";
import AppError from "../errorHelpers/appError";

const transporter = nodemailer.createTransport({
  host: envVariables.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVariables.EMAIL_SENDER.SMTP_PORT),
  secure: Number(envVariables.EMAIL_SENDER.SMTP_PORT) === 465, // only true for 465
  auth: {
    user: envVariables.EMAIL_SENDER.SMTP_USER,
    pass: envVariables.EMAIL_SENDER.SMTP_PASS,
  },
});

interface SendEmailOptions {
    to: string,
    subject: string;
    templateName: string;
    templateData?: Record<string, any>
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments
}: SendEmailOptions) => {
    try {
        console.log(`\u2709\uFE0F Sending email to ${to}...templetName: ${templateName}`);
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath, templateData)
        const info = await transporter.sendMail({
            from: envVariables.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        })
        console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    } catch (error: any) {
        console.log("email sending error", error);
        throw new AppError(401, "Email error")
    }

}