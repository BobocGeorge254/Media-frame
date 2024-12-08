from django.core.files.uploadedfile import InMemoryUploadedFile
import os

model = None

def transcribe_audio(audio_file: InMemoryUploadedFile) -> str:
    global model  # Use the preloaded model set up in apps.py

    if model is None:
        raise RuntimeError("Whisper model is not loaded.")
    
    temp_file_path = os.path.join(os.getcwd(), audio_file.name)
    temp_file_path = os.path.normpath(temp_file_path)

    with open(temp_file_path, "wb") as temp_file:
        for chunk in audio_file.chunks():
            temp_file.write(chunk)

    print(temp_file_path)
    if os.path.exists(temp_file_path):
        print('exists')
    else:
        print('dosent exist')
        
    result = model.transcribe("sample.mp3")
    print(result)
    return result["text"]
