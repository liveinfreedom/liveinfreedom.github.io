<template>
  <div class="grey darken-1 empty-layout">
    <router-view/>
  </div>
</template>

<script>
import messages from "@/utils/messages";

export default {
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(firebaseError) {
      console.log('firebaseError', firebaseError);
      this.$error(messages[firebaseError.code] || 'Неизвестная ошибка')
    }
  }
}
</script>