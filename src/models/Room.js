class Room {
    constructor(_players, _id){
        this.players = _players
        this.id = _id
        this.plays = 0
    }

    set players(_players){
        this._players = _players
    }

    get players(){
        return this._players
    }

    set id(_id){
        this._id = _id
    }

    get id(){
        return this._id
    }

    set plays(_plays){
        this._plays = _plays
    }

    get plays(){
        return this._plays
    }
}

module.exports = Room