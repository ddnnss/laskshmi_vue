# Generated by Django 3.0.5 on 2020-08-03 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('page', '0002_auto_20200706_1902'),
    ]

    operations = [
        migrations.AddField(
            model_name='banner',
            name='btn_text',
            field=models.CharField(blank=True, max_length=255, verbose_name='Текст на кнопке'),
        ),
    ]