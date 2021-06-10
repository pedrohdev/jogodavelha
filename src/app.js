const express = require("express")
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const Game = require("./services/Game")

io.on('connection', (socket) => {
    socket.on("start", name => {
        let join = Game.join(name, socket)
        
        if(join){
            let [ player, adversary ] = join

            player.socket.emit("turn", true)
            socket.emit("turn", false)

            player.socket.emit("started", { 
                player: {
                    name: player.name,
                    symbol: player.symbol
                },
                adversary :{
                    name: adversary.name,
                    symbol: adversary.symbol
                } 
            })

            socket.emit("started", { 
                player: {
                    name: adversary.name,
                    symbol: adversary.symbol
                },
                adversary :{
                    name: player.name,
                    symbol: player.symbol
                } 
            })
        }
    })

    socket.on("move", position => {
        let { adversary, plays } = Game.move(position, socket.id)
        
        if(plays == 9){
            adversary.emit("move", position)

            setTimeout(() => {
                adversary.emit("draw")
                socket.emit("draw")
                Game.disconnect(socket.id)
            }, 300)
        }else {
            adversary.emit("move", position)
            socket.emit("turn", false)
            adversary.emit("turn", true)
        }
    })

    socket.on("disconnect", () => {
        let adversary = Game.disconnect(socket.id)

        if(adversary) adversary.emit("left")
    })

    socket.on("end", () => {
        Game.disconnect(socket.id)
    })
})

app.use(express.static(`${__dirname}/public`))

server.listen(process.env.PORT || 3000)