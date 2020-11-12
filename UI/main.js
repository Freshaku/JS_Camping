"use strict";
const filterObj = {
    author: (item, author) => !author || item.author.toLowerCase().includes(author.toLowerCase()),
    text: (item, text) => !text || item.text.toLowerCase().includes(text.toLowerCase()),
    dateTo: (item, dateTo) => !dateTo || item.createdAt < dateTo,
    dateFrom: (item, dateFrom) => !dateFrom || item.createdAt > dateFrom
};

const validateObj = {
    text: (item) => item.text && item.text.length <= 200
};

let user = 'Fresh-aku';

class Message{
    constructor(text,to, id = null, createdAt = null, author = null, isPersonal = null){
        this._id =id;
        this.text = text;
        this._createdAt = createdAt || new Date();
        this._author = author || this.user;
        this.isPersonal = isPersonal ?? !!to;
        this._to = to;
    }
        
    get id(){
        return this._id;
    }

    get createdAt(){
        return this._createdAt;
    }

    set createdAt(createdAt){
        this._createdAt = createdAt || new Date();
    }

    get author(){
        return this._author;
    }

    set to(to){
        this.to = to;
        this.isPersonal = !!to;
    }
    
    get to(){
        return this._to;
    }
}

class MessageList{

    constructor(messages){
        this._messages = messages.slice();
        this._user = user;
        this._msgCollection = messages;
    }

    get user() {
        return this._user;
    }

    getPage(skip = 0, top = 10, filterConfig = {}){
        let result = this._messages.slice(skip, skip + top);
        Object.keys(filterConfig).forEach((key) => {
            result = result.filter((item) => filterObj[key](item, filterConfig[key]));
        });
        result.sort((a, b) => a.createdAt - b.createdAt);
        return result;
    }

    get(id){
        return this._messages.find((item) => item.id == id) || false;
    }

    add(msg){
            // if (validateMessage(msg)) {
            //     msg.id = `${+new Date()}`;
            //     msg.createdAt = new Date();
            //     msg.author = currentAuthor;
            //     messages.push(msg);
            //     return true;
            // }
            // return false;
        msg = new Message(msg.text, msg.to, msg.id, msg.createdAt, msg.author, msg.isPersonal);
        if (MessageList.validate(msg)){
            this._messages.push(msg);
            return true;
        }
        return false;
    }

    edit(id, msg){
        let index = this._messages.findIndex(msg => msg.id == id);
        if (MessageList.validate(msg)){
            this._messages[index].text = msg;
            return true;
        } else if(index === -1){
            return false;
        }
    }

    remove(id){
        let index = this._messages.findIndex(message => message.id === id);
        if(index === -1){
            return false;       
        }else{
            this._messages.splice(index, 1);
            return true;         
        }
    }

    static validate(message){
        return Object.keys(validateObj).every((key) => validateObj[key](message));
    }

    addAll(messages){
        let notValidatedMessages = [];
        for (let i = 0; i < messages.length; i++) {
          if (MessageList.validate(messages)) {
            this._messages.push(messages);
          } else {
            notValidatedMessages.push(messages);
          }
        }
        return notValidatedMessages;
    }

    clear() {
        this._messages = [];
    }
}


