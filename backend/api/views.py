"""
Views for the Portfolio API.

Permission model:
  - Public  (GET):  IsAuthenticatedOrReadOnly → any unauthenticated user can read
  - Admin   (POST/PUT/PATCH/DELETE): IsAuthenticated → requires Bearer JWT token
  - Contact (POST): AllowAny → anyone can submit the contact form
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Project, Skill, Experience, Certification, Message, SiteSettings, About
from .serializers import (
    ProjectSerializer,
    ProjectDetailSerializer,
    SkillSerializer,
    SkillsGroupedSerializer,
    ExperienceSerializer,
    CertificationSerializer,
    MessageSerializer,
    MessageCreateSerializer,
    SiteSettingsSerializer,
    AboutSerializer,
)


# ─── Custom Permission ────────────────────────────────────────────────────────
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allow GET/HEAD/OPTIONS for everyone.
    Allow POST/PUT/PATCH/DELETE only for authenticated users (JWT).
    NOTE: We check is_authenticated only — NOT is_staff — so any user
    with a valid JWT token can perform admin CRUD.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated)


# ─────────────────────────────────────────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────────────────────────────────────────
class AdminLoginView(TokenObtainPairView):
    """
    POST /api/auth/login/
    Body: { "username": "admin", "password": "..." }
    Returns: { "access": "<jwt>", "refresh": "<jwt>" }
    """
    pass   # TokenObtainPairView handles everything


# ─────────────────────────────────────────────────────────────────────────────
# PROJECTS
# ─────────────────────────────────────────────────────────────────────────────
class ProjectListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/projects/           → all visible projects (public)
    POST /api/projects/           → create project (authenticated admin)
    """
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = Project.objects.all()
        # Public users only see visible projects
        if not (self.request.user and self.request.user.is_authenticated):
            qs = qs.filter(visible=True)
        # Optional filter by category: ?category=ML+%26+AI
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/projects/<id>/    (public)
    PUT    /api/projects/<id>/    (authenticated admin)
    PATCH  /api/projects/<id>/    (authenticated admin)
    DELETE /api/projects/<id>/    (authenticated admin)
    """
    queryset = Project.objects.all()
    serializer_class = ProjectDetailSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class ProjectBySlugView(generics.RetrieveUpdateAPIView):
    serializer_class = ProjectDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Project.objects.all()

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


# ─────────────────────────────────────────────────────────────────────────────
# SKILLS
# ─────────────────────────────────────────────────────────────────────────────
class SkillsGroupedView(APIView):
    """
    GET /api/skills/
    Returns skills grouped by category — matches the React component's data shape.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        skills = Skill.objects.all()
        serializer = SkillsGroupedSerializer()
        return Response(serializer.to_representation(skills))


class SkillListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/skills/manage/      → flat list (admin)
    POST /api/skills/manage/      → create skill (admin)
    """
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]


class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET / PUT / PATCH / DELETE /api/skills/manage/<id>/  (admin)
    """
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]


# ─────────────────────────────────────────────────────────────────────────────
# EXPERIENCE
# ─────────────────────────────────────────────────────────────────────────────
class ExperienceListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/experience/         (public)
    POST /api/experience/         (authenticated admin)
    """
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class ExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET / PUT / PATCH / DELETE /api/experience/<id>/"""
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


# ─────────────────────────────────────────────────────────────────────────────
# CERTIFICATIONS
# ─────────────────────────────────────────────────────────────────────────────
class CertificationListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/certifications/     (public)
    POST /api/certifications/     (authenticated admin)
    """
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class CertificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET / PUT / PATCH / DELETE /api/certifications/<id>/"""
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


# ─────────────────────────────────────────────────────────────────────────────
# MESSAGES (Contact Form)
# ─────────────────────────────────────────────────────────────────────────────
class MessageCreateView(generics.CreateAPIView):
    """
    POST /api/messages/           → anyone can submit
    """
    queryset = Message.objects.all()
    serializer_class = MessageCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {'detail': 'Message sent successfully. I will get back to you soon!'},
            status=status.HTTP_201_CREATED
        )


class MessageListView(generics.ListAPIView):
    """
    GET /api/messages/admin/      → admin only — view all messages
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]


class MessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    PATCH /api/messages/admin/<id>/  → mark as read (admin)
    DELETE /api/messages/admin/<id>/ → delete (admin)
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]


# ─────────────────────────────────────────────────────────────────────────────
# SITE SETTINGS
# ─────────────────────────────────────────────────────────────────────────────
class SiteSettingsView(APIView):
    """
    GET   /api/settings/          → public — section visibility flags
    PATCH /api/settings/          → admin — update section visibility
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get(self, request):
        settings = SiteSettings.get_solo()
        serializer = SiteSettingsSerializer(settings)
        return Response(serializer.data)

    def patch(self, request):
        settings = SiteSettings.get_solo()
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ─────────────────────────────────────────────────────────────────────────────
# ABOUT
# ─────────────────────────────────────────────────────────────────────────────
class AboutView(APIView):
    """
    GET  /api/about/   → public — personal info for the About section
    PUT  /api/about/   → admin — update personal info
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get(self, request):
        about = About.get_solo()
        serializer = AboutSerializer(about)
        return Response(serializer.data)

    def put(self, request):
        about = About.get_solo()
        serializer = AboutSerializer(about, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def patch(self, request):
        about = About.get_solo()
        serializer = AboutSerializer(about, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
