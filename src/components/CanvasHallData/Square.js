import TYPE from './Constant'



const framework7_font = new FontFace( 'framework7-icons',
  'url(https://cdn.jsdelivr.net/gh/framework7io/framework7-icons@master/fonts/Framework7Icons-Regular.woff2)' );
document.fonts.add( framework7_font );

const material_font = new FontFace( 'material-icons',
// pass the url to the file in CSS url() notation
// 'url(https://cdn.jsdelivr.net/npm/@mdi/font/fonts/materialdesignicons-webfont.woff2?v=7.3.67)');
'url(https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2)' );
document.fonts.add( material_font ); // add it to the document's FontFaceSet


export default class Square {
    constructor(j) {
        this.x = j.xPos
        this.y = j.yPos
        this.w = j.width
        this.h = j.height
        this.shape=j.shape
        this.table=j.name     
        this.tableId=j.tableId
        this.angle = 0;
        this.color = j.color
        this.url=j.url
        
        this.isBooking = true;
        this.fullName = j.fullName
        this.ETA = j.ETA;
        this.ATA = j.ATA;
        this.duration=j.duration
        this.timeLeft=j.timeLeft
        this.slice=j.slice
        this.timeLeftIcon=j.timeLeftIcon
        this.sliceColor=j.sliceColor
        this.covers=j.covers
        this.children=j.children
        this.requests=j.requests
        this.foodStyles=j.foodStyles
        this.reuse=j.reuse

        this.expandX = j.expandX
        this.expandY = j.expandY
        this.lockRatio = j.lockRatio
        this.flipX = 1;
        this.flipY = 1;
        
        if(this.url) {
            this.img = new Image();
            this.img.src = this.url;
            this.isImg = false;
            this.img.onload = () => {
                this.isImg = true;
            }
        }

        this.selected = false
        this.active = false
        this.resize = false
    }
    draw(context) {
        context.save();
        // context.rotate(Math.PI / 18)
        context.fillStyle = 'green'
        
        let realX = this.x + this.camera.x;
        let realY = this.y + this.camera.y;

        // if (this.active || this.resize) {
        //     let rect = this.getRealMouseRect(realX, realY, this.w, this.h, this.angle)

        //     context.fillStyle = this.color;
        //     context.save()
        //     context.setLineDash([10, 5, 30, 5])
        //     context.beginPath()
        //     context.moveTo(rect.leftEdgeX, rect.topEdgeY)
        //     context.lineTo(0, rect.topEdgeY)
        //     context.moveTo(rect.leftEdgeX, rect.topEdgeY)
        //     context.lineTo(rect.leftEdgeX, 0)
        //     context.moveTo(rect.leftEdgeX, rect.topEdgeY)
        //     context.closePath()
        //     context.lineWidth = 0.5
        //     context.strokeStyle = this.activeColor
        //     context.stroke()


        //     this.drawCoords(context, realX, realY, this.activeColor, this.w, this.h, rect.leftEdgeX, rect.topEdgeY)
            

        //     context.restore()
        // }

        context.save()
        context.translate(realX + this.w / 2, realY + this.h / 2 );
        context.rotate(this.angle)
        context.beginPath();

        switch (this.shape)
        {
            case TYPE.RECT:
                context.fillStyle = this.color;
                context.fillRect(-this.w / 2, -this.h / 2, this.w, this.h)
                break;
            case TYPE.IMAGE:
                if(this.isImg) {
                    context.save();
                    context.scale(this.flipX, this.flipY);
                    context.drawImage (this.img, -this.w / 2, -this.h / 2, this.w, this.h);
                    context.restore();
                }
                break;
            case TYPE.ROUNDRECT:
                this.drawRoundedRect(context, -this.w / 2, -this.h / 2, 10)
                break;
            case TYPE.OCTAGON:
                this.drawOctagon(context, 0 , 0 , this.w / 2)
                break;
            case TYPE.HEX:
                this.drawExagonal(context, 0 , 0 , this.w / 2)
                break;
            case TYPE.TRIANGLE:
                this.drawTriangle(context, 0 , 0 , this.w / 2)
                break;
            case TYPE.ROUND:
                context.arc(0 , 0 , this.w / 2, 0, 2 * Math.PI, true);
                context.fillStyle = this.color
                context.fill();
                break;
            case TYPE.ECLLIPSE:
                context.ellipse(0 , 0 , this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
                context.fillStyle = this.color
                context.fill();
                break;
        }

        if(this.shape != 'image') {
            context.font="20px Arial";
            context.textAlign="center"; 
            context.textBaseline = "middle";
            context.fillStyle = "#ffffff";          
            context.fillText(this.table, 0, -this.h / 2 + 20); 
            context.font="12px Arial";
        }


        if(this.isBooking)
        {



            context.fillStyle = "red";
            context.fillRect(-this.w / 2, -10, this.w * (this.timeLeft / this.duration), 20);

            context.save()
            context.fillStyle = 'white';
            context.font = '20px material-icons';
            context.fillText("bluetooth_searching", -this.w / 2 + 15, 0);
            context.restore();

            context.fillStyle = "white";
            context.fillText(this.fullName, 0, 0);  
            context.font="12px Arial";
            context.fillText(this.children?this.covers + '+' + this.children : this.covers, 0, this.h / 4); 
            context.fillText(this.ETA, 0, this.h / 2 - 8);     
        }

        if (this.selected || this.resize) {
            context.lineWidth = 2;
            context.strokeStyle = this.activeColor2
            context.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h)
        }
        
        if (this.active && this.rotate) {
            // this.drawHandles(context, realX, realY, this.w, this.h, this.activeColor, this.shape);
            //mouseDown(this);
        }

        context.restore();

        // context.save()
        // context.translate(this.x + this.w / 2, this.y + this.h / 2);
        // context.rotate(this.angle)
        // context.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h)
        // context.restore();

        context.restore();
    }

