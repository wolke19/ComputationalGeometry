let inputArr = []
let range = {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    drawing: false
}
let X = []
let Y = []
let tree
let treeIsDrawable = false
let pointSize = 5
let notTouchedColor = "white"
let touchedColor = "green"
let inRangeColor = "red"


class Node {
    constructor(parent) {
        this.value = null
        this.leftChild = null
        this.rightChild = null
        this.point = null
        this.isVertical = null
        this.parent = parent

        // for Tree Map drawing only
        this.y1 = null
        this.y2 = null
        this.x1 = null
        this.x2 = null
    }
    getDepth(){
        let parent = this.parent
        let depthCounter = 0
        while(parent !== null){
            depthCounter++
            parent = parent.parent
        }
        return depthCounter
    }
}
class KDTree{
    constructor(root) {
        this.root = root
    }
    constructBalanced2DTree(leftIndex, rightIndex, node, vertical){
    //     Folie 19
        if (leftIndex > rightIndex) {
            node = null
        }
        else{
            let median = Math.floor((leftIndex + rightIndex)/2)
            if (vertical) node.point = X[median].id
            else node.point = Y[median].id
            node.isVertical = vertical

            partitionField(leftIndex, rightIndex, median)

            node.leftChild = new Node(node)
            node.rightChild = new Node(node)

            this.constructBalanced2DTree(leftIndex , median-1, node.leftChild, !vertical)
            this.constructBalanced2DTree(median+1, rightIndex, node.rightChild, !vertical)
        }

        function partitionField(leftIndex, rightIndex, median){
            // wenn horizontal, repartition X. Siehe Folie 18
            let partitionArr = (vertical) ? Y : X
            let checkArr = (vertical) ? X : Y
            // either push to helper array p1 or p2 depending on checkArr
            let partition1 = []
            let partition2 = []
            for (let i = leftIndex; i <= rightIndex; i++) {

                if (partitionArr[i].id === checkArr[median].id) continue

                let goesInPartition2 = true
                for (let j = leftIndex; j < median; j++) {
                    if (partitionArr[i].id === checkArr[j].id) {
                        goesInPartition2 = false
                        break
                    }
                }

                if (goesInPartition2) partition2.push(partitionArr[i])
                else partition1.push(partitionArr[i])
            }
            // refill partitionArr from helperArrays
            for (let i = leftIndex; i <= rightIndex; i++) {
                if (i === median) continue
                if (i < median) partitionArr[i] = partition1[i - leftIndex]
                if (i > median) partitionArr[i] = partition2[i - (median+1)]
            }
        }
    }
    rangeSearch(node){
        if (node.point === null) return

        let [coord, l, r] = (node.isVertical)
            ? [inputArr[node.point].x, range.x1, range.x2]
            : [inputArr[node.point].y, range.y1, range.y2]
        let x = inputArr[node.point].x
        let y = inputArr[node.point].y

        if (x < range.x2 && x > range.x1 && y < range.y2 && y > range.y1) {
            inputArr[node.point].color = inRangeColor
            inputArr[node.point].output = "inRange"
        }
        else {
            inputArr[node.point].color = touchedColor
            inputArr[node.point].output = "touched"
        }

        if (l < coord) this.rangeSearch(node.leftChild)
        if (r > coord) this.rangeSearch(node.rightChild)
    }
    drawTreeMap(node, isRightChild){
        if (node.point === null) return
        let depth = node.getDepth()

        if (node.isVertical){
            node.y1 = inputArr[node.parent.point].y
            node.y2 = (isRightChild) ? canvas.height : 0
            if (node.getDepth() > 2) {
                if (isRightChild){
                    node.y2 = Math.max(node.parent.parent.y1, node.parent.parent.y2)
                }
                else{
                    node.y2 = Math.min(node.parent.parent.y1, node.parent.parent.y2)
                }
            }
            drawVertical(node.y1, node.y2, inputArr[node.point].x)
        }
        else {
            node.x1 = (node.point === this.root.point) ? 0 : inputArr[node.parent.point].x
            node.x2 = (isRightChild) ? canvas.width : 0
            if (node.getDepth() > 2) {
                if (isRightChild){
                        node.x2 = Math.max(node.parent.parent.x1, node.parent.parent.x2)
                }
                else{
                    node.x2 = Math.min(node.parent.parent.x1, node.parent.parent.x2)
                }
            }
            drawHorizontal(node.x1, node.x2, inputArr[node.point].y)
        }
        this.drawTreeMap(node.rightChild, true)
        this.drawTreeMap(node.leftChild, false)

        function drawVertical(y1, y2, x){
            ctx.strokeStyle = "grey"
            ctx.beginPath()
            ctx.moveTo(x, y1)
            ctx.lineTo(x, y2)
            ctx.stroke()
        }
        function drawHorizontal(x1, x2, y){
            ctx.strokeStyle = "grey"
            ctx.beginPath()
            ctx.moveTo(x1, y)
            ctx.lineTo(x2, y)
            ctx.stroke()
        }
    }
}
class Point{
    constructor(x, y) {
        this.x = x
        this.y = y
        this.id = inputArr.length
        this.color = "white"
        this.output = "notTouched"
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, pointSize, 0, 2 * Math.PI)
        ctx.fill()
    }
}

function rangeSearch(){
    resetInputColorAndType()
    if (range.x1 > range.x2){
        let temp = range.x1
        range.x1 = range.x2
        range.x2 = temp
    }
    if (range.y1 > range.y2){
        let temp = range.y1
        range.y1 = range.y2
        range.y2 = temp
    }
    tree.rangeSearch(tree.root)
}
function prepareAndTriggerTreeConstruction(){
    X.length = 0
    Y.length = 0
    for (const point of inputArr) {
        X.push(point)
        Y.push(point)
    }
    X.sort((a, b) => {return a.x - b.x}) // sort ascending
    Y.sort((a, b) => {return a.y - b.y})

    let root = new Node(null)
    root.point = 0
    root.isVertical = false
    tree = new KDTree(root)
    treeIsDrawable = true
    tree.constructBalanced2DTree(0, inputArr.length - 1, tree.root, false)
}
function mouseClickRangeSearch(){
    resetInputColorAndType()
    inputArr.push(new Point(Math.floor(mouse.x), Math.floor(mouse.y)))
    prepareAndTriggerTreeConstruction()

}
function insert100RandomPoints(){
    resetInputColorAndType()
    for (let i = 0; i < 1000; i++) {
        inputArr.push(new Point(Math.random()*canvas.width, Math.random()*canvas.height))
    }
    prepareAndTriggerTreeConstruction()
}

function handleRangeSearch(){
    if (treeIsDrawable) tree.drawTreeMap(tree.root, true)
    drawPoints()
    drawRange()
}
function drawPoints(){
    for (const point of inputArr) {
        point.draw()
    }
}
function drawRange(){
    ctx.strokeStyle = "red"
    ctx.beginPath()
    ctx.moveTo(range.x1, range.y1)
    ctx.lineTo(range.x2, range.y1)
    ctx.lineTo(range.x2, range.y2)
    ctx.lineTo(range.x1, range.y2)
    ctx.lineTo(range.x1, range.y1)
    ctx.stroke()
}
function resetTree(){
    treeIsDrawable = false
    X.length = 0
    Y.length = 0
    inputArr.length = 0
}
function resetInputColorAndType(){
    for (const point of inputArr) {
        point.color = "white"
        point.output = "notTouched"
    }
}

