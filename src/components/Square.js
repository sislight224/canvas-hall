export default class Square {
    constructor(j) {
        this.x = j.x
        this.y = j.y
        this.w = j.width
        this.h = j.height
        this.shape=j.shape
        this.table=j.tableName     
        this.tableId=j.tableId
             
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
      
        if (this.active) {
            context.fillStyle = this.color;
            context.save()
            context.setLineDash([10, 5, 30, 5])
            context.beginPath()
            context.moveTo(this.x, this.y)
            context.lineTo(0, this.y)
            context.moveTo(this.x, this.y)
            context.lineTo(this.x, 0)
            context.moveTo(this.x, this.y)
            context.closePath()
            context.lineWidth = 0.5
            context.strokeStyle = this.activeColor
            context.stroke()

            
            this.drawCoords(context, this.x, this.y, this.activeColor, this.w, this.h)
            

            context.restore()
        }
        context.beginPath();

        switch (this.shape)
        {
            case 'rect':
                context.fillRect(this.x, this.y, this.w, this.h)
                break;
            case 'image':
                if(this.isImg) {
                    context.drawImage (this.img, this.x, this.y, this.w, this.h);
                }
                break;
            case 'roundRect':
                this.drawRoundedRect(context, 10)
                break;
            case 'octagonal':
                this.drawOctagon(context, this.x + this.w / 2, this.y + this.w / 2, this.w / 2)
                break;
            case 'round':
                context.arc(this.x + (this.w / 2), this.y + (this.h / 2), this.w / 2, 0, 2 * Math.PI, true);
                context.fillStyle = this.bookings? this.bookings[this.shift].color :'green'
                context.fill();
                break;
            case 'ecllipse':
                context.ellipse(this.x + (this.w / 2), this.y + (this.h / 2), this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
                context.fillStyle = this.bookings? this.bookings[this.shift].color :'green'
                context.fill();
                break;
        }
        context.font="20px Arial";
        context.textAlign="center"; 
        context.textBaseline = "middle";
        context.fillStyle = "#ffffff";          
        context.fillText(this.table,this.x+(this.w/2),this.y+(this.h/2)); 
        context.font="12px Arial";
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
                context.strokeRect(this.x, this.y, this.w, this.h)
            }
        
        if (this.active) {
            // drawHandles(context, this.x, this.y, this.w, this.h, this.activeColor,this.shape);
            //mouseDown(this);
        }
        context.restore();
    }

    drawRoundedRect(context, radius) {
        context.beginPath();
        context.moveTo(this.x + radius, this.y);
        context.arcTo(this.x + this.w, this.y, this.x + this.w, this.y + this.h, radius);
        context.arcTo(this.x + this.w, this.y + this.h, this.x, this.y + this.h, radius);
        context.arcTo(this.x, this.y + this.h, this.x, this.y, radius);
        context.arcTo(this.x, this.y, this.x + this.w, this.y, radius);
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

    drawCoords = (ctx, x, y, color = "green", w, h) => {
        ctx.save()
        ctx.translate(x, y)
        ctx.fillStyle = color
        ctx.fillRect(-45, -7, 30, 14)
        ctx.fillStyle = 'white'
        ctx.fillText(Math.floor(x), -30, 0)
    
        ctx.fillStyle = 'black'
        ctx.fillRect(w / 2 - 15, -14, 30, 14)
        ctx.fillStyle = 'white'
        ctx.fillText(Math.floor(w), w / 2, -7)
    
        ctx.rotate(Math.PI / 2)
        ctx.fillStyle = color
        ctx.fillRect(-45, -7, 30, 14)
        ctx.fillStyle = 'white'
        ctx.fillText(Math.floor(y), -30, 0)
    
        ctx.fillStyle = 'black'
        ctx.fillRect(h / 2 - 15, 0, 30, 14)
        ctx.fillStyle = 'white'
        ctx.fillText(Math.floor(h), h / 2, 7)
    
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