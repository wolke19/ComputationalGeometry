let inputArr = []
let outputArr = []
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


class Node {
    constructor() {
        this.value = null
        this.leftChild = null
        this.rightChild = null
        this.point = null
        this.isVertical = null
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

            node.leftChild = new Node()
            node.rightChild = new Node()

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
        if (x < range.x2 && x > range.x1 && y < range.y2 && y > range.y1) outputArr.push(inputArr[node.point])
        if (l < coord)                  this.rangeSearch(node.leftChild)
        if (r > coord)                  this.rangeSearch(node.rightChild)
    }
}

function rangeSearch(){
    outputArr.length = 0
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

function mouseClickRangeSearch(){
    inputArr.push(new Point(Math.floor(mouse.x), Math.floor(mouse.y)))
    // PREP FOR TREE CONSTRUCTION
    X.length = 0
    Y.length = 0
    for (const point of inputArr) {
        X.push(point)
        Y.push(point)
    }
    X.sort((a, b) => {return a.x - b.x}) // sort ascending
    Y.sort((a, b) => {return a.y - b.y})

    let root = new Node(null)
    tree = new KDTree(root)
    root.isVertical = false
    tree.constructBalanced2DTree(0, inputArr.length - 1, tree.root, false)
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

class Point{
    constructor(x, y) {
        this.x = x
        this.y = y
        this.id = inputArr.length
    }
    draw(color){
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = "green"
        ctx.font = "16px Arial"
        ctx.fillText("" + this.id, this.x, this.y)
    }
}
function handleRangeSearch(){
    drawPoints()
    drawRange()
}
function drawPoints(){
    for (const point of inputArr) {
        point.draw("white")
    }
    for (const point of outputArr) {
        point.draw("red")
    }
}
function resetTree(){
    X.length = 0
    Y.length = 0
    inputArr.length = 0
    outputArr.length = 0
}

