import { client } from "./client";

const qrcode = require('qrcode-terminal');

client.on('qr', (qr: any) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log(`    
    ╭•╼━━≺∆≻━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾≺∆≻━━━╾•╮ 
    ┃｡˚⭐ ￫ Cliente Conectado                                        
    ┃━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━━━━   
    ┃｡˚⭐ ￫ Nome do cliente: ${client.info.pushname}              
    ┃━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━━━━   
    ┃｡˚⭐ ￫ Telefone do cliente: ${client.info.wid.user}       
    ┃━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━━━━
    ┃｡˚⭐ ￫ Plataforma do cliente: ${client.info.platform === 'iphone' ? 'IOS' : client.info.platform}
    ╰╼━━━━━━━━╾━━━━━━╾━━━━━━╾≺End≻━═━╾━━━╾━━━━━━╾━━━━━━━━━━━╯
    `);
});

