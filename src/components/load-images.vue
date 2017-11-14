<template>
  <!-- loaded image -->
  <div>
    <div class="image-wrap" v-for=" ( item, index ) in $store.state.image.currentUploadFile" :key="item.index">
      <img :src="$store.state.image.currentUploadFile[index].dataUrl" alt="" >
      <canvas
        v-if="$route.path === '/link-area'"
        :id="'linkArea-' + index"
        :width="getSize($store.state.image.currentUploadFile[index].dataUrl, true)"
        :height="getSize($store.state.image.currentUploadFile[index].dataUrl, false)"

        @click="activateArea(index, true)"
        @mousedown="drawStart($event, index)"
        @mouseup="drawEnd($event, index)"
        @mousemove="drawing($event, index)">
      </canvas>
      <div
        v-if="$route.path === '/link-area'"
        :class="'dimed item-'+index"
        @click="activateArea(index, false)">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    name: "load-images";
    return {
      areaData: []
    };
  },
  mounted() {
    if (this.$route.path === "/link-area") {
      const canvas = Array.prototype.slice.call(
        document.getElementsByTagName("canvas")
      );

      for (let i = 0; i < canvas.length; i++) {
        this.areaData.push({
          canvas: canvas[i],
          ctx: canvas[i].getContext("2d"),
          isActive: false,
          isDrawing: false,
          linkArea: [],
          basePos: { x: 0, y: 0 }
        });
      }
    }
  },
  methods: {
    getSize(dataUrl, bool) {
      const img = new Image();
      img.src = dataUrl;
      return bool ? img.width : img.height;
    },
    activateArea(idx, bool) {
      const wrapEl = document.getElementsByClassName("image-wrap");
      const dimedEl = document.querySelector(".dimed.item-" + idx);

      this.areaData[idx].isActive = bool ? true : false;
      dimedEl.style.display = bool ? "block" : "none";

      if (bool) wrapEl[idx].classList.add("is-active");
      else wrapEl[idx].classList.remove("is-active");
    },
    drawStart(evt, idx) {
      const { linkArea, basePos, canvas, ctx } = this.areaData[idx];

      this.areaData[idx].isDrawing = true;
      basePos.x = evt.offsetX;
      basePos.y = evt.offsetY;
      
    },
    drawEnd(evt, idx) {
      const { linkArea, basePos, canvas, ctx } = this.areaData[idx];

      this.areaData[idx].isDrawing = false;
      
      linkArea.push({
        x: basePos.x,
        y: basePos.y,
        wid: evt.offsetX - basePos.x,
        hei: evt.offsetY - basePos.y
      });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawRectangles(evt, idx)
      
    },
    drawing(evt, idx) {
      const { basePos, canvas, isDrawing, isActive, ctx } = this.areaData[idx];
      if (isDrawing && isActive) {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.rect(
          basePos.x,
          basePos.y,
          evt.offsetX - basePos.x,
          evt.offsetY - basePos.y
        );
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 1;
        ctx.stroke();
        this.drawRectangles(evt, idx)
      }
    },
    drawRectangles(evt, idx){
      for (let i = 0; i < this.areaData[idx].linkArea.length; i++) {
        this.areaData[idx].ctx.fillRect(
          this.areaData[idx].linkArea[i].x,
          this.areaData[idx].linkArea[i].y,
          this.areaData[idx].linkArea[i].wid,
          this.areaData[idx].linkArea[i].hei
        );
        this.areaData[idx].ctx.fillStyle = "rgba(206, 0, 0, 0.5)"; 
      }
    }
  }
};
</script>

<style lang="less" scoped>
.image-wrap *::-moz-selection {
  background: transparent;
}
.image-wrap *::selection {
  background: transparent;
}
.image-wrap {
  position: relative;
  &.is-active {
    z-index: 10;
  }
  &.is-active:after {
    @border-line : 2px;
    position: absolute;
    display: block;
    content: "";
    top: -@border-line;
    left: -@border-line;
    width: 100%;
    height: 100%;
    border: @border-line solid cyan;
    z-index: 9;
  }
}
.dimed {
  position: fixed;
  display: none;
  content: "";
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: -1;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
</style>
