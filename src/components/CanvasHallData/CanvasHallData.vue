<template>
  <div>
    <v-row justify="space-around" class="ma-2">
      <v-col cols="12">       
        <v-btn-toggle v-model="activeVHall" mandatory active-class="info white--text" class="d-inline mr-8">
          <template v-for="(h,hi) in virtualHallJSON">
            <v-btn style="height:36px" :key="hi" dark :value="h" @click="setHallData(hi)">{{h.virtualHallName}}</v-btn>
          </template>
        </v-btn-toggle>
        <v-btn class="mr-2" color="info" dark @click.stop="dialogNew = true">New</v-btn>
        <v-btn class="mr-2" color="success" dark @click.stop="getVirtualHallData();dialogSave = true">GetData</v-btn>                
      </v-col>        
    </v-row> 
    <v-row class="text-center">
      <v-col cols="2">

        <div class="text-left ml-7 mt-2 text-h5">Hall Time</div>
        <div class="action-container ml-5 text-left">
          <v-btn class="mr-2 mb-2" color="info" dark @click="setHallTime('19:00')">19:00</v-btn>
          <v-btn class="mr-2 mb-2" color="info" dark @click="setHallTime('19:30')">19:30</v-btn>
        </div>
        <v-divider></v-divider>

        <div class="text-left ml-7 mt-2 text-h5">Shapes</div>
        <div class="action-container ml-5 text-left">
          <v-btn class="mr-2 mb-2" color="info" dark @click="setShape('rect')"><v-icon>mdi-square</v-icon></v-btn>
          <v-btn class="mr-2 mb-2" color="info" dark @click="setShape('round')"><v-icon>mdi-circle</v-icon></v-btn>
          <v-btn class="mr-2 mb-2" color="info" dark @click="setShape('ellipse')"><v-icon>mdi-ellipse</v-icon></v-btn>
          <v-btn class="mr-2 mb-2" color="info" dark @click="setShape('exa')"><v-icon>mdi-hexagon</v-icon></v-btn>
          <v-btn class="mr-2 mb-2" color="info" dark @click="setShape('octa')"><v-icon>mdi-octagon</v-icon></v-btn>
          <v-btn class="mr-2 mb-2" color="info" dark @click="setShape('triangle')"><v-icon>mdi-triangle</v-icon></v-btn>
        </div>
        <v-divider></v-divider>
        <div class="text-left ml-7 mt-2 text-h5">Modifiers</div>
        <div class="action-container ml-5 text-left">
          <!-- <v-btn class="mr-2 mb-2" :color="isRotate?'info': ''" dark @click="SetCamera"><v-icon>mdi-rotate-right</v-icon></v-btn> -->
          <v-btn class="mr-2 mb-2" color="info" dark @click="SetFlipX()"><v-icon>mdi-flip-horizontal</v-icon></v-btn>
          <v-btn class="mr-2 mb-2" color="info" dark @click="SetFlipY()"><v-icon>mdi-flip-vertical</v-icon></v-btn>
          <v-btn class="mr-2 mb-2" color="error" dark @click="DelTable"><v-icon>mdi-delete</v-icon></v-btn>
          <input type="color" class="btn" @change="SetColor">
          <v-slider min="0" max="100" @change="handleSliderChange"></v-slider>
        </div>
        <v-divider></v-divider>

      </v-col>
      <v-col cols="10">
        <div class="warp-container">
          <div class="wrap">
            <div>
              <canvas id="mycanvas" @drop="dropCard" @dragover="allowDropCard"></canvas>
            </div>
          </div>
          <div class="wrap2">
            <div>
              <canvas id="mycanvas2"></canvas>
            </div>
          </div>

          <div class="warp-container"
            v-if="isHandleAnchor()"
            :style="{ zIndex: 5 }">

            <div class="top-anchor anchor"
              @mousedown="handleAnchors"
              @touchstart="handleAnchors"
              :style="{
                left: selDivStyle.fX + 'px',
                top: selDivStyle.fY + 'px',
                transform: 'rotate(' + selDivStyle.imgAngle + 'rad) translate(0, -' + selDivStyle.hH + 'px)',
              }"
            ></div>
            <div class="bottom-anchor anchor"
              @mousedown="handleAnchors"
              @touchstart="handleAnchors"
              :style="{
                left: selDivStyle.fX + 'px',
                top: selDivStyle.fY + 'px',
                transform: 'rotate(' + selDivStyle.imgAngle + 'rad) translate(0, ' + selDivStyle.hH + 'px)',
              }"
            ></div>
            <div class="right-anchor anchor"
              @mousedown="handleAnchors"
              @touchstart="handleAnchors"
              :style="{
                left: selDivStyle.fX + 'px',
                top: selDivStyle.fY + 'px',
                transform: 'rotate(' + selDivStyle.imgAngle + 'rad) translate(' + (selDivStyle.hW) + 'px, 0)',
              }"
            ></div>
            <div class="left-anchor anchor"
              @mousedown="handleAnchors"
              @touchstart="handleAnchors"
              :style="{
                left: selDivStyle.fX + 'px',
                top: selDivStyle.fY + 'px',
                transform: 'rotate(' + selDivStyle.imgAngle + 'rad) translate(-' + selDivStyle.hW + 'px, 0)',
              }"
            ></div>

            <!-- <div class="top-left-anchor anchor"
              @mousedown="handleAnchors"
              :style="{
                left: selDivStyle.fX + 'px',
                top: selDivStyle.fY + 'px',
                transform: 'rotate(' + selDivStyle.imgAngle + 'rad) translate(-' + selDivStyle.hW + 'px, -' + selDivStyle.hH + 'px)',
              }"
            ></div>
            <div class="top-right-anchor anchor"
              @mousedown="handleAnchors"
              :style="{
                left: selDivStyle.fX + 'px',
                top: selDivStyle.fY + 'px',
                transform: 'rotate(' + selDivStyle.imgAngle + 'rad) translate(' + selDivStyle.hW + 'px, -' + selDivStyle.hH + 'px)',
              }"
            ></div>
            <div class="bottom-left-anchor anchor"
              @mousedown="handleAnchors"
              :style="{
                left: selDivStyle.fX + 'px',
                top: selDivStyle.fY + 'px',
                transform: 'rotate(' + selDivStyle.imgAngle + 'rad) translate(-' + selDivStyle.hW + 'px, ' + selDivStyle.hH + 'px)',
              }"
            ></div>
            <div class="bottom-right-anchor anchor"
              @mousedown="handleAnchors"
              :style="{
                left: selDivStyle.fX + 'px',
                top: selDivStyle.fY + 'px',
                transform: 'rotate(' + selDivStyle.imgAngle + 'rad) translate(' + selDivStyle.hW + 'px, ' + selDivStyle.hH + 'px)',
              }"
            ></div> -->

            <!-- Anchor Transform -->
            <div class="top-left-rotate rotate"
              @mousedown="handleRotate"
              @touchstart="handleRotate"
              :style="{
                left: selDivStyle.fX + 'px',
                top: selDivStyle.fY + 'px',
                transform: 'rotate(' + selDivStyle.imgAngle + 'rad) translate(-' + (selDivStyle.hW + 18) + 'px, -' + (selDivStyle.hH + 18) + 'px)',
              }"
            ></div>
            <div class="top-right-rotate rotate"
              @mousedown="handleRotate"
              @touchstart="handleRotate"
              :style="{
                left: selDivStyle.fX + 'px',
                top: selDivStyle.fY + 'px',
                transform: 'rotate(' + selDivStyle.imgAngle + 'rad) translate(' + (selDivStyle.hW + 18) + 'px, -' + (selDivStyle.hH + 18) + 'px)',
              }"
            ></div>
            <div class="bottom-right-rotate rotate"
              @mousedown="handleRotate"
              @touchstart="handleRotate"
              :style="{
                left: selDivStyle.fX + 'px',
                top: selDivStyle.fY + 'px',
                transform: 'rotate(' + selDivStyle.imgAngle + 'rad) translate(-' + (selDivStyle.hW + 18) + 'px, ' + (selDivStyle.hH + 18) + 'px)',
              }"
            ></div>
            <div class="bottom-left-rotate rotate"
              @mousedown="handleRotate"
              @touchstart="handleRotate"
              :style="{
                left: selDivStyle.fX + 'px',
                top: selDivStyle.fY + 'px',
                transform: 'rotate(' + selDivStyle.imgAngle + 'rad) translate(' + (selDivStyle.hW + 18) + 'px, ' + (selDivStyle.hH + 18) + 'px)',
              }"
            ></div>
          </div>
          
        </div>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialogNew"
      max-width="600"
      style="overflow:hidden"
    >
      <v-card>
        <v-card-title class="text-h5">
          New Hall
          <v-spacer></v-spacer>
          <v-btn float icon>
            <v-icon color="success">mdi-content-save</v-icon>
          </v-btn>
          <v-btn float icon @click="dialogNew = false">
            <v-icon color="info">mdi-close</v-icon>
          </v-btn>            
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-3">
          <v-row>
            <v-col cols="6">
              <v-text-field
                  v-model="hall.name"
                  counter="25"
                  label="Hall Name"
                  outlined
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="d-flex justify-center">
              <v-switch v-model="hall.location" :label="hall.location?'Indoor':'Outdoor'"></v-switch>
            </v-col>
            <v-col cols="6">
                <v-text-field
                  v-model="hall.width"
                  type="number"
                  label="Hall Width"
                  outlined
                  hint="in cm"
                ></v-text-field>              
            </v-col>
            <v-col cols="6">
                <v-text-field
                  v-model="hall.height"
                  type="number"
                  label="Hall Height"
                  outlined
                  hint="in cm"
                ></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field
                  v-model="hall.tableWidth"
                  type="number"
                  label="Table Width"
                  outlined
                  hint="in cm"
                ></v-text-field>              
            </v-col>
            <v-col cols="6">
                <v-text-field
                  v-model="hall.tableHeight"
                  type="number"
                  label="Table Height"
                  outlined
                  hint="in cm"
                ></v-text-field>
            </v-col>
          </v-row>            
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogSave"
      max-width="600"
      style="overflow:hidden"
    >
      <v-card>
        <v-card-title class="text-h5">
          getVHall
          <v-spacer></v-spacer>
          <v-btn float icon>
            <v-icon color="success">mdi-content-save</v-icon>
          </v-btn>
          <v-btn float icon @click="dialogSave=false">
            <v-icon color="info">mdi-close</v-icon>
          </v-btn>            
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-3">
          {{JSON.stringify(this.virtualHallJSON)}}
        </v-card-text>
      </v-card>
    </v-dialog> 
	</div>
