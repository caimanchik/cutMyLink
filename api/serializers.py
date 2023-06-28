import datetime

from rest_framework import serializers

from cutMyLink.settings import chars_choices, host
from .models import Links


class LinkSerializer(serializers.HyperlinkedModelSerializer):
    expires_data = serializers.DictField()
    short_link = serializers.CharField()

    class Meta:
        model = Links
        fields = ('url', 'short_url', 'hop_count', 'expires_at', 'expires_data', 'short_link')

    def validate(self, data):
        if 'short_link' in data:
            if len(data['short_link']) != 10:
                raise serializers.ValidationError('Некорректная ссылка')
            for c in data['short_link']:
                if c not in chars_choices: raise serializers.ValidationError('Некорректная ссылка')
        else:
            if 'url' not in data \
                    or 'expires_data' not in data \
                    or 'days' not in data['expires_data'] \
                    or 'hours' not in data['expires_data'] \
                    or 'minutes' not in data['expires_data']:
                raise serializers.ValidationError('Представлены не все поля')

            try:
                days, minutes, hours = \
                    int(data['expires_data']['days']), \
                    int(data['expires_data']['hours']), \
                    int(data['expires_data']['minutes'])

            except ValueError:
                raise serializers.ValidationError('Неверный формат данных')

            if days == minutes == hours == 0:
                raise serializers.ValidationError('Время действия ссылки не может быть равным нулю')

        return data

    @staticmethod
    def get(short_link, redirect=False):
        try:
            link = Links.objects.get(short_url=short_link)
            if datetime.datetime.now().timestamp() > link.expires_at.timestamp():
                raise KeyError('Срок действия ссылки истек')
        except Links.DoesNotExist:
            raise KeyError('Такой ссылки не существует')

        if redirect:
            link.hop_count += 1
            link.save()

        return {
            "url": link.url,
            "short_url": host + link.short_url,
            "hop_count": link.hop_count,
            "expires_at": link.expires_at,
        }

    def create(self, data):

        url = data['url']
        expires_at = LinkSerializer._get_expiration_date(data['expires_data'])
        link_obj = Links()
            # .objects.create(url=url, expires_at=expires_at)
        link_obj.url = url
        link_obj.expires_at = expires_at
        link_obj.save()

        return {
            "url": link_obj.url,
            "short_url": host + link_obj.short_url,
            "hop_count": link_obj.hop_count,
            "expires_at": link_obj.expires_at,
        }

    @staticmethod
    def _get_expiration_date(exp_data):
        delta = datetime.timedelta(
            days=int(exp_data['days']),
            hours=int(exp_data['hours']),
            minutes=int(exp_data['minutes'])
        )

        return datetime.datetime.now() + delta
