let pointArr = [],
    hullArr = [],
    useGraham = true
function handleConvexHull2D(){
    if (pointArr.length > 0){
        for (const anchorArrElement of pointArr) {
            anchorArrElement.draw()
        }
    }
    drawLineFromPointArr(hullArr, 3, true)
}
function mouseClickCh2d(){
    insertPointWithCheck(pointArr)
    fillHullArr()
}

function fillHullArr() {
    if (pointArr.length < 3) return
    // Grahams Scan
    if (false){
        hullArr = []

        // set p0 to lowest point. Why doesnt leftmost point work???
        let p0 = 0
        for (let i = 1; i < pointArr.length; i++) {
            if (pointArr[i].y < pointArr[p0].y) p0 = i
        }

        // Compute and sort points by slope from p0. Point.order is an attribute created solely for ordering purposes.
        for (let i = 0; i < pointArr.length; i++) {
            pointArr[i].order = getSlope(pointArr[p0], pointArr[i])
        }
        pointArr.sort((a,b) => {
            return a.order - b.order
        })

        // push p0 and p1 into hullArr
        hullArr.push(pointArr[0], pointArr[1])

        for (let i = 2; i < pointArr.length; i++) {
            while (hullArr.length >= 3 && isRightTurn(pointArr[i], hullArr[hullArr.length-1], hullArr[hullArr.length-2])){
                hullArr.pop()
            }
            hullArr.push(pointArr[i])
        }
    }

    // Jarvis as in https://de.wikipedia.org/wiki/Gift-Wrapping-Algorithmus
    else{
        // need to clear hull after adding new point
        hullArr = []

        // find first hull element p0
        let p0 = 0
        for (let i = 1; i < pointArr.length; i++) {
            if (pointArr[i].x < pointArr[p0].x) p0 = i
        }

        // remember first hull element for do-while comparison, p0 will always point to the most recent hull element
        let firstHullEl = p0

        // set q1 for first guess of best new hull element on index 0
        let q1 = 0


        do {
            hullArr.push(pointArr[p0])
            // reset q1 for next iter
            q1 = 0

            // corner case avoided due to > instead of >= in pointIsLeftOftLine()
            // if (q1 === p0) q1 = 1

            for (let i = 1; i < pointArr.length; i++) {
                let isBetterPoint = pointIsLeftOfLine(hullArr[hullArr.length-1], pointArr[q1], pointArr[i])
                //
                if (q1 === p0 || isBetterPoint) q1 = i
            }
            p0 = q1
        }
        while (q1 !== firstHullEl)
    }

    function isRightTurn(point, hullTop, hullSecond){
        let dotProd =   (point.y - hullTop.y) * (hullTop.x - hullSecond.x) -
            (point.x - hullTop.x) * (hullTop.y - hullSecond.y)
        return (dotProd <= 0)
    }

    function getSlope(anchor, point){
        // atan2 best for angle computation (umlaut: most stable but still expensive)
        return Math.atan2(point.y - anchor.y, point.x - anchor.x)
    }
    function pointIsLeftOfLine(lineStart, lineEnd, point){
        let dotProd =   (lineEnd.x - lineStart.x) * (point.y - lineStart.y) -
                                (lineEnd.y - lineStart.y) * (point.x - lineStart.x)
        return (dotProd > 0)
    }
}

function resetConvexHull2D() {
    pointArr.length = 0
    hullArr.length = 0
}







