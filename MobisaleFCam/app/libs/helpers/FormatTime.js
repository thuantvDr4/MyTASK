
export function setTime(dateTime, type) {
    // default : MM/DD/YYYY
    var day   = dateTime.getDate();
    var month = dateTime.getMonth() +1;
    var year  = dateTime.getFullYear();

    if(month < 10){
        month = `0${month}`;
    }

    if(day < 10){
        day = `0${day}`;
    }

    switch (type) {
        case 'MM/DD/YYYY' :
            return (`${month}/${day}/${year}`);

        case 'DD/MM/YYYY':
            return (`${day}/${month}/${year}`);

        case 'MM-DD-YYYY':
            return (`${month}-${day}-${year}`);

        case 'DD-MM-YYYY':
            return (`${day}-${month}-${year}`);

        default: return(`${month}-${day}-${year}`);

    }
}



const  formatTime ={
    setTime,
};

export default formatTime;
