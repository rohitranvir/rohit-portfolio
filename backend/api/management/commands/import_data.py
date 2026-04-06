"""
Management command to import JSON data from the frontend into PostgreSQL.

Usage:
    python manage.py import_data
    python manage.py import_data --clear   # wipe existing data first
"""
import json
import os

from django.core.management.base import BaseCommand
from api.models import Project, Skill, Experience, Certification, SiteSettings, About


class Command(BaseCommand):
    help = 'Import portfolio data from frontend JSON files into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Delete all existing data before importing',
        )

    def handle(self, *args, **options):
        # Resolve the path to frontend/public/data/
        base = os.path.normpath(
            os.path.join(
                os.path.dirname(__file__),
                '..', '..', '..', '..', 'frontend', 'public', 'data'
            )
        )

        if not os.path.isdir(base):
            self.stderr.write(self.style.ERROR(f'Data directory not found: {base}'))
            return

        self.stdout.write(f'📂 Reading JSON files from: {base}\n')

        if options['clear']:
            Project.objects.all().delete()
            Skill.objects.all().delete()
            Experience.objects.all().delete()
            Certification.objects.all().delete()
            self.stdout.write(self.style.WARNING('🗑️  Cleared all existing data'))

        # ── 1. PROJECTS ───────────────────────────────────────────────────
        path = os.path.join(base, 'projects.json')
        if os.path.exists(path):
            with open(path, encoding='utf-8') as f:
                projects = json.load(f)
            count = 0
            for idx, p in enumerate(projects):
                _, created = Project.objects.get_or_create(
                    title=p.get('title', ''),
                    defaults={
                        'description': p.get('description', ''),
                        'short_desc': p.get('shortDesc', ''),
                        'full_desc': p.get('fullDesc', ''),
                        'category': p.get('category', 'Web Dev'),
                        'tech': p.get('tech', []),
                        'github_url': p.get('githubUrl', ''),
                        'live_url': p.get('liveUrl', ''),
                        'highlight': p.get('highlight', ''),
                        'featured': p.get('featured', False),
                        'visible': p.get('visible', True),
                        'order': idx,
                    }
                )
                if created:
                    count += 1
            self.stdout.write(self.style.SUCCESS(f'✅ Projects: {count} imported ({len(projects)} total in JSON)'))
        else:
            self.stdout.write(self.style.WARNING('⚠️  projects.json not found'))

        # ── 2. SKILLS ─────────────────────────────────────────────────────
        path = os.path.join(base, 'skills.json')
        if os.path.exists(path):
            with open(path, encoding='utf-8') as f:
                data = json.load(f)
            skills_map = data.get('skills', data)
            count = 0
            if isinstance(skills_map, dict):
                for category, items in skills_map.items():
                    for idx, s in enumerate(items):
                        _, created = Skill.objects.get_or_create(
                            name=s.get('name', ''),
                            category=category,
                            defaults={
                                'icon': s.get('icon', '💻'),
                                'order': idx,
                            }
                        )
                        if created:
                            count += 1
            else:
                for idx, s in enumerate(skills_map):
                    _, created = Skill.objects.get_or_create(
                        name=s.get('name', ''),
                        defaults={
                            'icon': s.get('icon', '💻'),
                            'category': s.get('category', 'Tools'),
                            'order': idx,
                        }
                    )
                    if created:
                        count += 1
            total = sum(len(v) for v in skills_map.values()) if isinstance(skills_map, dict) else len(skills_map)
            self.stdout.write(self.style.SUCCESS(f'✅ Skills: {count} imported ({total} total in JSON)'))
        else:
            self.stdout.write(self.style.WARNING('⚠️  skills.json not found'))

        # ── 3. EXPERIENCE ─────────────────────────────────────────────────
        path = os.path.join(base, 'experience.json')
        if os.path.exists(path):
            with open(path, encoding='utf-8') as f:
                data = json.load(f)
            experiences = data.get('experience', data) if isinstance(data, dict) else data
            count = 0
            for idx, e in enumerate(experiences):
                _, created = Experience.objects.get_or_create(
                    role=e.get('role', ''),
                    company=e.get('company', ''),
                    defaults={
                        'duration': e.get('duration', ''),
                        'exp_type': e.get('type', 'internship'),
                        'description': e.get('description', []),
                        'tools': e.get('tools', []),
                        'order': idx,
                    }
                )
                if created:
                    count += 1
            self.stdout.write(self.style.SUCCESS(f'✅ Experience: {count} imported ({len(experiences)} total in JSON)'))
        else:
            self.stdout.write(self.style.WARNING('⚠️  experience.json not found'))

        # ── 4. CERTIFICATIONS ─────────────────────────────────────────────
        path = os.path.join(base, 'certifications.json')
        if os.path.exists(path):
            with open(path, encoding='utf-8') as f:
                certs = json.load(f)
            count = 0
            for idx, c in enumerate(certs):
                _, created = Certification.objects.get_or_create(
                    name=c.get('name', ''),
                    defaults={
                        'issuer': c.get('platform', c.get('issuer', '')),
                        'date': c.get('date', ''),
                        'url': c.get('link', c.get('url', '')),
                        'order': idx,
                    }
                )
                if created:
                    count += 1
            self.stdout.write(self.style.SUCCESS(f'✅ Certifications: {count} imported ({len(certs)} total in JSON)'))
        else:
            self.stdout.write(self.style.WARNING('⚠️  certifications.json not found'))

        # ── 5. ABOUT ──────────────────────────────────────────────────────
        path = os.path.join(base, 'about.json')
        if os.path.exists(path):
            with open(path, encoding='utf-8') as f:
                about_data = json.load(f)
            about = About.get_solo()
            about.name = about_data.get('name', about.name)
            about.tagline = about_data.get('tagline', about.tagline)
            about.roles = about_data.get('roles', about.roles)
            about.availability = about_data.get('availability', about.availability)
            about.photo = about_data.get('photo', about.photo)
            about.bio = about_data.get('bio', about.bio)
            about.stats = about_data.get('stats', about.stats)
            about.info = about_data.get('info', about.info)
            about.social = about_data.get('social', about.social)
            about.save()
            self.stdout.write(self.style.SUCCESS(f'✅ About: imported for "{about.name}"'))
        else:
            self.stdout.write(self.style.WARNING('⚠️  about.json not found'))

        # ── 6. SETTINGS ──────────────────────────────────────────────────
        path = os.path.join(base, 'settings.json')
        if os.path.exists(path):
            with open(path, encoding='utf-8') as f:
                settings_data = json.load(f)
            settings = SiteSettings.get_solo()
            if 'sectionVisibility' in settings_data:
                settings.section_visibility = settings_data['sectionVisibility']
                settings.save()
            self.stdout.write(self.style.SUCCESS('✅ Settings: section visibility imported'))
        else:
            self.stdout.write(self.style.WARNING('⚠️  settings.json not found'))

        # ── SUMMARY ───────────────────────────────────────────────────────
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('🎉 All data imported successfully!'))
        self.stdout.write(f'   Projects:       {Project.objects.count()}')
        self.stdout.write(f'   Skills:         {Skill.objects.count()}')
        self.stdout.write(f'   Experience:     {Experience.objects.count()}')
        self.stdout.write(f'   Certifications: {Certification.objects.count()}')
        self.stdout.write(f'   About:          {About.objects.count()}')
