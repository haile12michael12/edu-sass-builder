# EduSaaS Studio

EduSaaS Studio is a comprehensive Educational SaaS platform built with modern technologies to provide schools, teachers, and students with powerful tools for online learning and administration.

## Project Structure

```
EduSaaS-Studio/
│
├── backend/                     # Laravel 11 (API + SaaS core logic)
│   ├── app/
│   │   ├── Console/
│   │   ├── Exceptions/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Auth/
│   │   │   │   ├── SaaS/
│   │   │   │   ├── Admin/
│   │   │   │   ├── Student/
│   │   │   │   └── Teacher/
│   │   │   ├── Middleware/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── School.php
│   │   │   ├── Course.php
│   │   │   ├── Assignment.php
│   │   │   ├── Payment.php
│   │   │   └── Subscription.php
│   │   ├── Services/
│   │   │   ├── AI/
│   │   │   │   ├── CourseGenerator.php
│   │   │   │   ├── ChatTutor.php
│   │   │   │   └── ReportGenerator.php
│   │   │   ├── Payment/
│   │   │   │   ├── TelebirrService.php
│   │   │   │   ├── ChapaService.php
│   │   │   └── Notification/
│   │   │       ├── TelegramBot.php
│   │   │       └── SMSNotifier.php
│   │   └── Traits/
│   │
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/
│   │   ├── api.php
│   │   ├── tenant.php
│   │   └── web.php
│   ├── tests/
│   ├── storage/
│   ├── composer.json
│   └── artisan
│
├── frontend/                    # Next.js 15 (React-based SaaS dashboard)
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   │   ├── admin/
│   │   │   │   ├── teacher/
│   │   │   │   ├── student/
│   │   │   │   └── parent/
│   │   │   ├── builder/        # Drag-and-drop school app builder
│   │   │   ├── auth/
│   │   │   ├── settings/
│   │   │   ├── analytics/
│   │   │   └── ai-assistant/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── ui/
│   │   │   ├── charts/
│   │   │   └── forms/
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── apiClient.ts
│   │   │   ├── auth.ts
│   │   │   └── i18n.ts
│   │   ├── pages/
│   │   └── styles/
│   ├── public/
│   ├── tailwind.config.js
│   └── package.json
│
├── ai-services/                 # Microservices (Python/FastAPI)
│   ├── course_generator/
│   │   ├── main.py
│   │   ├── utils/
│   │   └── models/
│   ├── chat_tutor/
│   ├── summarizer/
│   ├── translator/
│   ├── requirements.txt
│   └── Dockerfile
│
├── docs/                        # Documentation, architecture, and API specs
│   ├── API_SPEC.yaml
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── README.md
│
├── devops/
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   └── nginx.conf
│   ├── ci-cd/
│   │   ├── github-actions.yml
│   │   ├── deploy.sh
│   │   └── tests.yml
│   ├── monitoring/
│   │   ├── prometheus.yml
│   │   └── grafana-dashboard.json
│   └── k8s/
│       ├── backend-deployment.yaml
│       ├── frontend-deployment.yaml
│       └── ai-microservices.yaml
│
└── README.md
```

## Technologies Used

- **Backend**: Laravel 11, PHP 8.2+
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **AI Services**: Python 3.9+, FastAPI
- **Database**: MySQL 8.0+ with multi-tenancy support
- **Infrastructure**: Docker, Kubernetes, GitHub Actions
- **Monitoring**: Prometheus, Grafana
- **Payment Gateways**: Telebirr, Chapa

## Features

### Core Functionality
- Multi-tenant SaaS architecture
- School management system
- Course creation and management
- Assignment distribution and grading
- Student progress tracking
- Subscription and payment management

### AI-Powered Features
- Automated course content generation
- AI chat tutor for students
- Intelligent report generation
- Content summarization
- Language translation

### Administrative Tools
- Drag-and-drop school app builder
- Analytics dashboard
- User role management (Admin, Teacher, Student, Parent)
- Notification system (Telegram, SMS)

## Getting Started

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Python 3.9+
- MySQL 8.0+
- Docker (optional but recommended)

### Installation
1. Clone the repository
2. Set up the backend (Laravel)
3. Set up the frontend (Next.js)
4. Set up AI microservices (Python/FastAPI)
5. Configure environment variables
6. Run database migrations
7. Start the services

## Deployment

The project includes comprehensive DevOps configurations for:
- Docker containerization
- Kubernetes deployments
- CI/CD pipelines with GitHub Actions
- Monitoring with Prometheus and Grafana

## Documentation

Detailed documentation can be found in the [docs](docs/) directory:
- [API Specification](docs/API_SPEC.yaml)
- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

## Contributing

We welcome contributions! Please see our contributing guidelines for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue or contact the development team.