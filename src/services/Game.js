const Room = require("../models/Room")
const Player = require("../models/Player")

class Game {
    constructor(){
        this.rooms = {}
    }

    create(name, socket){
        const player = new Player(name, socket.id, socket, "X")
        const room = new Room([player], socket.id)

        this.rooms[socket.id] = room
    }

    join(name, socket){
        const rooms = Object.values(this.rooms)
        const player = new Player(name, socket.id, socket, "O")

        const availables = rooms.filter(({ players }) => players.length == 1)
        
        if(availables.length != 0){
            let [ { id } ] = availables  
            this.rooms[id].players.push(player)
            return this.rooms[id].players
        }else {
            this.create(name, socket)
            return false
        }

    }

    move(position, id){
        const rooms = Object.values(this.rooms).filter(({players}) => players[0].id == id ||  players[1].id == id)

        if(rooms.length != 0 && rooms[0].players[1]){
            const [ room ] = rooms

            this.rooms[room.id].plays += 1

            if(room.players[0].id == id){
                return { adversary: room.players[1].socket, plays: this.rooms[room.id].plays}
            }
            
            if(room.players[1].id == id){
                return { adversary: room.players[0].socket, plays:  this.rooms[room.id].plays}
            }
            
        }
    }

    disconnect(id){
        const rooms = Object.values(this.rooms).filter(({players}) => { 
            return players[0].id == id ||  players[1] && players[1].id == id 
        })

        if(rooms.length != 0){
            const [ room ] = rooms
            delete this.rooms[room.id]
            
            if(room.players[0].id == id && room.players[1]){
                return room.players[1].socket
            }else if(room.players[1] && room.players[1].id == id){
                return room.players[0].socket
            }else {
                return false
            }
        }
    }
}

module.exports = new Game()