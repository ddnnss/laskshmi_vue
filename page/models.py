from django.db import models

class Banner(models.Model):
    order = models.IntegerField('Порядок отображения', default=1)
    image = models.ImageField('Картинка', upload_to='banners/', blank=False)
    title = models.CharField('Заголовок', max_length=255, blank=True)
    subtitle = models.CharField('Описание', max_length=255, blank=True)
    url = models.CharField('Ссылка', max_length=255, blank=True)
    is_active = models.BooleanField(default=True)


    def __str__(self):
        return 'Баннер, порядковый номер : %s' % self.order

    class Meta:
        verbose_name = "Баннер"
        verbose_name_plural = "Баннеры"
