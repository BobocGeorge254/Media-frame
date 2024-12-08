from django.urls import path
from .views import TranscriptionAPIView, PitchShiftingAPIView

urlpatterns = [
    path('transcribe/', TranscriptionAPIView.as_view() , name='transcribe'),
    path('shift/', PitchShiftingAPIView.as_view(), name='shift')
]