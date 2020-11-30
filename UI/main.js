"use strict";
const user = 'Fresh-aku';
class Message{
    constructor(text = '',to = null, id = null, createdAt = null, author = null, isPersonal = null){
        this._id = id;
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

    set author(author){
        this._author = author || this.user;
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
    }

    static validate(msg){
        if (typeof (msg.text) === 'string' && (msg.text.length) <= 200 && typeof (msg.isPersonal) === 'boolean' && (typeof (msg.to) === 'string' || typeof (msg.to) === 'undefined')){
            return true;
        }else{
            return false;
        }
    }

    static _filterObj = {
        author: (item, author) => !author || item.author.toLowerCase().includes(author.toLowerCase()),
        text: (item, text) => !text || item.text.toLowerCase().includes(text.toLowerCase()),
        dateTo: (item, dateTo) => !dateTo || item.createdAt < dateTo,
        dateFrom: (item, dateFrom) => !dateFrom || item.createdAt > dateFrom
    };

    get user() {
        return this._user;
    }

    set user(user) {
        this._user = user;
    }

    getPage(skip = 0, top = 10, filterConfig = {}){
        let result = this._messages.slice();
        Object.keys(filterConfig).forEach((key) => {
            result = result.filter((item) =>  MessageList._filterObj[key](item, filterConfig[key]));
        });
        result.sort((a, b) => a.createdAt - b.createdAt);
        result.splice(0, skip);
        if (result.length > top){
            result.splice(top);
        }
        return result;
    }

    get(id){
        return this._messages.find((item) => item.id == id) || false;
    }

    add(msg){
        if (this._user && MessageList.validate(msg)) {
            msg.id = `${+new Date()}`;
            msg.createdAt = new Date();
            msg.author = user;
            this._messages.push(msg);
            return true;
        }
        return false;
    }

    edit(id, msg){
        
        let index = this._messages.find(message => message.id === id);
        // let newMsg = new Message({
        //     id: msg.id, text: msg.text, createdAt: msg.createdAt, author: msg.author, isPersonal: msg.isPersonal
        //   });
        if (this._user){
            if(MessageList.validate(msg)){
                index.text = msg.text;
                return true;
            }
            return false;
        }
        return false;
    }

    remove(id){
        let index = this._messages.findIndex(message => message.id === id);
        if (this._user){
            if(index === -1){
                return false;       
            }else{
                this._messages.splice(index, 1);
                return true;         
            }
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

class UserList{
    constructor(users, activeUsers){
        this._users = users;
        this._activeUsers = activeUsers;
    }

    get users(){
        return this._users;
    }

    set users(users){
        this._users = users;
    }

    get activeUsers(){
        return this._activeUsers;
    }

    set activeUsers(activeUsers){
        this._activeUsers = activeUsers;
    }
}

class HeaderView{
    constructor(containerId){
        this.containerId = containerId;
    }

    display(user){
        const mainUser = document.getElementById(this.containerId);
        if(user){
            mainUser.textContent = user;
        }
    }
}

function formatDate(date){
    let d = date.getDate();
    let m = date.getMonth();
    let y = date.getFullYear();
    let h = date.getHours();
    let min = date.getMinutes();
    if(d < 10 && m < 10 && h < 10 && min < 10){
        d = `0${d}`;
        m = `0${m}`;
        h = `0${h}`;
        min = `0${min}`;
    }

    return `${h}:${min} ${d}.${m}.${y}`
}

class MessagesView{
    constructor(containerId){
        this.containerId = containerId;
    }
    display(msg){
        const messages = document.getElementById(this.containerId);
        messages.innerHTML = msg.map((msg) => this.getMsg(msg)).join("");
    }
    getMsg(msg, text, _author, _createdAt,to){
        if(msg._author !== user){
            return `
                <div class="others">
                    <div class="message">
                        <div class="edit-message">
                            <div class="message-container ">
                                <p class="text-message">${msg.text}</p>
                            </div>
                        </div>
                        <div class="name-of-author">
                            <p class="text-name-of-author">${msg._author}  ${formatDate(msg._createdAt)}</p>
                        </div>
                    </div>
                </div>
            `;
        } else{
            return `
                <div class="mine">
                    <div class="message">
                        <div class="edit-message">
                            <div class="edit-btn">
                                <a href="#"><img src="img/edit-outlined.svg" alt="edit-outlined" class="mine-edit-btn-item"></a>
                                <a href="#"><img src="img/trash.svg" alt="trash" class="mine-edit-btn-item"></a>
                            </div>
                            <div class="message-container mine-message-container">
                                <p class="text-message">${msg.text}</p>
                            </div>
                        </div>
                        <div class="name-of-author mine-name-of-author">
                            <p class="text-name-of-author">${msg._author}  ${formatDate(msg._createdAt)}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}
class UsersView{
    constructor(containerId){
        this.containerId = containerId;
    }
    display(users){
        const allUsers = document.getElementById(this.containerId);
        allUsers.innerHTML = users.map((userr) => this.getUsers(userr)).join("");
    }
    getUsers(name) {
        if(name !== activeF && name !== activeS){
            if(name === chatF || name === chatS){
                return `
                <div class="users">
                <p class="name-of-chat">${name}<img src="img/chat_icon.svg" alt="chat-icon" class="chat-icon"></p>
                </div>
                `;
            }else{
                return `
                <div class="users">
                    <p class="name-of-chat">${name}</p>
                </div>
            `;
            }
        }else{
            return `
            <div class="users">
                <p class="name-of-chat">${name}</p>
                <div class="online-icon"></div>
            </div>
            `;
        }
    }
}

const messages = [
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

const usersL = ["JS chat", "Karina", "Artem", "Anton", "Lera", "Rsschool chat", "Lena"];
const chatF = 'JS chat';
const chatS = 'Rsschool chat';
const activeF = 'Karina';
const activeS = 'Lera';

const MsgList = new MessageList(messages);
const userList = new UserList(usersL); 
const headerView = new HeaderView('main-user');
const messagesView = new MessagesView('messages');
const usersView = new UsersView('users');

function setCurrentUser(user){
    MsgList.user = user;
    headerView.display(user);
}

function addMessage(msg){
    // MsgList.user = user;
    // if (MsgList.add(msg)) {
    //     const newMsg = MsgList.msgs.slice(-1)[0];
    //     messagesView.addMessage(newMsg, MsgList.user);
    //     return true;
    //   }
    //   return false;
    MsgList.user = user;
    if(MsgList.add(msg)){
        messagesView.display(MsgList.getPage(0,10));
        return true;
    }
    return false;
}

function editMessage(id, msg){
    MsgList.user = user;
    if(MsgList.edit(id, msg)){
        messagesView.display(MsgList.getPage(0,10));
        return true;
    }
    return false;
}

function removeMessage(id){
    MsgList.user = user;
    if(MsgList. remove(id)){
        messagesView.display(MsgList.getPage(0,10));
        return true;
    } 
    return false;
}

function showMessages(skip = 0, top = 10, filterConfig = {}){
    messagesView.display(MsgList.getPage(skip, top, filterConfig));
}

function showUsers(){
    usersView.display(userList.users);
}

console.log(MsgList.edit('1', 'привет'));
console.log(addMessage({ text: "1" }));
console.log(addMessage({ id: '1', text: "1" }));
console.log(removeMessage(10));
setCurrentUser(user);
showMessages(0, 10);
showUsers();