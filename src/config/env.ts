import dotenv from 'dotenv';
dotenv.config();

function ensureEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing environment variable: ${key}`);
    return value;
}

export const GROUPS_IDS: string[] = ensureEnvVar('GROUPS_IDS').split(',');
export const CLIENT_NUMBER: string = ensureEnvVar('CLIENT_NUMBER');
export const GOOGLE_SEARCH_API_KEY: string = ensureEnvVar('GOOGLE_SEARCH_API_KEY');
export const GOOGLE_SEARCH_API_CTX_GENERAL: string = ensureEnvVar('GOOGLE_SEARCH_API_CTX_GENERAL');
export const GOOGLE_SEARCH_API_CTX_IMAGES: string = ensureEnvVar('GOOGLE_SEARCH_API_CTX_IMAGES');
export const CHROME_PATH: string = ensureEnvVar('CHROME_PATH');
export const GEMINI_API_KEY: string = ensureEnvVar('GEMINI_API_KEY');
export const BOT_INSTRUCTION: string[] = process.env.BOT_INSTRUCTION?.split('|') || [];
