from django.contrib import admin

from .models import Links


@admin.register(Links)
class TokenAdmin(admin.ModelAdmin):

    list_display = (
        'url',
        'short_url',
        'hop_count',
        'expires_at',
    )
    search_fields = ('url', 'short_url')
    ordering = ('-expires_at',)