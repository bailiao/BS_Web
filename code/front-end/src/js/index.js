
// const ipfsAPI = require('ipfs-api');
// const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
// import {Buffer} from '../../node_modules/buffer/index.js';
// import $ from 'jquery';  //  引入 jQuery
require("../js/jquery-3.6.0.js");
require("../js/bootstrap.js");
require("../css/bootstrap.css");
require("../css/myCss.css");
// import '../js/bootstrap.js';  //  引入 Bootstrap
// import '../css/bootstrap.css';  //  引入 Bootstrap 的 css
// import '../css/myCss.css'
import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client'
const ipfs = create({host: 'localhost', port: '5001', protocol: 'http'});
// var ipfs = window.IpfsApi('localhost', '5001', {protocol: 'http'})
const server = "http://127.0.0.1:8000";

$(function(){
    /* 模态框显示 */
    $("#log_in_out").on("click", function() {
        var IsLogin = checkIdentify();
        console.log(IsLogin);
        if(IsLogin) {
            $(this).text("Logout");
        }
        else {
            var login_modal = $("#login_modal")
            login_modal.modal();
        }
    })

    $("#upload_task").on("click", function(){
        $("#upload_modal").modal();
    })

    $("#register_link").on("click", function() {
        $("#login_modal").modal('hide');
        $("#register_modal").modal('show');
    })

    $("#forget_passwd").on("click", function() {
        $("#login_modal").modal('hide');
        $("#findpasswd_modal").modal('show');
    })

    $("#register_modal").find(".link").on("click", function(){
        $("#register_modal").modal('hide');
        $("#login_modal").modal('show');
    })

    $("#findpasswd_modal").find(".link").on("click", function(){
        $("#findpasswd_modal").modal('hide');
        $("#login_modal").modal('show');
    })
    /* 模态框显示 */

    /* 获取表单数据并提交至后端 */
    $("#login_modal").find(".modal-footer").find("button").on("click", function(){
        let data = {};
        let value = $('#login_modal').find("form").serializeArray();
        $.each(value, function (index, item) {
            console.log(item.name);
            data[item.name] = item.value;
        });
        // alert("点击")
        console.log(JSON.stringify(data));
        $.post(`${server}/login/`, JSON.stringify(data), function(res) {
            $("#login_modal").modal('hide');
            if(res) {
                setCookie("UID", data['Email'], 1);
                alert("登录成功");
            }else {
                alert("登录失败！")
            }

            
        });
    })

    $("#register_modal").find(".modal-footer").find("button").on("click", function(){
        let data = {};
        let value = $('#register_modal').find("form").serializeArray();
        $.each(value, function (index, item) {
            console.log(item.name);
            data[item.name] = item.value;
        });
        console.log(JSON.stringify(data));
        $.post(`${server}/register/`, JSON.stringify(data), function(data) {
            $("#login_modal").modal('hide');
            if(data) {
                alert("注册成功");
            }else {
                alert("注册失败！")
            }

            
        });
    })

    $("#findpasswd_modal").find(".modal-footer").find("button").on("click", function(){
        let data = {};
        let value = $('#findpasswd_modal').find("form").serializeArray();
        $.each(value, function (index, item) {
            console.log(item.name);
            data[item.name] = item.value;
        });
        console.log(JSON.stringify(data));
        // $.post(`${server}/runoob/`, JSON.stringify(data), function(data) {
        //     $("#login_modal").modal('hide');
        //     if(data) {
        //         alert("找回密码成功");
        //     }else {
        //         alert("找回密码失败！")
        //     }

            
        // });
    })
    /* 获取表单数据并提交至后端 */
    var modalBox = $("#upload_modal input:checkbox");
    var type = "image";
    modalBox.on("click", function() {
        $(this).prop("checked", true);
        $(this).siblings().prop("checked", false);
        if($(this).prop("name") == "IsImage") {
            // alert("image");
            type = "image";
            $(".imageinput").show();
            $(".videoinput").hide();
        }else if($(this).prop("name") == "IsVideo") {
            // alert("video");
            type = "video"
            $(".videoinput").show();
            $(".imageinput").hide();
        }else{
            console.log($(this).prop);
        }
    })

    /* 获取图片上传到IPFS */
    $("#upload_modal").find(".modal-footer").find("button").on("click", function(){
        var reader;
        // alert("sss");
        let data = {};
        /* 无法获取文件路径，需要额外获取 */
        let value = $('#upload_modal').find("form").serializeArray();
        $.each(value, function (index, item) {
            console.log(item.name);
            data[item.name] = item.value;
        });
        console.log(JSON.stringify(data));
        if("image" == type) {
            var len = $("#file_select").get(0).files.length;
            console.log(len);
            var path = new Array();
            for(var i = 0; i < len; i++) {
                const file = $("#file_select").get(0).files[i];
                let reader = new FileReader();
                reader.readAsArrayBuffer(file);
                // console.log(reader);
                reader.onload = function() {
                    console.log(reader.result);
                    let buffer = Buffer.from(reader.result);
                    ipfs.add(buffer).then(res=>{
                        console.log("res: ", res.path);
                        path.push(res.path);
                    })
                }
                
            }
            data['Email'] = getCookie("UID");
            data['Path'] = path;
            console.log(data);
            // $.post(`${server}/uploadTask/`, JSON.stringify(data), function(data) {
            //     $("#login_modal").modal('hide');
            //     if(data) {
            //         alert("上传成功");
            //     }else {
            //         alert("上传失败！")
            //     }

                
            // });
        }else if("video" == type) {
            data['Email'] = getCookie("UID");
            data['Path'] = path;
            console.log(data);
            
            // $.post(`${server}/uploadTask/`, JSON.stringify(data), function(data) {
            //     $("#login_modal").modal('hide');
            //     if(data) {
            //         alert("上传成功");
            //     }else {
            //         alert("上传失败！")
            //     }

                
            // });
        }
    })

    
    // let saveImageOnIpfs = (reader) => {
    //     return new Promise(function(resolve, reject) {
    //         const buffer = Buffer.from(reader.result);
    //         ipfs.add(buffer).then((response) => {
    //             console.log(response)
    //             resolve(response[0].hash);
    //         }).catch((err) => {
    //             console.error(err)
    //             reject(err);
    //         })
    //     })
    // }   
  
    /* 获取图片上传到IPFS */

 });

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate + expiredays);
    document.cookie = c_name + "=" + value + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString()); 
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

//检查是否已登录和登录者的身份
function checkIdentify() {
    var UID = getCookie("UID");
    if(UID == null || UID == "") {    //如果用户还未登录，那么返回登录界面
        return false;
    } else {
        return true;
    }
}