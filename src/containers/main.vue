<template>
  <div class="container">
    <phase-bar></phase-bar>
    <button type="button" name="content-tap" @click="activeTab = true">NEW CONTENT</button>
    <button type="button" name="content-tap" @click="activeTab = false">TO MODIFY</button>
    
    <makeNew v-if="activeTab"></makeNew>
    <modify v-else></modify>

  </div>
</template>

<script>
import {
  MainModify,
  MainNew,
  PhaseBar
} from '../components/index'

export default {
  name: 'SivContentMaker',
  data () {
    return {
      name : 'main',
      activeTab : true
    }
  },
  components: {
    phaseBar: PhaseBar,
    makeNew: MainNew,
    modify: MainModify
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
  [name="content-tap"] {
    font-size: 15px;
    padding: 10px;
  }
  .new-cont,
  .to-modi{
    margin-top: 50px;
  }
  .load-html{
    max-height:500px;
    overflow-y: scroll;
  }
</style>