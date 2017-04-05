$(function(){
    initUnreadMsg('myMsgUnread','unreadSum');
});
function initUnreadMsg(msgId,msgNum){
    $.ajax({
        type: "POST",
        url: path+"/message/listUnreadMsg.do",
        dataType: "json",
        error: function() {
            tipDialog("提交失败，连接错误。请刷新页面重试。");
        },success: function(re){
            var msg = "";
            var datas = re.data;
            if (datas.length > 0) {
                for ( var i = 0; i < datas.length; i++) {
                    msg += "<li><a href='javascript:void(0);' title='' onclick=showNews('"+datas[i].id+"','"+datas[i].msg_content+"') ><i class='icon-envelope-alt'></i>"+datas[i].msg_content+"</a></li>";
                }
            }
            msg += "<li><a href='javascript:void(0);' title='全部消息' onclick=clickNavMenu('this.id','"+path+"/message/forwardAllMsgUI.do') ><i class='icon-bell'></i> 全部消息 >></a></li>";
            $("#"+msgId).html(msg);
            $("#"+msgNum).html(re.unreadNum);
        }
    });
}

function showNews(id,msg_content){
    dialog({
        title:'详细消息内容',
        width:320,
        fixed: true,
        content: "<textarea disabled style='width:100%'>"+msg_content+"</textarea>",
        okValue: '确定',
        ok: function () {
            this.title('提交中…');
            $.ajax({
                type: "POST",
                url: path+"/message/doReadMsg.do",
                data:{id:id},
                error: function() {
                    tipDialog("提交失败，连接错误。请刷新页面重试。");
                },success: function(){
                    tipDialog("已阅读");
                    initUnreadMsg('myMsgUnread','unreadSum');
                }
            });
        }
    }).show();
}

jQuery(document).ready(function() {
    $("#realname").html("<b>"+$.cookie('realname')+"</b>");
});

function clickNavMenu(id,pageUrl){
    $("#user-nav li").removeClass("active");
    $("#sidebar ul li").removeClass("active");
    $("#"+id).parent().addClass("active");
    $("#iframepage").attr("src",pageUrl);
}

function exit(){
    confirmCancelDialog("确定退出系统吗？",basePath+"index/exit.do");
}

function changePasswordUI(){
    $("#oldPassword").val("");
    $("#password").val("");
    $("#rePassword").val("");
}

function changePassword(){
    $("#msg").html("");

    if($("#oldPassword").val()==""){$("#msg").html("<span class='label label-important'>原密码不能为空</span>");return false;}
    if($("#password").val()==""){$("#msg").html("<span class='label label-important'>新密码不能为空</span>");return false;}
    if($("#rePassword").val()==""){$("#msg").html("<span class='label label-important'>重复密码不能为空</span>");return false;}
    if($("#password").val()!=$("#rePassword").val()){$("#msg").html("<span class='label label-important'>两次密码不一致</span>");return false;}

    var param = {};
    param.oldPassword = $("#oldPassword").val();
    param.password = $("#password").val();
    param.rePassword = $("#rePassword").val();
    $.ajax({
        type: "POST",
        url: path+"/user/doChangePassword.do",
        data: param,
        dataType: "json",
        error: function() {
            tipDialog("提交失败，连接错误。请刷新页面重试。");
        },success: function(re){
            $("#msg").html("<span class='label label-important'>"+re.msg+"</span>");
            if(re.msg=='修改密码成功'){
                setTimeout(function(){location.href=path+"/index/exit.do";},2000);
            }
        }
    });
}