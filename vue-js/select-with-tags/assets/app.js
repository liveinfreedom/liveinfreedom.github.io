var vueSelect = new Vue({
    el: '#vueSelect',
    data: {
        selected: [],
    },
    methods: {
        uncheck: function(e) {
            var delValue = e.target.getAttribute('data-value');
            this.selected = this.selected.filter(value => value !== delValue);
        }
    }
});