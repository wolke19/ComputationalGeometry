let anchorArr = [],
    hullArr = []
function handleConvexHull2D(){
    if (anchorArr.length > 0){
        ctx.beginPath()
        for (const anchorArrElement of anchorArr) {
            anchorArrElement.draw()
        }
    }
    if (hullArr.length > 2){
        ctx.moveTo(hullArr[hullArr.length-1].x, hullArr[hullArr.length-1].y)
        for (const hullArrElement of hullArr) {
            ctx.lineTo(hullArrElement.x, hullArrElement.y)
            ctx.strokeStyle = opts.pointColor
            ctx.stroke()
        }
    }
}

function getHull() {
    hullArr = []
    let p0 = 0

    // find p0
    for (let i = 1; i < anchorArr.length; i++) {
        if (anchorArr[i].y > anchorArr[p0].y ||
                anchorArr[i].y === anchorArr[p0].y && anchorArr[i].x > anchorArr[p0].x) {
            p0 = i
        }
    }

    // compute and sort by slope from p0
    for (let i = 0; i < anchorArr.length; i++) {
        anchorArr[i].order = getSlope(anchorArr[i], anchorArr[p0])
    }
    anchorArr.sort((a,b) => {
        return a.order - b.order
    })

    // find hull
    hullArr.push(anchorArr[0], anchorArr[1])
    for (let i = 2; i < anchorArr.length; i++) {
        while (hullArr.length > 2 && isRightTurn(anchorArr[i], hullArr[hullArr.length-1], hullArr[hullArr.length-2])){
            hullArr.pop()
        }
        hullArr.push(anchorArr[i])
    }

    function isRightTurn(point, hullTop, hullSecond){
        return (getSlope(hullSecond, hullTop) > getSlope(hullSecond, point))
    }

    function getSlope(a, b){
        return Math.atan2(b.y - a.y, b.x - a.x)
    }
}


function resetConvexHull2D() {
    anchorArr.length = 0
}

addEventListener("click", function (event){
    if (dropdownSelected === "ch2d" && mouse.onCanvas){
        let existingPoint = false
        for (let i = 0; i < anchorArr.length; i++) {
            if (mouse.x < anchorArr[i].x + anchorArr[i].size
                && mouse.x > anchorArr[i].x - anchorArr[i].size
                && mouse.y < anchorArr[i].y + anchorArr[i].size
                && mouse.y > anchorArr[i].y - anchorArr[i].size) {
                existingPoint = true
                anchorArr.splice(i,1)
                break
            }
        }
        if (!existingPoint) anchorArr.push(new StaticPoint())
        if (anchorArr.length >= 2) getHull()
    }
})



