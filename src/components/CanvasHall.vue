<template>
    <v-row class="text-center">

      <v-col cols="1" class="table-container">
        <v-btn 
          v-for="(t, i) in tables"
          :key="i"
          :id="t.tableId"
          :name="t.tableName"
          :hall="t.virtualHallId"
          :type="t.virtualHallId == null?'rect' : 'round'"
          :draggable="true"
          :class="{'table-btn' : true}"
          :fab="t.virtualHallId != null"
          :color="t.virtualHallId == null? 'primary' : 'cyan'"
          @dragstart="dragCard"
        >
        {{ t['tableName'] }}
        </v-btn>
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
        </div>
      </v-col>

      <v-col class="control" cols="1">
        <v-input type="color"></v-input>
        <v-btn class="btn" @click="getVirtualHallData">click</v-btn>
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
          ev.dataTransfer.setData("hall", ev.target.getAttribute('hall'));
      },
      dropCard(ev) {
          ev.preventDefault();
          let id = ev.dataTransfer.getData("card");
          let name = ev.dataTransfer.getData("cardName");
          let type = ev.dataTransfer.getData("cardType");
          let hall = ev.dataTransfer.getData("hall");
          let json = {...this.defaultParelData};

          console.log(hall, hall === 'null')

          if(id == '') return;
          if(hall !== 'null') {
            document.getElementById(id).remove()
          }

          let canvasCoords = this.canvas.getBoundingClientRect()

          json['tableId'] = id;
          json['tableName'] = name;
          json['shape'] = type;
          json['x'] = (event.pageX - canvasCoords.left) / this.zoomLevel;
          json['y'] = (event.pageY - canvasCoords.top) / this.zoomLevel;

          let newPrtcls = new Square(json);
          this.prtcls.push(newPrtcls)
      },
      getVirtualHallData() {
        let tables = this.getIt('tables');
        this.virtualHallJSON[0]['tables'] = tables;
        console.log("Virtual Hall Json Data :  ", this.virtualHallJSON)
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
            "active":true,
            "tableId": "AC892C8C9C5477FFE53F2A2AADB2CB11989A874E",
            "tableName": "I1",
            "hallId": "C3AEE1B8BF886C1A13602D6E271F0CE7D7F727A5",
            "virtualHallId":"AADCBDE475BCF7B59C55BAAC1988FAF1DD15D7E5"
          },
          {
            "active":true,
            "tableId": "98BE6476E12A82D9441A4C47B7C895DEE0FA7C06",
            "tableName": "I2",
            "hallId": "C3AEE1B8BF886C1A13602D6E271F0CE7D7F727A5",
            "virtualHallId":"AADCBDE475BCF7B59C55BAAC1988FAF1DD15D7E5"
          },
          {
            "active":true,
            "tableId": "F69E599E34BF2084CD69CC3DB00850E7FBED13CA",
            "tableName": "I3",
            "hallId": "C3AEE1B8BF886C1A13602D6E271F0CE7D7F727A5",
            "virtualHallId":null
          },
          {
            "active":true,
            "tableId": "C615A5BA638C2CC2E00FD550F08144D119DE3598",
            "tableName": "I4",
            "hallId": "C3AEE1B8BF886C1A13602D6E271F0CE7D7F727A5",
            "virtualHallId":"AADCBDE475BCF7B59C55BAAC1988FAF1DD15D7E5"
          },
          {
            "active":true,
            "tableId": "0F40FF8F00A5B270DC4EF508F779F7D513E80870",
            "tableName": "I5",
            "hallId": "C3AEE1B8BF886C1A13602D6E271F0CE7D7F727A5",
            "virtualHallId":null
          },
          {
            "active":true,
            "tableId": "99DD8A4C91863A7FC72AC8305F6AAF7153F2A3A2",
            "tableName": "I6",
            "hallId": "C3AEE1B8BF886C1A13602D6E271F0CE7D7F727A5",
            "virtualHallId":null
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
                              originH : e.h
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
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .control-btn{
      z-index: 3;
      height: 50%;
      width: 10%;
      position: absolute;
      top: 0px;
      right: 0px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      align-content: stretch;
      flex-direction: column-reverse;
      flex-wrap: nowrap;
  }
  button{
      padding: 10px;
  }

  .round {
      border-radius: 50%;
  }

</style>