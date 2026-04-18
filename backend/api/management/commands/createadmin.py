from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os

class Command(BaseCommand):
    help = 'Create admin superuser automatically'

    def handle(self, *args, **options):
        username = os.environ.get('ADMIN_USERNAME', 'admin')
        password = os.environ.get('ADMIN_PASSWORD', 'Admin@123')
        email = os.environ.get(
            'ADMIN_EMAIL', 
            'rohitranveer358@gmail.com'
        )

        # Delete existing and recreate
        User.objects.filter(username=username).delete()
        
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        self.stdout.write(
            self.style.SUCCESS(
                f'✅ Superuser "{username}" created!'
            )
        )