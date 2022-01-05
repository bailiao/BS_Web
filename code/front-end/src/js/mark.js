
require("../css/bootstrap.css");
require("../css/sideNav.css");
require("../js/jquery-3.6.0.js");
require("../js/bootstrap.js");

const server = "http://127.0.0.1:8000";
const ipfs_img = "http://127.0.0.1:8080/ipfs/"
var isDrawing = false;
var canvas_offset_left;
var canvas_offset_top;

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
                let id = "goMark"+index;
                $(".canvas_box").append("<canvas width='900' height='500' id="+id+" style='border:1px solid #ccc'></canvas>")
                $(".canvas_box").trigger("create");
            }

            for(var index = 0; index < len; index++) {
                let id = "goMark"+index;
                init(id, ipfs_img + res['Image'][index]['Path']);
                $("#"+id).hide();
            }

            // 计算相对位置
            canvas_offset_left = $("canvas").offset().left;
            canvas_offset_top = $("canvas").offset().top;
        }
    })

    
    /* 导入图片 */
    $(".nav-img").on("click", '.display-img', function(){
        // alert("sss")
        // $(".canvas img").show();
        index = $(this).prop("name");
        console.log(index);
        id="goMark"+index;
        $("#"+id).show();
        // init(ipfs_img+img_path)
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

    
    
    

    $("#ToMark").on("click", function() {
        isDrawing = false;
    })

    // $("#ToMark").on("click", function() {
    //     isDrawing = true;
    // })


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

function init(id, image_path) {
    const canvas = new fabric.Canvas(id) // 这里传入的是canvas的id
    // let isDrawing = false
    let isDrag = false
    let startx, starty, absolute_x, absolute_y;
    let currentItem;
    let DrawItem;
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
    })
    // canvas.setBackgroundImage(
    //     image_path,
    //     canvas.renderAll.bind(canvas),
    //     // {
    //     //     width: canvas.width,
    //     //     height: canvas.height,
    //     //     scaleX: canvas.width / 500,
    //     //     scaleY: canvas.height / 500,
    //     // }
    // )
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

    $("#ToMark").on("click", function() {
        isDrawing = true;
        console.log(isDrawing);
    })

    rect.on('selected', options => {
        console.log('选中矩形啦', options);
    })

    rect1.on('selected', options => {
        console.log('选中矩形啦', options);
    })

    canvas.on('mouse:down', options => {
        console.log("mouse: "+isDrawing);
        if(isDrawing) {
            console.log("mouse: "+isDrawing);
                console.log(`x轴坐标: ${options.e.clientX};    y轴坐标: ${options.e.clientY}`)
                isDrag = true;
                // currentItem = setRect(`${options.e.clientX}`, `${options.e.clientY}`, 0, 0);
                // console.log(currentItem);
                // canvas.add(currentItem);
                startx = `${options.e.clientX}` - canvas_offset_left;
                starty = `${options.e.clientY}` - canvas_offset_top;
                absolute_x = `${options.e.clientX}`;
                absolute_y = `${options.e.clientY}`;
            // }
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
            // console.log(DrawItem);
        }
    })

    canvas.on('mouse:up', options => {
        // isDrawing = false;
        isDrag = false;
        isDrawing = false;
        DrawItem = null;
        currentItem = null;
    })
  
    // 在canvas画布中加入矩形（rect）。add是“添加”的意思
    canvas.add(rect,rect1)

    console.log('canvas stringify ', JSON.stringify(canvas))
    console.log('canvas toJSON', canvas.toJSON())
    console.log('canvas toObject', canvas.toObject())
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
        console.log('选中矩形啦', options);
        // isDrag = false;
    })

    return rect;
}