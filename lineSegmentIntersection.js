let lineArr = [],
    eventArr = [],
    drawing = false,
    anchor  = {
        x: 0,
        y: 0
    },
    proposedEndpoint = {
        x: 0,
        y: 0
    }

class Line{
    constructor(fromX, fromY, toX, toY) {
        this.from = {
            x: fromX,
            y: fromY
        }
        this.to = {
            x: toX,
            y: toY
        }
    }
    draw(){
        ctx.strokeStyle = "white"
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.moveTo(this.from.x, this.from.y)
        ctx.lineTo(this.to.x, this.to.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(this.from.x, this.from.y, 5, 0, 2 * Math.PI)
        ctx.fill()
        ctx.arc(this.to.x, this.to.y, 5, 0, 2 * Math.PI)
        ctx.fill()
    }
}

class Event{
    constructor(type, x) {
        this.type = type
        this.x = x
    }
}

function drawLines(){
    for (const line of lineArr) {
        line.draw()
    }
}
function aim(){
    let angleToMouse = Math.atan2(mouse.y - anchor.y, mouse.x - anchor.x)
    let radius = Math.floor(Math.sqrt(Math.pow(mouse.x - anchor.x, 2)+ Math.pow(mouse.y - anchor.y, 2)))
    console.log(angleToMouse)
    let pi = Math.PI
    let degrees = Math.floor(angleToMouse / pi * -180)


    let snapTo = 0
    let proposedX = anchor.x + radius
    let proposedY = anchor.y

    // right
    if (angleToMouse > -pi/4 && angleToMouse < pi/4){
        snapTo = 0
        proposedX = anchor.x + radius
        proposedY = anchor.y
    }

    // down
    else if (angleToMouse > pi/4 && angleToMouse < (3/4 * pi)) {
        snapTo = pi/2
        proposedX = anchor.x
        proposedY = anchor.y + radius
    }

    // left
    else if (angleToMouse > (3/4 * pi) || angleToMouse < (-3/4 * pi)){
        snapTo = pi
        proposedX = anchor.x - radius
        proposedY = anchor.y
    }

    // up
    else if (angleToMouse < (pi/4) && angleToMouse > (-3/4 * pi)){
        snapTo = -pi / 2
        proposedX = anchor.x
        proposedY = anchor.y - radius
    }

    // ANCHOR
    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.arc(anchor.x, anchor.y, 5, 0, 2 * Math.PI)
    ctx.fill()

    // LINE TO MOUSE
    ctx.strokeStyle = "grey"
    ctx.beginPath()
    ctx.moveTo(anchor.x, anchor.y)
    ctx.lineTo(mouse.x, mouse.y)
    ctx.stroke()

    // RADIUS
    ctx.strokeStyle = "grey"
    ctx.beginPath()
    ctx.arc(anchor.x, anchor.y, radius, 0, 2 * Math.PI)
    ctx.stroke()

    // RADIUS TO SNAP
    ctx.strokeStyle = "red"
    ctx.beginPath()
    if (snapTo === pi && angleToMouse < 0) ctx.arc(anchor.x, anchor.y, radius, snapTo, angleToMouse)
    else if (snapTo > angleToMouse) ctx.arc(anchor.x, anchor.y, radius, angleToMouse, snapTo)
    else  ctx.arc(anchor.x, anchor.y, radius, snapTo, angleToMouse)
    ctx.stroke()

    // PROPOSED LINE
    ctx.strokeStyle = "red"
    ctx.beginPath()
    ctx.moveTo(anchor.x, anchor.y)
    ctx.lineTo(proposedX, proposedY)
    ctx.stroke()

    // TEXT
    ctx.font = "12px Arial"
    ctx.fillText(degrees + "°", mouse.x, mouse.y)
    ctx.fillText(radius + "px", proposedX, proposedY)

    proposedEndpoint.x = proposedX
    proposedEndpoint.y = proposedY
}
function handleIntersections(){
    drawLines()
    if (drawing) aim()
}


function mouseClickIntersect() {
    if (!drawing) {
        anchor.x = mouse.x
        anchor.y = mouse.y
    }
    else lineArr.push(new Line(anchor.x, anchor.y, proposedEndpoint.x, proposedEndpoint.y))
    drawing = !drawing
}

function resetLines(){
    lineArr.length = 0
}
function resetEvents(){
    eventArr.length = 0
}

