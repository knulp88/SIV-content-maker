<template>
  <!-- loaded image -->
  <div>
    <div
      class="image-wrap"
      v-for=" ( item, index ) in $store.state.image.currentUploadFile" :key="item.index"
      :style="{
        width : getSize($store.state.image.currentUploadFile[index].dataUrl, true) + 'px'
      }">
      <img :src="$store.state.image.currentUploadFile[index].dataUrl" alt="" >

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
  methods: {
    // get base64 image width, height
    getSize(dataUrl, bool) {
      const img = new Image();
      img.src = dataUrl;
      return bool ? img.width : img.height;
    }
  }
};
</script>

<style lang="less" scoped>
.image-wrap {
  position: relative;
  margin: 0 auto;
  z-index: 10;
}
</style>
