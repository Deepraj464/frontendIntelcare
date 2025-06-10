# client.py

import requests
import os

def test_api():
    """
    Simple function to test the file processing API
    """
    
    # API endpoint
 
    #url = "http://localhost:5001/monthly_financial_health"
    url = "https://curki-api-ecbybqa6d5bmdzdh.australiaeast-01.azurewebsites.net/monthly_financial_health"
    
    # File paths
    template_file = r"C:\Users\utkar\Downloads\monthly input\temple sheets\Claimables.xlsx"
    source_files = [
        r"C:\Users\utkar\Downloads\monthly input\Weekly_Claims_Register.csv",
        r"C:\Users\utkar\Downloads\monthly input\Rostered_Staff_Activity.csv",
        r"C:\Users\utkar\Downloads\monthly input\Payroll_Summary_Export.csv",
        r"C:\Users\utkar\Downloads\monthly input\Income_Report_Billing_System.csv"
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
            'metric_name': 'claimables'  # Change this to test different metrics: hours, wages, income_by_service, claimables
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
        url = "https://curki-api-ecbybqa6d5bmdzdh.australiaeast-01.azurewebsites.net/summarise_monthly_finance"
        files = {'file': open(r"C:\Users\utkar\Downloads\Monthly Financial Health - Mastertemplate .xlsx", 'rb')}

        response = requests.post(url, files=files)
        print(response.json())

    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure your Flask app is running on http://localhost:5001")

    except:
        print("")

if __name__ == "__main__":
    print("=== Testing File Processing API ===")
    print()
    
    # Test file processing
    #print("1. Testing file processing...")
    #test_api()

    # Test summariser
    print("2. Testing summariser...")
    test_summariser()