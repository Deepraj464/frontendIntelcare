# client.py

import requests
import os

def test_api():
    """
    Simple function to test the file processing API
    """
    
    # API endpoint
 
    #url = "http://localhost:5001/monthly_financial_health"
    url = "https://curki-backend-api-d8d3c4hafyg3hqfg.australiaeast-01.azurewebsites.net/QFR"
    
    # File paths
    template_file = r"C:\Users\utkar\Downloads\QFR_template\HC_CareLabour_Cost&Hours 2.xlsx"
    source_files = [
        r"C:\Users\utkar\Downloads\Source File_qfr\employee_labour_costs.csv",
        r"C:\Users\utkar\Downloads\Source File_qfr\agency_staff_costs.csv",
        r"C:\Users\utkar\Downloads\Source File_qfr\labour_hours.csv",
        r"C:\Users\utkar\Downloads\Source File_qfr\hourly_rates.csv"
    ]
    
    # Check if files exist
    files_to_check = [template_file] + source_files
    for file_path in files_to_check:
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}")
            print("Please update the file paths in client.py")
            return
    
    try:
        # Prepare files for upload
        files = [
            ('template', open(template_file, 'rb'))
        ]
        
        # Add all source files
        for source_file in source_files:
            files.append(('source_files', open(source_file, 'rb')))
        
        # Form data
        data = {
            'metric_name': 'HC_CareLabour_Cost&Hours 2'  # Change this to test different metrics: hours, wages, income_by_service, claimables
        }
        
        print("📤 Sending request to API...")
        print(f"Template: {os.path.basename(template_file)}")
        print(f"Source files: {', '.join([os.path.basename(f) for f in source_files])}")
        print(f"Metric: {data['metric_name']}")
        print()
        
        # Send POST request
        response = requests.post(url, files=files, data=data)
        
        # Close files
        for _, f in files:
            f.close()
        
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            # Success - save the returned file
            output_filename = f"{data['metric_name']}.xlsx"
            with open(output_filename, 'wb') as f:
                f.write(response.content)
            print(f"✅ Success! File saved as: {output_filename}")
            
        else:
            # Error response
            try:
                error_data = response.json()
                print(f"❌ Error: {error_data.get('error', 'Unknown error')}")
            except:
                print(f"❌ Error: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure your Flask app is running on http://localhost:5001")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def test_summariser():
    """
    Test the summariser endpoint
    """
    try:
        url = "https://curki-backend-api-d8d3c4hafyg3hqfg.australiaeast-01.azurewebsites.net/summarise_QFR"
        files = {'file': open(r"C:\Users\utkar\Downloads\Monthly Financial Health.xlsx", 'rb')}

        response = requests.post(url, files=files)
        print(response.json())

    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure your Flask app is running on http://localhost:5001")

    except:
        print("")

def test_visualise():
    import base64
    #url = "http://localhost:5001/visualise_qfr"
    url = "https://curki-backend-api-d8d3c4hafyg3hqfg.australiaeast-01.azurewebsites.net/visualise_qfr"
    file_path = r"C:\Users\utkar\Downloads\QFR_dummy_data.xlsx"

    with open(file_path, "rb") as f:
        files = {"file": (file_path, f)}
        response = requests.post(url, files=files)

    if response.status_code == 200:
        data = response.json()
        print(data)
        print("Received attachments info:")
        attachments = data.get("attachments", [])
        def get_image_extension(file_bytes):
            if file_bytes.startswith(b'\x89PNG\r\n\x1a\n'):
                return ".png"
            elif file_bytes.startswith(b'\xff\xd8\xff'):
                return ".jpg"
            else:
                return ".bin"


        output_dir = "output_images"
        os.makedirs(output_dir, exist_ok=True)

        for att in attachments:
            file_bytes = base64.b64decode(att['file_base64'])
            ext = get_image_extension(file_bytes)
            
            # Use basename to strip any directories
            base_name = os.path.basename(att['filename'])
            # If no extension, append detected extension
            if not os.path.splitext(base_name)[1]:
                base_name += ext

            save_path = os.path.join(output_dir, base_name)
            with open(save_path, "wb") as f:
                f.write(file_bytes)
            print(f"✅ Saved: {save_path}")
    else:
        print("Error:", response.status_code, response.text)


if __name__ == "__main__":
    print("=== Testing File Processing API ===")
    print()
    
    # Test file processing
    #print("1. Testing file processing...")
    #test_api()

    # Test summariser
    #print("2. Testing summariser...")
    #test_summariser()

    # Test Visualisation
    print("3. Testing Visualisation...")
    test_visualise()