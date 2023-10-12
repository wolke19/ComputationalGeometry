function checkForExistingPoint(points){
    let existingPoint = false
    for (let i = 0; i < pointArr.length; i++) {
        if (mouse.x < points[i].x + points[i].size*2
            && mouse.x > points[i].x - points[i].size*2
            && mouse.y < points[i].y + points[i].size*2
            && mouse.y > points[i].y - points[i].size*2) {
            existingPoint = true
            points.splice(i,1)
            break
        }
    }
    if (!existingPoint) points.push(new StaticPoint(mouse.x, mouse.y))
}

function drawLineFromPointArr(points, minPoints, close){
    ctx.beginPath()
    if (points.length >= minPoints){
        ctx.moveTo(points[0].x, points[0].y)
        for (const point of points) {
            ctx.lineTo(point.x, point.y)
        }
        ctx.strokeStyle = opts.pointColor
        if (close) ctx.closePath()
        ctx.stroke()
    }
}