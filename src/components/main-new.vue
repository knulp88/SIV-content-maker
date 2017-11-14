<template>
  <div class="new-cont">

    <div class="title-tab">
      <label for="cont-title">CONTENT TITLE :</label>
      <input v-model="newContent.title" id="cont-title" type="text" name="contentType" value="">
    </div>

    <div class="device-tab">
      <input v-model="newContent.device" type="radio" id="pc" name="deviceType" value="PC">
      <label for="pc">PC</label>
      <input v-model="newContent.device" type="radio" id="mo" name="deviceType" value="MO">
      <label for="mo">MO</label>
    </div>

    <div class="type-tap" v-if="newContent.device === 'PC'">
      <input v-model="newContent.type" type="radio" id="wide" name="contentType" value="WIDE">
      <label for="wide">WIDE</label>
      <input v-model="newContent.type" type="radio" id="normal" name="contentType" value="NORMAL">
      <label for="normal">NORMAL</label>
    </div>

    <div class="confirm-dataset">
      <p>
        CONTENT TITLE : <span v-if="newContent.title">{{ newContent.title }}</span>
      </p>
      <p>
        DEVICE TYPE : <span v-if="newContent.device">{{ newContent.device }}</span>
      </p>
      <p v-if="newContent.device === 'PC'">
        CONTENT TYPE : <span  v-if="newContent.type">{{ newContent.type }}</span>
      </p>
    </div>

    <div>
      <button class="makenew-btn" @click="validationSet">MAKE NEW CONTENT</button>
    </div>

  </div>

</template>

<script>
export default {
  data() {
    return {
      name: "main-new",
      newContent: {
        title: "",
        device: "",
        type: ""
      }
    };
  },
  mounted(){
    Object.assign(this.newContent, this.$store.state.main.newContent)
  },
  methods: {
    validationSet() {
      const { title, device, type } = this.newContent;
      if (title && device && (device === "MO" ? true : type)) {
        alert(`
          TITLE : ${title}\n
          TYPE : ${type ? type : "normal"}\n
          DEVICE : ${device}
        `);
        this.$store.commit("CONTENT_DATA_INIT", this.newContent);
        this.$ls.set("sivContent", this.$store.state);
        this.$router.push({ name: "image" });
      } else {
        alert(`
          Check this setting
          ${title ? "" : "TITLE"}
          ${type ? "" : "TYPE"}
          ${device ? "" : "DEVICE"}
        `);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.type-tap,
.device-tab {
  padding: 15px 0;
  & > label {
    margin-right: 30px;
    padding-left: 10px;
    font-size: 20px;
    font-weight: bold;
  }
}
.title-tab {
  padding: 15px 0;
  & > input,
  & > label {
    font-size: 20px;
  }
}
.confirm-dataset {
  padding: 20px 0;
  p {
    padding: 20px 0;
  }
  p > span {
    display: inline-block;
    border-radius: 5px;
    padding: 5px 15px;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    background-color: #666;
  }
}
.makenew-btn {
  font-size: 30px;
  border: none;
  border-radius: 5px;
  padding: 10px 30px;
  background-color: orange;
  color: #fff;
}
</style>

