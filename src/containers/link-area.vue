<template>
  <div class="container">
    <phaseBar></phaseBar>

    <div class="complete-btn">
      <button @click="linkAreaSet" class="comp-btn">AREA SETTING COMPLETE</button>
    </div>
    
    <div class="link-area-wrap">
      <linkArea></linkArea>
    </div>

  </div>
</template>

<script>
import { PhaseBar, LinkArea } from "../components/index";
export default {
  name: "link-area",
  data() {
    return {
      isLinkArea: null
    };
  },
  components: {
    phaseBar: PhaseBar,
    linkArea: LinkArea
  },
  mounted() {},
  methods: {
    linkAreaSet(){
      // console.log(this.$store.state.linkArea.linkAreaData)
    }
  },
  computed: {}
};
</script>

<style lang="less" scoped>
.complete-btn{
  padding: 30px 0;
}
.comp-btn {
  font-size: 30px;
  border: none;
  border-radius: 5px;
  padding: 10px 10px;
  background-color: orange;
  color: #fff;
}
.link-area-wrap {
  margin: 0 auto;
}
</style>