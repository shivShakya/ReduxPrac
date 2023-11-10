from flask import Flask , request , jsonify
from pymongo import MongoClient
import pandas as pd 

app = Flask(__name__)


client = MongoClient('')
db = client['']
collect = db['']

@app.route('/upload_csv', method=['POST'])
def upload_csv():
      try: 
              csv_file = request.files['file']

              if csv_file:
                       
                       df = pd.read_csv(csv_file)

                       records = df.to_dict(orient='records')

                       collect.insert_many(records)

                       return jsonify({'message' : "CSV data successfully inserted"})
              else:
                       return jsonify({"error" : "No file provided"})
      except Exception as e:
                   return jsonify({'error': str(e)})
      
if __name__ == '__main__':
          app.run(debug=True)