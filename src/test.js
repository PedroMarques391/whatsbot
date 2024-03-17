const APIKEY = 'AIzaSyC09oEbGT_TyuXJCWQv7_e6Fvw0aeDRO4w';
const cx = '24f481bb12ac84f48';
const searchTerm = 'fotos de carro';
async function searchGoogle(APIKEY, cx, term) {
  const URL = await fetch(`https://www.googleapis.com/customsearch/v1?key=${APIKEY}&cx=${cx}&q=${term}&searchType=image`); const data = await URL.json(); for (let i = 0; i < 5; i++) {
    const item = data.items[i];
    console.log(item.link);
  }
}

searchGoogle(APIKEY, cx, searchTerm);

// const { translate } = require('google-translate-api-browser');

// translate('This is My life', { to: 'pt-br' })
//   .then((res) => {
//     // I do not eat six days
//     console.log(res.text);
//   // })
