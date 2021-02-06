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
            ]
        }
    }
}
const dynamicItemsApp = Vue.createApp(dynamicItems)

dynamicItemsApp.component('alert-item', {
    props: ['alert'],
    template:
        `<div class="alert alert-warning alert-dismissible fade show" role="alert">
            {{ alert.text }}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="remove">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>`,
    methods: {
        remove(){
            console.log('dynamicItemsRoot.tasks[0]', dynamicItemsRoot.tasks[0])
            console.log('this.alert', this.alert)
        }
    }
})

const dynamicItemsRoot = dynamicItemsApp.mount('#dynamic-items')