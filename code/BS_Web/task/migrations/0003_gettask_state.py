# Generated by Django 3.2.9 on 2022-01-04 07:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task', '0002_auto_20220104_0639'),
    ]

    operations = [
        migrations.AddField(
            model_name='gettask',
            name='State',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
