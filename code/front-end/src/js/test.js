// 标注页面测试用，可忽略

var isDrawing = false;
$(function(){
    $("button").on("click", function() {
        isDrawing = true;
    })
    init()
})

function init() {
    const canvas = new fabric.Canvas('goMark') // 这里传入的是canvas的id
    // let isDrawing = false
    let startx, starty
    let currentItem
    // 创建一个长方形
    const rect = new fabric.Rect({
        top: 30, // 距离容器顶部 30px
        left: 30, // 距离容器左侧 30px
        width: 100, // 宽 100px
        height: 60, // 高 60px
        fill: '', // 填充 红色
        stroke: '#FD9D91',
        strokeUniform: true,
        strokeWidth: 2,
    })

    const rect1 = new fabric.Rect({
        top: 60, // 距离容器顶部 30px
        left: 60, // 距离容器左侧 30px
        width: 100, // 宽 100px
        height: 60, // 高 60px
        fill: '', // 填充 红色
        stroke: '#FD9D91',
        strokeUniform: true,
        strokeWidth: 2,
        originX: "center",
        originY: "top",
    })
    const text = new fabric.Textbox("helloworld",{
        top: 60, // 距离容器顶部 30px
        left: 60, // 距离容器左侧 30px
        fontSize: 10,
        fill: '#f6416c',
        originX: "right",
        originY: "bottom",
    })

    const group = new fabric.Group([rect1, text], {
        top: 60, 
        left: 60, 
    })
    var image = 'https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27d1b4e5f8824198b6d51a2b1c2d0d75~tplv-k3u1fbpfcp-zoom-crop-mark:400:400:400:400.awebp'
    console.log(image);
    fabric.Image.fromURL( 
        'http://127.0.0.1:8080/ipfs/QmPCHhXvrw4aHZHMihU9DZqZG8uvEDA11tnH9z2gq3djTF', 
        (img) => { 
            // 设置背景图
            console.log(img); 
            canvas.setBackgroundImage( 
                img, 
                canvas.renderAll.bind(canvas), 
                { 
                    scaleX: canvas.width / img.width, // 计算出图片要拉伸的宽度 
                    scaleY: canvas.height / img.height // 计算出图片要拉伸的高度 
                } 
            ) 
        })

    
    // rect.on('selected', options => {
    //     console.log('选中矩形啦', options)
    //     console.log($(this))
    // })

    rect.on('selected', (options) => {
        console.log('选中矩形啦', options.target)
    })

    group.on('selected', (options) => {
        console.log('选中矩形啦', options.target.item(1))

    })

    canvas.on('mouse:down', options => {
        if(isDrawing) {
            console.log(`x轴坐标: ${options.e.clientX};    y轴坐标: ${options.e.clientY}`)
            // isDrawing = true;
            // currentItem = setRect(`${options.e.clientX}`, `${options.e.clientY}`, 0, 0);
            // console.log(currentItem);
            // canvas.add(currentItem);
            startx = `${options.e.clientX}`;
            starty = `${options.e.clientY}`;
        }
    })

    canvas.on('mouse:move', options => {
        // console.log(`move x轴坐标: ${options.e.clientX};    move y轴坐标: ${options.e.clientY}`)
        if(isDrawing) {
            if(currentItem) {
                canvas.remove(currentItem);
            }
            let width = `${options.e.clientX}` - startx;
            let height = `${options.e.clientY}` - starty;
            currentItem = setRect(startx, starty, width, height);
            canvas.add(currentItem);
            // if(currentItem) {
            //     currentItem.width = `${options.e.clientX}` - startx;
            //     currentItem.height = `${options.e.clientY}` - starty;   
            //     // canvas.add(currentItem);
            //     console.log(currentItem);
            // }
        }
    })

    canvas.on('mouse:up', options => {
        isDrawing = false;
    })

    console.log("left: ",group.left,group.top, group.item(0).width, group.item(0).height, group.item(1).text)
  
    // 在canvas画布中加入矩形（rect）。add是“添加”的意思
    canvas.add(rect,rect1,text,group)
    console.log("left: ",rect1.width,group.item(0).top, group.top, text.top, group.item(1).top)
    // console.log('canvas stringify ', JSON.stringify(canvas))
    // console.log('canvas toJSON', canvas.toJSON())
}

function setRect(left, top, width, hright) {
    let rect = new fabric.Rect({
        left: left,
        top: top,
        width: width,
        height: hright,
        fill:'',     //不填充颜色，
        stroke: '#FD9D91',
        strokeUniform: true,
        strokeWidth: 2,
    })

    // rect.on('selected', options => {
    //     console.log('选中矩形啦', options);
    // })

    return rect;
}