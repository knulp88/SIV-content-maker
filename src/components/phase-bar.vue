<template>
  <nav class="phase-bar">
    <ul>
      <!-- CONTENT INITIALIZE -->
      <router-link to="/main" tag="li">
        1<span v-if="this.$route.path === '/main'">. CONTENT INITIALIZE</span>
      </router-link>
      <!-- IMAGE LOAD & ALIGN -->
      <router-link to="/image" tag="li">
        2<span v-if="this.$route.path === '/image'">. IMAGE LOAD &amp; ALIGN</span>
      </router-link>
      <!-- LINK AREA SET -->
      <router-link to="/link-area" tag="li">
        3<span v-if="this.$route.path === '/link-area'">. LINK AREA SET</span>
      </router-link>
      <!-- LINK DATA SET -->  
      <router-link to="/link-data" tag="li">
        4<span v-if="this.$route.path === '/link-data'">. LINK DATA SET</span>
      </router-link>
      <!-- CONFIRM CONTENT -->
      <router-link to="/confirm-content" tag="li">
        5<span v-if="this.$route.path === '/confirm-content'">. CONFIRM CONTENT</span>
      </router-link>
      <!-- TO PUBLISH -->
      <router-link to="/to-publish" tag="li">
        6<span v-if="this.$route.path === '/to-publish'">. TO PUBLISH</span>
      </router-link>
    </ul>
  </nav>

</template>

<script>
export default {
  name: "phase-bar",
  data() {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.phase-bar {
  padding-bottom: 30px;
  ul {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  li {
    position: relative;
    cursor: pointer;
    &.router-link-active {
      min-width: 35px;
      height: 35px;
      padding: 0 20px;
      border-radius: 17.5px 17.5px;
      line-height: 35px;
      font-size: 20px;
      color: #fff;
      background: #2c3e50;
    }
    min-width: 25px;
    height: 25px;
    border-radius: 12.5px 12.5px;
    margin: 0 30px;
    font-size: 15px;
    line-height: 25px;
    font-weight: 700;
    text-align: center;
    color: #b1afb9;
    list-style: none;
    background: #cecece;
  }
}
</style>
