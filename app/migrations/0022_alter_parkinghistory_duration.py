# Generated by Django 5.0.3 on 2024-03-25 08:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0021_delete_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parkinghistory',
            name='duration',
            field=models.DurationField(blank=True, null=True),
        ),
    ]
