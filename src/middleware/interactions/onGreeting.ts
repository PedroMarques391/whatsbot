import { botResponses } from '@/utils';
import { Message, Chat } from 'whatsapp-web.js';

const greetingRegexGroup = /\b(o{1,}i+|ol+[áa]+|o{2,}p+a+|e+\s*a+[íi]+|f+a+l+a+|s+a+l+v+e+|b+o+m+\s*d+i+a+|b+o+a+\s*t+a+r+d+e+|b+o+a+\s*n+o+i+t+e+|h+e+y+|h+i+|h+e+l+l+o+|y+o+|e+a+e+|e+a+i+|o+i+e+|o+e{2,})\s*(ada|adabot)\b/i;

const greetingRegexPrivate = /\b(o{1,}i+|ol+[áa]+|o{2,}p+a+|e+\s*a+[íi]+|f+a+l+a+|s+a+l+v+e+|b+o+m+\s*d+i+a+|b+o+a+\s*t+a+r+d+e+|b+o+a+\s*n+o+i+t+e+|h+e+y+|h+i+|h+e+l+l+o+|y+o+|e+a+e+|e+a+i+|o+i+e+|o+e{2,})\b/i;

const botMentions = ['ada', 'adabot'];

export async function greeting(message: Message, chat: Chat): Promise<boolean> {
    const body = message.body.toLowerCase().trim();

    if (message.fromMe) return false;

    const isMentionedDirectly = botMentions.includes(body) || body.startsWith(`@${process.env.CLIENT_NUMBER?.split('@')[0]}`);

    const matchedGreeting = chat.isGroup
        ? greetingRegexGroup.test(body)
        : greetingRegexPrivate.test(body);

    if (matchedGreeting || isMentionedDirectly) {
        const reply = botResponses[Math.floor(Math.random() * botResponses.length)];
        await message.reply(reply);
        return true;
    }
    return false;
}