let messages = [
    new Message({
        id: '1',
        text: 'Привет, как у вас успехи с домашкой?)',
        createdAt: new Date('2020-10-09T11:44:00'),
        author: 'Artem',
        isPersonal: false,
    }),
    new Message({
        id: '2',
        text: 'Привет!',
        createdAt: new Date('2020-10-09T11:54:00'),
        author: 'Lera',
        isPersonal: false,
    }),
    new Message({
        id: '3',
        text: 'Привет, все отлично, только застряла на 3-м задании.',
        createdAt: new Date('2020-10-09T11:55:00'),
        author: 'Lena',
        isPersonal: true,
        to: 'Artem'
    }),
    new Message({
        id: '4',
        text: 'Все довольно таки не плохо, но требует времени)',
        createdAt: new Date('2020-10-09T12:01:00'),
        author: 'Fresh-aku',
        isPersonal: false,
    }),
    new Message({
        id: '5',
        text: 'Так что работаем ребята:)',
        createdAt: new Date('2020-10-09T12:05:00'),
        author: 'Anton',
        isPersonal: false,
    }),
    new Message({
        id: '6',
        text: 'хах, это точно',
        createdAt: new Date('2020-10-09T12:06:00'),
        author: 'Fresh-aku',
        isPersonal: false,
    }),
    new Message({
        id: '7',
        text: 'А вообще у кого какие планы на выходные? Может собиремся вместе где-нибудь и вместе порешаем интересные задачки?)',
        createdAt: new Date('2020-10-09T12:07:00'),
        author: 'Artem',
        isPersonal: false,
    }),
    new Message({
        id: '8',
        text: 'Хорошая идея, я за!',
        createdAt: new Date('2020-10-09T12:10:00'),
        author: 'Lera',
        isPersonal: false,
    }),
    new Message({
        id: '9',
        text: 'и я)',
        createdAt: new Date('2020-10-09T12:11:00'),
        author: 'Fresh-aku',
        isPersonal: false,
    }),
    new Message({
        id: '10',
        text: 'я за любой движ)',
        createdAt: new Date('2020-10-09T12:15:00'),
        author: 'Anton',
        isPersonal: false,
    }),
    new Message({
        id: '11',
        text: 'я за!',
        createdAt: new Date('2020-10-09T12:16:00'),
        author: 'Lena',
        isPersonal: false,
    }),
    new Message({
        id: '12',
        text: 'Круто, тогда договорились! Может есть какие-нибудь предложения на счет места?',
        createdAt: new Date('2020-10-09T12:20:00'),
        author: 'Artem',
        isPersonal: false,
    }),
    new Message({
        id: '13',
        text: 'О, я знаю одну крутую кафешку.',
        createdAt: new Date('2020-10-09T12:25:00'),
        author: 'Lera',
        isPersonal: false,
    }),
    new Message({
        id: '14',
        text: 'Там очень отмасферно и удобные диваны. Там даже есть гамак и качели. А еще там очень вкусный кофе. Прям сейчас бы туда сгоняла. ',
        createdAt: new Date('2020-10-09T12:26:00'),
        author: 'Lera',
        isPersonal: false,
    }),
    new Message({
        id: '15',
        text: 'ооо, звучит очень даже неплохо',
        createdAt: new Date('2020-10-09T12:27:00'),
        author: 'Lena',
        isPersonal: false,
    }),
    new Message({
        id: '16',
        text: 'ахаххаха, и правда, теперь я хочу на качели:)',
        createdAt: new Date('2020-10-09T12:28:00'),
        author: 'Fresh-aku',
        isPersonal: false,
    }),
    new Message({
        id: '17',
        text: 'Супер, тогда погнали в понедельник в часика 2?',
        createdAt: new Date('2020-10-09T12:30:00'),
        author: 'Artem',
        isPersonal: false,
    }),
    new Message({
        id: '18',
        text: 'Окей',
        createdAt: new Date('2020-10-09T12:31:00'),
        author: 'Lera',
        isPersonal: false,
    }),
    new Message({
        id: '19',
        text: 'Да, давайте.',
        createdAt: new Date('2020-10-09T12:32:00'),
        author: 'Anton',
        isPersonal: false,
    }),
    new Message({
        id: '20',
        text: 'Хорошо',
        createdAt: new Date('2020-10-09T12:31:00'),
        author: 'Lena',
        isPersonal: false,
    }),
    new Message({
        id: '21',
        text: 'До завтра)',
        createdAt: new Date('2020-10-09T12:31:00'),
        author: 'Fresh-aku',
        isPersonal: false,
    })
];

let MsgList = new MessageList(messages);

// проверка
// console.log('Возвращает первые 10 сообщений', MsgList.getPage(0, 10));
// console.log('Возвращает 10 сообщений, начиная с 11-ого', MsgList.getPage(10, 10));
// console.log('Выбирает те сообщения, где автор содержит подстроку ‘Artem’, возвращает первые 10 сообщений', MsgList.getPage(0, 10, {author: 'Artem'}));
// console.log('Выбирает те сообщения, где автор содержит подстроку ‘тогда’, возвращает первые 10 сообщений', MsgList.getPage(0, 10, {text: 'Привет'}));
// console.log(MsgList.edit(1, 'hi'));
// console.log(MsgList.edit(5, 'hello'));
// console.log(MsgList.get(10));
// проверка
console.log('добавлено новое сообщение, которое проходит валидность', MsgList.add({
    id: '22',
    text: 'Ну что, все готовы?',
    createdAt: new Date('2020-10-10T11:55:00'),
    author: 'Lena',
    isPersonal: false,
}));
console.log('Поступило новое сообщение, которое не проходит валидность', MsgList.add({
    id: '23',
    text: 'Да, идем!',
    createdAt: '2020-10-10T11:55:00',
    author: 'Artem',
    isPersonal: false,
}));
console.log('Удалено сообщение', MsgList.remove('8'));
console.log(MsgList.addAll(messages));
console.log(MsgList.clear());
