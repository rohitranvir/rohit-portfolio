import json, sys
import django

django.setup()
from api.models import Skill

with open('../frontend/public/data/skills.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for category, skills in data['skills'].items():
    for idx, skill in enumerate(skills):
        obj, created = Skill.objects.get_or_create(
            name=skill['name'],
            category=category,
            defaults={'icon': skill.get('icon', '💻'), 'order': idx}
        )
        if created:
            print(f"Created skill: {skill['name']} ({category})")
        else:
            print(f"Existing skill: {skill['name']} ({category})")

print("Finished importing skills.")
