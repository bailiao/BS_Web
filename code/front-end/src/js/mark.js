// $(function() {
//     $(".right-select-box");
//     $(".addpic").removeAttr("disabled"), $("#imgform").on("submit",function(t) {
//         t.preventDefault();
//         imageLabel({
//             img: $("[name=src]").val(),
//             editPop: !0,    
//             close: function(t) {
//                 return t.length && alert(JSON.stringify(t)), !0
//             },
//             clickArea: function() {},
//             edit: function(t) {},
//             startArea: function() {},
//             confirm: function(t) {
//                 return t.length && alert(JSON.stringify(t)), !0
//             }
//         })
//         // imageLabel({
//         //     img: '../images/20.jpg',
//         //     editPop: !0,
//         //     close: function(t) {
//         //         return t.length && alert(JSON.stringify(t)), !0
//         //     },
//         //     clickArea: function() {},
//         //     edit: function(t) {},
//         //     startArea: function() {},
//         //     confirm: function(t) {
//         //         return t.length && alert(JSON.stringify(t)), !0
//         //     }
//         // })
//     })
// })
require("../css/bootstrap.css");
require("../css/sideNav.css");
require("../js/jquery-3.6.0.js");
require("../js/bootstrap.js");

const server = "http://127.0.0.1:8000";
const ipfs_img = "http://127.0.0.1:8080/ipfs/"

$(function() {
    $(".canvas img").hide();
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
                $(".nav-img").append("<li><a class='display-img' href='#' id="+res['Image'][index]['Path']+">"+res['Image'][index]['Name']+"</a></li>");
            }

        }
    })

    $(".nav-img").on("click", '.display-img', function(){
        // alert("sss")
        $(".canvas img").show();
        img_path = $(this).prop("id");
        console.log(img_path);
        $(".canvas img").prop("src", ipfs_img+img_path);
    })

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
    
    /* 导入图片 */
    $(".panel-body > .nav > li > a").on("click", function(e) {
        alert(e.currentTarget.textContent);
    });




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