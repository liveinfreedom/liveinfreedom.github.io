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
    },
    methods: {
        remove(){
            console.log('remove() this.alert', this.alert.id, this.alert.text)
            dynamicItemsRoot.$data.tasks.forEach((task, index)=>{
                console.log('forEach() task, this.alert.id', task.id, this.alert.id)
                if (task.id === this.alert.id) {
                    delete dynamicItemsRoot.$data.tasks[index]
                }
            })
        }
    }
}
const dynamicItemsApp = Vue.createApp(dynamicItems)

dynamicItemsApp.component('alert-item', {
    props: ['alert'],
    emits: ['enlargeText'],
    template:
        `<div class="alert alert-warning alert-dismissible fade show" role="alert">
            {{ alert.text }}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="$emit('remove', )">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>`
})

const dynamicItemsRoot = dynamicItemsApp.mount('#dynamic-items')