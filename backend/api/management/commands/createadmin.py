from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create admin superuser automatically'

    def handle(self, *args, **options):
        username = 'admin'
        password = 'Admin@123'
        email = 'rohitranveer358@gmail.com'

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(
                    f'User "{username}" already exists'
                )
            )
        else:
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