<template lang="html">
  <div class="container">
    <phase-bar></phase-bar>
    <div class="info">
      <div>
        <p>
          <span>TITLE : {{ newContent.title }}</span>
          <span>DEVICE : {{ newContent.device }}</span>
          <span v-if="newContent.device==='PC'">TYPE : {{ newContent.type }}</span>
        </p>
      </div>

      <div>
        <button @click="clearFiles"> CLEAR IMAGE </button>
        <button @click="alignNum"> ALIGN FILE NUM </button>
        <br>
        <input @change="imagesUpload" type="file" name="img" multiple >
        <ul v-if="$store.state.image.currentUploadFile[0]" class="image-list">
          <li
            @mouseover="listHighlighting"
            @mouseleave="listHighlighting"
            v-for="(item, index) in $store.state.image.currentUploadFile" :key="item.index">
              {{ $store.state.image.currentUploadFile[index].name }}
          </li>
        </ul>
      </div>

      <div>
        <button @click="linkAreaSet" class="link-area-btn">LINK AREA SET</button>
      </div>
    </div>

    <!-- loaded image -->
    <load-images></load-images>
    <!-- <div>
      <div v-for=" ( items, index ) in $store.state.image.currentUploadFile" :key="items.index">
        <img :src="$store.state.image.currentUploadFile[index].dataUrl" alt="" >
      </div>
    </div> -->

  </div>
</template>

<script>
import { PhaseBar, LoadImages} from "../components/index";
export default {
  name: "image",
  data() {
    return {
      newContent: {},
    };
  },
  components: {
    phaseBar: PhaseBar,
    loadImages: LoadImages
  },
  mounted() {
    this.newContent = this.$store.state.main.newContent;
  },
  methods: {
    listHighlighting(evt) {
      if (evt.type === "mouseover") {
        evt.target.classList.add("is-active");
      } else {
        evt.target.classList.remove("is-active");
      }
    },
    imagesUpload(evt) {
      this.$store.dispatch("clearFiles");
      this.$store.dispatch("uploadFiles", { evt });
    },
    clearFiles() {
      document.querySelector("input[type=file]").value = "";
      this.$store.dispatch("clearFiles"); 
    },
    alignNum() {
      // 규칙 파일확장자 앞에 있는 두자리 넘버링으로 소팅, 모바일에서 '-2x.jpg...'
      return this.$store.dispatch("sortImageList");
    },
    linkAreaSet() {
      this.$ls.set("sivContent", this.$store.state);
      this.$router.push({name:'link-area'})
    }
  }
};
</script>

<style scoped lang="less">
.info {
  padding: 20px 0;
  text-align: left;
  display: flex;
  & > div {
    border-right: 1px solid #cecece;
    padding: 0 15px;
  }
  & > div:nth-child(1) {
    width: 20%;
    & > p span {
      display: inline-block;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  & > div:nth-child(2) {
    width: 60%;
  }
  & > div:nth-child(3) {
    border-right: none;
    width: 20%;
  }
  .image-list {
    max-height: 100px;
    overflow-y: scroll;
    margin-top: 10px;
    border: 1px solid #cecece;
    padding: 10px 10px;
    background: #eee;
  }
  .image-list li {
    padding: 3px 10px;
  }
  .image-list li.is-active {
    background: #cacaca;
  }
  .link-area-btn {
    font-size: 30px;
    border: none;
    border-radius: 5px;
    padding: 10px 10px;
    background-color: orange;
    color: #fff;
  }
}
img {
  vertical-align: top;
}
</style>
