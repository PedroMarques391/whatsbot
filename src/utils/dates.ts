export function formatDate(unixTimeStamp: number): string {
    const date = new Date(unixTimeStamp * 1000);

    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    const seconds = (`0${date.getSeconds()}`).slice(-2);

    const formattedTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedTime;
}