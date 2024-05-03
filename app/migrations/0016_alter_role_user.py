# Generated by Django 5.0.3 on 2024-03-20 09:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0015_alter_role_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='role',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='role', to='app.user'),
        ),
    ]
