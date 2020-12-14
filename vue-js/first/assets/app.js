var app01 = new Vue({
    el: '#app1',
    data: {
        message: 'Hello Vue!'
    }
});

console.log('#app2 init');
var app02 = new Vue({
    el: '#app2',
    //template: '<id || inline template>',
    data: {
        text: 'Это видно в шаблонах',
        first_name: "Вася",
        last_name: "Пупкин"
    },
    computed: { // кэшируемые методы
        full_name: function(){
            return this.first_name + ' ' + this.last_name; //Вася Пупкин
        },
        date_field: function () { // выполняется только один раз, т.к. нет зависимостей
            return Date.now();
        }
    },
    methods: { // НЕкэшируемые методы (выполняютеся каждый раз)
        date_method: function () {
            return Date.now();
        }
    },
    watch: { // выполняются onAfterChange
        first_name: function (valAfterChange, valBeforeChange) {
            console.log('изменено first_name', arguments);
            console.log('значение до', valBeforeChange);
            console.log('значение после:', valAfterChange);
            console.log('значение текущее:', this.first_name); // равно valAfterChange
        },
        full_name: function(valAfterChange, valBeforeChange){
            console.log('изменено full_name (вычисляемое поле)', arguments);
        }
    },

    
    // методы жизненного цикла
    beforeCreate: function(){
        console.log('beforeCreate', arguments);
    },
    created: function(){
        console.log('created', arguments);
    },
    beforeMount: function(){
        console.log('beforeMount', arguments);
    },
    mounted: function(){
        console.log('mounted', arguments);
    },
    beforeUpdate: function(){
        console.log('beforeUpdate', arguments);
    },
    updated: function(){
        console.log('updated', arguments);
    },
    beforeDestroy: function(){},
    destroyed: function(){},
});

var app03 = new Vue({
    el: '#app3',
    data: {
        message: 'You loaded this page on ' + new Date().toLocaleString(),
        dynamicVal: 'Значение для текстового поля'
    }
});

var app3 = new Vue({
    el: '#app-3',
    data: {
        seen: true
    }
});

var app5 = new Vue({
    el: '#app-5',
    data: {
        message: 'Привет, Vue.js!'
    },
    methods: {
        reverseMessage: function () {
            this.message = this.message.split('').reverse().join('')
        },
        alertMessage: function () {
            alert(this.message);
        }
    }
});

Vue.component('todo-item', {
    props: ['todo'],
    template: '<li>{{ todo.text }}</li>'
});
var app7 = new Vue({
    el: '#app-7',
    data: {
        groceryList: [
            { id: 0, text: 'Овощи' },
            { id: 1, text: 'Сыр' },
            { id: 2, text: 'Что там ещё люди едят?' }
        ]
    }
});