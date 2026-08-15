import requests
import json

url = 'http://localhost:8000/upload-video'
files = {'file': ('test_video.mp4', open('test_video.mp4', 'rb'), 'video/mp4')}

try:
    response = requests.post(url, files=files)
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f'Error: {e}')
