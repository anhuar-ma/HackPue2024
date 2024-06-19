# import whisper
# def main():
#     model = whisper.load_model("base")
#     result = model.transcribe("./uploads/recording.wav")
#     return result["text"]
from flask import Flask, jsonify
import whisper
import json

app = Flask(__name__)

def main():
    model = whisper.load_model("base")
    result = model.transcribe("./uploads/recording.wav",language="es")
    return result["text"]

@app.route('/transcribe', methods=['GET'])
def transcribe_audio():
    transcription = main()

    # Write the transcription to a JSON file
    with open('transcription.json', 'w') as f:
        json.dump({'transcription': transcription}, f)

    return jsonify({'transcription': transcription})

if __name__ == '__main__':
    app.run(port=5001, debug=True)