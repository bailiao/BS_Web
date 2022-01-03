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
from . import models


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

def videoToImage(path:str):
    # 使用opencv按一定间隔截取视频帧，并保存为图片

    vc = cv2.VideoCapture(str)  # 读取视频文件
    c = 0
    print("------------")
    if vc.isOpened():  # 判断是否正常打开
        print("yes")
        rval, frame = vc.read()
    else:
        rval = False
        print("false")

    timeF = 10000000  # 视频帧计数间隔频率

    while rval:  # 循环读取视频帧
        rval,frame = vc.read()
        print(c,timeF,c%timeF)
        if (c % timeF == 0):# 每隔timeF帧进行存储操作
            print("write...")
            cv2.imwrite('path' + str(c) + '.jpg', frame)  # 存储为图像
            print("success!")
        c = c + 100000
    cv2.waitKey(1)
    vc.release()
    print("==================================")