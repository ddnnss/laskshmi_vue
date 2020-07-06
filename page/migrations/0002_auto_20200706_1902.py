# Generated by Django 3.0.5 on 2020-07-06 16:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('page', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='banner',
            name='subtitle',
            field=models.CharField(blank=True, max_length=255, verbose_name='Описание'),
        ),
        migrations.AddField(
            model_name='banner',
            name='title',
            field=models.CharField(blank=True, max_length=255, verbose_name='Заголовок'),
        ),
        migrations.AlterField(
            model_name='banner',
            name='url',
            field=models.CharField(blank=True, max_length=255, verbose_name='Ссылка'),
        ),
    ]