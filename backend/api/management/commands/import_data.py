import json
from django.core.management.base import BaseCommand
from api.models import Experience

class Command(BaseCommand):
    help = 'Imports initial Experience and Education data'

    def handle(self, *args, **options):
        experiences = [
            {
                "role": "Data Analyst Intern",
                "company": "Codesoft Private Limited",
                "duration": "Jun 2024 - Aug 2024",
                "exp_type": "internship",
                "description": [
                    "Performed exploratory data analysis on large datasets",
                    "Built automated reporting dashboards",
                    "Executed data cleaning and preprocessing",
                    "Created strategic insights reports"
                ],
                "tools": ["Python", "Pandas", "NumPy", "SQL", "Excel", "Matplotlib", "Seaborn"]
            },
            {
                "role": "Web Development Intern",
                "company": "Zidio Development",
                "duration": "Jan 2024 - Mar 2024",
                "exp_type": "internship",
                "description": [
                    "Developed responsive frontend components",
                    "Built pixel-perfect UI from Figma mockups",
                    "Collaborated using Git/GitHub workflow",
                    "Implemented mobile-first responsive designs"
                ],
                "tools": ["HTML", "CSS", "JavaScript", "React", "Git", "Bootstrap"]
            }
        ]

        education = [
            {
                "role": "B.E. Computer Science",
                "company": "Babasaheb Naik College of Engineering",
                "duration": "2021 - 2025",
                "exp_type": "education",
                "description": [
                    "Data Science & Machine Learning Specialization",
                    "CGPA: 7.5/10",
                    "Published research paper in IJISRT"
                ],
                "tools": ["Python", "ML", "Data Science", "Java"]
            }
        ]

        for item in experiences + education:
            exp, created = Experience.objects.get_or_create(
                role=item['role'],
                company=item['company'],
                defaults={
                    'duration': item['duration'],
                    'exp_type': item['exp_type'],
                    'description': item['description'],
                    'tools': item['tools']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created: {exp.role} at {exp.company}"))
            else:
                self.stdout.write(self.style.WARNING(f"Already exists: {exp.role} at {exp.company}"))

        self.stdout.write(self.style.SUCCESS('Successfully populated experience and education data!'))
