from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from . import models, forms

@login_required
def home_view(request):
    form = forms.NoteModalForm(auto_id = True)
    context = {
        'createNote' : form,
    }

    return render(request, 'createnotes/Home.html', context)

def landing_view(request):
    return render(request, 'createnotes/Landing.html')   

def contact_view(request):
    return render(request, 'createnotes/Contact.html')

def success_view(request):
    return render(request, 'createnotes/Success.html') 

def get_all_notes_view(request):
    if request.method == 'GET':
        try:
            notes = models.Note.objects.filter(author = request.user).values(
                'id', 'title', 'description', 'author', 'created_date'
            )
            all_notes = list(notes)
            return JsonResponse({"success": True, "notes": all_notes})
        except Exception as e:
            return JsonResponse({"success": False, "message": f"An error occurred: {str(e)}"}, status=500)
    return JsonResponse({"success": False, "message": "Invalid method. Use GET."}, status=400)

def create_note_view(request):
    if request.method == 'POST':
        try:  
            print(request.POST)
            form = forms.NoteModalForm(request.POST)        
            print(form.is_valid())
            if form.is_valid():
                note = form.save(commit=False)
                note.author = request.user  
                note.save()
                return JsonResponse({"success": True})
        except Exception as e:
               return JsonResponse({"success": False, "message": f"An error occurred: {str(e)}"}, status=500)
    return JsonResponse({"success": False, "message": "Invalid method. Use POST."}, status=400)
            

def delete_note_view(request, pk):
    if request.method == 'DELETE':
        try:
            note = models.Note.objects.get(pk=pk)   
            if note:
                note.delete();
                return JsonResponse({"success": True, "message": f"Note deleted"})
        except Exception as e:
            return JsonResponse({"success": False, "message": f"An error occurred: {str(e)}"}, status=500)
    return JsonResponse({"success": False, "message": "Invalid method"}, status=400)


