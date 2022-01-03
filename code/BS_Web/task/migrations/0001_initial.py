# Generated by Django 3.2.9 on 2022-01-02 23:10

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('TID', models.UUIDField(primary_key=True, serialize=False)),
                ('Name', models.CharField(max_length=255)),
                ('State', models.BooleanField()),
                ('Description', models.TextField(blank=True, default='The label task', null=True)),
                ('User', models.ManyToManyField(to='user.User')),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Ipfs_hash', models.CharField(max_length=70)),
                ('Task', models.ManyToManyField(to='task.Task')),
            ],
        ),
    ]