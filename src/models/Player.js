class Player {
    constructor(_name, _id, _socket, _symbol){
        this.name = _name
        this.id = _id
        this.socket = _socket
        this.symbol = _symbol
    }

    set name(_name){
        this._name = _name
    }

    get name(){
        return this._name
    }

    set id(_id){
        this._id = _id
    }

    get id(){
        return this._id
    }

    set socket(_socket){
        this._socket = _socket
    }

    get socket(){
        return this._socket
    }

    set symbol(_symbol){
        this._symbol = _symbol
    }

    get symbol(){
        return this._symbol
    }
}

module.exports = Player