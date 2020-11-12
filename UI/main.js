"use strict";
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

    static _filterObj = {
        author: (item, author) => !author || item.author.toLowerCase().includes(author.toLowerCase()),
        text: (item, text) => !text || item.text.toLowerCase().includes(text.toLowerCase()),
        dateTo: (item, dateTo) => !dateTo || item.createdAt < dateTo,
        dateFrom: (item, dateFrom) => !dateFrom || item.createdAt > dateFrom
    };

    constructor(messages){
        this._messages = messages.slice();
        this._user = user;
    }

    get user() {
        return this._user;
    }

    getPage(skip = 0, top = 10, filterConfig = {}){
        let result = this._messages.slice(skip, skip + top);
        Object.keys(filterConfig).forEach((key) => {
            result = result.filter((item) =>  MessageList._filterObj[key](item, filterConfig[key]));
        });
        result.sort((a, b) => a.createdAt - b.createdAt);
        // result.slice(skip, skip + top);
        return result;
    }

    get(id){
        return this._messages.find((item) => item.id == id) || false;
    }

    add(msg){
        if (MessageList.validate(msg)) {
            msg.id = `${+new Date()}`;
            msg.createdAt = new Date();
            msg.author = user;
            messages.push(msg);
            return true;
        }
        return false;
    }

    edit(id, msg){
        let index = this._messages.findIndex(msg => msg.id == id);
        if (MessageList.validate(msg)){
            this._messages[index].text = msg.text;
            return true;
        }
        return false;
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
        if (typeof(message.id && message.text && message.author) === 'string'
        && typeof (message.createdAt) === 'object' && typeof (message.isPersonal) === 'boolean' && (typeof (message.to) === 'string' || typeof (message.to) === 'undefined')){
            return true;
        }else{
            return false;
        }
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
    new Message(
        'Привет, как у вас успехи с домашкой?)',
        false,    
        '1',
        new Date('2020-10-09T11:44:00'),
        'Artem', 
    ),
    new Message(
        'Привет!',
        false,
        '2',
        new Date('2020-10-09T11:54:00'),
        'Lera',
    ),
    new Message(
        'Привет, все отлично, только застряла на 3-м задании.',  
        'Artem',
        '3',
        new Date('2020-10-09T11:55:00'),
        'Lena',
        true,
    ),
    new Message(
        'Все довольно таки не плохо, но требует времени)',
        false,
        '4',
        new Date('2020-10-09T12:01:00'),
        'Fresh-aku',
    ),
    new Message(
        'Так что работаем ребята:)',
        false,
        '5',
        new Date('2020-10-09T12:05:00'),
        'Anton',
    ),
    new Message(
        'хах, это точно',
        false,
        '6',
        new Date('2020-10-09T12:06:00'),
        'Fresh-aku',
    ),
    new Message(
        'А вообще у кого какие планы на выходные? Может собиремся вместе где-нибудь и вместе порешаем интересные задачки?)',
        false,
        '7',
        new Date('2020-10-09T12:07:00'),
        'Artem',
    ),
    new Message(
        'Хорошая идея, я за!',
        false,
        '8',
        new Date('2020-10-09T12:10:00'),
        'Lera',
    ),
    new Message(
        'и я)',
        false,
        '9',
        new Date('2020-10-09T12:11:00'),
        'Fresh-aku',
    ),
    new Message(
        'я за любой движ)',
        false,
        '10',
        new Date('2020-10-09T12:15:00'),
        'Anton',
    ),
    new Message(
        'я за!',
        false,
        '11',
        new Date('2020-10-09T12:16:00'),
        'Lena',
    ),
    new Message(
        'Круто, тогда договорились! Может есть какие-нибудь предложения на счет места?',
        false,
        '12',
        new Date('2020-10-09T12:20:00'),
        'Artem',
    ),
    new Message(
        'О, я знаю одну крутую кафешку.',
        false,
        '13',
        new Date('2020-10-09T12:25:00'),
        'Lera',
    ),
    new Message(
        'Там очень отмасферно и удобные диваны. Там даже есть гамак и качели. А еще там очень вкусный кофе. Прям сейчас бы туда сгоняла. ',
        false,
        '14',
        new Date('2020-10-09T12:26:00'),
        'Lera',
    ),
    new Message(
        'ооо, звучит очень даже неплохо',
        false,
        '15',
        new Date('2020-10-09T12:27:00'),
        'Lena',
    ),
    new Message(
        'ахаххаха, и правда, теперь я хочу на качели:)',
        false,
        '16',
        new Date('2020-10-09T12:28:00'),
        'Fresh-aku',
    ),
    new Message(
        'Супер, тогда погнали в понедельник в часика 2?',
        false,
        '17',
        new Date('2020-10-09T12:30:00'),
        'Artem',
    ),
    new Message(
        'Окей',
        false,
        '18',
        new Date('2020-10-09T12:31:00'),
        'Lera',
    ),
    new Message(
        'Да, давайте.',
        false,
        '19',
        new Date('2020-10-09T12:32:00'),
        'Anton',
    ),
    new Message(
        'Хорошо',
        false,
        '20',
        new Date('2020-10-09T12:31:00'),
        'Lena',
    ),
    new Message(
        'До завтра)',
        false,
        '21',
        new Date('2020-10-09T12:31:00'),
        'Fresh-aku',
    )
];

let MsgList = new MessageList(messages);

// проверка
console.log('Возвращает первые 10 сообщений', MsgList.getPage(0, 10));
console.log('Возвращает 10 сообщений, начиная с 11-ого', MsgList.getPage(10, 10));
console.log('Выбирает те сообщения, где автор содержит подстроку ‘Artem’, возвращает первые 10 сообщений', MsgList.getPage(0, 10, {author: 'Artem'}));
console.log('Выбирает те сообщения, где автор содержит подстроку ‘тогда’, возвращает первые 10 сообщений', MsgList.getPage(0, 10, {text: 'Привет'}));
console.log(MsgList.edit(1, 'hi'));
console.log(MsgList.edit(5, 'hello'));
console.log(MsgList.get(10));
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
MsgList.clear();
console.log(MsgList);
