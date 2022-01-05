from django.db import models
from user.models import User

class Task(models.Model):
    TID = models.UUIDField(max_length=15, primary_key=True, blank=False)
    User = models.ManyToManyField(User)
    Name = models.CharField(max_length=255, blank=False)
    Description = models.TextField(blank=True,null=True,default="The label task")
    CreatedTime = models.DateTimeField(auto_now_add=True)

class Image(models.Model):
    Task = models.ManyToManyField(Task)
    Name = models.CharField(max_length=255)
    Ipfs_hash = models.CharField(max_length=70)

class getTask(models.Model):
    Task = models.ManyToManyField(Task)
    Publisher = models.ManyToManyField(User,related_name="Publisher")
    Obtainer = models.ManyToManyField(User,related_name="Obtainer")
    State = models.BooleanField(default=False)
    Time = models.DateField(auto_now_add=True)