"use strict";
let ModuleMessages = (function() {
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

    const filterObj = {
        author: (item, author) => !author || item.author.toLowerCase().includes(author.toLowerCase()),
        text: (item, text) => !text || item.text.toLowerCase().includes(text.toLowerCase()),
        dateTo: (item, dateTo) => !dateTo || item.createdAt < dateTo,
        dateFrom: (item, dateFrom) => !dateFrom || item.createdAt > dateFrom
    };

    // const validateObj = {
    //     text: (item) => item.text && item.text.length <= 200
    // };
    
    let currentAuthor = 'Fresh-aku';

    // функция сортировки по дате создания и пагинацией, а также фильтрации по имени автора, дате и тексту

    function getMessages(skip = 0, top = 10, filterConfig = {}){

        let result = messages.slice(skip, skip + top);

        Object.keys(filterConfig).forEach((key) => {
            result = result.filter((item) => filterObj[key](item, filterConfig[key]));
        });

        // сортировка

        result.sort((a, b) => a.createdAt - b.createdAt);

        return result;

    }

    // проверка
    console.log('Возвращает первые 10 сообщений', getMessages(0, 10));
    console.log('Возвращает 10 сообщений, начиная с 11-ого', getMessages(10, 10));
    console.log('Выбирает те сообщения, где автор содержит подстроку ‘Artem’, возвращает первые 10 сообщений', getMessages(0, 10, {author: 'Artem'}));
    console.log('Выбирает те сообщения, где автор содержит подстроку ‘тогда’, возвращает первые 10 сообщений', getMessages(0, 10, {text: 'Привет'}));

    // функция получения сообщение из массива messages с определенным id.

    function getMessage(id){
        return messages.find((item) => item.id == id) || false;
    }

    // проверка
    console.log(getMessage(10));

    // функция проверки на валидность

    function validateMessage(msg = {}){
        if (typeof(msg.id && msg.text && msg.author) === 'string'
        && typeof (msg.createdAt) === 'object' && typeof (msg.isPersonal) === 'boolean' && (typeof (msg.to) === 'string' || typeof (msg.to) === 'undefined')){
            return true;
        }else{
            return false;
        }
        // return Object.keys(validateObj).every((key) => validateObj[key](msg));
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
        createdAt: '2020-10-09T11:55:00',
        author: 'Lena',
        isPersonal: true,
        to: 'Artem',
    }));

    // функция добавления нового сообщения

    function addMessage (msg){
        if (validateMessage(msg)) {
            msg.id = `${+new Date()}`;
            msg.createdAt = new Date();
            msg.author = currentAuthor;
            messages.push(msg);
            return true;
        }
        return false;
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

    // функция редактирования сообщения 

    function editMessage(id, msg){
        let index = messages.findIndex(msg => msg.id == id);
        if(index === -1){
            return false;       
        }else{
            messages[index].text = msg;
            return (validateMessage(messages[index]));    
        }
        // отваледировать сообщение после редактирования
    }

    // проверка
    console.log(editMessage(1, 'hi'));
    console.log(messages);
    
    // функция удаления сообщения

    function removeMessage(id){
        debugger;
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

    return{
        getMessages,
        getMessage,
        validateMessage,
        addMessage,
        editMessage,
        removeMessage
    };
})();