import requests
from requests.auth import HTTPBasicAuth

# Your ngrok URL (this is just a placeholder, replace it with your actual ngrok URL)
ngrok_url = 'https://c1ca-199-111-219-107.ngrok-free.app'

# Replace 'username' and 'password' with the credentials you set up for ngrok basic auth
username = 'hoRpolDlYouC'
password = 't6Zr9tjS0Fvc'

# The endpoint for generating text from your LLM
endpoint = '/api/generate'  # Adjust the endpoint if necessary

# Construct the full URL
url = f'{ngrok_url}{endpoint}'

# The data to be sent to the LLM API
data = {
  "model": "llama2",
  "prompt": "Type a small sentence.",
  "stream": False
}

# Make the POST request with basic authentication and JSON headers
response = requests.post(url, json=data, auth=HTTPBasicAuth(username, password))
response_data = response.json()

# Check if the request was successful
if response.status_code == 200:
    print('Success!')
    print(response_data["response"])
else:
    print('Failed to post data.')
    print('Status code:', response.status_code)
    print('Response:', response.text)

# If the content type of the response is JSON, attempt to decode it
# if 'application/json' in response.headers.get('Content-Type', ''):
#     try:
#         response_data = response.json()
#         print('JSON response:', response_data)
#     except ValueError as e:
#         print('Decoding JSON has failed:', e)
# else:
#     print('Response is not in JSON format.')
