import json
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from api.models import Project

class Command(BaseCommand):
    help = 'Populate the database with case study data'

    def handle(self, *args, **kwargs):
        projects_data = [
            {
                "title": "Vendor Connect India",
                "slug": "vendor-connect-india",
                "tagline": "Hyper-local B2B/B2C marketplace for street vendors",
                "problem_statement": "Street vendors across India lack digital presence. Customers cannot discover local vendors, compare products, or make secure payments.",
                "target_audience": "Small-scale vendors (food stalls, repair shops, artisans) and local customers who want to discover nearby businesses.",
                "tech_decisions": [
                    {
                    "question": "Why MongoDB over PostgreSQL?",
                    "answer": "Vendor profiles have variable schemas. MongoDB flexible document model handles this naturally."
                    },
                    {
                    "question": "Why Leaflet over Google Maps?",
                    "answer": "Zero API costs. OpenStreetMap tiles provide same capabilities without per-request billing."
                    },
                    {
                    "question": "Why Razorpay?",
                    "answer": "Best UPI support for Indian users with Test Mode for development without real money processing."
                    }
                ],
                "key_features": [
                    {
                    "icon": "🗺️",
                    "title": "Interactive Vendor Map",
                    "description": "Real-time Leaflet map with marker clustering and geo-filtered search by radius"
                    },
                    {
                    "icon": "💳",
                    "title": "Secure Payments",
                    "description": "Razorpay integration with webhook-based order status updates and refund handling"
                    },
                    {
                    "icon": "🔐",
                    "title": "JWT Authentication",
                    "description": "Token-based auth with role-based permissions for vendor vs customer"
                    },
                    {
                    "icon": "🐳",
                    "title": "Dockerised Deploy",
                    "description": "Multi-container Docker Compose — one command to deploy entire application"
                    }
                ],
                "challenges": [
                    {
                    "problem": "Map performance degrades with 500+ markers",
                    "solution": "Implemented MarkerClusterGroup plugin and debounced map-bounds API calls for viewport filtering"
                    },
                    {
                    "problem": "Razorpay webhook verification failing locally",
                    "solution": "Built mock payment simulation for development mode with conditional environment logic"
                    },
                    {
                    "problem": "MongoDB geo queries were slow at 800ms",
                    "solution": "Created 2dsphere indexes with $near operator reducing query time to under 50ms"
                    }
                ],
                "metrics": [
                    { "value": "50+", "label": "Vendors Onboarded" },
                    { "value": "<50ms", "label": "Geo-query Speed" },
                    { "value": "100%", "label": "Mobile Responsive" },
                    { "value": "1-cmd", "label": "Docker Deploy" }
                ],
                "roadmap": [
                    "Real-time order tracking with WebSocket",
                    "Vendor analytics dashboard with revenue charts",
                    "Multi-language support (Hindi, Marathi, Telugu)",
                    "AWS ECS deployment with CloudFront CDN"
                ]
            },
            {
                "title": "Multi-Tenant SaaS Expense Manager",
                "slug": "multi-tenant-saas-expense-manager",
                "tagline": "Enterprise expense management with tenant isolation",
                "problem_statement": "Organizations need separate expense tracking systems that don't share data. Building multi-tenant from scratch is complex and error-prone.",
                "tech_decisions": [
                    {
                    "question": "Why PostgreSQL schema isolation?",
                    "answer": "Schema-based isolation gives complete data separation per tenant with zero cross-contamination risk"
                    },
                    {
                    "question": "Why Celery + Redis?",
                    "answer": "Expense reports and email reminders are async tasks. Celery handles scheduling, Redis acts as broker"
                    }
                ],
                "key_features": [
                    {
                    "icon": "🏢",
                    "title": "Multi-Tenant Architecture",
                    "description": "PostgreSQL schema isolation supporting 50+ concurrent organizations"
                    },
                    {
                    "icon": "📊",
                    "title": "Real-time Dashboards",
                    "description": "Budget tracking with live charts deployed on Vercel with instant updates"
                    },
                    {
                    "icon": "⚡",
                    "title": "Async Task Pipeline",
                    "description": "Celery + Redis for scheduled reports, reminders and export generation"
                    },
                    {
                    "icon": "🔒",
                    "title": "RBAC Security",
                    "description": "Role-based access control with 15+ endpoints and per-tenant middleware"
                    }
                ],
                "challenges": [
                    {
                    "problem": "Data leakage between tenants in shared DB",
                    "solution": "Implemented pytest integration tests validating zero data leakage across 50+ tenant schemas"
                    },
                    {
                    "problem": "Celery tasks timing out on large exports",
                    "solution": "Added task chunking and progress tracking with Redis pub/sub for real-time status updates"
                    }
                ],
                "metrics": [
                    { "value": "50+", "label": "Concurrent Orgs" },
                    { "value": "15+", "label": "API Endpoints" },
                    { "value": "0", "label": "Data Leaks" },
                    { "value": "60%", "label": "Time Saved" }
                ]
            },
            {
                "title": "YouTube Comment Sentiment Analysis",
                "slug": "youtube-comment-sentiment-analysis",
                "tagline": "CNN-based NLP classifier for YouTube comments",
                "problem_statement": "Content creators and brands cannot efficiently analyze audience sentiment from thousands of YouTube comments manually.",
                "key_features": [
                    {
                    "icon": "🧠",
                    "title": "CNN NLP Model",
                    "description": "TensorFlow + Keras CNN trained on 50,000+ labeled YouTube comments achieving 85% accuracy"
                    },
                    {
                    "icon": "⚡",
                    "title": "Fast API Response",
                    "description": "Flask REST API with predictions under 200ms average response time"
                    },
                    {
                    "icon": "📝",
                    "title": "Published Research",
                    "description": "Peer-reviewed paper published in IJISRT journal DOI: IJISRT25FEB1017"
                    }
                ],
                "metrics": [
                    { "value": "85%", "label": "Model Accuracy" },
                    { "value": "50K+", "label": "Training Comments" },
                    { "value": "<200ms", "label": "API Response" },
                    { "value": "3", "label": "Sentiment Classes" }
                ]
            },
            {
                "title": "SmartReview AI",
                "slug": "smartreview-ai",
                "tagline": "LLM-powered automated code review tool",
                "problem_statement": "Code reviews are time-consuming. Developers spend hours reviewing style, bugs, and optimizations manually across multiple languages.",
                "key_features": [
                    {
                    "icon": "🤖",
                    "title": "LLM Integration",
                    "description": "AI-powered review returning structured feedback on bugs, style violations and optimizations"
                    },
                    {
                    "icon": "📝",
                    "title": "Monaco Editor",
                    "description": "VS Code-like editor with syntax highlighting and side-by-side diff view"
                    },
                    {
                    "icon": "📄",
                    "title": "PDF Export",
                    "description": "Review history persistence in PostgreSQL with PDF export capability"
                    },
                    {
                    "icon": "⚡",
                    "title": "60% Faster Reviews",
                    "description": "Internal benchmarking shows 60% reduction in manual code review turnaround time"
                    }
                ],
                "metrics": [
                    { "value": "60%", "label": "Faster Reviews" },
                    { "value": "5+", "label": "Languages Supported" },
                    { "value": "100%", "label": "Structured Output" },
                    { "value": "∞", "label": "Review History" }
                ]
            }
        ]

        count = 0
        for pdata in projects_data:
            # Generate slug if missing
            slug = pdata.get('slug')
            if not slug:
                slug = slugify(pdata['title'])

            project, created = Project.objects.get_or_create(
                slug=slug,
                defaults={'title': pdata['title']}
            )
            
            # If the project already exists but the title is different (e.g. they created it with different slug?), 
            # actually we should update fields
            project.title = pdata.get('title', project.title)
            project.tagline = pdata.get('tagline', '')
            project.problem_statement = pdata.get('problem_statement', '')
            project.target_audience = pdata.get('target_audience', '')
            project.tech_decisions = pdata.get('tech_decisions', [])
            project.key_features = pdata.get('key_features', [])
            project.challenges = pdata.get('challenges', [])
            project.metrics = pdata.get('metrics', [])
            project.roadmap = pdata.get('roadmap', [])
            
            # ensure default lists are properly set if missing from data
            project.screenshots = pdata.get('screenshots', [])
            project.demo_video_url = pdata.get('demo_video_url', '')
            project.architecture_diagram = pdata.get('architecture_diagram', '')
            
            project.save()
            count += 1
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f'{action} case study for: {project.title}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully populated {count} projects!'))
