let inputArrCH = [],
    hullArr = [],
    remainingPointsArr = [],
    triangleArr = [],
    
    useGraham = true,
    delaunay = true


function fillHullArr() {
    if (inputArrCH.length < 3) return
    hullArr.length = 0
    triangleArr.length = 0



    // Grahams Scan
    if (useGraham){
        // set p0 to lowest point. Why doesnt leftmost point work???
        let p0 = 0
        for (let i = 1; i < inputArrCH.length; i++) {
            if (inputArrCH[i].y < inputArrCH[p0].y) p0 = i
        }

        // Compute and sort points by slope from p0. Point.order is an attribute created solely for ordering purposes.
        for (let i = 0; i < inputArrCH.length; i++) {
            inputArrCH[i].order = getSlope(inputArrCH[p0], inputArrCH[i])
        }
        inputArrCH.sort((a,b) => {
            return a.order - b.order
        })

        // push p0 and p1 into hullArr
        hullArr.push(inputArrCH[0], inputArrCH[1])

        for (let i = 2; i < inputArrCH.length; i++) {
            while (hullArr.length >= 3 && isRightTurn(inputArrCH[i], hullArr[hullArr.length-1], hullArr[hullArr.length-2])){
                hullArr.pop()
            }
            hullArr.push(inputArrCH[i])
        }
    }

    // Jarvis as in https://de.wikipedia.org/wiki/Gift-Wrapping-Algorithmus
    else{
        // need to clear hull after adding new point


        // find first hull element p0
        let p0 = 0
        for (let i = 1; i < inputArrCH.length; i++) {
            if (inputArrCH[i].x < inputArrCH[p0].x) p0 = i
        }

        // remember first hull element for do-while comparison, p0 will always point to the most recent hull element
        let firstHullEl = p0

        // set q1 for first guess of best new hull element on index 0
        let q1 = 0


        do {
            hullArr.push(inputArrCH[p0])
            // reset q1 for next iter
            q1 = 0

            // corner case avoided due to > instead of >= in pointIsLeftOftLine()
            // if (q1 === p0) q1 = 1

            for (let i = 1; i < inputArrCH.length; i++) {
                let isBetterPoint = pointIsLeftOfLine(hullArr[hullArr.length-1], inputArrCH[q1], inputArrCH[i])
                //
                if (q1 === p0 || isBetterPoint) q1 = i
            }
            p0 = q1
        }
        while (q1 !== firstHullEl)
    }

    if (delaunay && inputArrCH.length > 3) triangulate()

    function isRightTurn(point, hullTop, hullSecond){
        let dotProd =   (point.y - hullTop.y) * (hullTop.x - hullSecond.x) -
            (point.x - hullTop.x) * (hullTop.y - hullSecond.y)
        return (dotProd <= 0)
    }


    function pointIsLeftOfLine(lineStart, lineEnd, point){
        let dotProd =   (lineEnd.x - lineStart.x) * (point.y - lineStart.y) -
            (lineEnd.y - lineStart.y) * (point.x - lineStart.x)
        return (dotProd > 0)
    }
}
function triangulate(){

    remainingPointsArr.length = 0
    // Prepare Remaining Points
    remainingPointsArr = structuredClone(inputArrCH)
    spliceHullElementsFromRemainingPointsArray()
    function spliceHullElementsFromRemainingPointsArray(){
        let i = 0
        while (i < remainingPointsArr.length){
            let isHullElement = false
            for (let j = 0; j < hullArr.length; j++) {
                if (JSON.stringify(remainingPointsArr[i]) === JSON.stringify(hullArr[j])){
                    remainingPointsArr.splice(i,1)
                    isHullElement = true
                    break
                }
            }
            if (!isHullElement) i++
        }
    }
    shuffleArray(remainingPointsArr)

    // If no remaining points exist return. Otherwise, chaos reigns.
    if (remainingPointsArr.length === 0) return

    //  3: Compute an initial triangulation 𝐷 by connecting 𝑝1 to the corners of CH(𝑃)
    let firstPoint = remainingPointsArr[0]
    for (let i = 1; i < hullArr.length; i++) {
        triangleArr.push(new Triangle(firstPoint, hullArr[i-1], hullArr[i]))
    }
    triangleArr.push(new Triangle(firstPoint, hullArr[0], hullArr[hullArr.length-1]))

    // TODO: Check for Delauney-Correctness. There are cases, when simply connecting results in a incorrect triangulation
    // todo: which leads to a incorrect result further down the line!

    for (let i = 1; i < remainingPointsArr.length; i++) {
        let point = remainingPointsArr[i]

        // 5: Find triangle 𝑝𝑖𝑝𝑗𝑝𝑘 containing 𝑝𝑟;
        // let containingTriangle = triangleArr[findTriangleIndex(point)]
        // function findTriangleIndex(point){
        //     for (let j = 0; j < triangleArr.length; j++) {
        //         let p1 = triangleArr[j].p1
        //         let p2 = triangleArr[j].p2
        //         let p3 = triangleArr[j].p3
        //
        //         // Continue if Point Outside Bounding Rectangle
        //         if ((point.x < p1.x && point.x < p2.x && point.x < p3.x) ||
        //             (point.x > p1.x && point.x > p2.x && point.x > p3.x) ||
        //             (point.y > p1.y && point.y > p2.y && point.y > p3.y) ||
        //             (point.y < p1.y && point.y < p2.y && point.y < p3.y)) {
        //             continue
        //         }
        //
        //         // Point Inside Triangle if Area of Triangle equal to Triangulated (by P) Subtriangles
        //         let A = area(p1, p2, p3)
        //         let a1 = area(point, p2, p3)
        //         let a2 = area(p1, point, p3)
        //         let a3 = area(p1, p2, point)
        //
        //         if (A === a1 + a2 + a3) return i
        //     }
        //
        //     function area(p1, p2, p3) {
        //         return Math.abs((p1.x*(p2.y-p3.y) + p2.x*(p3.y-p1.y)+ p3.x*(p1.y-p2.y))/2.0);
        //     }
        // }


        let holePoints = []
            let k = 0
            while (k < triangleArr.length){
                let p1 = triangleArr[k].p1
                let p2 = triangleArr[k].p2
                let p3 = triangleArr[k].p3

                let D =  (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) * 2
                let centerX = (1 / D ) * ( (Math.pow(p1.x, 2) + Math.pow(p1.y, 2)) * (p2.y - p3.y) +
                    (Math.pow(p2.x, 2) + Math.pow(p2.y, 2)) * (p3.y - p1.y) +
                    (Math.pow(p3.x, 2) + Math.pow(p3.y, 2)) * (p1.y - p2.y))

                let centerY = (1 / D ) * ( (Math.pow(p1.x, 2) + Math.pow(p1.y, 2)) * (p3.x - p2.x) +
                    (Math.pow(p2.x, 2) + Math.pow(p2.y, 2)) * (p1.x - p3.x) +
                    (Math.pow(p3.x, 2) + Math.pow(p3.y, 2)) * (p2.x - p1.x))

                let radius = distance(p1.x, p1.y, centerX, centerY)
                let distancePointToCenter = distance(point.x, point.y, centerX, centerY)
                if (distancePointToCenter > radius) {
                    k++
                    continue
                }
                holePoints.push(triangleArr[k].p1, triangleArr[k].p2, triangleArr[k].p3)
                triangleArr.splice(k, 1)
        }

        // UNIQUE
        let uniqueHolePoints = holePoints.filter((value, index) => {
            const _value = JSON.stringify(value)
            return index === holePoints.findIndex(obj => {
                return JSON.stringify(obj) === _value
            })
        })

        // GET SLOPE
        for (let j = 0; j < uniqueHolePoints.length; j++) {
            uniqueHolePoints[j].order = getSlope(point, uniqueHolePoints[j])
        }

        // ORDER BY SLOPE
        uniqueHolePoints.sort((a,b) => {
            return a.order - b.order
        })

        // NEW TRIANGLES
        console.log(triangleArr)
        for (let j = 1; j < uniqueHolePoints.length; j++) {
            triangleArr.push(new Triangle(point, uniqueHolePoints[j], uniqueHolePoints[j-1]))
        }
        triangleArr.push(new Triangle(point, uniqueHolePoints[0], uniqueHolePoints[uniqueHolePoints.length - 1]))
    }
}

