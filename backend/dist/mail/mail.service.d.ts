export declare class MailService {
    private transporter;
    constructor();
    sendVerificationEmail(email: string, token: string): Promise<void>;
}
