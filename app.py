import os
import eel
import whisper
import tkinter as tk
from tkinter import ttk, filedialog as fd

eel.init('frontend', allowed_extensions=['.js', '.html'])


ffmpeg_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ffmpeg')
os.environ['PATH'] = f"{ffmpeg_path};{os.environ['PATH']}"

@eel.expose
def processFile():
    def select_file():
        filetypes = [("Аудио и Видео файлы", 
                     "*.mp3;*.wav;*.ogg;*.flac;*.mp4;*.avi;*.mkv;*.mts;*.mov;*.m4a;*.wma;*.webm;*.aac;*.ac3;*.opus;*.mka;*.alac;*.amr"),
                     ("Все файлы", "*.*")]
        path = fd.askopenfilename(title="Выберите файл", filetypes=filetypes)
        if path:
            eel.add_filepath_to_html(path, os.path.basename(path))
            root.destroy()

    root = tk.Tk()
    root.title("СК-РБ-СОФТ")
    root.geometry("300x300+400+200")
    root.resizable(False, False)
    root.attributes("-topmost", True)
    root.configure(bg='#486CED')

    style = ttk.Style()
    style.configure("my.TButton", font=("Arial", 14), background="#486CED")

    button = ttk.Button(root, text="Выберите файл", command=select_file, style="my.TButton")
    button.pack(expand=True)

    root.mainloop()

@eel.expose
def start_wishper(filepath, selected_model):
    model = whisper.load_model(selected_model, download_root="modelsW")
    result = model.transcribe(audio=filepath)
    eel.add_text_to_html(result["text"])

eel.start('index.html', Geometry={'size': (500, 500), 'position': (50, 50)})
