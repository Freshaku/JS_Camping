"use strict";

const messages = [
    {
        id: '1',
        text: 'Привет, как у вас успехи с домашкой?)',
        createdAt: new Date('2020-10-09T11:44:00'),
        author: 'Artem',
        isPersonal: false,
    },
    {
        id: '2',
        text: 'Привет!',
        createdAt: new Date('2020-10-09T11:54:00'),
        author: 'Lera',
        isPersonal: false,
    },
    {
        id: '3',
        text: 'Привет, все отлично, только застряла на 3-м задании.',
        createdAt: new Date('2020-10-09T11:55:00'),
        author: 'Lena',
        isPersonal: true,
        to: 'Artem'
    },
    {
        id: '4',
        text: 'Все довольно таки не плохо, но требует времени)',
        createdAt: new Date('2020-10-09T12:01:00'),
        author: 'Fresh-aku',
        isPersonal: false,
    },
    {
        id: '5',
        text: 'Так что работаем ребята:)',
        createdAt: new Date('2020-10-09T12:05:00'),
        author: 'Anton',
        isPersonal: false,
    },
    {
        id: '6',
        text: 'хах, это точно',
        createdAt: new Date('2020-10-09T12:06:00'),
        author: 'Fresh-aku',
        isPersonal: false,
    },
    {
        id: '7',
        text: 'А вообще у кого какие планы на выходные? Может собиремся вместе где-нибудь и вместе порешаем интересные задачки?)',
        createdAt: new Date('2020-10-09T12:07:00'),
        author: 'Artem',
        isPersonal: false,
    },
    {
        id: '8',
        text: 'Хорошая идея, я за!',
        createdAt: new Date('2020-10-09T12:10:00'),
        author: 'Lera',
        isPersonal: false,
    },
    {
        id: '9',
        text: 'и я)',
        createdAt: new Date('2020-10-09T12:11:00'),
        author: 'Fresh-aku',
        isPersonal: false,
    },
    {
        id: '10',
        text: 'я за любой движ)',
        createdAt: new Date('2020-10-09T12:15:00'),
        author: 'Anton',
        isPersonal: false,
    },
    {
        id: '11',
        text: 'я за!',
        createdAt: new Date('2020-10-09T12:16:00'),
        author: 'Lena',
        isPersonal: false,
    },
    {
        id: '12',
        text: 'Круто, тогда договорились! Может есть какие-нибудь предложения на счет места?',
        createdAt: new Date('2020-10-09T12:20:00'),
        author: 'Artem',
        isPersonal: false,
    },
    {
        id: '13',
        text: 'О, я знаю одну крутую кафешку.',
        createdAt: new Date('2020-10-09T12:25:00'),
        author: 'Lera',
        isPersonal: false,
    },
    {
        id: '14',
        text: 'Там очень отмасферно и удобные диваны. Там даже есть гамак и качели. А еще там очень вкусный кофе. Прям сейчас бы туда сгоняла. ',
        createdAt: new Date('2020-10-09T12:26:00'),
        author: 'Lera',
        isPersonal: false,
    },
    {
        id: '15',
        text: 'ооо, звучит очень даже неплохо',
        createdAt: new Date('2020-10-09T12:27:00'),
        author: 'Lena',
        isPersonal: false,
    },
    {
        id: '16',
        text: 'ахаххаха, и правда, теперь я хочу на качели:)',
        createdAt: new Date('2020-10-09T12:28:00'),
        author: 'Fresh-aku',
        isPersonal: false,
    },
    {
        id: '17',
        text: 'Супер, тогда погнали в понедельник в часика 2?',
        createdAt: new Date('2020-10-09T12:30:00'),
        author: 'Artem',
        isPersonal: false,
    },
    {
        id: '18',
        text: 'Окей',
        createdAt: new Date('2020-10-09T12:31:00'),
        author: 'Lera',
        isPersonal: false,
    },
    {
        id: '19',
        text: 'Да, давайте.',
        createdAt: new Date('2020-10-09T12:32:00'),
        author: 'Anton',
        isPersonal: false,
    },
    {
        id: '20',
        text: 'Хорошо',
        createdAt: new Date('2020-10-09T12:31:00'),
        author: 'Lena',
        isPersonal: false,
    },
    {
        id: '21',
        text: 'До завтра)',
        createdAt: new Date('2020-10-09T12:31:00'),
        author: 'Fresh-aku',
        isPersonal: false,
    },
];

// for (let i = 0; i < messages.length; i++) {
//     console.log('id: ' + messages[i].id + "\ntext: " + messages[i].text + '\ncreatedAt: ' + messages[i].createdAt + '\nauthor: ' + messages[i].author + '\nisPersonal' + messages[i].isPersonal);
// }

