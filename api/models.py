import random

from django.db import models

from cutMyLink.settings import chars_choices, link_len


class Links(models.Model):

    url = models.URLField()
    short_url = models.CharField(max_length=10, unique=True, db_index=True)
    hop_count = models.IntegerField(default=0)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.short_url:

            while True:
                url = random.choices(chars_choices, link_len)

                if not Links.objects.filter(short_url=url).exists():
                    self.short_url = url
                    break

        super().save(*args, **kwargs)
