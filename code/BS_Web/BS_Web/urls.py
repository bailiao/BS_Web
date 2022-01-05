"""BS_Web URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from user import views as user_view
from task import views as task_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', user_view.register),
    path('login/', user_view.login),
    path('findpasswd/', user_view.findPassword),
    path('uploadTask/', task_view.createTask),
    path('processVideo/', task_view.processVideo),
    path('getAllTask/', task_view.getAllTask),
    path('getMyTask/', task_view.getMyTask),
    path('obtainTask/', task_view.obtainTask),
    path('cancelTask/',task_view.cancelTask),
    path('discardTask/',task_view.discardTask),
    path('getOneTask/',task_view.getOneTask),
]
