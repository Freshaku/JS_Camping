function getDay(date) {
    let day = date.getDay();
    if (day == 0){
        day = 7;
    } 
    return (day - 1);
}

function createCalendar(elem, year, month){
    let nDate = new Date(year, month - 1);
    let table = `
        <table>
            <tr>
                <th>пн</th>
                <th>вт</th>
                <th>ср</th>
                <th>чт</th>
                <th>пт</th>
                <th>сб</th>
                <th>вс</th>
            </tr>
            <tr>`;

    for (let i = 0; i < getDay(nDate); i++) {
      table += '<td></td>';
    }

    while (nDate.getMonth() == (month - 1)) {
      table += '<td>' + nDate.getDate() + '</td>';

      if (getDay(nDate) % 7 == 6) {
        table += '</tr><tr>';
      }

      nDate.setDate(nDate.getDate() + 1);
    }

    if (getDay(nDate) != 0) {
      for (let i = getDay(nDate); i < 7; i++) {
        table += '<td></td>';
      }
    }

    table += '</tr></table>';

    elem.innerHTML = table;
}

createCalendar(cal, 2012, 9);