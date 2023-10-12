addEventListener("click", function (){
    if (mouse.onCanvas){
        switch (dropdownSelected){
            case "ch2d":
                mouseClickCh2d()
                break
            case "intersect":
                mouseClickIntersect()
                break
        }
    }

})

window.addEventListener( 'resize', function(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    wipeCanvas()
})

addEventListener("mousemove", function (event) {
    let rect = canvas.getBoundingClientRect(),
        scaleX = w / rect.width,
        scaleY = h / rect.height;

    mouse.x = (event.x - rect.left) * scaleX
    mouse.y = (event.y - rect.top) * scaleY

    mouse.onCanvas = !(event.x < rect.left
        || event.x > rect.right
        || event.y < rect.top
        || event.y > rect.bottom)
})