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

    // Grahams Scan
    if (useGraham){
        hullArr = []

        let p0 = getP0Index()

        // Compute and sort points by slope from p0. Point.order is an attribute created solely for ordering purposes.
        for (let i = 0; i < pointArr.length; i++) {
            pointArr[i].order = getSlope(pointArr[i], pointArr[p0])
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

    // Jarvis
    else{
        let p0Index = getP0Index()
        let q1Index = p0Index

        let p0 = 1





        while (p0Index !== p0Index){
            hullArr.push(pointArr[q1Index])
            for (let i = 0; i < pointArr.length; i++) {

            }



        }






    }

    let p0 = 1;


    function getP0Index(){
        // Find p0 (bottom right)
        let p0 = 0
        for (let i = 1; i < pointArr.length; i++) {
            if (pointArr[i].y >= pointArr[p0].y) p0 = i
        }
        return p0
    }
    // If the middle point has a greater slope than the third point as seen from the first point, the curvature is
    // to the right.
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







