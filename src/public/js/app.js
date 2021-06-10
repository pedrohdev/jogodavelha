const socket = io()

const winner = (fields, symbol) => {
    if(fields[0] == symbol && fields[4] == symbol && fields[8] == symbol){
        return true
    }
    
    if(fields[6] == symbol && fields[4] == symbol && fields[2] == symbol){
        return true
    }   

    if(fields[0] == symbol && fields[1] == symbol && fields[2] == symbol){
        return true
    }
    
    if(fields[3] == symbol && fields[4] == symbol && fields[5] == symbol){
        return true
    }

    if(fields[6] == symbol && fields[7] == symbol && fields[8] == symbol){
        return true
    }

    // vertical

    if(fields[0] == symbol && fields[3] == symbol && fields[6] == symbol){
        return true
    }
    
    if(fields[1] == symbol && fields[4] == symbol && fields[7] == symbol){
        return true
    }
    
    if(fields[2] == symbol && fields[5] == symbol && fields[8] == symbol){
        return true
    }
}

Vue.component('Start', {
    template: `
        <div class="start">
            <h1>Jogo da velha 🕹️👵</h1>
            <input v-model="name" id="name" placeholder="Seu nome" type="text" autocomplete="off">
            <button @click="start" id="start">Começar</button>
        </div>
    `,
    data(){
        return {
            name: ""
        }
    },
    methods: {
        start(){
            if(this.name == "" || this.name.trim().length == 0){
                alert("Preencha seu nome")
            }else {
                this.$emit("start", this.name.trim())
            }
        }
    }
})

Vue.component('Game', {
    template: `
        <div>
            <h1 align="center">{{ player.name }} x {{adversary.name}}</h1>
            <h2 align="center" v-if="turn">Sua vez</h2>
            <h2 align="center" v-else>Vez do adversário</h2>
            <div :disabled="!turn" id="game">
                <div @click="$emit('select', index)" v-for="(element, index) in board" :key="index" :disabled="element.length != 0">
                    {{ element }}
                </div>
            </div>
        </div>
    `,
    props: {
        player: Object,
        adversary: Object,
        turn: Boolean,
        board: Array
    }
})

Vue.component('Left', {
    template: `
        <div class="back">
            <h1 align="center">Seu adversário saiu do jogo</h1>
            <button @click="$emit('restart')" class="back">Recomeçar</button>
        </div>
    `
})

Vue.component('Waiting', {
    template: `
        <h1 align="center">Esperando outro jogador...</h1>
    `
})

Vue.component('Result', {
    template: `
        <div class="back">
            <h1 align="center">{{ message }}</h1>
            <button class="back" @click="$emit('restart')">Recomeçar</button>
        </div>
    `,
    props: {
        message: String
    }
})

new Vue({ 
    el: '#app',
    data(){
        return {
            fields: ["", "", "", "", "", "", "", "", ""],
            clicked: false,
            left: false,
            started: false,
            plays: 0,
            waiting: true,
            turn: "",
            player: {
                name: "",
                symbol: ""
            },
            adversary: {
                name: "",
                symbol: ""
            },
            result: ""
        }
    },
    methods: {
        select(index){
            this.plays += 1

            this.clicked = index

            socket.emit("move", index)
        },
        start(name){
            socket.emit("start", name)

            this.player.name = name
            this.started = true
        },
        restart(){
            this.fields = ["", "", "", "", "", "", "", "", ""]
            this.clicked = false
            this.left = false
            this.started = false
            this.plays = 0
            this.waiting = true
            this.turn = ""
            this.player = {
                name: "",
                symbol: ""
            }
            this.adversary = {
                name: "",
                symbol: ""
            }
            this.result = ""
        }
    },
    created(){
        socket.on("started", ({player, adversary}) => {
            this.player = player
            this.adversary = adversary

            this.waiting = false
        })

        socket.on("left", () => { 
            this.left = true
        })

        socket.on("move", position => {
            this.plays += 1
            this.fields[position] = this.adversary.symbol

            if(winner(this.fields, this.adversary.symbol)){
                this.result = "Você perdeu 😅"
                socket.emit("end")
            }
        })

        socket.on("turn", person => this.turn = person)
        socket.on("draw", () => { 
            if(this.result === "") this.result = "Deu velha 👵" 
        })
    },
    computed: {
        board(){
            if(this.clicked !== false && this.fields[this.clicked] == ""){
                this.fields[this.clicked] = this.player.symbol

                if(winner(this.fields, this.player.symbol)){
                    this.result = "Você ganhou 🎉✨"
                    socket.emit("end")
                }
            }

            return this.fields
        }
    }
})