</template>

<script>
  import Square from "./Square";
  import {DIRECTION} from "./Constant";

  export default {
    name: 'CanvasHallData',
    methods:{

      getOffsetCoords(mouse, rect) {
        return {
            x: mouse.x - rect.x,
            y: mouse.y - rect.y
        }
      },
      cursorInRect(mouseX, mouseY, rectX, rectY, rectW, rectH, angle = 0) {

        let realRect = this.getRealMouseRect(rectX, rectY, rectW, rectH, angle);

        // let x = rectX + this.camera.x;
        // let y = rectY + this.camera.y;

        // let xLine = mouseX > x && mouseX < x + rectW
        // let yLine = mouseY > y && mouseY < y + rectH
        let xLine = mouseX > realRect.leftEdgeX && mouseX < realRect.rightEdgeX;
        let yLine = mouseY > realRect.topEdgeY && mouseY < realRect.bottomEdgeY;

        return xLine && yLine
      },

      getRealMouseRect(x, y, width, height, rotation) {
        // Define the rectangle properties
        // const x = 200; // x-coordinate of the rectangle
        // const y = 200; // y-coordinate of the rectangle
        // const width = 100; // width of the rectangle
        // const height = 50; // height of the rectangle
        // const rotation = 45; // rotation angle in degrees

        // Convert the rotation angle to radians
        const angleInRadians = rotation;

        // Calculate the center point of the rectangle
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        // Calculate the coordinates of the four corners
        const topLeftX = Math.cos(angleInRadians) * (x - centerX) - Math.sin(angleInRadians) * (y - centerY) + centerX;
        const topLeftY = Math.sin(angleInRadians) * (x - centerX) + Math.cos(angleInRadians) * (y - centerY) + centerY;

        const topRightX = Math.cos(angleInRadians) * (x + width - centerX) - Math.sin(angleInRadians) * (y - centerY) + centerX;
        const topRightY = Math.sin(angleInRadians) * (x + width - centerX) + Math.cos(angleInRadians) * (y - centerY) + centerY;

        const bottomLeftX = Math.cos(angleInRadians) * (x - centerX) - Math.sin(angleInRadians) * (y + height - centerY) + centerX;
        const bottomLeftY = Math.sin(angleInRadians) * (x - centerX) + Math.cos(angleInRadians) * (y + height - centerY) + centerY;

        const bottomRightX = Math.cos(angleInRadians) * (x + width - centerX) - Math.sin(angleInRadians) * (y + height - centerY) + centerX;
        const bottomRightY = Math.sin(angleInRadians) * (x + width - centerX) + Math.cos(angleInRadians) * (y + height - centerY) + centerY;

        // Calculate the x and y coordinates of the edges
        const leftEdgeXTemp = Math.min(topLeftX, bottomLeftX);
        const rightEdgeXTemp = Math.max(topRightX, bottomRightX);
        const topEdgeYTemp = Math.min(topLeftY, topRightY);
        const bottomEdgeYTemp = Math.max(bottomLeftY, bottomRightY);

        const leftEdgeX = Math.min(leftEdgeXTemp, rightEdgeXTemp);
        const rightEdgeX = Math.max(leftEdgeXTemp, rightEdgeXTemp);
        const topEdgeY = Math.min(topEdgeYTemp, bottomEdgeYTemp);
        const bottomEdgeY = Math.max(topEdgeYTemp, bottomEdgeYTemp);

        return {
          topLeftX,
          topLeftY,
          topRightX,
          topRightY,
          bottomLeftX,
          bottomLeftY,
          bottomRightX,
          bottomRightY,
          leftEdgeX,
          rightEdgeX,
          topEdgeY,
          bottomEdgeY,
        }
      },

      handleScroll(event) {
        event.preventDefault(); // Prevent default scroll behavior

        const zoomSpeed = 0.1; // Adjust this value to control the zoom speed
        const scrollDelta = Math.sign(event.deltaY); // Get the scroll direction (1 for zoom in, -1 for zoom out)

        // Calculate the new zoom level
        this.zoomLevel -= scrollDelta * zoomSpeed;

        // Limit the zoom level to a specific range if desired
        // For example, you can use:
        this.zoomLevel = Math.max(0.5, Math.min(this.zoomLevel, 8));

        //   // Apply the zoom level to the canvas
        //   ctx2.clearRect(0, 0, canvas.width, canvas.height);
        //   ctx2.scale(zoomLevel, zoomLevel);

        // Redraw your canvas content here
        // ...
        this.drawBG(this.ctx2)

        // Reset the canvas scale to avoid cumulative scaling
          //   ctx2.setTransform(1, 0, 0, 1, 0, 0);
      },
      checkCloseEnough(p1, p2) {
          console.log(29,this.closeEnough)
          return Math.abs(p1 - p2) < this.closeEnough;
      },
      mouseUp() {
        this.dragTL = this.dragTR = this.dragBL = this.dragBR = false;
      },
      mouseDown(e,mouse) {
        //let mouse = getMouseCoords(canvas,this)
        console.log(41, e, mouse,this.dragTL,this.dragTR,this.dragBL,this.dragBR,this.mouseX,this.mouseY)
      },

      drawBG (context){
          context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          context.scale(this.zoomLevel, this.zoomLevel);

          context.save()

          context.fillStyle = 'white'
          context.fillRect(0, 0, this.w / this.zoomLevel, this.h / this.zoomLevel)
          context.lineWidth = 0.3;
          context.strokeStyle = 'lightgray'
          context.fillStyle = 'black'
          console.log('width : ', this.w, 'canvas : ', this.canvas.width)
          for (let i = 1; i < this.w / this.zoomLevel; i++) {
              context.beginPath()
              if (i % 10 === 0) {
                  context.moveTo(i, 0);
                  context.lineTo(i, this.h / this.zoomLevel)
                  context.moveTo(i, 0);
              }
              context.closePath()
              context.stroke()
          }

          for (let i = 1; i < this.h / this.zoomLevel; i++) {
              context.beginPath()
              if (i % 10 === 0) {
                  context.moveTo(0, i)
                  context.lineTo(this.w / this.zoomLevel, i)
                  context.moveTo(0, i)
              }
              context.closePath()
              context.stroke()
          }


          context.lineWidth = 1
          context.strokeStyle = 'gray'

          context.beginPath()
          for (let i = 50; i < this.w / this.zoomLevel; i += 10) {
              if ((i - this.camera.x) % 50 === 0) {
                  context.moveTo(i, 0)
                  context.lineTo(i, 30)
                  context.fillText(` ${i - this.camera.x}`, i, 30)
              } else {
                  context.moveTo(i, 0)
                  context.lineTo(i, 10)
              }

          }
          context.closePath()
          context.stroke()

          context.beginPath()
          for (let i = 50 ; i < this.h / this.zoomLevel; i += 10) {
              if ((i - this.camera.y) % 50 === 0) {
                  context.moveTo(0, i)
                  context.lineTo(30, i)
                  context.fillText(` ${i - this.camera.y}`, 30, i)
              } else {
                  context.moveTo(0, i)
                  context.lineTo(10, i)
              }

          }
          context.closePath()
          context.stroke()
          context.restore()

          context.setTransform(1, 0, 0, 1, 0, 0);
      },
      getMouseCoords(canvas, event) {
        let canvasCoords = canvas.getBoundingClientRect()
        return {
            x: (event.clientX - canvasCoords.left) / this.zoomLevel,
            y: (event.clientY - canvasCoords.top) / this.zoomLevel
        }
      },
      getIt(type = '') {
          let json = [];
          if(type == 'tables') {
            this.prtcls.forEach(e => {
                json.push({
                    "active":true,
                    "tableId": e.tableId,
                    "tableName": e.table,
                    "width": e.w,
                    "height": e.h,
                    "shape": e.shape,
                    "x": e.x,
                    "y": e.y
                });
              })
          } else {
            this.prtcls.forEach(e => {
              json.push({
                  name: e.table,
                  xPos: e.x,
                  yPos: e.y
              })
            })
          }

          return json;
      },
      setShape(type = 'rect') {
          this.prtcls.forEach(e => {
              if(e.resize) {
                  if(type == 'color') {
                      e.color = document.getElementById('color').value;
                  } else {
                      e.shape = type;
                      if(type == 'round') {
                          e.h = e.w;
                      }
                  }
              }
          })
      },
      allowDropCard(ev) {
          ev.preventDefault();
      },

      dropCard(ev) {
          ev.preventDefault();
          let id = ev.dataTransfer.getData("card");
          let name = ev.dataTransfer.getData("cardName");
          let type = ev.dataTransfer.getData("cardType");
          let repeatable = ev.dataTransfer.getData("repeatable");
          // let json = {...this.defaultParelData};


          console.log(id, !repeatable, repeatable)

          if(id == '') return;
          if(repeatable == 0) {
            this.hideTable(id);
          }

          let canvasCoords = this.canvas.getBoundingClientRect()

          let json = this.tables.filter(t => t.tableId == id);
          if(json.length == 0) {
            json = this.archElements.filter(a => a.elementId == id)[0];
            json['tableId'] = json['elementId'];
            json['tableName'] = json['elementName'];
          } else {
            json = json[0]
          }

          console.log(json)

          json['tableId'] = id;
          json['tableName'] = name;
          json['shape'] = type;
          json['x'] = (Math.round((event.clientX - canvasCoords.left) / 10) * 10) / this.zoomLevel;
          json['y'] = (Math.round((event.clientY - canvasCoords.top) / 10) * 10) / this.zoomLevel;

          let newPrtcls = new Square(json);
          this.prtcls.push(newPrtcls)
      },

      hideTable(id, val = 1) {            //val = 1 : HIDE, 0 : SHOW
        let index = this.tables.findIndex(t => t.tableId == id);
        if(index == -1) {
          index = this.archElements.findIndex(a => a.elementId == id);
          let t = [...this.archElements];
          t[index]['hidden'] = val;
          this.archElements = [...t];
        } else {
          let t = [...this.tables];
          t[index]['hidden'] = val;
          this.tables = [...t];
        }
      },

      getVirtualHallData() {
        let tables = this.getIt('tables');
        this.virtualHallJSON[0]['tables'] = tables;
        console.log("Virtual Hall Json Data :  ", this.virtualHallJSON)
      },

      isHandleAnchor() {
        let isAnchor = false;
        // this.prtcls.forEach(e => {
        //   if(e.resize) {
        //     isAnchor = true;
        //   }
        // })
        return isAnchor;
      },

      SetCamera() {
        this.isRotate = !this.isRotate;
      },

      SetFlipX() {
        this.prtcls.forEach((p) => {
          if(p.resize) {
            p.flipX *= -1;
          }
        })
      },

      SetFlipY() {
        this.prtcls.forEach((p) => {
          if(p.resize) {
            p.flipY *= -1;
          }
        })
      },

      DelTable() {
        let tableId = "";
        let index = -1;
        this.prtcls.forEach((p, i) => {
          if(p.resize) {
            tableId = p.tableId;
            index = i;
          }
        })
        if(index != -1) {
          let p = [...this.prtcls];
          p = p.filter((t, i) => i !== index);
          this.prtcls = [...p];
        }

        this.hideTable(tableId, 0)
      },

      SetColor(e) {
        this.prtcls.forEach(p => {
          if(p.resize) {
            p.color = e.target.value;
          }
        })
      },

      initTables(hallIdx = 0) {

          let json = this.virtualHallJSON[hallIdx]['tables'];
          this.prtcls = new Array(json.length).fill().map((a,idx) => new Square(json[idx]))

      },
      animate () {
          this.ctx.clearRect(0, 0, this.w, this.ctx.canvas.height)
          this.ctx.scale(this.zoomLevel, this.zoomLevel);

          this.ctx.fillStyle = 'white'
          let aa = [...this.prtcls];
          aa.reverse().forEach(e => {
              e.select = true
              e.camera = {...this.camera};
              e.draw(this.ctx)
              if(e.resize) {
                this.drawDragAnchor(e.x, e.y, e.w, e.h, e.angle);
              }
          })
          this.ctx.setTransform(1, 0, 0, 1, 0, 0);
          window.requestAnimationFrame(this.animate)
      },

      handleSelect(e) {
        let mouse = this.getMouseCoords(this.canvas, e);
        let isSelect = false;
        this.prtcls.forEach(e => {
          if (this.cursorInRect(mouse.x, mouse.y, e.x, e.y, e.w, e.h, e.angle)) {
              e.resize = true
              isSelect = true
          } else {
              // e.resize = false
          }
        })

        if(!isSelect) {
          this.prtcls.forEach(e => {
              e.resize = false
          })
        }

      },

      handleRotate(){
        console.log("----set rotate")

        this.isRotate = true;
      },

      handleAnchors(event){
        if(event.toElement != undefined) {
          this.scale_direction = event.toElement.className.replace("-anchor anchor", "");
        } else {
          this.scale_direction = event.currentTarget.className.replace("-anchor anchor", "");
        }

        console.log("----set direction", this.scale_direction)
        this.isScale = true;
      },

      drawSelection(){
        let w = 200;
        let h = 100
        const rect = this.canvas.getBoundingClientRect();
        const left = rect.left;
        const top = rect.top;

        this.selDivStyle.imgWidth = w;
        this.selDivStyle.imgHeight = h;
        this.selDivStyle.hW = w / 2;
        this.selDivStyle.hH = h / 2;
        this.selDivStyle.fX = this.camera.x + w + left + this.selDivStyle.hW;
        this.selDivStyle.fY = this.camera.y + h + top + this.selDivStyle.hH;

        console.log(this.canvas, this.canvas.top)
        console.log(this.selDivStyle.fX, this.selDivStyle.fY)
        // Calculate imgAngle based on your requirements
        this.selDivStyle.imgAngle = Math.PI / 4; // Example angle of 45 degrees
      },

      drawDragAnchor(x, y, w, h, angle){

        const rect = this.canvas.getBoundingClientRect();
        const left = rect.left;
        const top = rect.top;

        w = w * this.zoomLevel;
        h = h * this.zoomLevel

        this.selDivStyle.imgWidth = w;
        this.selDivStyle.imgHeight = h;
        this.selDivStyle.hW = w / 2;
        this.selDivStyle.hH = h / 2;
        this.selDivStyle.fX = ( this.camera.x + x ) * this.zoomLevel + this.selDivStyle.hW + left;
        this.selDivStyle.fY = ( this.camera.y + y ) * this.zoomLevel + this.selDivStyle.hH  + top;

        // Calculate imgAngle based on your requirements
        this.selDivStyle.imgAngle = angle; // Example angle of 45 degrees
      },

      rotate(e, mouse){

        var imageCenterX = e.x + (e.w / 2);
        var imageCenterY = e.y + (e.h / 2);

        var a = { x: mouse.x, y: mouse.y };
        var b = { x: imageCenterX, y: imageCenterY };
        var c = { x: this.startPos.x, y: this.startPos.y };

        var dir = this.ccw(a, b, c);

        var radians = this.getAngle(a, b, c);

        let diff = Math.PI / 18;

        radians = Math.round(radians / diff) * diff;

        e.angle = dir == -1 ? -radians + this.startPos.originAngle : radians + this.startPos.originAngle;
        
      },
      
      scale(e, diff){
		
        let dx = diff.x;
        let dy = diff.y;

        // var xs = dx * dx;
        // var ys = dy * dy;		 
        // var distance =  Math.sqrt( xs + ys );

          if(this.scale_direction == DIRECTION.RIGHT){
            e.w = this.startPos.originW + dx;
          }
          if(this.scale_direction == DIRECTION.LEFT){
            e.w = this.startPos.originW - dx;
            e.x = this.startPos.x + dx - this.camera.x;
          }
          if(this.scale_direction == DIRECTION.BOTTOM){
            e.h = this.startPos.originH + dy;
          }
          if(this.scale_direction == DIRECTION.TOP){
            e.h = this.startPos.originH - dy;
            e.y = this.startPos.y + dy - this.camera.y;
          }
          // if(this.scale_direction == "top-left"){
          //   img.height += -dy;
          //   img.top += dy;
          //   img.width += -dx;
          //   img.left += dx;	
          // }
          // if(this.scale_direction == "top-right"){
          //   img.height += -dy;
          //   img.top += dy;
          //   img.width += dx;
          // }
          // if(this.scale_direction == "bottom-right"){
          //   img.height += dy;
          //   img.width += dx;
          // }
          // if(this.scale_direction == "bottom-left"){
          //   img.height += dy;
          //   img.width += -dx;
          //   img.left += dx;				
          // }

      },

      getAngle(a, b, c){
        var AB = Math.sqrt(Math.pow(b.x-a.x,2)+ Math.pow(b.y-a.y,2));    
        var BC = Math.sqrt(Math.pow(b.x-c.x,2)+ Math.pow(b.y-c.y,2)); 
        var AC = Math.sqrt(Math.pow(c.x-a.x,2)+ Math.pow(c.y-a.y,2));
        return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
      },

      ccw(a, b, c) {
        var area2 = (b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x);
        if (area2 < 0) return -1;
        if (area2 > 0) return +1;
        return 0;
      },

      detectDoubleTap(event) {
        const curTime = new Date().getTime();
        const tapLen = curTime - this.lastTap;

        if (tapLen < 500 && tapLen > 0) {
          // Double tap detected

          this.handleSelect(event);

          console.log('Double tapped!');
        } else {
          // Not a double tap, start a timer
          this.timeout = setTimeout(() => {
            clearTimeout(this.timeout);
          }, 500);
        }

        this.lastTap = curTime;
      },

      handleMouseMove(e) {
        let diff = {
              x : Math.round((e.clientX - this.startPos.x) / 10) * 10,
              y : Math.round((e.clientY - this.startPos.y) / 10) * 10,
          };
          if(e.which == 2) {
            this.camera.x = this.startPos.originX + diff.x;
            this.camera.y = this.startPos.originY + diff.y;
            this.camera.x = Math.min(0, this.camera.x);
            this.camera.y = Math.min(0, this.camera.y);
            this.drawBG(this.ctx2)
          }
          // } else {
          //     let mouse = this.getMouseCoords(this.canvas, e)

          //     let arr = this.prtcls.map(e => this.cursorInRect(mouse.x, mouse.y, e.x, e.y, e.w, e.h, e.angle))
          //     !arr.every(e => e === false) ? this.canvas.classList.add('pointer') : this.canvas.classList.remove('pointer')

          //     this.prtcls.forEach(e => {
          //         if (e.selected) {
          //             let newX = Math.round((mouse.x - e.offset.x)/10)*10
          //             let newY = Math.round((mouse.y - e.offset.y)/10)*10
          //             if(e.resize && (this.isScale || this.isRotate)) {
          //                 let diff = {
          //                     x : Math.round((mouse.x - this.startPos.x) / this.setting.diff) * this.setting.diff,
          //                     y : Math.round((mouse.y - this.startPos.y) / this.setting.diff) * this.setting.diff,
          //                 }

          //                 if(this.isRotate) {
          //                   this.rotate(e, mouse)
          //                   // e.angle = this.startPos.originAngle + Math.PI / 18 * diff.x/10;

          //                 } else {

          //                   diff.x = e.expandX? diff.x : 0;
          //                   diff.y = e.expandY? diff.y : 0;

          //                   if(e.lockRatio) {
          //                       diff.y = diff.x * (e.h / e.w);
          //                   }

          //                   this.scale(e, diff)

          //                   e.w = Math.max(10, e.w)
          //                   e.h = Math.max(10, e.h)

          //                   // if(this.scale_direction == DIRECTION.LEFT) {
          //                   //     e.w = this.startPos.originW - diff.x;
          //                   //     // e.h = this.startPos.originH + diff.y;
          //                   //     e.x = this.startPos.x + diff.x


          //                   // } else {
          //                   //   if(e.shape == 'round') {
          //                   //     e.w = this.startPos.originW + diff.x;
          //                   //     e.h = this.startPos.originH + diff.x;
          //                   //   } else {
          //                   //       e.w = this.startPos.originW + diff.x;
          //                   //       e.h = this.startPos.originH + diff.y;
          //                   //   }
              
          //                   //   e.w = Math.max(10, e.w)
          //                   //   e.h = Math.max(10, e.h)
          //                   // }



          //                 }


          //             } else {
          //                 e.x = newX
          //                 e.y = newY
          //             }
          //         }
          //         this.cursorInRect(mouse.x, mouse.y, e.x, e.y, e.w, e.h, e.angle) ?
          //             e.active != true ? e.activate() : false
          //             : e.active = false
          //     })
          // }
      },

      handleMouseDown(e) {
        console.log("is SCALE: ", this.isScale, " ROTATE: ", this.isRotate)
        if(e.which == 2) {
            console.log("camera move---")
            this.canvas.classList.add('hand');
            this.startPos = {
                  x : e.clientX,
                  y : e.clientY,
                  originX: this.camera.x,
                  originY: this.camera.y
              }
            }
          // } else {
          //   let mouse = this.getMouseCoords(this.canvas, e)
          //   // One Select item move flag...
          //   let isSelect = false;
          //   this.prtcls.forEach(e => {
          //     if (!isSelect && this.cursorInRect(mouse.x, mouse.y, e.x, e.y, e.w, e.h, e.angle)) {
          //         isSelect = true
          //         e.selected = true
          //         e.offset = this.getOffsetCoords(mouse, e)
          //         if(e.resize) {
          //             this.startPos = {
          //                 x : mouse.x,
          //                 y : mouse.y,
          //                 originW : e.w,
          //                 originH : e.h,
          //                 originAngle : e.angle
          //             }
          //             e.rotate = this.isRotate;
          //         } else {
          //           e.rotate = false;
          //         }
          //     } else if ((this.isScale || this.isRotate) && e.resize) {
          //       console.log("_____seeleect div")
          //         e.selected = true
          //         e.offset = this.getOffsetCoords(mouse, e)
          //         this.startPos = {
          //             x : mouse.x,
          //             y : mouse.y,
          //             originW : e.w,
          //             originH : e.h,
          //             originAngle : e.angle
          //         }
          //         e.rotate = this.isRotate;
          //     } else {
          //         e.selected = false
          //     }
          //   })
          // }
      },

      handleMouseUp(e) {
        if(e.which == 2) {
          this.canvas.classList.remove('hand')
        } else {
          this.prtcls.forEach(e => {
            e.selected = false
          })
        }
        this.isScale = false;
        this.isRotate = false;
      },

      handleTouchStart(event) {
        const touchPoints = Array.from(event.touches);
        if (touchPoints.length === 2) {
          // Calculate the initial distance between two touch points
          const dx = touchPoints[0].clientX - touchPoints[1].clientX;
          const dy = touchPoints[0].clientY - touchPoints[1].clientY;
          this.pinchStartDistance = Math.sqrt(dx * dx + dy * dy);
          this.initialZoom = 1;
        }
      },

      handleTouchMove(event) {
        const touchPoints = Array.from(event.touches);
        console.log("touch - length -----", touchPoints.length)
        if (touchPoints.length === 2) {
          // Calculate the current distance between two touch points
          const dx = touchPoints[0].clientX - touchPoints[1].clientX;
          const dy = touchPoints[0].clientY - touchPoints[1].clientY;
          const pinchCurrentDistance = Math.sqrt(dx * dx + dy * dy);

          // Calculate the zoom factor based on the pinch distance change
          const zoomFactor = pinchCurrentDistance / this.pinchStartDistance;


          const zoomSpeed = 0.1; // Adjust this value to control the zoom speed
          this.zoomLevel -= (zoomFactor > this.initialZoom ? 1 : -1) * zoomSpeed;
          this.zoomLevel = Math.max(0.5, Math.min(this.zoomLevel, 8));
          // Perform the zoom action based on the zoom factor
          if (zoomFactor > this.initialZoom) {
            // Zoom in
            console.log('Zoom in');
          } else {
            // Zoom out
            console.log('Zoom out');
          }
          this.drawBG(this.ctx2)


          // Update the initial zoom for the next touch move event
          this.initialZoom = zoomFactor;
        }
      },

      handleSliderChange(value) {
        // Do something with the new value
        console.log(value)
        this.zoomLevel = 0.5 + 8.5 * value / 100;
        this.drawBG(this.ctx2)
      },

      setHallData(hallIdx) {
        delete this.prtcls;
        this.initTables(hallIdx)
      },

      setHallTime(hallTime = '') {
        console.log(hallTime)
        // delete this.prtcls;
        // this.initTables(hallIdx)
      }
    },

    data() {
      return {
        dialogSave:false,
        dialogNew:false,
        hall:{},
        activeVHall:null,
		
        closeEnough: 10,
        dragTL: false,
        dragBL: false,
        dragTR: false,
        dragBR: false,
        drag: false,
        mouseX: null,
        mouseY: null,
        widthPercent: 0.8,
        heightPercent: 0.8,
        zoomLevel: 1,
        prtcls: [],
        startPos: {},
        canvas: null,
        canvas2: null,
        ctx: null,
        ctx2: null,
        w: 0,
        h: 0,
        camera: {
          x : 0,
          y : 0
        },
        setting: {
          diff: 10
        },
        isCameraMove: false,
        isRotate: false,
        isScale: false,
        scale_direction: DIRECTION.LEFT,

        lastTap : 0,
        timeout : null,
        pinchStartDistance : 0,
        initialZoom : 1,
        isPressed : false,
        pressTimer : null,

        selDivStyle: { 
          imageUrl: 'path/to/image.jpg',
          imgWidth: 0,
          imgHeight: 0,
          imgAngle: 0,
          hW: 0,
          hH: 0,
          fX: 0,
          fY: 0,
        },

        defaultParelData: {
          "active":true,
          "tableId": "--",
          "tableName": "--",
          "width": 80,
          "height": 80,
          "shape": "roundRect",
          "expandX": true,
          "expandY": true,
          "lockRatio": false,
          "x": 0,
          "y": 0
        },

        tables: [
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "B67F9FACDDDFFA442EA00A65AFBCB41EF63A83B8",
                      "name": "I1",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "D331D59718149A972B869ECC77A5D6C22B90CDFA",
                      "name": "I11",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "00E81B36E24B72C204A362BDC236295123726EBA",
                      "name": "I21",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "A333D0DEB7E7C937C960DF0C2254A26FD2CC3F7C",
                      "name": "I31",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "CF17232C969260689E0E33F7C9DCDEF8E4E7ABE3",
                      "name": "B1",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "22DBE735D2519F8415287C809BC1FDB5928B0C62",
                      "name": "B2",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": false,
                      "reserved": true,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#ffa000",
                      "tableId": "74130C18A370EFF14333B125B4AA98518E5A9F57",
                      "name": "I2",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": false,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#d50000",
                      "tableId": "C67EE0A7EFCD4CF7ED0CA1D82E8E2D22BC9D02F7",
                      "name": "I13",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "4A5CEAC245613D59B01495020FFAB27B8B9584B0",
                      "name": "I23",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "3F3307FF68AFF9152EB38493E22E9AC123AFF0B7",
                      "name": "B3",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "9D9B136E9EBDC4985ADA5F051851ED44950619C7",
                      "name": "B4",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "244223D2A40F3B3BD954BB03DA61AA5EB9F10ACF",
                      "name": "I3",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": false,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#d50000",
                      "tableId": "5E002F83C7A0BBF74B1AD9DD991EBA74C5176CCE",
                      "name": "B5",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": false,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#d50000",
                      "tableId": "BA762B5AA667A60D94F6AB5C2E7F7A668BA3FBA7",
                      "name": "B6",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "30F2DC61E955FFEF6B11A66BFD45FB71A6EBA397",
                      "name": "I4",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "6A7CF57D649D1B3C5FE76DC07C36047C81E0EBE9",
                      "name": "I14",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "2B60A7C9E9E91DAA504F02FAE98EB8A1F5B240F0",
                      "name": "I24",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": false,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#d50000",
                      "tableId": "99A4D6E960DE46D74B36B56883CEF1ED245614BE",
                      "name": "I34",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "93450D961DD7CC0D669DEEBADD5F72C725927860",
                      "name": "I5",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "DE470E55798B09573C44C427B8F4D9F2F6A8E52B",
                      "name": "I15",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "CB42F930F6186F42A364061007F4FEBBF000183D",
                      "name": "I25",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": false,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#d50000",
                      "tableId": "1B061C1A93B4E5ABD129FB31852AAC1442C8C166",
                      "name": "I35",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "76656056530E0243B87A3088AE27E59A5F356D54",
                      "name": "I6",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "D6AE02C20CEFF982D7489367D4F95A907D2B86A5",
                      "name": "I16",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "A63BB1803BE21869F85816B77DC99F0164F840DC",
                      "name": "I26",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "color": "#42a5f5",
                      "tableId": "A91D990083CD81E7471AA9D216079438A7CEF36E",
                      "name": "I36",
                      "width": 80,
                      "height": 80,
                      "shape": "roundRect",
                      "expandX": true,
                      "expandY": true,
                      "lockRatio": false,
                      "repeatable": false,
                      "virtualHallId": null
                  }
        ],
        
        archElements: [
              {
                  "elementId": "E3EA16138BF0EDEEC12B34D654F6769489F00FF7",
                  "elementName": "wall",
                  "width": 80,
                  "height": 15,
                  "shape": "image",
                  "expandX": true,
                  "expandY": false,
                  "lockRatio": false,
                  "repeatable": true,
                  "icon":"mdi-wall",
                  "url": "https://jslab.it/shapes/wall.svg"
              },
              {
                  "elementId": "50BE5E8D6925223757046D01170CBAAC667EFE18",
                  "elementName": "window",
                  "width": 80,
                  "height": 15,
                  "shape": "image",
                  "expandX": true,
                  "expandY": false,
                  "lockRatio": false,
                  "repeatable": true,
                  "icon":"mdi-window-closed-variant",
                  "url": "https://jslab.it/shapes/window.svg"
              },
              {
                  "elementId": "0AAF80214E76193D92564688E994166CFB4E1848",
                  "elementName": "corner",
                  "width": 30,
                  "height": 30,
                  "shape": "image",
                  "expandX": true,
                  "expandY": false,
                  "lockRatio": false,
                  "repeatable": true,
                  "icon":"mdi-view-grid-plus",
                  "url": "https://jslab.it/shapes/corner.svg"
              },
              {
                  "elementId": "3CF659BFB6D54CF4AAF29F2188FD2457F76225B0",
                  "elementName": "door",
                  "width": 80,
                  "height": 80,
                  "shape": "image",
                  "expandX": true,
                  "expandY": false,
                  "lockRatio": false,
                  "repeatable": true,
                  "icon":"mdi-door",
                  "url": "https://jslab.it/shapes/door.svg"
              },
              {
                  "elementId": "1EE83840154CDBD075724D7C1C489B833BBB2182",
                  "elementName": "double_door",
                  "width": 160,
                  "height": 80,
                  "shape": "image",
                  "expandX": true,
                  "expandY": false,
                  "lockRatio": false,
                  "repeatable": true,
                  "icon":"mdi-door-sliding",
                  "url": "https://jslab.it/shapes/double_door.svg"
              }
        ],
        virtualHallJSON: [
          {
            "virtualHallId": "AADCBDE475BCF7B59C55BAAC1988FAF1DD15D7E5",
            "virtualHallName": "Hall 1",
            "tables": [
                  {
                      "active": true,
                      "reserved": false,
                      "virtualHallId": "AADCBDE475BCF7B59C55BAAC1988FAF1DD15D7E5",
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "tableId": "B67F9FACDDDFFA442EA00A65AFBCB41EF63A83B8",
                      "color": "#42a5f5",
                      "shape": "roundRect",
                      "name": "I1",
                      "width": 120,
                      "height": 120,
                      "xPos": 420,
                      "yPos": 120,
                      "ETA": "20:00",
                      "ATA": "20:12",
                      "duration": 90,
                      "timeLeft": 82,
                      "slice":2,
                      "timeLeftIcon": "mdi-slice-2",
                      "sliceColor":"#ff0000",
                      "fullName": "John Doe",
                      "covers": 3,
                      "children": null,
                      "requests": [{"dog":1,"icon":""},{"highchair":1,"icon":""}],
                      "foodStyles": [{"vegan":1,"icon":"mdi-leaf"},{"glutenfree":1,"icon":"mdi-barley-off"}],
                      "reuse": true                      
                  },
            ]
          },
          {
            "virtualHallId": "EEECBDE475BCF7B59C55BAAC1988FAF1DD15D7E5",
            "virtualHallName": "Hall 2",
            "tables": [
                  {
                      "active": true,
                      "reserved": false,
                      "virtualHallId": "EEECBDE475BCF7B59C55BAAC1988FAF1DD15D7E5",
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "tableId": "B67F9FACDDDFFA442EA00A65AFBCB41EF63A83B8",
                      "color": "#42a5f5",
                      "shape": "roundRect",
                      "name": "I1",
                      "width": 120,
                      "height": 120,
                      "xPos": 420,
                      "yPos": 120,
                      "ETA": "20:00",
                      "ATA": "20:12",
                      "duration": 90,
                      "timeLeft": 82,
                      "slice":2,
                      "timeLeftIcon": "mdi-slice-2",
                      "sliceColor":"#ff0000",
                      "fullName": "John Doe",
                      "covers": 3,
                      "children": null,
                      "requests": [{"dog":1,"icon":""},{"highchair":1,"icon":""}],
                      "foodStyles": [{"vegan":1,"icon":"mdi-leaf"},{"glutenfree":1,"icon":"mdi-barley-off"}],
                      "reuse": true                      
                  },
                  {
                      "active": true,
                      "reserved": false,
                      "virtualHallId": "EEECBDE475BCF7B59C55BAAC1988FAF1DD15D7E5",
                      "hallId": "E45B1EF9A888B834C27333F826F119DFE912B5B7",
                      "tableId": "B67F9FACDDDFFA442EA00A65AFBCB41EF63A83B8",
                      "color": "#ffa5f5",
                      "shape": "round",
                      "name": "I2",
                      "width": 120,
                      "height": 120,
                      "xPos": 420,
                      "yPos": 320,
                      "ETA": "19:00",
                      "ATA": "19:12",
                      "duration": 90,
                      "timeLeft": 40,
                      "slice":5,
                      "timeLeftIcon": "mdi-slice-2",
                      "sliceColor":"#ff0000",
                      "fullName": "Robert Kal",
                      "covers": 3,
                      "children": null,
                      "requests": [{"dog":1,"icon":""},{"highchair":1,"icon":""}],
                      "foodStyles": [{"vegan":1,"icon":"mdi-leaf"},{"glutenfree":1,"icon":"mdi-barley-off"}],
                      "reuse": true                      
                  },
            ]
          },
          {
            "virtualHallId": "70880A8B56A60B22965F3A67F8C395E0D0B9D3C3",
            "virtualHallName": "Hall 3",
            "tables": []
          }                    
        ]

      }
    },

    mounted() {
      this.canvas = document.getElementById('mycanvas')
      this.canvas2 = document.getElementById('mycanvas2')
      this.ctx = this.canvas.getContext('2d')
      this.ctx2 = this.canvas2.getContext('2d')
      this.w = this.canvas.width = this.canvas2.width = window.innerWidth * this.widthPercent;
      this.h = this.canvas.height = this.canvas2.height = window.innerHeight * this.heightPercent;

      this.canvas.style.backgroundColor = 'transparent'
      this.canvas2.style.backgroundColor = 'yellow'

      this.ctx.lineWidth = 2
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.font = '10px Arial'
      
      this.drawBG(this.ctx2)

      // let arr = new Array(40).fill('empty').map(() => Math.floor(Math.random() * 100))


      window.addEventListener('resize', () => {
            this.w = this.canvas.width = this.canvas2.width = window.innerWidth * this.widthPercent;
            this.h = this.canvas.height = this.canvas2.height = window.innerHeight * this.heightPercent;
            this.drawBG(this.ctx2)
      })

      this.canvas.addEventListener('click', e => {
          // let mouse = this.getMouseCoords(this.canvas, e);
          console.log(JSON.stringify(this.getIt()), e)
      })

      this.canvas.addEventListener('dblclick', e => {
        this.handleSelect(e);

      })

      window.addEventListener('mousemove', e => {
        this.handleMouseMove(e);
      })

      this.canvas.addEventListener('mousedown', e => {
        this.handleSelect(e);
      })

      window.addEventListener('mouseup', e => {
        this.handleMouseUp(e);
      })


      window.addEventListener('touchstart', (event) => {
        console.log("touch start")
        
        // ADD Keep press Event and select item
        if(!this.isRotate && !this.isScale) {
          this.isPressed = true;
          let that = this;
          this.pressTimer = setTimeout(function() {
            // Your code for "keep pressed" action here
            that.handleSelect(event.touches[0]);
            console.log("Keep pressed action");
          }, 200); // Adjust the duration (in milliseconds) as needed
        }

        // this.detectDoubleTap(event.touches[0])

        // this.handleTouchStart(event);
        // // Check if there are at least two touch points
        // if (event.touches.length >= 2) {
        //   this.canvas.classList.add('hand');
        //   this.startPos = {
        //     x : event.touches[0].clientX,
        //     y : event.touches[0].clientY,
        //     originX: this.camera.x,
        //     originY: this.camera.y
        //   }
        // }
        
        // this.handleMouseDown(event.touches[0]);
      });

      // Add an event listener to the touchmove event
      window.addEventListener('touchmove', (event) => {

        this.handleTouchMove(event);
        // Check if there are at least two touch points
        let e = event.touches[0];
        if (event.touches.length >= 2) {       
          console.log(e.clientX)   
          let diff = {
              x : Math.round((e.clientX - this.startPos.x) / 10) * 10,
              y : Math.round((e.clientY - this.startPos.y) / 10) * 10,
          };
          // Handle the two-finger touch movement
          this.camera.x = this.startPos.originX + diff.x;
          this.camera.y = this.startPos.originY + diff.y;
          this.camera.x = Math.min(0, this.camera.x);
          this.camera.y = Math.min(0, this.camera.y);
          this.drawBG(this.ctx2)
        }

        this.handleMouseMove(event.touches[0])

      });
      
      window.addEventListener('touchend', (event) => {
        this.isPressed = false;
        clearTimeout(this.pressTimer);

        event.width = 1;
        this.handleMouseUp(event);
      })

      this.canvas.addEventListener("contextmenu", e => {
          //event.preventDefault();
        console.log(e)
      });

      this.canvas.addEventListener('wheel', this.handleScroll);

      // document.getElementsByClassName("rotate").addEventListener("mousedown", e => {
      //   this.mouseDown(e)
      // })


      this.initTables()

      this.animate()

      // this.drawSelection();

    },

    // Handle functions

}
</script>

