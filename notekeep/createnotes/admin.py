from django.contrib import admin
from .models import Note

class NoteAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'created_date', 'author']

admin.site.register(Note, NoteAdmin)
