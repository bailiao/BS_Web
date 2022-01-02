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


def createTask(request):
    data = json.loads(request.body)
    user = models.User.objects.filter(Email=data['Email']).first()
    path = data['Path']
    task = models.Task.objects.create(TID=uuid.uuid4(), User=user, Name=data['Name'], State=False, Description=data['description'])
    for item in path:
        image = models.Image.objects.create(Ipfs_hash=item)
        image.add(task)

    return HttpResponse("上传成功")