<style lang="scss">

  .table-container{
    z-index: 10;
  }


  .arch-container img {
    width: 50px;
    height: 17px;
  }

  .warp-container {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .wrap {
      position: relative;
      z-index: 2;
  }

  .wrap div {
      box-shadow: 2px 2px 6px -2px rgba(0,0,0,0.75);
  }
  .wrap2 {

      position: absolute;
      z-index: 1;
      background-color: 'white'
  }

  #mycanvas {
      display: block;
      box-sizing: border-box;
      border: 1px solid hsl(259, 100%, 65%)
  }
  #mycanvas2 {
      display: block;
      box-sizing: border-box;
  }

  .pointer {
      cursor: pointer;
  }

  .hand {
      cursor: grab;
  }

  /* Line */
  .line-h{
      position: fixed;
      height: 0px;
  }
  .line-v{
      position: fixed;
      width: 0px;
  }
  .top-line{
      border-top: dashed 2px #f700cb;
  }
  .bottom-line{
      border-bottom: dashed 2px #f700cb;
  }
  .right-line{
      border-right: dashed 2px #f700cb;
  }
  .left-line{
      border-left: dashed 2px #f700cb;
  }
  /* Anchor */
  .anchor{
      position: fixed;
      width: 40px;
      height: 40px;
      margin: -20px 0 0 -20px;
      background-color: #36313594;
      opacity: 0.8;
  }
  /* Rotate */
  .rotate{
      position: fixed;
      width: 40px;
      height: 40px;
      margin: -20px 0 0 -20px;
      background-color: blue;
      opacity: 0.5;
  }
</style>