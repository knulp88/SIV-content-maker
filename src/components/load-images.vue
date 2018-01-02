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

        @mousedown="
          mouseInteractionStart($event, index)" 
        @mouseup="
          !areaData[index].isActive ? activateArea(index, true) : '',
          areaData[index].selectedArea === null ? drawEnd($event, index) : modifyEnd($event, index)"
        @mouseleave="
          areaData[index].selectedArea === null ? drawEnd($event, index) : modifyEnd($event, index)"
        @mousemove="
          areaData[index].selectedArea === null ? drawing($event, index) : modifing($event, index),
          mouseCursor($event, index)"
        @dblclick="dbclick($event, index)">
      </canvas>

      <ul
        class="linkArea-dots"
        v-if="linkListOn">
        <li
          class="list-item"
          v-for="item in areaData[index].linkArea" :key="item.zIdx">
          {{ item.zIdx + 1 }}
        </li>
      </ul>
      
      <div
        v-if="$route.path === '/link-area'"
        :class="'dimed item-'+index"
        @click="areaData[index].isActive ? activateArea(index, false) : ''">
      </div>

    </div>
  </div>
</template>

<script>
import Event from "../assets/libs/event-namespace";
export default {
  data() {
    return {
      areaData: [],
      areaDefault: {
        minPixel: 10,
        scaleArea: 10
      },
      keyEvt: {},
      activatedAreaIndex: null,
      linkListOn: false
    };
  },
  destroyed() {
    // REMOVE KEYBOARD EVENT
    if (Event.functionMap) {
      for (const i in Event.functionMap) {
        if (Event.functionMap.hasOwnProperty(i)) {
          Event.removeEventListener(i);
        }
      }
    }
  },
  mounted() {
    // CHECK ROUTE PATH
    if (this.$route.path === "/link-area") {
      // INITIALIZE DATA SET
      const canvas = Array.prototype.slice.call(
        document.getElementsByTagName("canvas")
      );

      for (let i = 0; i < canvas.length; i++) {
        this.areaData.push({
          canvas: canvas[i],
          ctx: canvas[i].getContext("2d"),
          isActive: false,
          isDrawing: false,
          isModify: null, // position, scale
          isAllAreaLinked: false,
          selectedArea: null,
          linkArea: [],
          basePos: { x: 0, y: 0, gapX: 0, gapY: 0 }
        });
      }

      this.$nextTick(() => {
        this.linkListOn = true;
      });

      const keyEvt = {
        ["keydown-MODIFY"]: e => {
          const checkKeyCode = e.keyCode.toString().match(/37|38|39|40/);
          if (
            checkKeyCode !== null &&
            this.activatedAreaIndex !== null &&
            this.areaData[this.activatedAreaIndex].selectedArea
          ) {
            e.preventDefault();
            const canvasIndex = this.activatedAreaIndex;
            const linkAreaIndex = this.areaData[this.activatedAreaIndex]
              .selectedArea.zIdx;
            const t = [e.metaKey ? "wid" : "x", e.metaKey ? "hei" : "y"];
            const q = e.shiftKey ? 10 : 1;

            if (checkKeyCode[0] === "37" || checkKeyCode[0] === "39") {
              this.areaData[canvasIndex].linkArea[linkAreaIndex][t[0]] +=
                checkKeyCode[0] === "37" ? q * -1 : q;
            } else if (checkKeyCode[0] === "38" || checkKeyCode[0] === "40") {
              this.areaData[canvasIndex].linkArea[linkAreaIndex][t[1]] +=
                checkKeyCode[0] === "38" ? q * -1 : q;
            }

            this.areaData[canvasIndex].ctx.clearRect(
              0,
              0,
              this.areaData[canvasIndex].canvas.width,
              this.areaData[canvasIndex].canvas.height
            );
            this.renderRectangles(canvasIndex);
          }
        },
        ["keydown-DELETE"]: e => {
          if (
            (e.keyCode === 46 || e.keyCode === 8) &&
            this.activatedAreaIndex !== null &&
            this.areaData[this.activatedAreaIndex].selectedArea
          ) {
            const canvasIndex = this.activatedAreaIndex;
            const linkAreaIndex = this.areaData[this.activatedAreaIndex]
              .selectedArea.zIdx;

            // deleted area splice
            this.areaData[canvasIndex].linkArea.splice(linkAreaIndex, 1);

            // area numbering reset
            if (this.areaData[canvasIndex].linkArea.length > 1) {
              for (
                let i = 0;
                i < this.areaData[canvasIndex].linkArea.length;
                i++
              ) {
                this.areaData[canvasIndex].linkArea[i].zIdx = i;
              }
            }

            this.areaData[canvasIndex].ctx.clearRect(
              0,
              0,
              this.areaData[canvasIndex].canvas.width,
              this.areaData[canvasIndex].canvas.height
            );
            this.renderRectangles(canvasIndex);

            this.areaData[canvasIndex].isModify = null;
            this.areaData[canvasIndex].selectedArea = null;
          }
        }
      };
      // add Events to global.
      for (const i in keyEvt) {
        Event.addEventListener(i, keyEvt[i]);
      }
    }
  },
  methods: {
    dbclick(evt, idx) {
      const { selectedArea, canvas, ctx } = this.areaData[idx];
      if (!selectedArea) {
        alert("select all area of image");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.areaData[idx].linkArea = [];
        this.areaData[idx].linkArea.push({
          zIdx: this.areaData[idx].linkArea.length,
          x: 0,
          y: 0,
          wid: canvas.width,
          hei: canvas.height,
          isSelect: false
        });
        this.renderRectangles(idx);
      }
    },
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
      const { canvas, ctx } = this.areaData[idx];

      // activate state
      this.areaData[idx].isActive = bool ? true : false;
      this.activatedAreaIndex = bool ? idx : null;

      dimedEl.style.display = bool ? "block" : "none";

      if (bool) {
        wrapEl[idx].classList.add("is-active");
      } else {
        wrapEl[idx].classList.remove("is-active");
        // reset select link area state
        for (let i in this.areaData[idx].linkArea) {
          this.areaData[idx].linkArea[i].isSelect = false;
        }
        // render
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.renderRectangles(idx);
      }
    },
    // mouse cursor set
    mouseCursor(evt, idx) {
      const {
        canvas,
        linkArea,
        isDrawing,
        isActive,
        isModify,
        selectedArea
      } = this.areaData[idx];

      const isOnLinkArea =
        this.getMousePosition(evt, idx) !== null ? true : false;

      const point = this.getScalePoint(evt, idx);

      if (isActive && !isOnLinkArea) {
        // drawing
        canvas.style.cursor = "crosshair";
      } else if (isOnLinkArea && selectedArea && point) {
        canvas.style.cursor = `${point.toLowerCase()}-resize`;
      } else if (isOnLinkArea && selectedArea && !point) {
        // on selected link area and position fix
        canvas.style.cursor = "move";
      } else if (isOnLinkArea && !selectedArea) {
        // on not selected link area
        canvas.style.cursor = "pointer";
      }
    },
    // mouse interaction start
    mouseInteractionStart(evt, idx) {
      const { basePos, isActive, linkArea, selectedArea } = this.areaData[idx];
      const selectedAreaCheck = this.getMousePosition(evt, idx);

      basePos.x = evt.offsetX;
      basePos.y = evt.offsetY;

      // mouse position is on linkarea
      if (selectedAreaCheck === null) {
        // state drawing new link area
        this.areaData[idx].isDrawing = true;
        this.selectArea(evt, idx);
      } else {
        // state select added link area to modifing
        const point = this.getScalePoint(evt, idx);
        if (point) {
          // modify scale
          this.areaData[idx].isModify = "SCALE-" + point;
        } else {
          // modify position
          this.areaData[idx].isModify = "POSITION";

          basePos.gapX = Math.abs(linkArea[selectedAreaCheck].x - evt.offsetX);
          basePos.gapY = Math.abs(linkArea[selectedAreaCheck].y - evt.offsetY);

          this.selectArea(evt, idx);
        }
      }
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
      const { minPixel } = this.areaDefault;
      const wid = evt.offsetX - x;
      const hei = evt.offsetY - y;

      if (isDrawing && isActive) {
        this.areaData[idx].isDrawing = false;

        if (Math.abs(wid) > minPixel && Math.abs(hei) > minPixel) {
          linkArea.push({
            zIdx: linkArea.length,
            x: wid < 0 ? x + wid : x,
            y: hei < 0 ? y + hei : y,
            wid: wid < 0 ? x - (x + wid) : wid,
            hei: hei < 0 ? y - (y + hei) : hei,
            isSelect: false
          });
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.renderRectangles(idx);
      }
    },
    drawing(evt, idx) {
      const { basePos, canvas, isDrawing, isActive, ctx } = this.areaData[idx];
      if (isDrawing && isActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.renderRectangles(idx);
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
    // When link area selected move link area
    modifing(evt, idx) {
      if (this.areaData[idx].isModify === "") return;
      const { isModify } = this.areaData[idx];

      if (isModify.includes("SCALE")) {
        // modifing to scale
        const {
          selectedArea: { zIdx },
          basePos: { x: bX, y: bY },
          ctx,
          canvas
        } = this.areaData[idx];
        const scalePoint = isModify.replace("SCALE-", "");
        const minP = this.areaDefault.minPixel;
        const { x, y, wid, hei } = this.areaData[idx].linkArea[zIdx];
        const moved = {
          x: (evt.offsetX - bX) * -1,
          y: (evt.offsetY - bY) * -1
        };
        let fs = {};

        const scaleFunc = {
          ["SCALE-N"]() {
            Object.assign(fs, { y: y - moved.y, hei: hei + moved.y });
          },
          ["SCALE-S"]() {
            Object.assign(fs, { hei: hei - moved.y });
          },
          ["SCALE-W"]() {
            Object.assign(fs, { x: x - moved.x, wid: wid + moved.x });
          },
          ["SCALE-E"]() {
            Object.assign(fs, { wid: wid - moved.x });
          }
        };

        function reverseDirection(vm) {
          // reset direction
          if (hei < 1 && wid >= 0) {
            vm.areaData[idx].isModify = scalePoint.includes("N")
              ? `SCALE-${scalePoint.replace("N", "S")}`
              : `SCALE-${scalePoint.replace("S", "N")}`;

            fs.hei = 1;
          } else if (wid < 1 && hei >= 0) {
            vm.areaData[idx].isModify = scalePoint.includes("W")
              ? `SCALE-${scalePoint.replace("W", "E")}`
              : `SCALE-${scalePoint.replace("E", "W")}`;

            fs.wid = 1;
          } else if (wid < 1 && hei < 1) {
            if (scalePoint.includes("N")) {
              vm.areaData[idx].isModify =
                scalePoint === "NW" ? `SCALE-SE` : `SCALE-SW`;
            } else if (scalePoint.includes("S")) {
              vm.areaData[idx].isModify =
                scalePoint === "SW" ? `SCALE-NE` : `SCALE-NW`;
            }

            fs.wid = 1;
            fs.hei = 1;
          }
        }

        // fix scale length = 1~2
        for (let i = 0; i < scalePoint.length; i++) {
          scaleFunc[`SCALE-${scalePoint.charAt(i)}`]();
          reverseDirection(this);
        }

        Object.assign(this.areaData[idx].linkArea[zIdx], fs);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.renderRectangles(idx);

        this.areaData[idx].basePos.x = evt.offsetX;
        this.areaData[idx].basePos.y = evt.offsetY;
      } else if (isModify === "POSITION") {
        // modifing to position

        const {
          selectedArea: { x, y, zIdx },
          basePos: { gapX, gapY },
          canvas,
          ctx
        } = this.areaData[idx];

        this.areaData[idx].linkArea[zIdx].x = evt.offsetX - gapX;
        this.areaData[idx].linkArea[zIdx].y = evt.offsetY - gapY;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.renderRectangles(idx);
      }
    },

    // state modifing link area end
    modifyEnd(evt, idx) {
      this.areaData[idx].isModify = "";
    },

    // get link area on mouse position
    getMousePosition(evt, idx) {
      const { linkArea, isDrawing } = this.areaData[idx];

      let result = null;
      for (let i = 0; i < linkArea.length; i++) {
        if (
          evt.offsetX > linkArea[i].x &&
          evt.offsetX < linkArea[i].x + linkArea[i].wid &&
          evt.offsetY > linkArea[i].y &&
          evt.offsetY < linkArea[i].y + linkArea[i].hei
        ) {
          result = i;
        }
      }
      return result; // link area index or null
    },

    // modify scale select mouse point
    getScalePoint(evt, idx) {
      if (this.areaData[idx].selectedArea === null) return;

      const df = this.areaDefault.scaleArea;
      const { selectedArea: { x, y, wid, hei } } = this.areaData[idx];
      const points = {
        NW: { x: x, y: y, wid: x + df, hei: y + df },
        SE: { x: x + wid - df, y: y + hei - df, wid: x + wid, hei: y + hei },
        NE: { x: x + wid - df, y: y, wid: x + wid, hei: y + df },
        SW: { x: x, y: y + hei - df, wid: x + df, hei: y + hei },
        N: { x: x + df, y: y, wid: x + wid - df, hei: y + df },
        S: { x: x + df, y: y + hei - df, wid: x + wid - df, hei: y + hei },
        W: { x: x, y: y + df, wid: x + df, hei: y + hei - df },
        E: { x: x + wid - df, y: y + df, wid: x + wid, hei: y + hei - df }
      };

      for (const i in points) {
        if (
          evt.offsetX > points[i].x &&
          evt.offsetX < points[i].wid &&
          evt.offsetY > points[i].y &&
          evt.offsetY < points[i].hei
        ) {
          return i;
        }
      }
    },

    // select link area
    selectArea(evt, idx) {
      const { basePos, canvas, ctx, linkArea, isDrawing } = this.areaData[idx];
      let result = null;

      if (linkArea.length > 0) {
        result = this.getMousePosition(evt, idx);
        for (let i in this.areaData[idx].linkArea) {
          // all link area state init
          this.areaData[idx].linkArea[i].isSelect = false;
        }
        if (result !== null) {
          this.areaData[idx].linkArea[result].isSelect = true; // selectde link area state update
          this.areaData[idx].selectedArea = this.areaData[idx].linkArea[result]; // init select area data
        } else {
          this.areaData[idx].selectedArea = null; // init select area data
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
        this.renderRectangles(idx); // render canvas
      }
    },

    // RENDER FUNC
    renderRectangles(idx) {
      for (let i = 0; i < this.areaData[idx].linkArea.length; i++) {
        const { ctx, linkArea } = this.areaData[idx];
        const { x, y, wid, hei, isSelect } = linkArea[i];
        const fs = wid < hei ? wid / 2 : hei / 2;

        ctx.fillStyle = isSelect
          ? "rgba(255, 0, 0, 0.5)"
          : "rgba(0, 255, 255, 0.5)";
        // link area render
        ctx.fillRect(x + 0.5, y + 0.5, wid, hei);

        ctx.lineWidth = 1;
        if (isSelect) {
          ctx.strokeStyle = "rgba(255, 255, 255, 1)";
          ctx.strokeRect(x + 0.5, y + 0.5, wid, hei);
        } else {
          ctx.strokeStyle = "rgba(0, 0, 0, 1)";
          ctx.strokeRect(x + 0.5, y + 0.5, wid, hei);
        }

        // link area index number render
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
.linkArea-dots {
  position: absolute;
  display: flex;
  flex-flow: column wrap;
  left: 100%;
  top: 0;
  height: 100%;
  & .list-item {
    margin: 10px 0 10px 12px;
    width: 30px;
    height: 30px;
    border-radius: 5px 5px;
    background: #fff;
    color: #212121;
    font-size: 20px;
    font-weight: bold;
    line-height: 30px;

    cursor: pointer;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
