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
import cv2
import os
import urllib
import ipfsApi

ipfs = ipfsApi.Client('127.0.0.1', 5001)
from . import models

video = "D:/django/BS_Web/Video/"     #需要修改为自己的Video路径
video_img = "D:/django/BS_Web/Image/"     #需要修改为自己的Video路径

def createTask(request):
    data = json.loads(request.body)
    user = models.User.objects.filter(Email=data['Email']).first()
    path = data['Path']
    task = models.Task.objects.create(TID=uuid.uuid4(), Name=data['Name'], State=False, Description=data['Description'])
    task.User.add(user)
    for item in path:
        image = models.Image.objects.create(Ipfs_hash=item)
        image.Task.add(task)

    return HttpResponse("上传成功")

def processVideo(request):
    data = request.FILES.get("rubia.mp4")
    print(type(data))
    key = list(request.FILES.keys())
    # file = data.values()
    # print(data.values())

    # 视频先存下来
    print(os.getcwd())
    # folder_path = os.path.join(os.getcwd(), "../../Video")
    file_path = os.path.join(video, urllib.parse.quote(key[0]))
    print(file_path)
    destination = open(file_path, "wb+")
    for chunk in data.chunks():
        destination.write(chunk)
    destination.close()

    # 使用opencv按一定间隔截取视频帧，并保存为图片

    vc = cv2.VideoCapture(file_path)  # 读取视频文件
    c = 0
    print("------------")
    if vc.isOpened():  # 判断是否正常打开
        print("yes")
        rval, frame = vc.read()
    else:
        rval = False
        print("false")

    timeF = 50000000  # 视频帧计数间隔频率
    list1=[]
    while rval:  # 循环读取视频帧
        rval,frame = vc.read()
        # print(c,timeF,c%timeF)
        if (c % timeF == 0):# 每隔timeF帧进行存储操作
            # print("write...")
            theFile = video_img + key[0]+str(c/timeF) + '.jpg'
            cv2.imwrite(theFile, frame)  # 存储为图像
            res = ipfs.add(theFile)[0]
            print(res)
            list1.append(res)
            # print("success!")
        c = c + 100000
    cv2.waitKey(1)
    vc.release()
    print("==================================")
    return HttpResponse(json.dumps(list1))

def createVideoTask(request):
    data = json.loads(request.body)
    user = models.User.objects.filter(Email=data['Email']).first()
    path = data['Path']
    task = models.Task.objects.create(TID=uuid.uuid4(), Name=data['Name'], State=False, Description=data['Description'])
    task.User.add(user)
    for item in path:
        image = models.Image.objects.create(Ipfs_hash=item)
        image.Task.add(task)

    return HttpResponse("上传成功")

def getAllTask(request):
    list1=[]
    
    taskList = models.Task.objects.all()
    for task in taskList:
        taskItem={}
        taskItem['TID']=task.TID
        taskItem['Name']=task.Name
        taskItem['State']=task.State
        taskItem['Description']=task.Description
        taskItem['CreatedTime']=task.CreatedTime
        user = list(models.User.objects.values('Email').filter(UID=task.User))
        taskItem['Publisher']=user[0]['Email']
        img = list(models.Image.objects.values().filter(Task=task).first())
        taskItem['Cover'] = img[0]['Ipfs_hash']

        list1.append(taskItem)

    return HttpResponse(json.dumps(list1))

def getMyTask(request):
    data = json.loads(request.body)
    user = models.User.objects.filter(Email=data['Email']).first()
    self_task={'publish':[], 'obtain':[]}
    publish_task_list = list(models.Task.values().filter(User=user))
    for item in publish_task_list:
        dict1={}
        dict1['TID'] = item['TID']
        dict1['Name'] = item['Name']
        dict1['State'] = item['State']
        dict1['Description'] = item['Description']
        dict1['CratedTime'] = item['CreatedTime']
        task = models.Task.objects.filter(TID=item['TID']).first()
        img = list(models.Image.objects.values().filter(Task=task).first())
        dict1['Cover'] = img[0]['Ipfs_hash']
        self_task['publish'].append(dict1)

    obtain_task_list = list(models.getTask.objects.values('Task','Publisher','State').filter(Obtainer=user))
    for item in obtain_task_list:
        publisher = models.User.objects.values().filter(UID=item['Publisher']).first()
        task = models.Task.objects.values().filter(TID=item['Task']).first()
        dict2={}
        dict2['TID'] = task['TID']
        dict2['Name'] = task['Name']
        dict2['State'] = item['State']
        dict2['Description'] = task['Description']
        dict2['CratedTime'] = task['CreatedTime']
        img = list(models.Image.objects.values().filter(Task=task).first())
        dict2['Cover'] = img[0]['Ipfs_hash']
        self_task['obtain'].append(dict2)

    return HttpResponse(json.dumps(self_task))



        

