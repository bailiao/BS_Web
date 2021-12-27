from django.db.models.fields.related import create_many_to_many_intermediary_model
from django.shortcuts import render
from django.http import HttpResponse
from django.core.mail import send_mail
from threading import Thread     # 导入线程模块
from BS_Web import settings
import json
import uuid
import random
import datetime
import pytz


from . import models
# Create your views here.
def register(request):
    data = json.loads(request.body)
    checkemail = list(models.User.objects.values('Email').filter(Email = data['Email']))
    if checkemail:
        return HttpResponse("邮箱已被注册")
    else:
        data['UID'] = uuid.uuid4()
        models.User.objects.create(**data)
        return HttpResponse("注册成功！")

def login(request):
    data = json.loads(request.body)
    logininguser = list(models.User.objects.values('Password').filter(Email=data['Email']))
    if logininguser:
        if logininguser[0]['Password'] == data['Password']:
            return HttpResponse("密码正确")
        else:
            return HttpResponse("密码错误")
    else:
        return HttpResponse("未注册")
def getusername(request):
    data = json.loads(request.body)
    loginuser = list(models.User.objects.values('Name').filter(Email = data['Email']))
    if loginuser:
        return HttpResponse(loginuser[0]['Name'])
    else:
        return HttpResponse("没这个人")
    
def getinfo(request):
    data = json.loads(request.body)
    loginuser = list(models.User.objects.values('Name','CreatedTime').filter(Email = data['Email']))
    user={}
    if loginuser:
        user['account'] = loginuser[0]['Name']
        user['time'] = loginuser[0]['CreatedTime'].strftime('%Y-%m-%d')
        return HttpResponse(json.dumps(user))
    else:
        return HttpResponse("没这个人")

def modifyPassword(request):
    data = json.loads(request.body)
    user = list(models.User.objects.values('Password').filter(Email=data['Email']))
    if user:
        if user[0]['Password'] == data['Password']:
            models.User.objects.filter(Email=data['Email']).update(Password=data['Newpassword'])
            return HttpResponse("修改成功")
        else:
            return HttpResponse("密码错误")
    else:
        return HttpResponse("该邮箱未注册")

#随机生成验证码
def random_str(randomlength=6):
    random.random()
    str = ''
    chars = 'abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    length = len(chars) - 1
    for i in range(randomlength):
        str += chars[random.randint(0, length)]
    return str

#发送邮件找回密码 
def findPassword(request):
    data = json.loads(request.body)
    Email = data['Email']
    user = models.User.objects.filter(Email=data['Email']).first()
    if user:
        email_title = "找回密码"
        code = random_str()             #随机生成的验证码
        IdentifyingCode = models.IdentifyingCode.objects.create(Code=code)
        IdentifyingCode.User.add(user)
        email_body = "验证码为: {0}".format(code)
        t1 = Thread( target = send_mail, args = (email_title, email_body, settings.EMAIL_HOST_USER,[Email]) ) 
        t1.start()
        return HttpResponse("验证码已发送，请查收邮件")
    else:
        return HttpResponse("邮箱未注册")


def Verifycode(request):
    data = json.loads(request.body)
    Email = data['Email']
    Newpassword =data['Newpassword']
    user = models.User.objects.filter(Email=data['Email']).first()
    if user:
        user_code = list(models.IdentifyingCode.objects.filter(User=user))
        if user_code:
            now_time = datetime.datetime.now()
            code = data['Checksum']                     #获取传递过来的验证码
            msg = ""
            for item in user_code:
                print(now_time)
                print(item.Time)
                diff = (now_time-item.Time).seconds
                if 0 <= diff and diff < 1800 :
                    if code == item.Code:
                        user.Password = Newpassword
                        user.save()
                        msg = "设置成功"
                        item.delete()
                        print("设置成功")
                else:
                    item.delete()
            if msg == "":
                msg = "验证码错误"
            elif msg == "设置成功":
                user_code = list(models.IdentifyingCode.objects.filter(User=user))
                for item in user_code:
                    item.delete()
            
            return HttpResponse(msg)   
        else:
            return HttpResponse("邮箱无验证码")
    else:
        return HttpResponse("邮箱未注册")


# def addFavor(request):
#     data = json.loads(request.body)
#     user = models.User.objects.filter(Email=data['Email']).first()
#     info = data['Description']
#     project = dashboard_models.Project.objects.filter(RepositoryURL=data['Repo']).first()
#     check = dashboard_models.Favor.objects.filter(User=user,Project=project).first()
#     if check:
#         return HttpResponse("你已收藏")
#     favor = dashboard_models.Favor.objects.create(Info=info)
#     favor.User.add(user)
#     favor.Project.add(project)
#     return HttpResponse("收藏成功")

# def checkFavor(request):
#     data = json.loads(request.body)
#     user = models.User.objects.filter(Email=data['Email']).first()
#     project = dashboard_models.Project.objects.filter(RepositoryURL=data['Repo']).first()
#     favor = dashboard_models.Favor.objects.filter(User=user,Project=project).first()
#     if favor:
#         return HttpResponse("已收藏")
#     else:
#         return HttpResponse("未收藏")

# def returnFavor(request):
#     data = json.loads(request.body)
#     user = models.User.objects.filter(Email=data['Email']).first()
#     project_list = list(dashboard_models.Favor.objects.values('Project','Info').filter(User=user))
#     list1=[]
#     for item in project_list:
#         repo={}
#         url = dashboard_models.Project.objects.values().filter(PID=item['Project']).first()
#         repo['Url'] = url['RepositoryURL']
#         repo['Name'] = url['Name']
#         repo['Description'] = item['Info']
#         list1.append(repo)
#     return HttpResponse(json.dumps(list1))

# def deleteFavor(request):
#     data = json.loads(request.body)
#     user = models.User.objects.filter(Email=data['Email']).first()
#     project = dashboard_models.Project.objects.filter(RepositoryURL=data['Repo']).first()
#     favor = dashboard_models.Favor.objects.filter(User=user,Project=project).first()
#     if favor:
#         favor.delete()
#         return HttpResponse("删除成功")
#     else:
#         return HttpResponse("删除失败")



# def test(request):
#     url = "https://github.com/jiyujia926/NFTauction/"
#     Email= "3190103367@zju.edu.cn"
#     user = models.User.objects.filter(Email=Email).first()
#     project = dashboard_models.Project.objects.filter(RepositoryURL=url).first()
    