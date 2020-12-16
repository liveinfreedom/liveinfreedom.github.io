<template>
  <ul class="sidenav app-sidenav" :class="{'open': isSidebarOpen}">
    <router-link
      v-for="link in links"
      :key="link.url"
      tag="li"
      active-class="active"
      :to="link.url"
      :exact="link.exact"
    >
      <!-- Атрибут href подменяется компонентом router-link без доп.настроек -->
      <a href="#" class="waves-effect waves-orange pointer">{{ link.title }}</a>
    </router-link>
  </ul>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    'isSidebarOpen': Boolean,
  },
  data: () => ({
    links: [
      {title: 'Счет', url: '/', exact: true}, // т.к. "/" входит в состав любого урла и без exact этот урл будет всегда активен
      {title: 'История', url: '/history'},
      {title: 'Планирование', url: '/planning'},
      {title: 'Новая запись', url: '/record'},
      {title: 'Категории', url: '/categories'},
    ]
  })
}
</script>

<style scoped>

</style>