<template>
    <v-row class="text-center">

      <v-col cols="2" class="table-container">
        <v-btn 
          v-for="(t, i) in tables"
          :key="i"
          :id="t.tableId"
          :name="t.name"
          :hall="t.hallId"
          :type="t.shape"
          :draggable="true"
          :class="{'table-btn' : true}"
          :fab="t.shape === 'round'"
          :color="t.color"
          :repeatable="t.repeatable?1:0"
          :hidden="t.hidden == 1"
          x-small
          @dragstart="dragCard"
        >
        {{ t['name'] }}
        </v-btn>

        <div class="arch-container">
          <v-btn
            v-for="(t, i) in archElements"
            :key="i"
            :id="t.elementId"
            :name="t.elementName"
            :hall="null"
            :type="t.shape"
            :draggable="true"
            :class="{'table-btn' : true}"
            :fab="t.shape === 'round'"
            :color="null"
            :repeatable="t.repeatable?1:0"
            x-small
            @dragstart="dragCard"
          ><img 
            :src="t.url"
          /> {{ t['elementName'] }}</v-btn>
        </div>
      </v-col>
      <v-col cols="8">
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
        </div>
      </v-col>

      <v-col class="control" cols="2">
        <input type="color" class="btn" @change="SetColor">
        <v-btn class="btn" @click="getVirtualHallData">Get All</v-btn>
        <v-btn class="btn control-btn" 
          :color="isRotate?'primary': ''"
          @click="SetRotate"
        >Rotate</v-btn>
        <v-btn class="btn control-btn" 
          @click="SetFlipX()"
        >Flip H</v-btn>
        <v-btn class="btn control-btn" 
          @click="SetFlipY"
        >Flip V</v-btn>
        <v-btn class="btn control-btn" 
          @click="DelTable"
        >Delete</v-btn>
      </v-col>
    </v-row>
</template>

