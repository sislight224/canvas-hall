import TYPE from './Constant'

export default class Square {
    constructor(j) {
        this.x = j.x
        this.y = j.y
        this.w = j.width
        this.h = j.height
        this.shape=j.shape
        this.table=j.tableName     
        this.tableId=j.tableId
        this.angle = 0;
        
        this.bookings=j.bookings
        this.color = j.color
        this.lastName = j.lastName
        this.covers=j.covers
        this.children=j.children
        this.time=j.time
        this.url=j.url
        this.shift=0
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
        context.fillStyle = this.bookings?this.bookings[0].color:'green'
        
        let realX = this.x + this.camera.x;
        let realY = this.y + this.camera.y;

        if (this.active || this.resize) {
            context.fillStyle = this.color;
            context.save()
            context.setLineDash([10, 5, 30, 5])
            context.beginPath()
            context.moveTo(realX, realY)
            context.lineTo(0, realY)
            context.moveTo(realX, realY)
            context.lineTo(realX, 0)
            context.moveTo(realX, realY)
            context.closePath()
            context.lineWidth = 0.5
            context.strokeStyle = this.activeColor
            context.stroke()


            this.drawCoords(context, realX, realY, this.activeColor, this.w, this.h)
            

            context.restore()
        }

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
            case TYPE.ROUND:
                context.arc(0 , 0 , this.w / 2, 0, 2 * Math.PI, true);
                context.fillStyle = this.bookings? this.bookings[this.shift].color :'green'
                context.fill();
                break;
            case TYPE.ECLLIPSE:
                context.ellipse(0 , 0 , this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
                context.fillStyle = this.bookings? this.bookings[this.shift].color :'green'
                context.fill();
                break;
        }

        if(this.shape != 'image') {
            context.font="20px Arial";
            context.textAlign="center"; 
            context.textBaseline = "middle";
            context.fillStyle = "#ffffff";          
            context.fillText(this.table, 0, 0); 
            context.font="12px Arial";
        }


        if( this.bookings)
        {
            //let booking=this.bookings[this.shift];
            //context.fillText(booking.lastName,this.x+(this.w/2),this.y+(this.h/2));  
            //context.font="12px Arial";
            //context.fillText(booking.children?booking.covers + '+' + booking.children:booking.covers,this.x+(this.w/2),this.y+this.h-30); 
            //context.fillText(booking.time,this.x+(this.w/2),this.y+this.h-10);     
        }
            if (this.selected || this.resize) {
                context.lineWidth = 2;
                context.strokeStyle = this.activeColor2
                context.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h)
            }
        
        if (this.active && this.rotate) {
            this.drawHandles(context, realX, realY, this.w, this.h, this.activeColor, this.shape);
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
        // context.beginPath();
        // context.moveTo(x + sideLength * Math.cos(0), y + sideLength * Math.sin(0));
        // for (let i = 1; i <= 8; i++) {
        //   const angle = i * (Math.PI / 4);
        //   context.lineTo(x + sideLength * Math.cos(angle), y + sideLength * Math.sin(angle));
        // }
        // context.closePath();
        // context.stroke();
        // context.fillStyle = this.color;
        // context.fill();
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

    drawCoords = (ctx, x, y, color = "green", w, h) => {
        ctx.save()
        ctx.translate(x, y)
        ctx.fillStyle = color
        ctx.fillRect(-45, -7, 30, 14)
        ctx.fillStyle = 'white'
        ctx.fillText(Math.floor(x - this.camera.x), -30, 0)
    
        ctx.save()
        ctx.rotate(Math.PI / 2)
        ctx.fillStyle = color
        ctx.fillRect(-45, -7, 30, 14)
        ctx.fillStyle = 'white'
        ctx.fillText(Math.floor(y - this.camera.y), -30, 0)
        ctx.restore()
        
            ctx.save()
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