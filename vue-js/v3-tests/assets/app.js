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

// 3. DynamicItems
const dynamicItems = {
    data() {
        return {
            tasks: [
                { id: 1, text: 'Learn JavaScript' },
                { id: 2, text: 'Learn Vue' },
                { id: 3, text: 'Build something awesome' }
            ],
            newName: '',
        }
    },
    methods: {
        remove(index){
            this.tasks.splice(index, 1)
        },
        add(){
            if (this.newName.length > 2) {
                this.tasks.push({
                    id: this.tasks.length + 1,
                    text: this.newName,
                })
                this.newName = '';
            }
        }
    }
}
Vue.createApp(dynamicItems).mount('#dynamic-items');