<script>


  import Square from "./Square";
  export default {
    name: 'CanvasHall',
    methods:{

      getOffsetCoords(mouse, rect) {
        return {
            x: mouse.x - rect.x,
            y: mouse.y - rect.y
        }
      },
      cursorInRect(mouseX, mouseY, rectX, rectY, rectW, rectH) {
        let xLine = mouseX > rectX && mouseX < rectX + rectW
        let yLine = mouseY > rectY && mouseY < rectY + rectH

        return xLine && yLine
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
      drawHandles(ctx, x, y, w, h,color = "red", sh) {
          ctx.save()
          ctx.translate(x, y)
          ctx.fillStyle = color
          switch(sh)
            {
              case 'rect':
                ctx.fillRect(-10, -10, 15, 15)
                ctx.fillRect(w-5, h-5, 15, 15)
                ctx.fillRect(w-5, -10, 15, 15)
                ctx.fillRect(-10, h-5, 15, 15)
              break;
              case 'round':
                ctx.fillRect(-10, (w/2-10), 15, 15)
                ctx.fillRect(h-5,(w-15)/2, 15, 15)
                ctx.fillRect((h/2-10),-10, 15, 15)
                ctx.fillRect((h/2-10),h-5, 15, 15)
              break;
            }
          ctx.restore()
          //ctx.fillText(Math.floor(x), -30, 0)
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
              if (i % 50 === 0) {
                  context.moveTo(i, 0)
                  context.lineTo(i, 30)
                  context.fillText(` ${i}`, i, 30)
              } else {
                  context.moveTo(i, 0)
                  context.lineTo(i, 10)
              }

          }
          context.closePath()
          context.stroke()

          context.beginPath()
          for (let i = 50; i < this.h / this.zoomLevel; i += 10) {
              if (i % 50 === 0) {
                  context.moveTo(0, i)
                  context.lineTo(30, i)
                  context.fillText(` ${i}`, 30, i)
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
            x: (event.pageX - canvasCoords.left) / this.zoomLevel,
            y: (event.pageY - canvasCoords.top) / this.zoomLevel
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
      dragCard(ev) {
          ev.dataTransfer.setData("card", ev.target.id);
          ev.dataTransfer.setData("cardName", ev.target.getAttribute('name'));
          ev.dataTransfer.setData("cardType", ev.target.getAttribute('type'));
          ev.dataTransfer.setData("repeatable", ev.target.getAttribute('repeatable'));
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
          json['x'] = (event.pageX - canvasCoords.left) / this.zoomLevel;
          json['y'] = (event.pageY - canvasCoords.top) / this.zoomLevel;

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

      SetRotate() {
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

      initTables() {
          // let tableDiv = document.getElementById('tables-div');
          // tableDiv.innerHTML = this.tables.filter(t => t.virtualHallId == null).map((t, i) => `
          //     <div id="${t.tableId}" name="${t.tableName}" type="${i != 1? 'rect' : 'round'}" class="card ${i != 1? '' : 'round'}" draggable="true" ondragstart="dragCard(event)">
          //         <span>${t.tableName}</span>
          //     </div>
          // `)

          let json = this.virtualHallJSON[0]['tables'];
          this.prtcls = new Array(json.length).fill().map((a,idx) => new Square(json[idx]))

      },
      animate () {
          this.ctx.clearRect(0, 0, this.w, this.ctx.canvas.height)
          this.ctx.scale(this.zoomLevel, this.zoomLevel);

          this.ctx.fillStyle = 'white'
          this.prtcls.forEach(e => {
              e.select = true
              e.draw(this.ctx)
          })
          this.ctx.setTransform(1, 0, 0, 1, 0, 0);
          window.requestAnimationFrame(this.animate)
      }
    },

    data() {
      return {
        hsl: (h, s, l) => `hsl(${h},${s}%,${l}%)`,
        closeEnough: 10,
        dragTL: false,
        dragBL: false,
        dragTR: false,
        dragBR: false,
        drag: false,
        mouseX: null,
        mouseY: null,
        widthPercent: 0.7,
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

        isRotate: false,

        defaultParelData: {
          "active":true,
          "tableId": "--",
          "tableName": "--",
          "width": 80,
          "height": 80,
          "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                      "shape": "rect",
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
                  "url": "https://jslab.it/shapes/double_door.svg"
              }
        ],
        virtualHallJSON: [
          {
            "virtualHallId": "AADCBDE475BCF7B59C55BAAC1988FAF1DD15D7E5",
            "virtualHallName": "Hall 1",
            "tables": [
              {
                "active":true,
                "tableId": "AC892C8C9C5477FFE53F2A2AADB2CB11989A874E",
                "tableName": "I1",
                "width": 80,
                "height": 80,
                "shape": "octagonal",
                        "expandX": true,
                        "expandY": true,
                        "lockRatio": true,
                "x": 600,
                "y": 100
              },
              {
                "active":true,
                "tableId": "98BE6476E12A82D9441A4C47B7C895DEE0FA7C06",
                "tableName": "I2",
                "width": 80,
                "height": 80,
                "shape": "roundRect",
                        "expandX": false,
                        "expandY": true,
                        "lockRatio": false,
                "x": 720,
                "y": 100
              },		
                    {
                "active":true,
                "tableId": "98BE6476E12A82D9441A4C47B7C895DEE0FA7C06",
                "tableName": "I2",
                "width": 80,
                "height": 80,
                "shape": "roundRect",
                        "expandX": true,
                        "expandY": false,
                        "lockRatio": false,
                "x": 520,
                "y": 100
              },	
                    {
                "active":true,
                "tableId": "98BE6476E12A82D9441A4C47B7C895DEE0FA7C06",
                "tableName": "I2",
                "width": 80,
                "height": 80,
                "shape": "image",
                        "expandX": true,
                        "expandY": true,
                        "lockRatio": false,
                        "url": "https://jslab.it/shapes/corner.svg",
                "x": 80,
                "y": 80
              },	
                    {
                "active":true,
                "tableId": "98BE6476E12A82D9441A4C47B7C895DEE0FA7C06",
                "tableName": "I2",
                "width": 80,
                "height": 80,
                "shape": "image",
                        "expandX": true,
                        "expandY": true,
                        "lockRatio": false,
                        "url": "https://jslab.it/shapes/door.svg",
                "x": 180,
                "y": 180
              },		
                    {
                "active":true,
                "tableId": "98BE6476E12A82D9441A4C47B7C895DEE0FA7C06",
                "tableName": "I2",
                "width": 80,
                "height": 80,
                "shape": "image",
                        "expandX": true,
                        "expandY": true,
                        "lockRatio": false,
                        "url": "https://jslab.it/shapes/double_door.svg",
                "x": 280,
                "y": 180
              },		
                    {
                "active":true,
                "tableId": "98BE6476E12A82D9441A4C47B7C895DEE0FA7C06",
                "tableName": "I2",
                "width": 80,
                "height": 80,
                "shape": "image",
                        "expandX": true,
                        "expandY": true,
                        "lockRatio": false,
                        "url": "https://jslab.it/shapes/wall.svg",
                "x": 180,
                "y": 280
              },		
                    {
                "active":true,
                "tableId": "98BE6476E12A82D9441A4C47B7C895DEE0FA7C06",
                "tableName": "I2",
                "width": 80,
                "height": 80,
                "shape": "image",
                        "expandX": true,
                        "expandY": true,
                        "lockRatio": false,
                        "url": "https://jslab.it/shapes/window.svg",
                "x": 180,
                "y": 380
              },		
            ]
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
      this.h = this.canvas.height = this.canvas2.height = window.innerHeight * 0.9;

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
            this.h = this.canvas.height = this.canvas2.height = window.innerHeight * 0.9;
            this.drawBG(this.ctx2)
      })

      this.canvas.addEventListener('click', e => {
          // let mouse = this.getMouseCoords(this.canvas, e);
          console.log(JSON.stringify(this.getIt()), e)
      })

      this.canvas.addEventListener('dblclick', e => {
          let mouse = this.getMouseCoords(this.canvas, e);

          this.prtcls.forEach(e => {
              console.log(e.w)
                if (this.cursorInRect(mouse.x, mouse.y, e.x, e.y, e.w, e.h)) {
                    e.resize = true
                    e.offset = this.getOffsetCoords(mouse, e)
                } else {
                    e.resize = false
                }
            })

      })

      this.canvas.addEventListener('mousemove', e => {
          let diff = {
              x : Math.round((e.pageX - this.startPos.x) / 10) * 10,
              y : Math.round((e.pageY - this.startPos.y) / 10) * 10,
          };
          if(e.which == 2) {
            this.camera.x = this.startPos.originX + diff.x;
            this.camera.y = this.startPos.originY + diff.y;
            this.camera.x = Math.max(0, this.camera.x);
            this.camera.y = Math.max(0, this.camera.y);
            this.drawBG(this.ctx2)
          } else {
              let mouse = this.getMouseCoords(this.canvas, e)

              let arr = this.prtcls.map(e => this.cursorInRect(mouse.x, mouse.y, e.x, e.y, e.w, e.h))
              !arr.every(e => e === false) ? this.canvas.classList.add('pointer') : this.canvas.classList.remove('pointer')
              this.prtcls.forEach(e => {
                  if (e.selected) {
                      let newX = Math.round((mouse.x - e.offset.x)/10)*10
                      let newY = Math.round((mouse.y - e.offset.y)/10)*10
                      if(e.resize) {
                          let diff = {
                              x : Math.round((mouse.x - e.startPos.x) / this.setting.diff) * this.setting.diff,
                              y : Math.round((mouse.y - e.startPos.y) / this.setting.diff) * this.setting.diff,
                          }

                          if(this.isRotate) {

                            e.angle = e.startPos.originAngle + Math.PI / 18 * diff.x/10;

                          } else {

                            diff.x = e.expandX? diff.x : 0;
                            diff.y = e.expandY? diff.y : 0;

                            if(e.lockRatio) {
                                diff.y = diff.x * (e.h / e.w);
                            }

                            if(e.shape == 'round') {
                                e.w = e.startPos.originW + diff.x;
                                e.h = e.startPos.originH + diff.x;
                            } else {
                                e.w = e.startPos.originW + diff.x;
                                e.h = e.startPos.originH + diff.y;
                            }
            
                            e.w = Math.max(10, e.w)
                            e.h = Math.max(10, e.h)

                          }


                      } else {
                          e.x = newX
                          e.y = newY
                      }
          
                  }
                  this.cursorInRect(mouse.x, mouse.y, e.x, e.y, e.w, e.h) ?
                      e.active != true ? e.activate() : false
                      : e.active = false
              })
          }
      })

      this.canvas.addEventListener('mousedown', e => {
          if(e.which == 2) {
            this.canvas.classList.add('hand');
            this.startPos = {
                  x : e.pageX,
                  y : e.pageY,
                  originX: this.camera.x,
                  originY: this.camera.y
              }
          } else {
              let mouse = this.getMouseCoords(this.canvas, e)
              this.prtcls.forEach(e => {
                console.log(e.w)
                  if (this.cursorInRect(mouse.x, mouse.y, e.x, e.y, e.w, e.h)) {
                      e.selected = true
                      e.offset = this.getOffsetCoords(mouse, e)
                      if(e.resize) {
                          e.startPos = {
                              x : mouse.x,
                              y : mouse.y,
                              originW : e.w,
                              originH : e.h,
                              originAngle : e.angle
                          }
                      }
                  } else {
                      e.selected = false
                  }
              })
          }
      })

      this.canvas.addEventListener('mouseup', e => {
          console.log("camera : ", this.camera)
          if(e.which == 2) {
            this.canvas.classList.remove('hand')
          } else {
            this.prtcls.forEach(e => {
                  e.selected = false
              })
          }
      })

      this.canvas.addEventListener("contextmenu", e => {
          //event.preventDefault();
        console.log(e)
      });

      this.canvas.addEventListener('wheel', this.handleScroll);

      this.initTables()

      this.animate()
      // const initTables = () => {
      //   let tableDiv = document.getElementById('tables-div');
      //   tableDiv.innerHTML = this.tables.filter(t => t.virtualHallId == null).map((t, i) => `
      //       <div id="${t.tableId}" name="${t.tableName}" type="${i != 1? 'rect' : 'round'}" class="card ${i != 1? '' : 'round'}" draggable="true" ondragstart="dragCard(event)">
      //           <span>${t.tableName}</span>
      //       </div>
      //   `)
      //   let json = this.virtualHallJSON[0]['tables'];
      //   this.prtcls = new Array(json.length).fill().map((a,idx) => new Square(json[idx]))
      // }
    },

    // Handle functions

}
</script>

<style lang="scss">

  .table-container{
    z-index: 10;
  }

  .arch-container{
    z-index: 10;
    position: relative;
    width: 80%;
    /* height: 100%; */
    display: flex;
    align-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .arch-container img {
    width: 50px;
    height: 17px;
  }

  .table-btn {
    margin: 10px;
  }

  .warp-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5%;
      height: 100vh;
      position: relative;
      z-index: 2;
  }

  .wrap div {
      box-shadow: 2px 2px 6px -2px rgba(0,0,0,0.75);
  }

  .wrap2 {
      padding: 0 5%;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      top: 0;
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

  li.pass {
      color: green
  }

  li.fail {
      color: red
  }

  .tables {
      width: 10%;
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 3;
      /* display: flex;
      justify-content: center;
      align-items: center; */
  }

  .hand {
      cursor:move;
  }

  .card {
      margin: 10px;
      width: 50px;
      height: 50px;
      background-color: rgb(179, 172, 172);
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .control {
      z-index: 3;
      height: 100%;
      width: 10%;
      position: absolute;
      top: 0px;
      right: 0px;
      // display: flex;
      justify-content: center;
      align-items: center;
  }

  .control-btn{
      z-index: 3;
      height: 50%;
      width: 10%;
      margin: 10px;
      // position: absolute;
      // top: 0px;
      // right: 0px;
      // display: flex;
      // justify-content: space-evenly;
      // align-items: center;
      // align-content: stretch;
      // flex-direction: column-reverse;
      // flex-wrap: nowrap;
  }
  button{
      padding: 10px;
  }

  .round {
      border-radius: 50%;
  }

</style>