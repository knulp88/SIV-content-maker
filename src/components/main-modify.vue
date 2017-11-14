<template>
  <div class="to-modi">
    <!-- UPLOAD HTML FILE -->
    <form enctype="multipart/form-data">
      <input @change="htmlToModi( $event )" type="file" id="file">
    </form>

    <div v-html="$store.state.currentUploadFile" v-if="$store.state.currentUploadFile" class="load-html">
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      htmlFile: this.$store.state.currentUploadFile
    }
  },
  methods: {
    htmlToModi( evt ){
      this.$store.dispatch( 'uploadFile', { evt });
    }
  }
}
</script>

<style lang="less" scoped>

</style>


