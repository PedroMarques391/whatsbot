export function extractTextFromBody(body: string): string {
    const words = body.split(' ');
    words.shift();
    return words.join(' ').trim();
}
