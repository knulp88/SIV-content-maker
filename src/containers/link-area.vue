<template>
  <div class="container">
    <phaseBar></phaseBar>
    
    <div class="link-area-wrap">
      <load-images></load-images>
    </div>

  </div>
</template>

<script>
import { PhaseBar, LoadImages } from "../components/index";
export default {
  name: "link-area",
  data() {
    return {
      isLinkArea: null
    };
  },
  components: {
    phaseBar: PhaseBar,
    loadImages: LoadImages
  },
  mounted() {
    
  },
  methods: {
    
  },
  computed: {}
};
</script>

<style lang="less" scoped>
.link-area-wrap {
  margin: 0 auto;
}
</style>