    drawRoundedRect(context, x, y, radius) {
        context.beginPath();
        context.moveTo(x + radius, y);
        context.arcTo(x + this.w, y, x + this.w, y + this.h, radius);
        context.arcTo(x + this.w, y + this.h, x, y + this.h, radius);
        context.arcTo(x, y + this.h, x, y, radius);
        context.arcTo(x, y, x + this.w, y, radius);
        context.closePath();
        // context.stroke();
        context.fillStyle = this.color;
        context.fill();
    }

    drawOctagon(context, x, y, sideLength) {
        let offset = 8
        let offsetAngle = 2 * Math.PI / 16;

        sideLength *= 1.08

        context.beginPath();
        context.moveTo(x + sideLength * Math.cos(offsetAngle), y + sideLength * Math.sin(offsetAngle));


        for (let side = 0; side <= offset; side++) {
            context.lineTo(x + sideLength * Math.cos(offsetAngle + side * 2 * Math.PI / offset), y + sideLength * Math.sin(offsetAngle + side * 2 * Math.PI / offset));
        }

        context.fillStyle = this.color;
        context.fill();

    }
    // Draw Exagonal
    drawExagonal(context, x, y, sideLength) {
        let offset = 6
        let offsetAngle = 0;

        sideLength *= 1.08

        context.beginPath();
        context.moveTo(x + sideLength * Math.cos(offsetAngle), y + sideLength * Math.sin(offsetAngle));


        for (let side = 0; side <= offset; side++) {
            context.lineTo(x + sideLength * Math.cos(offsetAngle + side * 2 * Math.PI / offset), y + sideLength * Math.sin(offsetAngle + side * 2 * Math.PI / offset));
        }

        context.fillStyle = this.color;
        context.fill();

    }
    // Draw Triangle
    drawTriangle(context, x, y, sideLength) {
        let offset = 3
        let offsetAngle = 0;

        sideLength *= 1.08

        context.beginPath();
        context.moveTo(x + sideLength * Math.cos(offsetAngle), y + sideLength * Math.sin(offsetAngle));


        for (let side = 0; side <= offset; side++) {
            context.lineTo(x + sideLength * Math.cos(offsetAngle + side * 2 * Math.PI / offset), y + sideLength * Math.sin(offsetAngle + side * 2 * Math.PI / offset));
        }

        context.fillStyle = this.color;
        context.fill();

    }

    drawHandles(ctx, x, y, w, h,color = "red", sh) {
        ctx.save()
        ctx.translate(-w / 2, -h / 2)
        ctx.fillStyle = color
        switch(sh)
          {
            case TYPE.RECT:
              ctx.fillRect(-10, -10, 15, 15)
              ctx.fillRect(w-5, h-5, 15, 15)
              ctx.fillRect(w-5, -10, 15, 15)
              ctx.fillRect(-10, h-5, 15, 15)
            break;
            case TYPE.ROUND:
              ctx.fillRect(-10, (w/2-10), 15, 15)
              ctx.fillRect(h-5,(w-15)/2, 15, 15)
              ctx.fillRect((h/2-10),-10, 15, 15)
              ctx.fillRect((h/2-10),h-5, 15, 15)
            break;
            default:
                ctx.fillRect(-10, -10, 15, 15)
                ctx.fillRect(w-5, h-5, 15, 15)
                ctx.fillRect(w-5, -10, 15, 15)
                ctx.fillRect(-10, h-5, 15, 15)
          }
        ctx.restore()
        //ctx.fillText(Math.floor(x), -30, 0)
    }

    drawCoords = (ctx, x, y, color = "green", w, h, rX, rY) => {
        ctx.save()
        ctx.translate(rX, rY)
        ctx.fillStyle = color
        ctx.fillRect(-45, -7, 30, 14)
        ctx.fillStyle = 'white'
        ctx.fillText(Math.floor(rX - this.camera.x), -30, 0)
    
        ctx.save()
        ctx.rotate(Math.PI / 2)
        ctx.fillStyle = color
        ctx.fillRect(-45, -7, 30, 14)
        ctx.fillStyle = 'white'
        ctx.fillText(Math.floor(rY - this.camera.y), -30, 0)
        ctx.restore()
        
        ctx.restore();

            ctx.save()
            ctx.translate(x, y)

            ctx.translate(w / 2, h / 2)
            ctx.rotate(this.angle)
            ctx.fillStyle = 'black'
            ctx.fillRect( - 15, -14 - h /2, 30, 14)
            ctx.fillStyle = 'white'
            ctx.fillText(Math.floor(w), 0, -7 - h /2)
        
            ctx.rotate(Math.PI / 2)
            ctx.fillStyle = 'black'
            ctx.fillRect(- 15,  w / 2, 30, 14)
            ctx.fillStyle = 'white'
            ctx.fillText(Math.floor(h), 0, 7+ w / 2)

            ctx.restore()
    
        ctx.restore()
    }

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
        const leftEdgeXTemp = Math.min(topLeftX, bottomLeftX, topRightX, bottomRightX);
        const rightEdgeXTemp = Math.max(topRightX, bottomRightX, topLeftX, bottomLeftX);
        const topEdgeYTemp = Math.min(topLeftY, topRightY, bottomLeftY, bottomRightY);
        const bottomEdgeYTemp = Math.max(bottomLeftY, bottomRightY, topLeftY, topRightY);

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
      }

    update() {
        this.x += 0.1
    }

    select() {
        this.selected = !this.selected
    }

    activate() {
        this.active = !this.active
    }

    activateResize() {
        this.resize = !this.resize;
    }
}