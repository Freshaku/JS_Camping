"use strict";
let currentUser = undefined;

class  ChatApiService{
    constructor() {
        this._token = localStorage.getItem('token');  
    }

    async getPage(skip = 0, top = 10, filterConfig = {}){
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${this._token}`);

        const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
        
        const resp = await fetch(`https://jslabdb.datamola.com/messages?skip=${skip}&top=${top}`, requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.log('error', error));

        return resp;
    }

    async addMsg({ text, isPersonal, to, author }){
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${this._token}`);
        myHeaders.append('Content-Type', 'application/json');
        const raw = {text, isPersonal, to, author};

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        };
      
        const resp = await fetch("https://jslabdb.datamola.com/messages", requestOptions)
            .then((response) => {
                if (response.statusText !== 'OK') {
                    response = errorP();
                }
            })
            .catch((error) => console.log('error', error));

            return resp;
    }

    async editMessage() {
    
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${this._token}`);
        myHeaders.append('Content-Type', 'application/json');
        const raw = {text, isPersonal, to, author};
    
        const requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };
    
        const resp = await fetch("https://jslabdb.datamola.com/messages/", requestOptions)
        .then((response) => {
            if (response.statusText !== 'OK') {
                response = errorP();
            }
        })
        .catch((error) => console.log('error', error));

        return resp;
    } 
    
    async deleteMsg() {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${this._token}`);
    
        const requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          redirect: 'follow',
        };
    
        const resp = await fetch("https://jslabdb.datamola.com/messages/", requestOptions)
        .then((response) => {
            if (response.statusText !== 'OK') {
                response = errorP();
            }
        })
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));

        return resp;
    }

    async logOut() {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${this._token}`);
        myHeaders.append('Content-Length', 0);
    
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          redirect: 'follow',
        };
    
        const resp = await fetch("https://jslabdb.datamola.com/auth/logout", requestOptions)
          .then((response) => response.text())
          .then((result) => result)
          .catch((error) => console.log('error', error));

          return resp;
    }

    async getUsers() {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${this._token}`);
    
        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };
    
        const resp = await fetch("https://jslabdb.datamola.com/users", requestOptions)
          .then((response) => response.json())
          .then((result) => result)
          .catch((error) => console.log('error', error));

          return resp;
    
    }

    async putSignIn(login, password) {
        const formdata = new FormData();
        formdata.append('name', login);
        formdata.append('pass', password);
    
        const requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow',
        };
    
        const resp = await fetch("https://jslabdb.datamola.com/auth/login", requestOptions)
          .then((response) => response.json())
          .then((result) => localStorage.setItem('token', result.token))
          .catch((error) => console.log('error', error));

          return resp;

    }

    async putLogIn(login, password) {
        const formdata = new FormData();
        formdata.append('name', login);
        formdata.append('pass', password);
    
        const requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow',
        };
        const resp = await fetch("https://jslabdb.datamola.com/auth/register", requestOptions)
          .then((response) => response.json())
          .catch((error) => console.log('error', error));

        return resp;
    }
}
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
        this._user = currentUser;
        // this.restore(messages);
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
        let result =this._messages.slice();
        Object.keys(filterConfig).forEach((key) => {
            result = result.filter((item) =>  MessageList._filterObj[key](item, filterConfig[key]));
        });
        result.sort((a, b) => a.createdAt - b.createdAt);
        result.splice(0, skip);
        if (result.length > top) {
            result.splice(top);
        }
        return result;
    }

    get(id){
        return this._messages.find((item) => item.id == id) || false;
    }

    add(msg){
        const newMsg = new Message(
            msg,
            false,
            `${+new Date()}`,
            new Date(),
            currentUser,
        );
        if (MessageList.validate(newMsg)) {
            this._messages.push(newMsg);
            this.save();
            return true;
        }
        return false;
    }

    edit(id, msg){
        let foundMsg = this._messages.find(message => message.id == id);
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
        let index = this._messages.findIndex(msg => msg.id == id);
        if(index === -1){
            return false;       
        }else{
            this._messages.splice(index, 1);
            this.save();
            return true;         
        }
    }


    clear() {
        this._messages = [];
    }

    save(){
        localStorage.setItem('messages', JSON.stringify(this._messages));
    }

    // restore(msg){
    //     const items = localStorage.getItem('messages');
    //     if(this._messages === [])
    //     {this.addAll(JSON.parse(items) || msg);}
    // } 
}

class UserList{
    constructor(users, activeUsers){
        this._users = users;
        this._activeUsers = activeUsers;
        // this.restore(users);
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
        this._users.push(user);
        this.save();
     }

    save(){
        localStorage.setItem('allUsers', JSON.stringify(this.users));
    }

    // restore(users) {
    //     const items = localStorage.getItem('allUsers');
    //     this.users = (JSON.parse(items) || users);
    // }
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
    getMsg(msg,_id, text, _author, _createdAt){
        if(msg._author !== currentUser){
            return `
                <div class="others">
                    <div class="message">
                        <div class="edit-message">
                            <div class="message-container ">
                                <p class="text-message">${msg.text}</p>
                            </div>
                        </div>
                        <div class="name-of-author">
                            <p class="text-name-of-author">${msg._author}  ${msg._createdAt.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            `;
        } else{
            return `
                <div class="mine">
                    <div class="message my-message">
                        <p class="visible-id-hidden">${msg.id}</p>     
                        <div class="edit-message">
                            <div class="edit-btn">
                                <button type="button" class="editt-btn edit-remove-btns" onclick="editMessage(${msg.id}, '${msg.text}')"><img src="img/edit-outlined.svg" alt="edit-outlined" id="edit-btn" class="mine-edit-btn-item"></button>
                                <button type="button" class="delete-btn edit-remove-btns" onclick="deleteMessage(${msg.id})"><img src="img/trash.svg" alt="trash" id="delete-btn" class="mine-edit-btn-item"></button>
                            </div>
                            <div class="message-container mine-message-container">
                                <p class="text-message my-txt-msg">${msg.text}</p>
                            </div>
                        </div>
                        <div class="name-of-author mine-name-of-author">
                            <p class="text-name-of-author">${msg._author}  ${msg._createdAt.toLocaleString()}</p>
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
                <div class="users" onclick="sendPrivateMsg()">
                <p class="name-of-chat">${name}<img src="img/chat_icon.svg" alt="chat-icon" class="chat-icon"></p>
                </div>
                `;
            }else{
                return `
                <div class="users" onclick="sendPrivateMsg()">
                    <p class="name-of-chat">${name}</p>
                </div>
            `;
            }
        }else{
            return `
            <div class="users" onclick="sendPrivateMsg()">
                <p class="name-of-chat">${name}</p>
                <div class="online-icon"></div>
            </div>
            `;
        }
    }
}

class ChatController{
    constructor(messages, users, activeUsers){
        this.chatApi = new ChatApiService();
        this.msgList = new MessageList(messages);
        this.userList = new UserList(users, activeUsers); 
        this.headerView = new HeaderView('main-user');
        this.messagesView = new MessagesView('messages');
        this.usersView = new UsersView('users');
    }

    setCurrentUser(user){
        currentUser = user;
        this.msgList.user = user;
        this.headerView.display(user);
    }
    
    addMessage(msg){
        // const resp = await this.chatApi.addMsg({ text: msg.text, author: msg.author, isPersonal: false });
        // await chatController.showMessages(0, 30, { isPersonal: false }, 2000);
        this.msgList.user = currentUser;
        if(this.msgList.add(msg)){
            this.messagesView.display(this.msgList.getPage(0,10));
            return true;
        }
        return false;
    }
    
    editMessage(id, msg){
        // const resp = await this.chatApi.editMessage(id, msg);
        //  await chatController.showMessages(0, 30, { isPersonal: false }, 2000);
        this.msgList.user = currentUser;
        if(this.msgList.edit(id, msg)){
            this.messagesView.display(this.msgList.getPage(0,10));
            return true;
        }
        return false;
    }
    
    removeMessage(id){
        // const resp = await this.chatApi.deleteMsg(id);
        // await chatController.showMessages(0, 30, { isPersonal: false }, 2000);
        this.msgList.user = currentUser;
        if(this.msgList.remove(id)){
            this.messagesView.display(this.msgList.getPage(0,25));
            return true;
        } 
        return false;
    }

    
    showMessages(skip = 15, top = 10, filterConfig = {}, time = 10000){
        this.messagesView.display(this.msgList.getPage(skip, top, filterConfig));
    }
    
    showUsers(time = 10000){
        this.usersView.display(this.userList.users);
        this.msgList.save();
        this.userList.save();
    }

    

    signUpP(){
        signUp.style.display="flex";
        signIn.style.display="none";
        main.style.display="none";
        errorBodyPage.style.display="none";
    }
    signinP(){
        signIn.style.display="flex";
        signUp.style.display="none";
        main.style.display="none";
        errorBodyPage.style.display="none";
    }

}

function mainPageNoSignUp(){
    signIn.style.display="none";
    signUp.style.display="none";
    main.style.display="block";
    hide.style.display="none";
    mainPageFromError.style.display="none";
    errorBodyPage.style.display="none";
}

function mainPage(){
    signIn.style.display="none";
    signUp.style.display="none";
    main.style.display="block";
    hide.style.display="flex";
    mainPageFromError.style.display="none";
    errorBodyPage.style.display="none";
}

function errorP(){
    signIn.style.display="none";
    signUp.style.display="none";
    main.style.display="none";
    hide.style.display="none";
    mainPageFromError.style.display="inline-block";
    errorBodyPage.style.display="flex";
    bodyColorError.style.backgroundColor ="#FFF";
}

function signInPage(){
    chatController.signinP();
    formSignIn.onsubmit = function(event) {
        event.preventDefault();
        const hasUser = chatController.userList.users.find((login) => login == nameSignIn.value);
        // try{
        //     await  chatController.chatApi.putSignIn(nameSignIn.value, passS.value)
        //     .then((result)=>{
                if(hasUser){ 
                    // chatController.chatApi._token = JSON.parse(result)._token;
                    mainPage();
                    chatController.setCurrentUser(nameSignIn.value);
                    btnToSignIn.style.display="none";
                    if(password.value === ''){
                        errorS.textContent = "The password is incorrect";
                    }
                }
        //     })
        // }catch(error){
            
        // }
    };
}

function signUpPage(){
    chatController.signUpP();
    formSignUp.onsubmit = async function(event) {
        event.preventDefault();
        const newUser = nameSignUp.value;
        // try{
            if(newUser){
                if (passL.value === rPassL.value && passL.value !== ''){
                    // await chatController.chatApi.putLogIn(nameSignUp.value, passL.value)
                    chatController.userList.addUser(newUser);
                    mainPage();
                    chatController.setCurrentUser(nameSignUp.value);
                    btnToSignIn.style.display="none";
                }else{
                    errorL.textContent = "The password is incorrect"
                }
            };
        // }catch(error){
        //     errorL.textContent = "The password is incorrect"
        // }
    };
}

function exitF(){
    chatController.signinP();
    currentUser = '';
    chatController.setCurrentUser("currentUser");
}

function loadMoreMsgs(){
    debugger;
    if(chatController.msgList._messages.length > 10){
        chatController.showMessages(0, 25, {}, 2000);
    }
}

function findByFilter(){
    debugger;
    event.preventDefault();
    // try{
    //     await chatController.chatApi.getPage(skip, top, {});
        const obj = {
            author: findName.value,
            text: findText.value,
            dateFrom: findDate.value,
        };
        const filters = obj;
        chatController.showMessages(0, 25, filters,2000);
        findName.value = '';
        findText.value = '';
        findDate.value = '';
    // }catch(error){
        if (findName.value !== chatController.author || findText.value !== chatController.text || findDate.value !== chatController.dateFrom) {
            errorF.textContent = "Oops! Message not found!"
        }
    // }
}

function sendPrivateMsg(){
    const toUser = document.querySelector('.name-of-chat');
    chatController.addMessage(writeMsg.value, true, toUser.textContent); 
    writeMsg.value = '';    
    const privatContainer = document.querySelector('.mine-message-container');
    privatContainer.style.border = "1px solid red";
    chatController.showMessages(15, 10, {}, 2000);
}

function sendMsg(){
    chatController.addMessage(writeMsg.value); 
    chatController.showMessages(15, 10, {}, 2000);
    writeMsg.value = '';      
}

function editMessage(id){
    debugger;
    const message = document.querySelector('.my-txt-msg');
    writeMsg.value = message.textContent;
    chatController.editMessage(id, writeMsg.value);
    writeMsg.value
    chatController.showMessages(15, 10, {}, 2000);
    
}

function deleteMessage(id){
    debugger;
    chatController.removeMessage(id);
    chatController.showMessages(15, 10, {}, 2000);
}


const bodyColorError = document.getElementById('body-color-for-error');
const errorBodyPage = document.getElementById('main-error-body');
const mainPageFromError = document.getElementById('btn-to-mainPage');
const signIn = document.getElementById('signin-page');
const formSignIn = document.getElementById('formsignin');
const nameSignIn = document.getElementById('namesig');
const passS = document.getElementById('passsign');
const btnSignIn = document.getElementById('btn-sigin');

const signUp = document.getElementById('login-page');
const formSignUp = document.getElementById('formlogin');
const nameSignUp = document.getElementById('namelog');
const passL = document.getElementById('passlog');
const rPassL = document.getElementById('rpasslog');
const btnSignUp = document.getElementById('btn-login');

const errorL = document.getElementById('errorL');
const errorS = document.getElementById('errorS');
const errorF = document.getElementById('errorF');

const toSignIn = document.getElementById('to-signin');
const toSignUp = document.getElementById('to-login');
const toMainS = document.getElementById('to-mains');
const toMainE = document.getElementById('btn-to-mainPage')
const toMainL = document.getElementById('to-mainl');
const exit = document.getElementById('exit');
const btnToSignIn = document.getElementById('btn-to-signin');

const main = document.getElementById('main-chat');

const findName = document.getElementById('user-name');
const findDate = document.getElementById('date');
const findText = document.getElementById('text');
const findBtn = document.getElementById('find-btn');



const loadMore = document.getElementById('load-more-btn');


const writeMsg = document.getElementById('write');
const btnSend = document.getElementById('send-msg-btn');
const hide = document.getElementById('mess-hide')

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

const users = ["JS chat", "Karina", "Artem", "Anton", "Lera", "Rsschool chat", "Lena"];
const activeUsers = ["Karina", "Lera"]
const chatF = 'JS chat';
const chatS = 'Rsschool chat';
const activeF = 'Karina';
const activeS = 'Lera';

const chatController = new ChatController(messages, users, activeUsers);
chatController.showUsers();
chatController.showMessages();
mainPageNoSignUp();
toMainS.addEventListener('click', () =>{mainPageNoSignUp()});
toMainL.addEventListener('click', () =>{mainPageNoSignUp()});
btnToSignIn.addEventListener('click', () =>{signInPage()});
toSignUp.addEventListener('click', () =>{signUpPage()});
btnToSignIn.addEventListener('click', () =>{signInPage()});
toSignIn.addEventListener('click', () =>{signInPage()});
toSignUp.addEventListener('click', () =>{signUpPage()});
exit.addEventListener('click', () =>{exitF()});
toMainE.addEventListener('click', () =>{mainPageNoSignUp()});
btnSend.addEventListener('click', () =>{sendMsg()});
loadMore.addEventListener('click', () =>{loadMoreMsgs()});
findBtn.addEventListener('click', () =>{findByFilter()});




