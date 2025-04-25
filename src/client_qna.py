import requests

"""
url = "http://localhost:5000/askai"  # Change if hosted elsewhere

# Example 1: With document
payload = {
    "query": "What are the 8 Aged Care Quality Standards?",
    "document": "This document provides information about aged care quality and safety standards in Australia."
}

# Example 2: Without document
# payload = {
#     "query": "What are the 8 Aged Care Quality Standards?"
# }

response = requests.post(url, json=payload)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())
"""
#----------------------- With out Question--------------------------------------

import requests

#url = "http://localhost:5000/askai"  # Replace with your host if different
url = "https://curki-api-ecbybqa6d5bmdzdh.australiaeast-01.azurewebsites.net/askai"

payload = {
    "query": "What are the 8 Aged Care Quality Standards?"
    # No 'document' field
}

response = requests.post(url, json=payload)
print(response)
print("Status Code:", response.status_code)
print("Response JSON:", response.json())
