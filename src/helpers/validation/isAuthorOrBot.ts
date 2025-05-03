import { extractTextFromBody } from '@/utils';
import { Message } from 'whatsapp-web.js';

export function isAuthorOrBot(message: Message): boolean {
    return `${extractTextFromBody(message.body)}@c.us` === message.author || `${extractTextFromBody(message.body)}@c.us` === message.to;
}