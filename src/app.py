from flask import Flask, request, jsonify
import os
import json
from werkzeug.utils import secure_filename
from agents.extractors.main import process_file
from agents.viz import call_visualization
from agents.summarize import extract_text_from_json_list, generate_report
from langchain.schema import Document
from agents.assistant import qanda_bot
from flask_cors import CORS
import io

from agents.incident_reporting.exct_all import process_pdf
from agents.incident_reporting.extractor import extract_incident_details
from agents.incident_reporting.detail_extract_tafm import extract_incident_details_tafm
from agents.incident_reporting.detail_extract_sci2 import extract_incident_details_sci2
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# To allow only specific frontend URLs
#CORS(app, resources={r"/*": {"origins": "https://your-frontend-url.com"}})

PRE_DEFINED_USER_QUERY = {
    "EBITDA Margin": """
        Calculate the EBITDA using the given financial data. 
        Create a pie chart representing 'Revenue', 'Operating Expenses', 'Depreciation', and 'Amortization', ensuring a transparent background. 
        Display the EBITDA value at the bottom right corner without overlapping any text labels.
        If any value is zero, you dont have to plot them in the chat.
    """,
    "Wages as a Percentage of Revenue": """
        Analyze the wage distribution relative to revenue for the year 2024. 
        Generate a bar chart comparing wages and revenue, ensuring clear visualization. 
        Display the percentage on top of each bar without overlapping any text
    """
}

@app.route('/incident_reporting', methods=['POST'])
def process_pdf_api():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.endswith('.pdf'):
        return jsonify({"error": "File must be a PDF"}), 400
    
    try:
        with io.BytesIO(file.read()) as file_stream:
            incident_details_json = process_pdf(file_stream)
        
        if isinstance(incident_details_json, str):
            incident_details_json = json.loads(incident_details_json)

        required_keys = [
            "CONSUMER INVOLVED FULL NAME",
            "STAFF REPORTING NAME",
            "Date of Incident (DD/MON/YY)",
            "Time of Incident (HH:MM AM/PM)",
            "LOCATION OF INCIDENT",
            "Criteria",
            "Description of Incident",
            "Description of Incident (Summarised)"
        ]

        relevent_incident_details_json = extract_incident_details(incident_details_json)
        if isinstance(relevent_incident_details_json, str):
            relevent_incident_details_json = json.loads(relevent_incident_details_json)

        direct_extracted_details = {key: relevent_incident_details_json.get(key, "") for key in required_keys}

        tafm_keys = ["Description of Incident", "Notes to Management", "Management Report"]
        tafm_details = {key: relevent_incident_details_json.get(key, "") for key in tafm_keys}
        tafm_details = extract_incident_details_tafm(tafm_details)

        sci2_keys = ["Description of Incident", "Notes to Management", "Management Report"]
        sci2_details = {key: relevent_incident_details_json.get(key, "") for key in sci2_keys}
        if "Injury Details" in incident_details_json:
            sci2_details["Injury Details"] = incident_details_json["Injury Details"]
        sci2_details = extract_incident_details_sci2(sci2_details)

        merged_data = {**direct_extracted_details, **tafm_details, **sci2_details}
        df = pd.DataFrame([merged_data])
        
        if "Injury Details" in df:
            df["Injury Details"] = df["Injury Details"].apply(lambda x: str(x) if isinstance(x, dict) else x)
        
        return jsonify({"message": "Data extracted successfully", "data": df.to_dict(orient='records')})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        

@app.route("/qanda", methods=["POST"])
def qanda():
    data = request.json
    if not data or "document" not in data or "query" not in data:
        return jsonify({"error": "Missing document or query"}), 400
    
    document = data["document"]
    user_query = data["query"]
    
    try:
        response = qanda_bot(document, user_query)
    except Exception as e:
        return jsonify({"error": f"Error processing Q&A: {str(e)}"}), 500
    
    return jsonify({"response": response})

@app.route("/", methods=["POST"])
def upload_files():

    if "files" not in request.files or "file_metrics" not in request.form:
        return jsonify({"error": "Missing files or metric names"}), 400

    files = request.files.getlist("files")
    file_metrics = json.loads(request.form["file_metrics"])
    print(files)

    # Extract metric names from JSON
    metric_names = [item["metric_name"] for item in file_metrics]

    if len(files) != len(metric_names):
        return jsonify({"error": "Number of files and metric names must match"}), 400


    responses = []
    
    all_df_json = []

    visualization_dict = {}

    all_extracted_data = []

    for file, metric_name in zip(files, metric_names):
        if file.filename == "":
            continue
        #file_stream = io.StringIO(file.read().decode("utf-8"))

        try:
            try:
                file_content = file.read()
                with io.StringIO(file_content.decode("utf-8")):
                    extracted_data, df_json = process_file(file_path=file_stream, filename=file.filename, metric_name=metric_name)

            except UnicodeDecodeError:
                with io.BytesIO(file_content) as file_stream:
                    extracted_data, df_json = process_file(file_path=file_stream, filename=file.filename, metric_name=metric_name)

            all_df_json.append(df_json)
            all_extracted_data.append(extracted_data["metric"])
        
        except Exception as e:
            print(f"Error processing file {file}: {e}")
            return jsonify({"error": f"Error processing file: {str(e)}"}), 400

        #------------------------------------------- Call to visualize------------------
        # Step 2: Select Query Based on Metric Name
        query = PRE_DEFINED_USER_QUERY.get(metric_name, "")

        try:
            if query:
                # Step 3: Call Visualization Function
                visualization_output = call_visualization(extracted_data['data'], query)
            else:
                visualization_output = call_visualization(extracted_data['data'],query=None)
            
            if visualization_output:
                visualization_dict[metric_name] = visualization_output

        except Exception as e:
            print(f"Error in visualization: {e}")
            visualization_output = None  # Or handle it as needed

        #-------------------------------------------------------------------------------
    #---------------------------- Report Generation ---------------------------------
    print(all_df_json)
    data = all_df_json
    #data_str = extract_text_from_json_list(all_df_json)
    #data = Document(page_content=data_str) #--------------------------------------------------------------------> This same document goes into Q&A
    print("_____________________________________________")
    print(data)
    print("_____________________________________________")

    try:
        report = generate_report(data)
    except Exception as e:
        print(f"Error generating report: {e}")
        report = "Unable to generate summary"

    print(report)

    #--------------------------------------------------------------------------------

    #------------------------------ Q&A Assistant -----------------------------------
    user_query = None
    #answer_response = qanda_bot(data, user_query)

    #--------------------------------------------------------------------------------
    print(visualization_dict)
    responses.append({
        "metric_name": metric_names,
        "extracted_data": all_extracted_data,
        "files_in_string_format": data,
        "report": report,
        "visualization": visualization_dict  # Add visualization path if available
    })

    return jsonify(responses)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

# python -m waitress --listen=0.0.0.0:8000 app_filestream:app        -------------------------> run using this
