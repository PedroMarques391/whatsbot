import chalk from 'chalk';
import figlet from 'figlet';

const isDayTime = new Date().getHours() >= 7 && new Date().getHours() < 19;

export const theme = isDayTime ? {
    background: chalk.bgWhiteBright.black,
    text: chalk.white,
    highlight: chalk.cyan,
    secondary: chalk.gray,
} : {
    background: chalk.bgBlackBright.white,
    text: chalk.white,
    highlight: chalk.magenta,
    secondary: chalk.greenBright,
};

export function printHeader(title: string) {
    console.log(
        chalk.cyan(
            figlet.textSync(title, { horizontalLayout: 'full' })
        )
    );
}

export function printBox(content: string[]) {
    const border = '─'.repeat(50);
    console.log(chalk.blueBright(`╭${border}╮`));
    content.forEach(line => {
        console.log(chalk.blueBright(`│ ${line.padEnd(48)} `));
    });
    console.log(chalk.blueBright(`╰${border}╯`));
}

export function formatLoadingBar(percent: number, barWidth = 40) {
    const filledLength = Math.floor((percent / 100) * barWidth);
    return chalk.green('█'.repeat(filledLength)) +
        chalk.gray('░'.repeat(barWidth - filledLength)) +
        chalk.yellow(` ${percent.toString().padStart(3)}%`);
}


export async function printWelcomeMessage(name: string, number: string, plataform: string) {
    const { highlight, secondary, text } = theme;

    printHeader('Bem Vindo');

    printBox([
        `${highlight('✅ AdaBot está online')}`,
        `${secondary('Esperando comando...')}`,
        '',
        `${highlight('⭐ ￫ Nome do cliente:')} ${text(name)}`,
        `${highlight('⭐ ￫ Telefone do cliente:')} ${text(number)}`,
        `${highlight('⭐ ￫ Plataforma:')} ${text(`${plataform === 'smbi' ? 'Whatsapp business' : plataform}`)}`,
    ]);
}
