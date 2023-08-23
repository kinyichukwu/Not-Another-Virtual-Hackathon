export const currentDate = ()=>{
    const date = new Date(Date.now());
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear()
    return `${day}/${month+1}/${year}`;
};

export const currentTime = ()=>{
    const date = new Date(Date.now());
    const hour = date.getHours();
    const minute = date.getMinutes() <= 9 ? "0" +date.getMinutes() : date.getMinutes();
    const time = hour < 12 ? "am" : "pm";
    return `${hour}:${minute}${time}`;
};