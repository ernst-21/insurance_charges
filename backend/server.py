from flask import Flask, request, jsonify
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app)


@app.route('/predict_insurance', methods=['POST'])
def predict_estimated_insurance():
    content = request.json
    age = int(content['age'])
    bmi = float(content['bmi'])
    children = int(content['children'])
    sex = content['sex']
    smoker = content['smoker']
    region = content['region']

    response = jsonify({
        'estimated_expenses': util.calc_insurance(age, bmi, children, sex, smoker, region)
    })

    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


if __name__ == "__main__":
    print("Starting Python Flask Server for Premium Insurance Predictions...")
    app.run()
