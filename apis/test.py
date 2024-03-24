# import requests
# from requests.auth import HTTPBasicAuth

# # Your ngrok URL (this is just a placeholder, replace it with your actual ngrok URL)
# ngrok_url = 'https://c1ca-199-111-219-107.ngrok-free.app'

# # Replace 'username' and 'password' with the credentials you set up for ngrok basic auth
# username = 'hoRpolDlYouC'
# password = 't6Zr9tjS0Fvc'

# # The endpoint for generating text from your LLM
# endpoint = '/api/generate'  # Adjust the endpoint if necessary

# # Construct the full URL
# url = f'{ngrok_url}{endpoint}'

# # The data to be sent to the LLM API
# data = {
#   "model": "llama2",
#   "prompt": "Type a small sentence.",
#   "stream": False
# }

# # Make the POST request with basic authentication and JSON headers
# response = requests.post(url, json=data, auth=HTTPBasicAuth(username, password))
# response_data = response.json()

# # Check if the request was successful
# if response.status_code == 200:
#     print('Success!')
#     print(response_data["response"])
# else:
#     print('Failed to post data.')
#     print('Status code:', response.status_code)
#     print('Response:', response.text)

# # If the content type of the response is JSON, attempt to decode it
# # if 'application/json' in response.headers.get('Content-Type', ''):
# #     try:
# #         response_data = response.json()
# #         print('JSON response:', response_data)
# #     except ValueError as e:
# #         print('Decoding JSON has failed:', e)
# # else:
# #     print('Response is not in JSON format.')
print(len([{"video_id":"ukzFI9rgwfU","title":"Machine Learning | What Is Machine Learning? | Introduction To Machine Learning | 2021 | Simplilearn","description":"Professional Certificate Course In AI And Machine Learning by IIT Kanpur (India Only): ..."},{"video_id":"7eh4d6sabA0","title":"Python Machine Learning Tutorial (Data Science)","description":"Build your first AI project with Python! This beginner-friendly machine learning tutorial uses real-world data. Subscribe for ..."},{"video_id":"FniLzpaSFGk","title":"NumPy and Pandas Tutorial | Data Analysis With Python | Python Tutorial for Beginners | Simplilearn","description":"Purdue Post Graduate Program In AI And Machine Learning: ..."},{"video_id":"6GUZXDef2U0","title":"Seaborn Tutorial : Seaborn Full Course","description":"New Data Science / Machine Learning Video Everyday at 1 PM EST!!! [ Click Notification Bell ] This video provides complete ..."},{"video_id":"ukzFI9rgwfU","title":"Machine Learning | What Is Machine Learning? | Introduction To Machine Learning | 2021 | Simplilearn","description":"Professional Certificate Course In AI And Machine Learning by IIT Kanpur (India Only): ..."},{"video_id":"D6gtZrsYi6c","title":"Unsupervised Learning | Unsupervised Learning Algorithms | Machine Learning Tutorial | Simplilearn","description":"Purdue Post Graduate Program In AI And Machine Learning: ..."},{"video_id":"0Lt9w-BxKFQ","title":"Scikit-Learn Tutorial | Machine Learning With Scikit-Learn | Sklearn | Python Tutorial | Simplilearn","description":"Professional Certificate Course In AI And Machine Learning by IIT Kanpur (India Only): ..."},{"video_id":"b0L47BeklTE","title":"Linear Regression Python Sklearn [FROM SCRATCH]","description":"linear regression python sklearn. In this video we will learn how to use SkLearn for linear regression in Python. You can follow ..."},{"video_id":"bSXIbCZNBw0","title":"Step by Step Tutorial on Logistic Regression in Python | sklearn |Jupyter Notebook","description":"This video tries to give you a basic understanding of logistic regression and works on a logistic regression problem from ..."},{"video_id":"PHxYNGo8NcI","title":"Machine Learning Tutorial Python - 9  Decision Tree","description":"Decision tree algorithm is used to solve classification problem in machine learning domain. In this tutorial we will solve employee ..."},{"video_id":"RtrBtAKwcxQ","title":"Machine Learning Tutorial Python - 21: Ensemble Learning - Bagging","description":"Ensemble learning is all about using multiple models to combine their prediction power to get better predictions that has low ..."},{"video_id":"tPYj3fFJGjk","title":"TensorFlow 2.0 Complete Course - Python Neural Networks for Beginners Tutorial","description":"Learn how to use TensorFlow 2.0 in this full tutorial course for beginners. This course is designed for Python programmers looking ..."},{"video_id":"tPYj3fFJGjk","title":"TensorFlow 2.0 Complete Course - Python Neural Networks for Beginners Tutorial","description":"Learn how to use TensorFlow 2.0 in this full tutorial course for beginners. This course is designed for Python programmers looking ..."}]))