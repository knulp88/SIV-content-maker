<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app",
  watch: {
    '$route': function() {
      this.$store.commit("PHASE_SET", this.$route.name);
    }
  },
  mounted() {
    const ls = this.$ls.get("sivContent");
    if (ls !== null) {
      this.$store.commit("STATE_INIT", ls); // 
      this.$router.push({ name: this.$store.state.phase });
    } else {
      this.$router.push({ name: "main" });
    }
  }
};
</script>

<style>
html,
body,
h1,
h2,
h3,
h4,
h5,
h6,
ul,
li,
p {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
img{
  vertical-align: top;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.container {
  min-width: 1200px;
  background-color: #ddd;
  padding: 30px 0;
  text-align: center;
}
</style>
