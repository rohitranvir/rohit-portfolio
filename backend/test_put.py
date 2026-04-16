import requests
import json

login_res = requests.post('http://localhost:8000/api/auth/login/', json={'username': 'admin', 'password': 'Admin@123'})
token = login_res.json().get('access')
headers = {'Authorization': f'Bearer {token}'}

get_res = requests.get('http://localhost:8000/api/skills/manage/', headers=headers)
skills = get_res.json()
if skills:
    skill = skills[0]
    print('Testing PUT...')
    skill_id = skill['id']
    put_res = requests.put(f'http://localhost:8000/api/skills/manage/{skill_id}/', json={'name': 'Updated', 'icon': '🔥', 'category': 'Backend'}, headers=headers)
    print(put_res.status_code, put_res.text)
else:
    print('No skills found')
