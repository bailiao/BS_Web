
require("../css/bootstrap.css");
require("../css/sideNav.css");
require("../js/jquery-3.6.0.js");
require("../js/bootstrap.js");

const server = "http://127.0.0.1:8000";
const ipfs_img = "http://127.0.0.1:8080/ipfs/"
var isDrawing = false;
var canvas_offset_left;
var canvas_offset_top;
var theCanvas;
var markArray;
var old_index;

$(function() {
    // $(".canvas img").hide();
    var TID = getUrlParam("TID");
    var Publisher = getUrlParam("Publisher");
    var Time = getUrlParam("Time")
    let data = {};
    data['TID'] = TID;
    $.ajax({
        type:'post',
        url:`${server}/getOneTask/`,
        data: JSON.stringify(data),
        dataType:'json',
        success: function(res) {
            console.log(typeof(res));
            console.log(res['Description']);
            console.log(res['Image'].length);
            $(".list-group-item-success").text("Name: "+res['Name']);
            $(".list-group-item-info").text("Publisher: "+Publisher);
            $(".list-group-item-warning").text("Description: "+res['Description']);
            $(".list-group-item-danger").text("Time: "+Time);
            var len = res['Image'].length;
            for(var index = 0; index < len; index++) {
                $(".nav-img").append("<li><a class='display-img' name="+index+" href='#' id="+res['Image'][index]['Path']+">"+res['Image'][index]['Name']+"</a></li>");
                $(".nav-img").trigger("create");
                // let id = "goMark"+index;
                // $(".canvas_box").append("<canvas width='900' height='500' id="+id+" style='border:1px solid #ccc'></canvas>")
                // $(".canvas_box").trigger("create");
            }

            // for(var index = 0; index < len; index++) {
            //     let id = "goMark"+index;
            //     init(id, ipfs_img + res['Image'][index]['Path']);
            //     $("#"+id).hide();
            // }
            markArray = new Array(len);
            theCanvas = init(len);
            
        }
    })

    // 计算相对位置
    canvas_offset_left = $("canvas").offset().left;
    canvas_offset_top = $("canvas").offset().top;

    /* 导入图片 */
    $(".nav-img").on("click", '.display-img', function(){
        // alert("sss")
        // $(".canvas img").show();
        index = $(this).prop("name");
        img_path = $(this).prop("id");
        console.log("index: "+index+" "+old_index);
        // id="goMark"+index;
        // $("#"+id).show();
        if(old_index)
            markArray[old_index] = theCanvas.getObjects();
        console.log(markArray)
        theCanvas.clear();
        setCanvas(ipfs_img+img_path, theCanvas, index);
        // $(".canvas img").prop("src", ipfs_img+img_path);
    })
    /* 导入图片 */

    /* 侧边栏 */
    $(".panel-heading").on("click", function(e) {
        var idLength = e.currentTarget.id.length;
        var index = e.currentTarget.id.substr(idLength - 1, idLength);
        $("#sub" + index).on('hidden.bs.collapse', function() {
            $(e.currentTarget).find("span").removeClass("glyphicon glyphicon-triangle-bottom");
            $(e.currentTarget).find("span").addClass("glyphicon glyphicon-triangle-right");
        })
        $("#sub" + index).on('shown.bs.collapse', function() {
            $(e.currentTarget).find("span").removeClass("glyphicon glyphicon-triangle-right");
            $(e.currentTarget).find("span").addClass("glyphicon glyphicon-triangle-bottom");
        })
    })
    /* 侧边栏 */

    /* 窗口切换 */
    $(".navbar-brand").on("click", function(){
        $(location).prop('href', './index.html');
    })

    $("#log_in_out").on("click", function(){
        clearCookie("UID");
        $(location).prop('href', './index.html');
    })

    $("#To_taskList").on("click", function(){
        $(location).prop('href', './taskList.html');
    })

    $("#To_self").on("click", function(){
        $(location).prop('href', './self.html');
    })
    /* 窗口切换 */
});


