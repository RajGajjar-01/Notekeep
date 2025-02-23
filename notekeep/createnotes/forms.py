from .models import Note
from django import forms

class NoteModalForm(forms.ModelForm):   
    class Meta:
        model = Note
        fields = ['title', 'description']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        placeholders = {
            'title': 'Note Title',
            'description': 'Description',
        }
    
        for field in self.fields:
            
            self.fields[field].widget.attrs.update({
                'placeholder': placeholders.get(field, ''), 
                'class': 'w-full p-2 border rounded-lg mb-4'
            })