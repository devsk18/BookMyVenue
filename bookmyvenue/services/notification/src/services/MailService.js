import fs from "fs/promises";
import Handlebars from "handlebars";

import transporter from "../configs/mailer.js";

export default class MailService {
    TEMPLATES = {
        welcome: {
            name: "welcome",
            subject: "Welcome",
            sender: "BookMyVenue <noreply@bookmyvenue.com>"
        }
    };

    constructor(data) {
        this.transporter = transporter;
        this.data = data;
    }

    async send() {
        try {
            const { data } = this.data;

            const template = this.TEMPLATES[this.data.template];
            if (!template) {
                throw new Error(`Template not found`);
            }

            const html = await this.renderTemplate(template.name, data);

            const info = await this.transporter.sendMail({ 
                from: template.sender, 
                to: data.recipient, 
                subject: data.subject || template.subject,
                html
            });

            // TODO: save mail data and status to db

            console.log("Email sent: " + info.response);
            return true
        } catch (error) {
            console.error("Error sending email: ", error);
            return false
        }
    }

    async renderTemplate(templateName, data) {
        const source = await fs.readFile(
            `./src/templates/${templateName}.hbs`,
            "utf8"
        );

        const template = Handlebars.compile(source);
        return template(data);
    }
}   