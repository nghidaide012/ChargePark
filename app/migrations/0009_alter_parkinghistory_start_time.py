# Generated by Django 5.0.3 on 2024-03-14 08:30

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_alter_vehicle_is_electric'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parkinghistory',
            name='start_time',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]