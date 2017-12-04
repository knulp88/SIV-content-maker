<template>
  <!-- loaded image -->
  <div>
    <div
      class="image-wrap"
      v-for=" ( item, index ) in $store.state.image.currentUploadFile"
      :key="item.index"
      :style="{
        width : getSize($store.state.image.currentUploadFile[index].dataUrl, true) + 'px'
      }">
      <img :src="$store.state.image.currentUploadFile[index].dataUrl" alt="" >

      <canvas
        v-if="$route.path === '/link-area'"
        :id="'linkArea-' + index"
        :width="getSize($store.state.image.currentUploadFile[index].dataUrl, true)"
        :height="getSize($store.state.image.currentUploadFile[index].dataUrl, false)"

        @mousedown="drawStart($event, index)"
        @mouseup="
          !areaData[index].isActive ? activateArea(index, true) : '',
          areaData[index].selectedArea === null ? drawEnd($event, index) : '',
          selectArea($event, index)
        "
        @mouseleave="areaData[index].selectedArea === null ? drawEnd($event, index) : ''"
        @mousemove="areaData[index].selectedArea === null ? drawing($event, index) : ''">
      </canvas>

      <div
        v-if="$route.path === '/link-area'"
        :class="'dimed item-'+index"
        @click="areaData[index].isActive ? activateArea(index, false) : ''">
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    name: "load-images";
    return {
      areaData: [],
      areaDefault: {
        minPixel: 10
      }
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
          isSelectable: false,
          selectedArea: null,
          linkArea: [],
          basePos: { x: 0, y: 0 }
        });
      }
    }
  },
  methods: {
    // get base64 image width, height
    getSize(dataUrl, bool) {
      const img = new Image();
      img.src = dataUrl;
      return bool ? img.width : img.height;
    },
    // activate canvas
    activateArea(idx, bool) {
      const wrapEl = document.getElementsByClassName("image-wrap");
      const dimedEl = document.querySelector(".dimed.item-" + idx);

      this.areaData[idx].isActive = bool ? true : false; // activate state
      dimedEl.style.display = bool ? "block" : "none";

      if (bool) wrapEl[idx].classList.add("is-active");
      else wrapEl[idx].classList.remove("is-active");
    },
    // mouse down event
    drawStart(evt, idx) {
      const { basePos } = this.areaData[idx];
      if (
        this.areaData[idx].isActive &&
        this.areaData[idx].selectedArea === null
      ) {
        this.areaData[idx].isDrawing = true;
        basePos.x = evt.offsetX;
        basePos.y = evt.offsetY;
      }
      this.areaData[idx].isSelectable = true;
    },
    drawEnd(evt, idx) {
      const {
        linkArea,
        basePos: { x, y },
        canvas,
        ctx,
        isDrawing,
        isActive
      } = this.areaData[idx];
      const wid = evt.offsetX - x;
      const hei = evt.offsetY - y;
      if (isDrawing && isActive) {
        this.areaData[idx].isDrawing = false;

        if (
          Math.abs(wid) > this.areaDefault.minPixel &&
          Math.abs(hei) > this.areaDefault.minPixel
        ) {
          linkArea.push({
            zIdx: linkArea.length,
            x: wid < 0 ? x + wid : x,
            y: hei < 0 ? y + hei : y,
            wid: wid < 0 ? x - (x + wid) : wid,
            hei: hei < 0 ? y - (y + hei) : hei,
            isSelect: false
          });
          this.areaData[idx].isSelectable = false;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawRectangles(idx);
      }
    },
    drawing(evt, idx) {
      const { basePos, canvas, isDrawing, isActive, ctx } = this.areaData[idx];

      if (isDrawing && isActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawRectangles(idx);
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
      }
    },
    selectArea(evt, idx) {
      if (!this.areaData[idx].isSelectable) return;

      const { basePos, canvas, ctx, linkArea, isDrawing } = this.areaData[idx];
      let af = null;
      let result = null;

      if (linkArea.length > 0) {

        for (let i = 0; i < linkArea.length; i++) {
          this.areaData[idx].linkArea[i].isSelect = false;
          if (
            evt.offsetX > linkArea[i].x &&
            evt.offsetX < linkArea[i].x + linkArea[i].wid &&
            evt.offsetY > linkArea[i].y &&
            evt.offsetY < linkArea[i].y + linkArea[i].hei
          ) {
            result = i;
          }
        }
        if (result !== null) {
          this.areaData[idx].linkArea[result].isSelect = true; // select state update
          this.areaData[idx].selectedArea = this.areaData[idx].linkArea[result]; // init select area data
          
        } else {
          this.areaData[idx].selectedArea = null; // init select area data
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
        this.drawRectangles(idx); // render canvas
        this.areaData[idx].isSelectable = false;

      }
    },
    drawRectangles(idx) {
      for (let i = 0; i < this.areaData[idx].linkArea.length; i++) {
        const { ctx, linkArea } = this.areaData[idx];
        const { x, y, wid, hei, isSelect } = linkArea[i];
        const fs = wid < hei ? wid / 2 : hei / 2;

        // fill color to selected or default link area
        ctx.fillStyle = isSelect
          ? "rgba(255, 0, 0, 0.5)"
          : "rgba(0, 255, 255, 0.5)";
        // link area render
        ctx.fillRect(x + 0.5, y + 0.5, wid, hei);

        ctx.lineWidth = 1;
        if (isSelect) {
          console.log('aaaa')
          ctx.strokeStyle = "rgba(255, 255, 255, 1)";
          ctx.strokeRect(x + 0.5, y + 0.5, wid, hei);
        } else {
          ctx.strokeStyle = "rgba(0, 0, 0, 1)";
          ctx.strokeRect(x + 0.5, y + 0.5, wid, hei); 
        }

        // link area indexing render
        ctx.font = `${fs}px san-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "black";
        ctx.lineWidth = fs / 10;
        ctx.strokeText(linkArea[i].zIdx + 1, x + wid / 2, y + hei / 2);
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fillText(linkArea[i].zIdx + 1, x + wid / 2, y + hei / 2);
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
  margin: 0 auto;
  z-index: 10;
  &.is-active {
    z-index: 11;
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
  &.isDrawing {
    cursor: crosshair;
  }
}
</style>
