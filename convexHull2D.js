let pointArr = [],
    hullArr = []
function handleConvexHull2D(){
    if (pointArr.length > 0){
        for (const anchorArrElement of pointArr) {
            anchorArrElement.draw()
        }
    }
    drawLineFromPointArr(hullArr, 2, true)
}

function getHull() {
    hullArr = []
    let p0 = 0

    // Find p0 (bottom right)
    for (let i = 1; i < pointArr.length; i++) {
        if (pointArr[i].y > pointArr[p0].y ||
                pointArr[i].y === pointArr[p0].y && pointArr[i].x > pointArr[p0].x) {
            p0 = i
        }
    }

    // Compute and sort by slope from p0. Point.order is an attribute created for ordering purposes.
    for (let i = 0; i < pointArr.length; i++) {
        pointArr[i].order = getSlope(pointArr[i], pointArr[p0])
    }
    pointArr.sort((a,b) => {
        return a.order - b.order
    })

    // Find hull
    hullArr.push(pointArr[0], pointArr[1])
    for (let i = 2; i < pointArr.length; i++) {
        while (hullArr.length > 2 && isRightTurn(pointArr[i], hullArr[hullArr.length-1], hullArr[hullArr.length-2])){
            hullArr.pop()
        }
        hullArr.push(pointArr[i])
    }

    // If the middle point has a greater slope than the third point as seen from the first point, the curvature is to
    // the right.
    function isRightTurn(point, hullTop, hullSecond){
        return (getSlope(hullSecond, hullTop) > getSlope(hullSecond, point))
    }

    function getSlope(a, b){
        // atan2 best for angle computation (umlaut: most stable but still expensive)
        return Math.atan2(b.y - a.y, b.x - a.x)
    }
}


function resetConvexHull2D() {
    pointArr.length = 0
    hullArr.length = 0
}

function mouseClickCh2d(){
    insertPointWithCheck(pointArr)
    if (pointArr.length >= 2) getHull()
}





