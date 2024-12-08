from django.core.files.uploadedfile import InMemoryUploadedFile
import os
import tempfile
import librosa
import soundfile as sf

def pitch_shift_audio(audio_file: InMemoryUploadedFile, n_steps: int) -> str:

    temp_input_path = os.path.join(os.getcwd(), audio_file.name)
    temp_input_path = os.path.normpath(temp_input_path)
    
    with open(temp_input_path, "wb") as temp_file:
        for chunk in audio_file.chunks():
            temp_file.write(chunk)

    if not os.path.exists(temp_input_path):
        raise FileNotFoundError(f"Uploaded file was not saved correctly: {temp_input_path}")
    
    y, sr = librosa.load(temp_input_path)
    y_shifted = librosa.effects.pitch_shift(y, sr, n_steps=n_steps)
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_output_file:
        temp_output_path = temp_output_file.name
        sf.write(temp_output_path, y_shifted, sr)

    os.remove(temp_input_path)
    return temp_output_path
