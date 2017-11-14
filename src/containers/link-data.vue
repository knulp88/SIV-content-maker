<template>
  <div class="container">
    <phaseBar></phaseBar>
    LINK DATA
  </div>
</template>

<script>
import {
  PhaseBar
} from '../components/index'
export default {
  data() {
    return {
      name: "link-data"
    };
  },
  components: {
    phaseBar: PhaseBar
  }
};
</script>

<style lang="less" scoped></style>