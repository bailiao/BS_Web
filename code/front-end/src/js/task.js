
require("../js/jquery-3.6.0.js");
require("../js/pinterest_grid.js");
require("../js/bootstrap.js");
require("../css/bootstrap.css");
require("../css/default.css");
require("../css/normalize.css");
require("../css/myCss.css");

const server = "http://127.0.0.1:8000";
const ipfs_img = "http://127.0.0.1:8080/ipfs/"

$(function() {
    // 瀑布流参数初始化
    $("#gallery-wrapper").pinterest_grid({
        no_columns: 3,
        padding_x: 10,
        padding_y: 10,
        margin_bottom: 50,
        single_column_breakpoint: 700
    });
    var taskList;
    $.ajax({
        type:'post',
        url:`${server}/getAllTask/`,
        dataType:'json',
        success:function(res) {
            console.log(res)
            taskList = res;
            /* 页面渲染 */
            console.log(typeof(taskList))
            var len = res.length;
            console.log(len);
            for(var index = 0; index < len; index++) {
                console.log(taskList[index]['Cover']);
                var img_path = taskList[index]['Cover'];
                let template = " \
                    <article class='white-panel' id="+index+"> \
                        <img src="+ipfs_img+img_path+" /> \
                        <p> Name: "+taskList[index]['Name']+"</p> \
                        <p> Publisher: "+taskList[index]['Publisher']+"</p> \
                        <p> Description: "+taskList[index]['Description']+"</p> \
                        <button type='button' class='btn btn-primary'>领取</button> \
                    </article>"
                let node = $(template);
                $("#gallery-wrapper").append(node);
                $("#gallery-wrapper").trigger("create");

                
            }
        }
        /* 页面渲染 */
    });

    /* 领取任务 */
    $("#gallery-wrapper").on('click', '.btn-primary', function(e) {
        var index = $(e.currentTarget).parent().prop("id");
        console.log(index);
        let data = {};
        data['Obtainer'] = getCookie("UID");
        data['Task'] = taskList[index]['TID'];
        data['Publisher'] = taskList[index]['Publisher'];
        console.log(data);
        $.post(`${server}/obtainTask/`, JSON.stringify(data), function(res) {
            if(res === "领取成功") {
                $(e.currentTarget).parent().hide()
                alert("领取成功");
            }else {
                alert("领取失败");
            }
        });
    })
    /* 领取任务 */

    /* 窗口切换 */
        $(".navbar-brand").on("click", function(){
            $(location).prop('href', './index.html');
        })

        $("#log_in_out").on("click", function(){
            clearCookie("UID");
            $(location).prop('href', './index.html');
        })

        $("#To_self").on("click", function(){
            $(location).prop('href', './self.html');
        })
    /* 窗口切换 */

    

});  


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

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate + expiredays);
    document.cookie = c_name + "=" + value + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString()); 
}

//删除登录用户的cookie
function clearCookie(name) { 

    setCookie(name, "", -1); 

} 
