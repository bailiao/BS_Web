
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
        no_columns: 4,
        padding_x: 10,
        padding_y: 10,
        margin_bottom: 50,
        single_column_breakpoint: 700
    }); 
    taskList = [
        {
            Ipfs_hash: "QmPCHhXvrw4aHZHMihU9DZqZG8uvEDA11tnH9z2gq3djTF"
        },
        {
            Ipfs_hash: "QmPQ1zJMu3qUmdqiC3XrwMCE68idt2J1twXKPUQebWWn44"
        },
        {
            Ipfs_hash: "QmWqxyoRXUNto16U8AgdLjTcFYJqTowKvYairt7zB8GmhR"
        },
        {
            Ipfs_hash: "QmYySiKB92DtnDMG2Hvb7VAsfDsRuBJ8psuLStMktBVEVj"
        },
        {
            Ipfs_hash: "QmXsw7qoSggKgYfE4Z9vJvnN59opxgPNvayPvbKK21SDmH"
        },
    ]
    console.log(taskList)
    // function buildTask(taskList) {
    // alert("sss")
    var len = taskList.length;
    console.log(len);
    for(var index = 0; index < len; index++) {
        var img_path = taskList[index]['Ipfs_hash'];
        let template = " \
            <div class='col-sm-6 col-md-4' > \
                <div class='thumbnail' >\
                <img src="+ipfs_img+Task['Ipfs_hash']+" /> \
                    <div class='caption'> \
                        <h3>"+Task['Name']+"</h3> \
                        <p>"+Task['Description']+"</p> \
                        <p> Sate: "+Task['State']+"</p> \
                        <p> CreatedTime: "+Task['CreatedTime']+"</p> \
                    </div> \
                </div> \
            </div> "
        let template = " \
        <div class='col-sm-6 col-md-4' > \
            <div class='thumbnail' >\
            <img src="+ipfs_img+Task['Ipfs_hash']+" /> \
                <div class='caption'> \
                    <h3> Name </h3> \
                    <p> abaaba </p> \
                    <p> Sate: </p> \
                    <p> CreatedTime: </p> \
                </div> \
            </div> \
        </div> "
        let node = $(template);
        $("#publish_task").append(node);
        $("#publish_task").trigger("create");

    }
    // }

});  

// $(window).load(function(){
//     alert("sss")
//     buildTask(taskList);
// });


function buildTask(taskList) {
    var index = 0;
    for(var Task in taskList) {
        let node = $("<div>");
        // let template = " \
        //     <article class='white-panel' id="+item['TID']+"> \
        //         <img src="+ipfs_img+Task['Ipfs_hash']+" /> \
        //         <p> Name: "+Task['Description']+"</p> \
        //         <p> Publisher: "+Task['User']+"</p> \
        //         <p> Description: "+Task['Description']+"</p> \
        //     </article>"
        // node.append(template);
        let template = " \
            <article class='white-panel' id="+ index++ +"> \
                <img src="+ipfs_img+Task['Ipfs_hash']+" /> \
                <p> Name: "+"Name"+"</p> \
                <p> Publisher: "+"Publisher"+"</p> \
                <p> Description: "+"Description"+"</p> \
            </article>"
        node.append(template);
        node.append("</div>");
    }
    $("#gallery-wrapper").append(node);
}
