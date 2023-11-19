let lineArr = [],
    eventArr = [],
    intersectionArr = [],
    drawing = false,
    anchor  = {
        x: 0,
        y: 0
    },
    proposedEndpoint = {
        x: 0,
        y: 0
    };

// SWEEP LINE ALGORITHM
function findIntersections(){
// Initialize eventArr Q with all events sorted by x-coordinate
    for (let line of lineArr) {
        if (line.from.x === line.to.x){
            eventArr.push(new Event(3, line.from.x, line))
        }
        else {
            let startEvent = new Event(1, line.from.x, line)
            let endEvent = new Event(2, line.to.x, line)
            eventArr.push(startEvent, endEvent)
        }
    }
    // sort descending to pop the next smallest event by x
    eventArr.sort((a,b) => {
        return b.x - a.x
    })
    console.log(eventArr)


    while (eventArr.length !== 0){
        let event = eventArr.pop()
        switch (event.type){
            case 1: {
                event.line.isActive = true
                break
            }
            case 2: {
                event.line.isActive = false
                break
            }
            case 3: {
                let upperBound = Math.max(event.line.to.y, event.line.from.y)
                let lowerBound = Math.min(event.line.to.y, event.line.from.y)
                for (const line of lineArr) {
                    if (line.isActive && line.to.y <= upperBound &&
                        line.to.y >= lowerBound){
                        intersectionArr.push(new Intersection(event.x, line.from.y))
                    }
                }
            }
        }
    }
}



// EVERYTHING ELSE

class Line{
    constructor(fromX, fromY, toX, toY, isActive) {
        this.from = {
            x: fromX,
            y: fromY
        }
        this.to = {
            x: toX,
            y: toY
        }
        this.isActive = isActive
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
    constructor(type, x, line) {
        this.type = type //1, 2, 3 (start, end, intersection)
        this.x = x
        this.line = line
    }
}

class Intersection{
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    draw(){
        ctx.fillStyle = "yellow"
        ctx.beginPath()
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI)
        ctx.fill()
    }
}

function drawIntersections(){
    for (const intersection of intersectionArr) {
        intersection.draw()
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
    // console.log(angleToMouse)
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
    drawIntersections()
    if (drawing) aim()
}


function mouseClickIntersect() {
    if (!drawing) {
        anchor.x = mouse.x
        anchor.y = mouse.y
    }
    else {
        // make sure lines always go from left to right
        lineArr.push(new Line(
            Math.min(anchor.x, proposedEndpoint.x),
            anchor.y,
            Math.max(proposedEndpoint.x, anchor.x),
            proposedEndpoint.y,
            false,))
        findIntersections()
    }
    drawing = !drawing
}

function resetLines(){
    lineArr.length = 0
    eventArr.length = 0
    intersectionArr.length = 0
}
function resetEvents(){
    eventArr.length = 0
}

