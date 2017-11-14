<template>
  <div class="container">
    <phaseBar></phaseBar>
    CONFIRM CONTENT
  </div>
</template>

<script>
import {
  PhaseBar
} from '../components/index'
export default {
  data() {
    return {
      name: "confirm-content"
    };
  },
  components: {
    phaseBar: PhaseBar
  }
};
</script>

<style lang="less" scoped></style>