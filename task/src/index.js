"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailProvider_1 = require("./EmailProvider");
const EmailService_1 = require("./EmailService");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const providers = [new EmailProvider_1.MockEmailProviderA(), new EmailProvider_1.MockEmailProviderB()];
    const emailService = new EmailService_1.EmailService(providers);
    const emailId = yield emailService.sendEmail('test@example.com', 'Hello', 'This is a test email.');
    console.log(`Email ID: ${emailId}`);
    setTimeout(() => {
        const status = emailService.getEmailStatus(emailId);
        console.log('Email Status:', status);
    }, 5000);
}))();
