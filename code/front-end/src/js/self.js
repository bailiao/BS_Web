
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
                    <div class='col-sm-6 col-md-4' > \
                        <div class='thumbnail' >\
                        <img src="+ipfs_img+img_path+" /> \
                            <div class='caption'> \
                                <h3>"+publish_taskList[index]['Name']+"</h3> \
                                <p>"+publish_taskList[index]['Description']+"</p> \
                                <p> CreatedTime: "+publish_taskList[index]['CreatedTime']+"</p> \
                                <p><a href='#'' class='btn btn-primary' role='button'>导出</a> <a href='#' class='btn btn-default' role='button'>撤销</a></p> \
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
                    <div class='col-sm-6 col-md-4' > \
                        <div class='thumbnail' >\
                        <img src="+ipfs_img+img_path+" /> \
                            <div class='caption'> \
                                <h3>"+obtain_taskList[index]['Name']+"</h3> \
                                <p> Publisher: "+obtain_taskList[index]['Publisher']+"</p> \
                                <p>"+obtain_taskList[index]['Description']+"</p> \
                                <p> Sate: "+obtain_taskList[index]['State']+"</p> \
                                <p> CreatedTime: "+obtain_taskList[index]['CreatedTime']+"</p> \
                                <p><a href='#'' class='btn btn-primary' role='button'>标注</a> <a href='#' class='btn btn-default' role='button'>放弃</a></p> \
                            </div> \
                        </div> \
                    </div> "
                let node = $(template);
                $("#obtain_task").append(node);
                $("#obtain_task").trigger("create");

            }
        }
    })
    // taskList = [
    //     {
    //         Ipfs_hash: "QmPCHhXvrw4aHZHMihU9DZqZG8uvEDA11tnH9z2gq3djTF"
    //     },
    //     {
    //         Ipfs_hash: "QmPQ1zJMu3qUmdqiC3XrwMCE68idt2J1twXKPUQebWWn44"
    //     },
    //     {
    //         Ipfs_hash: "QmWqxyoRXUNto16U8AgdLjTcFYJqTowKvYairt7zB8GmhR"
    //     },
    //     {
    //         Ipfs_hash: "QmYySiKB92DtnDMG2Hvb7VAsfDsRuBJ8psuLStMktBVEVj"
    //     },
    //     {
    //         Ipfs_hash: "QmXsw7qoSggKgYfE4Z9vJvnN59opxgPNvayPvbKK21SDmH"
    //     },
    // ]
    // function buildTask(taskList) {
    // alert("sss")
    

    /* 进入图片标注（传给TID） */


    /* 进入图片标注 */

    /* 丢弃或撤销任务 */

    /* 丢弃或撤销任务 */

    /* 导出任务 */

    /* 导出任务 */

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