class StaticPoint {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.size = opts.pointSize
        this.color = opts.pointColor
        this.order = 0
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        ctx.fill()
    }
}
class Triangle {
    constructor(p1, p2, p3){
        this.p1 = p1
        this.p2 = p2
        this.p3 = p3
    }
    draw(){
        let temp = []
        temp.push(this.p1, this.p2, this.p3)
        drawLineFromPointArr(temp , 3)
    }
}

function handleConvexHull2D(){
    drawPointsFromPointArr(inputArrCH)
    drawLineFromPointArr(hullArr,3)
    if (delaunay) drawDelaunay()
}
function resetConvexHull2D() {
    inputArrCH.length = 0
    hullArr.length = 0
    remainingPointsArr.length = 0
    triangleArr.length = 0
}
function drawLineFromPointArr(arr, minPoints){
    if (hullArr.length >= minPoints){
        ctx.beginPath()
        ctx.moveTo(arr[0].x, arr[0].y)
        for (const point of arr) {
            ctx.lineTo(point.x, point.y)
        }
        ctx.strokeStyle = opts.pointColor
        ctx.closePath()
        ctx.stroke()
    }
}
function drawPointsFromPointArr(arr){
    if (arr.length > 0){
        for (const anchorArrElement of arr) {
            anchorArrElement.draw()
        }
    }
}
function drawDelaunay(){
    if (triangleArr.length === 0) return
    for (const triangle of triangleArr) {
            triangle.draw()
    }
}

function mouseClickConvexHull(){
    insertPointWithCheck(mouse.x, mouse.y)
    fillHullArr()
}
function insert100RandomPointsComplexHull(){
    for (let i = 0; i < 10; i++) {
        insertPointWithCheck(Math.random()*canvas.width, Math.random()*canvas.height)
    }
    fillHullArr()
}
function insertPointWithCheck(x, y){
    let existingPoint = false
    if (inputArrCH.length > 0){
        for (let i = 0; i < inputArrCH.length; i++) {
            if (x < inputArrCH[i].x + inputArrCH[i].size*2 &&
                x > inputArrCH[i].x - inputArrCH[i].size*2 &&
                y < inputArrCH[i].y + inputArrCH[i].size*2 &&
                y > inputArrCH[i].y - inputArrCH[i].size*2) {
                existingPoint = true
                inputArrCH.splice(i,1)
                break
            }
        }
    }
    if (!existingPoint) inputArrCH.push(new StaticPoint(x, y))
}


function shuffleArray(arr) {
    arr.sort(() => Math.random() - 0.5);
}
function distance(x1, y1, x2, y2){
    return Math.sqrt((Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
}
function getSlope(anchor, point){
    // atan2 best for angle computation (umlaut: most stable but still expensive)
    return Math.atan2(point.y - anchor.y, point.x - anchor.x)
}









