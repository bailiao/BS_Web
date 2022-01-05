
require("../js/jquery-3.6.0.js");
require("../js/pinterest_grid.js");
require("../js/bootstrap.js");
require("../css/bootstrap.css");
require("../css/myCss.css");

const server = "http://127.0.0.1:8000";
const ipfs_img = "http://127.0.0.1:8080/ipfs/"

$(function() {
    var publish_taskList, obtain_taskList;
    let data = {};
    data['Email'] = getCookie("UID");
    $.ajax({
        type:'post',
        url:`${server}/getMyTask/`,
        data:JSON.stringify(data),
        dataType:'json',
        success: function(res) {
            console.log(res)
            publish_taskList = res['publish'];
            obtain_taskList = res['obtain'];

            var len = publish_taskList.length;
            console.log(publish_taskList);
            for(var index = 0; index < len; index++) {
                var img_path = publish_taskList[index]['Cover'];
                let template = " \
                    <div class='col-sm-6 col-md-4' id="+publish_taskList[index]['TID']+" > \
                        <div class='thumbnail' >\
                        <img src="+ipfs_img+img_path+" /> \
                            <div class='caption'> \
                                <h3>"+publish_taskList[index]['Name']+"</h3> \
                                <p>"+publish_taskList[index]['Description']+"</p> \
                                <p> CreatedTime: "+publish_taskList[index]['Time']+"</p> \
                                <p><a class='btn btn-primary btn-out' role='button'>导出</a> <a class='btn btn-default btn-cancel' role='button'>撤销</a></p> \
                            </div> \
                        </div> \
                    </div> "
                // let template = " \
                // <div class='col-sm-6 col-md-4' > \
                //     <div class='thumbnail' >\
                //     <img src="+ipfs_img+Task['Ipfs_hash']+" /> \
                //         <div class='caption'> \
                //             <h3> Name </h3> \
                //             <p> abaaba </p> \
                //             <p> Sate: </p> \
                //             <p> CreatedTime: </p> \
                //         </div> \
                //     </div> \
                // </div> "
                let node = $(template);
                $("#publish_task").append(node);
                $("#publish_task").trigger("create");

            }
            console.log(obtain_taskList);
            len = obtain_taskList.length;
            for(var index = 0; index < len; index++) {
                var img_path = obtain_taskList[index]['Cover'];
                let template = " \
                    <div class='col-sm-6 col-md-4' id="+index+"_"+obtain_taskList[index]['TID']+" > \
                        <div class='thumbnail' >\
                        <img src="+ipfs_img+img_path+" /> \
                            <div class='caption'> \
                                <h3>"+obtain_taskList[index]['Name']+"</h3> \
                                <p> Publisher: "+obtain_taskList[index]['Publisher']+"</p> \
                                <p>"+obtain_taskList[index]['Description']+"</p> \
                                <p> Sate: "+obtain_taskList[index]['State']+"</p> \
                                <p> CreatedTime: "+obtain_taskList[index]['Time']+"</p> \
                                <p><button class='btn btn-primary btn-mark'>标注</button> <button class='btn btn-default btn-dicard'>放弃</button></p> \
                            </div> \
                        </div> \
                    </div> "
                let node = $(template);
                $("#obtain_task").append(node);
                $("#obtain_task").trigger("create");

            }
        }
    })
    

    /* 进入图片标注（传给TID） */
    $("#obtain_task").on('click', '.btn-mark', function(e){
        alert("sss")
        var id = $(e.currentTarget).closest(".col-sm-6").prop("id");
        var str = id.split("_")
        console.log(id);
        var index = str[0]
        var tid = str[1];
        $(location).prop('href', './mark.html?TID='+tid+"&Publisher="+obtain_taskList[index]['Publisher']+"&Time="+obtain_taskList[index]['Time']);
    })
    /* 进入图片标注 */

    /* 丢弃或撤销任务 */
    $("#publish_task").on('click', '.btn-cancel', function(e){
        var id = $(e.currentTarget).closest(".col-sm-6").prop("id");
        let data={};
        data['TID'] = id;
        $.ajax({
            type:'post',
            url:`${server}/cancelTask/`,
            data: JSON.stringify(data),
            success: function(res){
                if(res === "撤销成功") {
                    alert("撤销成功")
                }else {
                    alert("撤销失败")
                }
            }
        })
    })

    $("#obtain_task").on('click', '.btn-dicard', function(e){
        var id = $(e.currentTarget).closest(".col-sm-6").prop("id");
        console.log(id);
        $.ajax({
            type:'post',
            url:`${server}/discardTask/`,
            data: JSON.stringify(data),
            success: function(res){
                if(res === "丢弃成功") {
                    alert("丢弃成功")
                }else {
                    alert("丢弃失败")
                }
            }
        })
    })

    /* 丢弃或撤销任务 */

    /* 导出任务 */

    /* 导出任务 */

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

//删除登录用户的cookie
function clearCookie(name) { 

    setCookie(name, "", -1); 

} 