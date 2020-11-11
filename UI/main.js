'use strict';
const ModuleMessages = (function() {
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
            this._user = user;
            this._id =id;
            this.text = text;
            this._createdAt = createdAt || new Date();
            this._author = author || this.user;
            this.isPersonal = isPersonal ?? !!to;
            this._to = to;
        }

        get user() {
            return this._user;
        }
    
        set user(user) {
            this._user = user;
        }
        
        get id(){
            return this._id;
        }

        set id(id){
            this._id =id;
        }

        get text(){
            return this.text;
        }

        set text(text){
            this.text = text;
        }

        get createdAt(){
            return this._createdAt;
            // для вывода сообщения если дата сегодня, то выводимм только время
        }

        set createdAt(createdAt){
            this._createdAt = createdAt || new Date();
        }

        get author(){
            return this._author;
        }

        set author(author){
            this._author = author || user;
        }

        get isPersonal(){
            return this.isPersonal;
        }

        set isPersonal(isPersonal){
            this.isPersonal = isPersonal;
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
            msg = new Message(text, to, id, createdAt, author, isPersonal);
            if (msg.validate(msg)){
                this._messages.push(msg);
                return true;
            }
            return false;
        }

        addAll(messages) {
            const notValidatedMessages = [];
            messages.forEach((message) => {
                if (MessageList.validate(message)) {
                  this._messages.push(message);
                } else {
                    notValidatedMessages.push(message);
                }
            });
            return notValidatedMessages;
        }

        edit(idNew, msg, to){
            const message = this._messages.find(({id}) => idNew === id);
            if (MessageList.validate(obj)){
                const obj = {text: msg, to: to};
                message.edit(obj);
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

        static validate(){
            return Object.keys(validateObj).every((key) => validateObj[key](message));
        }

        clear() {
            this._messages = [];
        }
    }
})();