let ModuleMessages = +function() {
    
    // getMessages(skip?: number, top?: number, filterConfig?: Object): Array<message> 

    // Получить массив сообщений с сортировкой по дате создания и пагинацией. Предусмотреть возможность фильтрации по имени автора, дате и тексту.

    // skip - number - параметр для пагинации, сколько сообщений пропускать, опциональный параметр, default: 0.

    // top - number - параметр для пагинации, сколько сообщений получить, опциональный параметр, default: 10.

    // filterConfig - Object -  параметр для применения фильтров. Объект может содержать поля author, dateFrom, dateTo и text для фильтрации.

    function getMessages(skip = 0, top = 10, filterConfig){
        let arr = [];
        if (skip < 0){
            skip = 0;
        }
        if (top < 0){
            top = 10;
        }
        if (typeof(filterConfig) === 'object') {
            if (filterConfig.author) {
                for (let i = 0; i < messages.length; i++) {
                    if (messages[i].author.includes(filterConfig.author)){
                        arr.push(messages[i]);
                    }
                }
            }
            if (filterConfig.text) {
                for (let i = 0; i < messages.length; i++) {
                    if (messages[i].text.includes(filterConfig.text)){
                        arr.push(messages[i]);
                    }
                }
            }
            if(filterConfig.dateFrom){
                filterConfig.dateFrom = filterConfig.dateFrom || new Date('1970-01-01T00:00:00');
                for (let i = 0; i < messages.length; i++) {
                    if ((Date.parse(messages[i].createdAt) > Date.parse(filterConfig.dateFrom))) {
                        arr.push(messages[i]);
                    }
                }
            }else{
                arr.sort((a,b) => {
                    return (Date.parse(b.createdAt)-Date.parse(a.createdAt));
                });
                return arr;
            }

            if(filterConfig.dateTo){
                filterConfig.dateTo = filterConfig.dateTo || new Date('1970-01-01T00:00:00');
                for (let i = 0; i < messages.length; i++) {
                    if ((Date.parse(messages[i].createdAt) > Date.parse(filterConfig.dateTo))) {
                        arr.push(messages[i]);
                    }
                }
            }else{
                arr.sort((a,b) => {
                    return (Date.parse(b.createdAt)-Date.parse(a.createdAt));
                });
                return arr;
            }
        }
        else {
            messages.sort((a,b) => {
                return (Date.parse(b.createdAt)-Date.parse(a.createdAt));
            });
            for (let i = skip; i < (top + skip); i++) {
                arr.push(messages[i]);
            }
            return arr;
        }
    }

    // проверка
    console.log('Возвращает первые 10 сообщений', getMessages(0, 10));
    console.log('Возвращает 10 сообщений, начиная с 11-ого', getMessages(10, 10));
    console.log('Выбирает те сообщения, где автор содержит подстроку ‘Artem’, возвращает первые 10 сообщений', getMessages(0, 10, {author: 'Artem'}));
    console.log('Выбирает те сообщения, где автор содержит подстроку ‘тогда’, возвращает первые 10 сообщений', getMessages(0, 10, {text: 'тогда'}));

    // getMessage(id: string): message - получить сообщение из массива messages с определенным id.

    function getMessage(id){
            let messageId = messages.filter(name => name.id == id);
            if (messageId.id === messages.id){
                return messageId;
            }else {
                return false;
            }
    }

    // проверка
    console.log(getMessage(10));

    // validateMessage(msg: message): boolean - проверить объект msg на валидность: присутствие всех обязательных полей в нужном формате (см. структуру объекта message выше).

    function validateMessage(msg){
        if (typeof(msg.id && msg.text && msg.author) == 'string'
        && typeof (msg.createdAt) === 'object' && typeof (msg.isPersonal) === 'boolean' && (typeof (msg.to) === 'string' || typeof (msg.to) === 'undefined')){
            return true;
        }else{
            return false;
        }
    }

    // проверка true 
    console.log('Все верно, ', validateMessage({
        id: '3',
        text: 'Привет, все отлично, только застряла на 3-м задании.',
        createdAt: new Date('2020-10-09T11:55:00'),
        author: 'Lena',
        isPersonal: true,
        to: 'Artem',
    }));

    // проверка false 
    console.log('Проверь типы данных, ', validateMessage({
        id: '3',
        text: 'Привет, все отлично, только застряла на 3-м задании.',
        createdAt: '2020-10-09T11:55:00',
        author: 'Lena',
        isPersonal: true,
        to: 'Artem',
    }));

    // addMessage(msg: message): boolean - добавить новое сообщение в массив messages, предварительно проверив его на валидность, вернуть true если сообщение добавлено успешно, иначе false.

    function addMessage (msg){
        if (validateMessage(msg) === true){
            messages.push(msg);
            return true; 
        }else{
            return false;
        }
    }

    // проверка
    console.log('добавлено новое сообщение, которое проходит валидность', addMessage({
        id: '22',
        text: 'Ну что, все готовы?',
        createdAt: new Date('2020-10-10T11:55:00'),
        author: 'Lena',
        isPersonal: false,
    }));
    console.log('Поступило новое сообщение, которое не проходит валидность', addMessage({
        id: '23',
        text: 'Да, идем!',
        createdAt: '2020-10-10T11:55:00',
        author: 'Artem',
        isPersonal: false,
    }));
    // проверяем как выглядит массив
    console.log(messages);

    // editMessage(id: string, msg: message): boolean - изменить сообщение в массиве messages по id. Объект msg может не содержать все обязательные для сообщения поля, а иметь лишь те поля, которые необходимо изменить (можно менять все поля, кроме id, author, createdAt). Перед изменением сообщения требуется проверить его валидность. Вернуть true или false.

    function editMessage(id, msg){
        let index = messages.findIndex(msg => msg.id == id);
        if(index === -1){
            return false;       
        }else{
            if(validateMessage(messages[index])){
                messages[index].text = msg;
                console.log(messages);
                return true;
            }      
        }
    }

    // проверка
    console.log(editMessage(1, 'hi'));
    
    // removeMessage(id: string): boolean - удалить сообщение по id из массива messages.

    function removeMessage(id){
        let index = messages.findIndex(msg => msg.id === id);
        if(index === -1){
            return false;       
        }else{
            messages.splice(index, 1);
            return true;         
        }
    }

    // проверка
    console.log('Удалено сообщение', removeMessage('8'));
    console.log(messages);
}();
  
