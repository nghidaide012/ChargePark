# Generated by Django 5.0.3 on 2024-03-20 11:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0018_alter_electricvehicleinfo_vehicle_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parkinghistory',
            name='parking_spot',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parking_history', to='app.spot'),
        ),
    ]
