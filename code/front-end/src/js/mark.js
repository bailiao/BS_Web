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
$(function() {
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
});