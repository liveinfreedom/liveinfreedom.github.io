var vueList = new Vue({
    el: '#vueList',
    data: {
        list: [
            'кабачки',
            'баклажаны',
            'картофель',
        ],
    },
});

var vueLength = new Vue({
    el: '#vueLength',
    data: {
        text: '',
        length: 'короче',
    },
    methods: {
        check: function () {
            this.length = this.text.length > 10 ? 'длиннее' : 'короче';
        }
    }
});

Vue.component('blog-post', {
    props: ['title'],
    template: '<h3>{{ title }}</h3>'
});

new Vue({
    el: '#blog-posts',
    // data: function () {
    //     return {title: ''}
    // }
    // data: {
    //     posts: [
    //         { id: 1, title: 'My journey with Vue' },
    //         { id: 2, title: 'Blogging with Vue' },
    //         { id: 3, title: 'Why Vue is so fun' }
    //     ]
    // }
});

