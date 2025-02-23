from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing_view, name='createnotes-landing'),
    path('home/', views.home_view, name='createnotes-home'),
    path('api/get-all-notes/', views.get_all_notes_view, name='get-all-notes'),
    path('api/create-note/', views.create_note_view, name='create-note'),
    path('api/delete-note/<int:pk>/', views.delete_note_view, name='delete-note'),
]