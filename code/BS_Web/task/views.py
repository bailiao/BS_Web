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
