# Generated by Django 3.2.9 on 2022-01-04 18:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task', '0004_gettask_time'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='State',
        ),
        migrations.AlterField(
            model_name='gettask',
            name='State',
            field=models.BooleanField(default=False),
        ),
    ]