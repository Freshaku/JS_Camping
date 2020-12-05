"use strict";
let user = '';
class Message{
    constructor(text = '',to = null, id = null, createdAt = null, author = null, isPersonal = null){
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
        this.restore(messages);
    }

    addAll(messages){
        const notValidatedMessages = [];
        for (let i = 1; i < messages.length; i++) {
            const newMsg = new Message( messages[i].text, messages[i]._id,messages[i]._to, messages[i]._createdAt,  messages[i]._author, messages[i].isPersonal);
            if (MessageList.validate(newMsg)) {
                this._messages.push(newMsg);
            } else {
                notValidatedMessages.push(newMsg);
            }
        }
        this.save();
        return notValidatedMessages;
    }

    static validate(msg){
        if (typeof (msg.text) === 'string' && (msg.text.length) <= 200 ){
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

    get messages(){
        return this._messages;
    }

    set messages(messages){
        if (messages.length === 0) {
            this._messages = messages.slice();
        } else {
            for (let i = 0; i < messages.length; i++) {
                if( MessageList.validate(messages[i])){
                   return this._messages.push(messages[i]);
                }else{
                    return false;
                }
            }
        }
    }

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
        if (!this._user){
            return false;
        }
        const newMsg = new Message(
            msg,
            false,
            `${+new Date()}`,
            new Date(),
            user,
        );
        if (MessageList.validate(newMsg)) {
            this._messages.push(newMsg);
            this.save();
            return true;
        }
        return false;
    }

    edit(id, msg){
        let foundMsg = this._messages.find(message => message.id === id);
        if (!this._user){
            return false;
        }
        foundMsg.text = msg;
        const newMsg = new Message( foundMsg.text, foundMsg._id,foundMsg._to, foundMsg._createdAt,  foundMsg._author, foundMsg.isPersonal);
        if(MessageList.validate(newMsg)){
            foundMsg = newMsg;
            this.save();
            return true;
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


    clear() {
        this._messages = [];
    }

    save(){
        localStorage.setItem('messages', JSON.stringify(this._messages));
    }

    restore(){
        const items = localStorage.getItem('messages');
        this.clear();
        this.addAll(JSON.parse(items));
    } 
}

class UserList{
    constructor(users, activeUsers){
        this._users = users;
        this._activeUsers = activeUsers;
        this.restore(users);
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

    addUser(user) {
        this.users.push(user);
        this.save();
     }

    save(){
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    restore() {
        const items = localStorage.getItem('users');
        this.users = (JSON.parse(items));
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
    let d = new Date(date.getDate());
    let m = new Date(date.getMonth());
    let y = new Date(date.getFullYear());
    let h = new Date(date.getHours());
    let min = new Date(date.getMinutes());
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
                            <p class="text-name-of-author">${msg._author}  ${msg._createdAt}</p>
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
                                <a href="#"><img src="img/edit-outlined.svg" alt="edit-outlined" id="edit-btn" class="mine-edit-btn-item"></a>
                                <a href="#"><img src="img/trash.svg" alt="trash" id="delete-btn" class="mine-edit-btn-item"></a>
                            </div>
                            <div class="message-container mine-message-container">
                                <p class="text-message">${msg.text}</p>
                            </div>
                        </div>
                        <div class="name-of-author mine-name-of-author">
                            <p class="text-name-of-author">${msg._author}  ${msg._createdAt}</p>
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

class ChatController{
    constructor(messages, users, activeUsers){
        this.msgList = new MessageList(messages);
        this.userList = new UserList(users, activeUsers); 
        this.headerView = new HeaderView('main-user');
        this.messagesView = new MessagesView('messages');
        this.usersView = new UsersView('users');
    }

    setCurrentUser(user){
        this.msgList.user = user;
        this.headerView.display(user);
    }
    
    addMessage(msg){
        this.msgList.user = user;
        if(this.msgList.add(msg)){
            this.messagesView.display(this.msgList.getPage(0,10));
            return true;
        }
        return false;
    }
    
    editMessage(id, msg){
        this.msgList.user = user;
        if(this.msgList.edit(id, msg)){
            this.messagesView.display(this.msgList.getPage(0,10));
            return true;
        }
        return false;
    }
    
    removeMessage(id){
        this.msgList.user = user;
        if(this.msgList. remove(id)){
            this.messagesView.display(this.msgList.getPage(0,10));
            return true;
        } 
        return false;
    }
    
    showMessages(skip = 0, top = 10, filterConfig = {}){
        this.messagesView.display(this.msgList.getPage(skip, top, filterConfig));
    }
    
    showUsers(){
        this.usersView.display(this.userList.users);
        this.msgList.save();
        this.userList.save();
    }

    mainPageNoLogIn(){
        signIn.style.display="none";
        logIn.style.display="none";
        main.style.display="block";
        writeMsg.style.display="none";
        btnSend.style.display="none";
    }

    mainPage(){
        signIn.style.display="none";
        logIn.style.display="none";
        main.style.display="block";
        writeMsg.style.display="block";
        btnSend.style.display="flex";
    }

    loginP(){
        logIn.style.display="flex";
        signIn.style.display="none";
        main.style.display="none";
    }
    signinP(){
        signIn.style.display="flex";
        logIn.style.display="none";
        main.style.display="none";
    }

}

function signInPage(){
    chatController.signinP();
    formSignIn.onsubmit = function(event) {
        event.preventDefault();
        const hasUser = chatController.userList.users.find((login) => login === nameSignIn.value);
        if(hasUser){ 
            chatController.mainPage();
            chatController.setCurrentUser(nameSignIn.value);
            btnToSignIn.style.display="none";
            if(passS.value === ''){
                errorS.textContent = "The password is incorrect";
            }
        }
    };
}

function logInPage(){
    chatController.loginP();
    formLogin.onsubmit = function(event) {
        event.preventDefault();
        const newUser = nameLogin.value;
        if(newUser){
            if (passL.value === rPassL.value && passL.value !== ''){
                chatController.userList.addUser(newUser);
                chatController.mainPage();
                chatController.setCurrentUser(nameLogin.value);
                btnToSignIn.style.display="none";
            }else{
                errorL.textContent = "The password is incorrect"
            }
        };
    };
}

function exitF(){
    chatController.signinP();
    user = '';
    this.setCurrentUser(user);
}

function loadMoreMsgs(){
    debugger;
    if (chatController.msgList._messages.length > 10) {
        chatController.showMessages(0, 10);
    }
}

function findByFilter(){
    if(findName){
        chatController.author = findName.value;
        chatController.showMessages();
    }
    if(findText){
        chatController.text = findText.value;
        chatController.showMessages();
    }
    if(findDate){
        chatController.dateFrom = findDate.value;
        chatController.showMessages();
    }
    if(findName.value !== chatController.author || findText.value !== chatController.text || findDate.value !== chatController.dateFrom || findName.value === "" || findText.value === ""){
        errorF.textContent = "Oops! Message not found!"
    }
}

function editMessage(id){
    chatController.editMessage(id, writeMsg.value);
}

function deleteMessage(id){
    chatController.removeMessage(id);
}


function sendMsg(){
    chatController.addMessage(writeMsg.value,false)
    writeMsg.value = ""
}

const signIn = document.getElementById('signin-page');
const formSignIn = document.getElementById('formsignin');
const nameSignIn = document.getElementById('namesig');
const passS = document.getElementById('passsign');
const btnSignIn = document.getElementById('btn-sigin');

const logIn = document.getElementById('login-page');
const formLogin = document.getElementById('formlogin');
const nameLogin = document.getElementById('namelog');
const passL = document.getElementById('passlog');
const rPassL = document.getElementById('rpasslog');
const btnLogIn = document.getElementById('btn-login');

const errorL = document.getElementById('errorL');
const errorS = document.getElementById('errorS');
const errorF = document.getElementById('errorF');

const toSignIn = document.getElementById('to-signin');
const toLogIn = document.getElementById('to-login');
const toMainS = document.getElementById('to-mains');
const toMainL = document.getElementById('to-mainl');
const exit = document.getElementById('exit');
const btnToSignIn = document.getElementById('btn-to-signin');

const main = document.getElementById('main-chat');

const findName = document.getElementById('user-name');
const findDate = document.getElementById('date');
const findText = document.getElementById('text');
const findBtn = document.getElementById('find-btn');

const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById('delete-btn');

const loadMore = document.getElementById('load-more-btn');

// const privetMsg;

const writeMsg = document.getElementById('write');
const btnSend = document.getElementById('send-msg-btn');;

const messages = [
    new Message(
        'Привет, как у вас успехи с домашкой?)',
        '1',
        false,    
        new Date('2020-10-09T11:44:00'),
        'Artem', 
    ),
    new Message(
        'Привет!',
        '2',
        false,
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
        '4',
        false,
        new Date('2020-10-09T12:01:00'),
        'Fresh-aku',
    ),
    new Message(
        'Так что работаем ребята:)',
        '5',
        false,
        new Date('2020-10-09T12:05:00'),
        'Anton',
    ),
    new Message(
        'хах, это точно',
        '6',
        false,
        new Date('2020-10-09T12:06:00'),
        'Fresh-aku',
    ),
    new Message(
        'А вообще у кого какие планы на выходные? Может собиремся вместе где-нибудь и вместе порешаем интересные задачки?)',
        '7',
        false,
        new Date('2020-10-09T12:07:00'),
        'Artem',
    ),
    new Message(
        'Хорошая идея, я за!',
        '8',
        false,
        new Date('2020-10-09T12:10:00'),
        'Lera',
    ),
    new Message(
        'и я)',
        '9',
        false,
        new Date('2020-10-09T12:11:00'),
        'Fresh-aku',
    ),
    new Message(
        'я за любой движ)',
        '10',
        false,
        new Date('2020-10-09T12:15:00'),
        'Anton',
    ),
    new Message(
        'я за!',
        '11',
        false,
        new Date('2020-10-09T12:16:00'),
        'Lena',
    ),
    new Message(
        'Круто, тогда договорились! Может есть какие-нибудь предложения на счет места?',
        '12',
        false,
        new Date('2020-10-09T12:20:00'),
        'Artem',
    ),
    new Message(
        'О, я знаю одну крутую кафешку.',
        '13',
        false,
        new Date('2020-10-09T12:25:00'),
        'Lera',
    ),
    new Message(
        'Там очень отмасферно и удобные диваны. Там даже есть гамак и качели. А еще там очень вкусный кофе. Прям сейчас бы туда сгоняла. ',
        '14',
        false,
        new Date('2020-10-09T12:26:00'),
        'Lera',
    ),
    new Message(
        'ооо, звучит очень даже неплохо',
        '15',
        false,
        new Date('2020-10-09T12:27:00'),
        'Lena',
    ),
    new Message(
        'ахаххаха, и правда, теперь я хочу на качели:)',
        '16',
        false,
        new Date('2020-10-09T12:28:00'),
        'Fresh-aku',
    ),
    new Message(
        'Супер, тогда погнали в понедельник в часика 2?',
        '17',
        false,
        new Date('2020-10-09T12:30:00'),
        'Artem',
    ),
    new Message(
        'Окей',
        '18',
        false,
        new Date('2020-10-09T12:31:00'),
        'Lera',
    ),
    new Message(
        'Да, давайте.',
        '19',
        false,
        new Date('2020-10-09T12:32:00'),
        'Anton',
    ),
    new Message(
        'Хорошо',
        '20',
        false,
        new Date('2020-10-09T12:31:00'),
        'Lena',
    ),
    new Message(
        'До завтра)',
        '21',
        false,
        new Date('2020-10-09T12:31:00'),
        'Fresh-aku',
    )
];

const users = ["JS chat", "Karina", "Artem", "Anton", "Lera", "Rsschool chat", "Lena"];
const activeUsers = ["Karina", "Lera"]
const chatF = 'JS chat';
const chatS = 'Rsschool chat';
const activeF = 'Karina';
const activeS = 'Lera';

const chatController = new ChatController(messages, users, activeUsers);
chatController.showUsers();
chatController.showMessages();
chatController.mainPageNoLogIn();
toMainS.addEventListener('click', () =>{chatController.mainPageNoLogIn()});
toMainL.addEventListener('click', () =>{chatController.mainPageNoLogIn()});
btnToSignIn.addEventListener('click', () =>{signInPage()});
toLogIn.addEventListener('click', () =>{logInPage()});
btnToSignIn.addEventListener('click', () =>{signInPage()});
toSignIn.addEventListener('click', () =>{signInPage()});
toLogIn.addEventListener('click', () =>{logInPage()});
exit.addEventListener('click', () =>{exitF()});
btnSend.addEventListener('click', () =>{sendMsg()});
loadMore.addEventListener('click', () =>{loadMoreMsgs()});
findBtn.addEventListener('click', () =>{findByFilter()});
// editBtn.addEventListener('click', () =>{editMessage()});
// deleteBtn.addEventListener('click', () =>{deleteMessge()});



