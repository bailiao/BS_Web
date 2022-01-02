from django.db import models
from user.models import User

class Task(models.Model):
    TID = models.UUIDField(max_length=15, primary_key=True, blank=False)
    User = models.ManyToManyField(User)
    Name = models.CharField(max_length=255, blank=False)
    State = models.BooleanField()
    Description = models.TextField(blank=True,null=True,default="The label task")

class Image(models.Model):
    Task = models.ManyToManyField(Task)
    Ipfs_hash = models.CharField(max_length=70)
