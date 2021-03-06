from django.db.models.fields.related import create_many_to_many_intermediary_model
from django.shortcuts import render
from django.http import HttpResponse
from django.core.mail import send_mail
from BS_Web import settings
import json
import uuid
import random
import datetime
import pytz
import cv2
import os
import urllib
import time
import ipfsApi

ipfs = ipfsApi.Client('127.0.0.1', 5001)
img_profix = "http://ipfs.io/ipfs/"
from . import models

video = "D:/django/BS_Web/Video/"     #需要修改为自己的Video路径
video_img = "D:/django/BS_Web/Image/"     #需要修改为自己的Video路径
json_save = "D:/django/BS_Web/json/"

def createTask(request):
    data = json.loads(request.body)
    user = models.User.objects.filter(Email=data['Email']).first()
    path = eval(data['Path'])
    task = models.Task.objects.create(TID=uuid.uuid4(), Name=data['Name'], Description=data['Description'])
    task.User.add(user)
    print(type(path))
    for item in path:
        print(item)
        image = models.Image.objects.create(Name=item['Name'],Ipfs_hash=item['Path'])
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
            dict={}
            theFile = video_img + key[0]+str(c/timeF) + '.jpg'
            cv2.imwrite(theFile, frame)  # 存储为图像
            res = ipfs.add(theFile)[0]['Hash']
            dict['Name'] = key[0]+str(c/timeF) + '.jpg'
            dict['Path'] = res
            print(res)
            list1.append(dict)
            # print("success!")
        c = c + 100000
    cv2.waitKey(1)
    vc.release()
    print("==================================")
    return HttpResponse(json.dumps(list1))

def getAllTask(request):
    list1=[]
    
    taskList = models.Task.objects.values().all()
    
    for task in taskList:
        # print(task)
        taskItem={}
        taskItem['TID']=str(task['TID'])
        # print(task['TID'], taskItem['TID'])
        taskItem['Name']=task['Name']
        taskItem['Description']=task['Description']
        taskItem['CreatedTime']=task['CreatedTime'].strftime('%Y-%m-%d %H:%M:%S')
        uid = models.Task.objects.values('User').filter(TID=task['TID']).first()
        # print(uid)
        user = models.User.objects.values('Email').filter(UID=uid['User']).first()
        print(user)
        taskItem['Publisher']=user['Email']
        img = models.Image.objects.values().filter(Task=task['TID']).first()
        # print(img)
        taskItem['Cover'] = img['Ipfs_hash']

        list1.append(taskItem)

    return HttpResponse(json.dumps(list1))

def getMyTask(request):
    data = json.loads(request.body)
    print(data)
    user = models.User.objects.filter(Email=data['Email']).first()
    self_task={'publish':[], 'obtain':[]}
    publish_task_list = list(models.Task.objects.values().filter(User=user))
    for item in publish_task_list:
        dict1={}
        dict1['TID'] = str(item['TID'])
        dict1['Name'] = item['Name']
        dict1['State'] = item['State']
        dict1['Description'] = item['Description']
        dict1['CratedTime'] = item['CreatedTime'].strftime('%Y-%m-%d %H:%M:%S')
        task = models.Task.objects.filter(TID=item['TID']).first()
        img = models.Image.objects.values().filter(Task=task).first()
        dict1['Cover'] = img['Ipfs_hash']
        self_task['publish'].append(dict1)

    obtain_task_list = list(models.getTask.objects.values('Task','Publisher','Time').filter(Obtainer=user))
    print(obtain_task_list)
    for item in obtain_task_list:
        publisher = models.User.objects.values().filter(UID=item['Publisher']).first()
        task_i = models.Task.objects.values().filter(TID=item['Task']).first()
        task = models.Task.objects.filter(TID=item['Task']).first()
        dict2={}
        dict2['TID'] = str(task_i['TID'])
        dict2['Name'] = task_i['Name']
        dict2['Publisher'] = publisher['Email']
        dict2['Description'] = task_i['Description']
        dict2['Time'] = item['Time'].strftime('%Y-%m-%d')
        img = models.Image.objects.values().filter(Task=task).first()
        dict2['Cover'] = img['Ipfs_hash']
        self_task['obtain'].append(dict2)
    print(self_task)
    return HttpResponse(json.dumps(self_task))

