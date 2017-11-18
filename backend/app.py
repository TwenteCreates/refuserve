from googletrans import Translator
from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

translator = Translator()
@app.route('/translate', methods=['GET'])
def translate_api_call():
    resp = dict()
    text = request.values.get('text', '')
    dest = request.values.get('dest', 'en')
    print(text)
    x = translator.translate(text, dest=dest)
    resp['value'] = x.text
    return jsonify(resp)


@app.route('/')
def hello_world():
    return 'Hello from Flask!'


if __name__ == '__main__':
    app.run()