//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function getCookie(c_name) {
    if (document.cookie.length>0)//首先查询cookie是否是空的
    {
        var c_start=document.cookie.indexOf(c_name + "=")//检测这个cookie是否存在
        if (c_start!=-1)//如果cookie存在
        { 
            c_start=c_start + c_name.length+1; //获取到cookie的值的开始位置
            var c_end=document.cookie.indexOf(";",c_start);//从c_start开始查找";"的存在
            if (c_end==-1) c_end=document.cookie.length;//如果没找到，说明是最后一项
            return document.cookie.substring(c_start,c_end);
        }
    }
    return ""//不存在就返回空
}

//删除登录用户的cookie
function clearCookie(name) { 

    setCookie(name, "", -1); 

} 

var currentItem;
function init(len) {
    const canvas = new fabric.Canvas('goMark') // 这里传入的是canvas的id
    // let isDrawing = false
    let isDrag = false
    let startx, starty, absolute_x, absolute_y;
    
    let DrawItem;

    // console.log(image_path);
    // fabric.Image.fromURL( 
    //     image_path, 
    //     (img) => { 
    //         // 设置背景图 
    //         canvas.setBackgroundImage( 
    //             img, 
    //             canvas.renderAll.bind(canvas), 
    //             { 
    //                 scaleX: canvas.width / img.width, // 计算出图片要拉伸的宽度 
    //                 scaleY: canvas.height / img.height // 计算出图片要拉伸的高度 
    //             } 
    //         ) 
    //     })

    $("#ToMark").on("click", function() {
        isDrawing = true;
        // console.log(isDrawing);
    })

    // $("#ToMark").on("click", function() {
    //     isDrawing = false;
    // })

    // $("#ToMark").on("click", function() {
    //     isDrawing = true;
    // })

    canvas.on('mouse:down', options => {
        // console.log("mouse: "+isDrawing);
        if(isDrawing) {
            // console.log("mouse: "+isDrawing);
            console.log(`x轴坐标: ${options.e.clientX};    y轴坐标: ${options.e.clientY}`)
            isDrag = true;
            startx = `${options.e.clientX}` - canvas_offset_left;
            starty = `${options.e.clientY}` - canvas_offset_top;
            absolute_x = `${options.e.clientX}`;
            absolute_y = `${options.e.clientY}`;
        }
    })

    canvas.on('mouse:move', options => {
        if(isDrag) {
            if(DrawItem) {
                canvas.remove(DrawItem);
            }
            let width = `${options.e.clientX}` - absolute_x;
            let height = `${options.e.clientY}` - absolute_y;
            DrawItem = setRect(startx, starty, width, height);
            canvas.add(DrawItem);
        }
    })

    canvas.on('mouse:up', options => {
        // isDrawing = false;
        // console.log(currentItem);
        // Array[canvas_index].push(currentItem);
        isDrag = false;
        isDrawing = false;
        DrawItem = null;
        currentItem = null;
        console.log(canvas.getObjects());
    })

    return canvas;
  
    // 在canvas画布中加入矩形（rect）。add是“添加”的意思

    // console.log('canvas stringify ', JSON.stringify(canvas))
    // console.log('canvas toJSON', canvas.toJSON())
    // console.log('canvas toObject', canvas.toObject())
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

    rect.on('selected', options => {
        // console.log('选中矩形啦', options);
        // currentItem = this;
    })

    return rect;
}

function setCanvas(image_path, canvas, index) {
    old_index = index;
    console.log(image_path);
    fabric.Image.fromURL( 
        image_path, 
        (img) => { 
            // 设置背景图 
            canvas.setBackgroundImage( 
                img, 
                canvas.renderAll.bind(canvas), 
                { 
                    scaleX: canvas.width / img.width, // 计算出图片要拉伸的宽度 
                    scaleY: canvas.height / img.height // 计算出图片要拉伸的高度 
                } 
            ) 
        })
    let len = markArray[index].length;
    for(var i = 0; i < len; i++) {
        console.log(markArray[index][i]);
        canvas.add(markArray[index][i]);
    }
}