let anchorArr = []
function handleConvexHull2D(){



    for (const anchorArrElement of anchorArr) {
        anchorArrElement.draw()
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
    }
})