def obtainTask(request):
    data = json.loads(request.body)
    print(data)
    task = models.Task.objects.filter(TID=data['Task']).first()
    obtainer = models.User.objects.filter(Email=data['Obtainer']).first()
    publisher = models.User.objects.filter(Email=data['Publisher']).first()
    task_obtained = models.getTask.objects.create()
    task_obtained.Task.add(task)
    task_obtained.Obtainer.add(obtainer)
    task_obtained.Publisher.add(publisher)
    return HttpResponse("领取成功")

def cancelTask(request):
    data = json.loads(request.body)
    print(data)
    task = models.Task.objects.filter(TID=data['TID']).first()
    imageList = list(models.Image.objects.filter(Task=task).all())
    for img in imageList:
        img.delete()
    task.delete()
    return HttpResponse("撤销成功")
        
def discardTask(request):
    data = json.loads(request.body)
    print(data)
    task = models.Task.objects.filter(TID=data['TID']).first()
    obtain_task = models.getTask.objects.filter(Task=task).first()
    obtain_task.delete()
    return HttpResponse("丢弃成功")

def getOneTask(request):
    data = json.loads(request.body)
    task = models.Task.objects.values().filter(TID=data['TID']).first()
    task_image = list(models.Image.objects.values().filter(Task=data['TID']).all())
    res={}
    res['Description'] = task['Description']
    res['Name'] = task['Name']
    list1=[]
    for image in task_image:
       dict={}
       dict['Id'] = image['id']
       dict['Name'] = image['Name']
       dict['Path'] = image['Ipfs_hash']
       list1.append(dict)
    res['Image'] = list1
    return HttpResponse(json.dumps(res))    

def saveInfo(request):
    data = json.loads(request.body)
    tid = data['TID']
    publisher_Email = data['Publisher']
    Image_info = data['ImageInfo']

    task = models.Task.objects.filter(TID=tid).first()
    task_obtained = models.getTask.objects.filter(Task=task).first()
    destination = {}
    destination["info"]={"description":task.Description,"version":"1.0","year":2021,"contributor":publisher_Email,"data_created":str(task.CreatedTime)}
    destination['licenses']={'name':task.Name}
    destination['images']=[]
    destination['annotations']=[]
    for item in Image_info:
        dict_image = {}
        dict_annotation = {}
        image = models.Image.objects.filter(Task=task, id=item['Image']).first()
        
        left = item['Left']
        top = item['Top']
        width = item['Width']
        height = item['Height']
        text = item['Text']

        dict_image['id']=image.id
        dict_image['url']=img_profix+image.Ipfs_hash
        dict_annotation['image_id']=image.id
        dict_annotation['category'] = text
        dict_annotation['bbox'] = [left, top, width, height]

        export = models.ExportCoCo.objects.create(left=left,top=top,width=width,height=height,text=text)
        export.Task_obtained.add(task_obtained)
        export.Image.add(image)

        destination['images'].append(dict_image)
        destination['annotations'].append(dict_annotation)
    
    final=json.dumps(destination,ensure_ascii=False)
    file_path = json_save+task.Name+".json"
    fileob = open(file_path,'w',encoding="utf-8")
    fileob.write(final)
    fileob.close()
    jsonfile = models.JsonFile.objects.create(File_path=file_path)
    jsonfile.Task.add(task)
    return HttpResponse("保存成功")

def downloadExport(request):
    tid = request.POST.get('TID');
    task = models.Task.objects.filter(TID=tid).first()
    file = models.JsonFile.objects.values().filter(Task=task).first()
 
    with open(file['File_path'],'rb') as f:
        responses = HttpResponse(f.read(),content_type="APPLICATION/OCET-STREAM")
        responses["Content-Disposition"] = 'attachment; filename=export.json'
        responses["Content-Length"]=os.path.getsize(file['File_path']) 
    return responses
    
    