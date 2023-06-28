import datetime

from rest_framework import serializers

from cutMyLink.settings import chars_choices
from .models import Links


class LinkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Links
        fields = '__all__'

    def validate(self, data):
        if data['short_link'] is not None:
            if len(data['short_link']) != 10:
                raise serializers.ValidationError('Некорректная ссылка')
            for c in data['short_link']:
                if c not in chars_choices: raise serializers.ValidationError('Некорректная ссылка')
        else:
            if None in (
                    data['url'], data['expires_data'],
                    data['expires_data']['days'],
                    data['expires_data']['hours'],
                    data['expires_data']['minutes']):
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
    def get(short_link):
        try:
            link = Links.objects.get(short_url__exact=short_link)

            if datetime.datetime.now() > link.expires_at:
                raise KeyError('Срок действия ссылки истек')
        except Links.DoesNotExist:
            raise KeyError('Такой ссылки не существует')

        link.hop_count += 1
        link.save()

        return link

    def create(self, data):

        url = data['full_url']
        expires_at = LinkSerializer._get_expiration_date(data['expires_data'])

        link_obj = Links.objects.create(url=url, expires_at=expires_at)

        return link_obj

    @staticmethod
    def _get_expiration_date(exp_data):
        delta = datetime.timedelta(
            days=int(exp_data['days']),
            hours=int(exp_data['hours']),
            minutes=int(exp_data['minutes'])
        )

        return datetime.datetime.now() + delta