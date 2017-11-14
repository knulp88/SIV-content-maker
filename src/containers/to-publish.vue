<template>
  <div class="container">
    <phaseBar></phaseBar>
    TO PUBLISH
    <button @click="lsClear">ls clear</button>
  </div>
</template>

<script>
import { PhaseBar } from "../components/index";
export default {
  name: "to-publish",
  data() {
    return {};
  },
  components: {
    phaseBar: PhaseBar
  },
  methods: {
    lsClear() {
      window.localStorage.clear();
      console.log(this.$store.state);
    }
  }
};
</script>

<style lang="less" scoped></style>