from googletrans import Translator
from flask import Flask, jsonify, request, abort, url_for
from flask_cors import CORS
from flask_cloudy import Storage

from gtts import gTTS

import subprocess
app = Flask(__name__)
CORS(app)

# Update the config
app.config.update({
	"STORAGE_PROVIDER": "LOCAL", # Can also be S3, GOOGLE_STORAGE, etc...
	"STORAGE_KEY": "",
	"STORAGE_SECRET": "",
	"STORAGE_CONTAINER": "./",  # a directory path for local, bucket name of cloud
	"STORAGE_SERVER": True,
	"STORAGE_SERVER_URL": "/files" # The url endpoint to access files on LOCAL provider
})
storage = Storage()
storage.init_app(app)

from pymongo import MongoClient

client = MongoClient('127.0.0.1', 27017)
db = client.test_database
collection = db.chats1
collection2 = db.users1

#tested
@app.route('/chat', methods=['POST'])
def create_message():
    request_json = request.get_json()
    print request_json
    if not request_json:
        abort(404)
    res = db.chats1.insert(request_json)
    if res:
        res = {
            "response": "Success"
        }
    return jsonify(res)

#tested
@app.route('/chat', methods=['GET'])
def read_message():
    request_json = request.values
    print request_json
    if not request_json:
        raise
    user1 = request_json.get("user1", "ali")    #mine
    user2 = request_json.get("user2", "anand")  #other
    lang = request_json.get("lang", None)
    res = db.chats1.find(
        {
            "$or":[{"from": user1, "to": user2}, {"from": user2, "to": user1}]
        }
    )
    lis = []

    for element in res:
        element.pop('_id')
        print element
        if not lang or element["from"]==user1:
            x = element['text']
        else:
            x = translator.translate(element['text'], dest=lang).text
        element['text'] = x
        lis.append(element)
    return jsonify(lis)

#tested
@app.route('/message-list', methods=['GET'])
def get_last_k_messages():
    request_json = request.values
    print request_json
    if not request_json:
        raise
    to_user = request_json.get("to", "anand")
    res = db.chats1.find({"to":to_user}).sort("_id", -1)
    # lis = []
    # from_set = set()

    _element = {}
    for element in res:
        element.pop('_id')
        print element
        _element = element
        break
    return jsonify(_element)
    #     if element['from'] in from_set:
    #         continue
    #     else:
    #         from_set.add(element['from'])
    #         lis.append(element)
    # return jsonify(lis)

@app.route('/chat', methods=['DELETE'])
def delete_message():
    request_json = request.get_json()
    if not request_json:
        print('you have to pass the condition, otherwise I will delete everything')
        db.chats1.drop()
    return jsonify({})


@app.route('/user', methods=['POST'])
def create_user():
    request_json = request.get_json()
    print request_json
    if not request_json:
        abort(404)
    obj_id = db.users1.insert(request_json)
    if obj_id:
        res = {
            "response": "Success",
            "user_id": str(obj_id)
        }
    else:
        res = {
            "response": "Failure"
        }
    return jsonify(res)

#tested
@app.route('/user', methods=['GET'])
def read_user():
    request_json = request.get_json()
    if not request_json:
        pass
    res = db.users1.find()
    lis = []
    for element in res:
        element.pop('_id')
        lis.append(element)
    return jsonify(lis)


@app.route('/user', methods=['DELETE'])
def delete_user():
    request_json = request.get_json()
    if not request_json:
        print('you have to pass the condition, otherwise I will delete everything')
        db.users1.drop()
    return jsonify({})

#tested
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

#tested
@app.route('/')
def hello_world():
    return 'Hello from Flask!'

@app.route('/voice-changer', methods=['POST'])
def get_audio_for_youtube_link
    import pdb; pdb.set_trace()
    # resp = dict()
    youtube_uri = request.values.get('url', '') #youtube uri link
    lang = request.values.get('lang', 'en')
    filename = youtube_uri.split('/')[-1]
    vtt_fullname = '%s.%s.vtt' %(filename, lang)
    # 1. call youtube-dl to create the vtt
    subprocess.call(['youtube-dl' ,'-write-auto-sub', '--skip-download',
                     youtube_uri, '--srt-lang', lang,
                     '-o', filename ])
    # 2. vtt to transcript
    #python test.py example.hi.vtt --transcript --scc_lang=hi
    subprocess.call(['python', 'vtt-to-transcript.py', vtt_fullname, 'transcript',
                     '--scc_lang', lang])
    # 3. tts the transcript
    file_contents = open('transcript.txt', 'encoding'='utf-8').read()
    tts = gTTS(text=file_contents, lang='en', slow=True)
    mp3_filename = '%s.mp3' %(filename)
    tts.save(mp3_filename)
    storage.upload(mp3_filename)
    import os; os.remove(mp3_filename)
    # resp['audio'] = url
    return redirect(url_for("download", object_name=mp3_filename))

@app.route("/download/<path:object_name>")
def download(object_name):
    my_object = storage.get(object_name)
    if my_object:
        download_url = my_object.download()
        return download_url
    else:
        abort(404, "File doesn't exist")
if __name__ == '__main__':
    app.run(host= '0.0.0.0')