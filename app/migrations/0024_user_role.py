# Generated by Django 5.0.3 on 2024-04-04 12:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0023_alter_user_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.CharField(default='employee', max_length=100),
        ),
    ]
