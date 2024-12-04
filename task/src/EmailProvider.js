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
exports.MockEmailProviderB = exports.MockEmailProviderA = void 0;
class MockEmailProviderA {
    sendEmail(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`ProviderA: Sending email to ${to}...`);
            if (Math.random() < 0.7) {
                throw new Error('ProviderA: Random Failure');
            }
            return true;
        });
    }
}
exports.MockEmailProviderA = MockEmailProviderA;
class MockEmailProviderB {
    sendEmail(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`ProviderB: Sending email to ${to}...`);
            if (Math.random() < 0.5) {
                throw new Error('ProviderB: Random Failure');
            }
            return true;
        });
    }
}
exports.MockEmailProviderB = MockEmailProviderB;
