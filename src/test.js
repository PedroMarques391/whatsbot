// // const APIKEY = 'AIzaSyC09oEbGT_TyuXJCWQv7_e6Fvw0aeDRO4w';
// // const cx = '24f481bb12ac84f48';
// // const searchTerm = 'fotos de carro';
// // async function searchGoogle(APIKEY, cx, term) {
// //   const URL = await fetch(`https://www.googleapis.com/customsearch/v1?key=${APIKEY}&cx=${cx}&q=${term}&searchType=image`); const data = await URL.json(); for (let i = 0; i < 5; i++) {
// //     const item = data.items[i];
// //     console.log(item.link);
// //   }
// // }

// // searchGoogle(APIKEY, cx, searchTerm);

// // // // const { translate } = require('google-translate-api-browser');

// // // // translate('This is My life', { to: 'pt-br' })
// // // //   .then((res) => {
// // // //     // I do not eat six days
// // // //     console.log(res.text);
// // // //   // })

// // // Caminho para o vídeo de entrada
// // const videoPath = './src/videos/video.mp4';
// // // Caminho para o GIF de saída
// // const gifPath = './src/videos/video.gif';

// // // Convertendo o vídeo em GIF
// // ffmpeg(videoPath)
// //   .output(gifPath)
// //   .withSize('320x240') // Definindo o tamanho do GIF
// //   .on('end', () => {
// //     console.log('Conversão concluída!');
// //   })
// //   .on('error', (err) => {
// //     console.error('Erro durante a conversão:', err);
// //   })
// //   .run();

const fs = require('fs');
const ytdl = require('ytdl-core');

const videoUrl = 'https://youtu.be/NBAjIgsK0qQ';


const outputFileName = './src/videos/video.mp4';

const outputStream = fs.createWriteStream(outputFileName);

// Baixa o vídeo
ytdl(videoUrl, {
  quality: 'highest',
  filter: 'audioandvideo',
})
  .on('error', (error) => {
    console.error('Erro ao baixar o vídeo:', error);
  })
  .on('end', () => {
    console.log('Download do vídeo concluído!');
  })
  .pipe(outputStream);
