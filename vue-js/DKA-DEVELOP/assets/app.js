let vmFirst = new Vue({
    el: '#vmFirst',
    data: {
        text: 'динамический',
        title: 'Заголовок из Vue',
        classes: 'vue1 vue2',
        status: true,
        cart: 1,
        template: 1
    }
});
vmFirst.text = 'динамический из Vue';

let vmClassesStyles = new Vue({
    el: '#vmClassesStyles',
    data: {
        classProp1: true,
        classProp2: true,
        color: 'blue',
        fontSize: '24px',
        transform: 'translateX(20px)'
    }
});

let vmLists = new Vue({
    el: '#vmLists',
    data: {
        products: ['яйца', 'крупа', 'сыр'], // vmLists.indexed.push('зелень')
        users: [
            {login: 'petrov', fio: 'Петр Петрович'},
            {login: 'ivanov', fio: 'Иван Иванович'},
        ],
    }
});