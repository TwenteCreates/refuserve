from googletrans import Translator
from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


from pymongo import MongoClient

client = MongoClient('x.x.x.x', 27017)
db = client.test_database
collection = db.chats1
collection2 = db.users1


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


@app.route('/chat', methods=['GET'])
def read_message():
    request_json = request.values
    print request_json
    if not request_json:
        raise
    user1 = request_json.get("user1", "ara")    #mine
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
    app.run(host= '0.0.0.0')