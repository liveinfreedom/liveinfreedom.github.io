let iexApp = {};

// 1. Counter
const Counter = {
    data() {
        return {
            active: false,
            counter: 5,
            timerId: null
        }
    },
    methods: {
        clickHandler(){
            if (this.active) {
                clearInterval(this.timerId)
            } else {
                this.timerId = setInterval(() => {
                    this.counter++
                }, 1000)
            }
            this.active = !this.active;
        }
    }
}
Vue.createApp(Counter).mount('#counter')

// 2. ListRendering
const ListRendering = {
    data() {
        return {
            todos: [
                { text: 'Learn JavaScript' },
                { text: 'Learn Vue' },
                { text: 'Build something awesome' }
            ]
        }
    }
}
Vue.createApp(ListRendering).mount('#list-rendering')
