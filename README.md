# Aplikasi Web Donasi Live

Platform web untuk menampilkan progres donasi secara real-time dengan desain Islami dan ornamen Dayak Kalimantan Timur, dilengkapi panel admin untuk pengelolaan data.

> **⚠️ Status Project**: Dalam tahap development aktif. Lihat [Issues](../../issues) untuk progress terkini.

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/username/donation-app.git
cd donation-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local dengan konfigurasi Firebase Anda

# Start development server
npm run dev
```

🌐 **Live Demo**: [https://donation-app.web.app](https://donation-app.web.app)  
📚 **Documentation**: [Wiki](../../wiki)  
🐛 **Report Bug**: [Create Issue](../../issues/new?template=bug_report.md)  
💡 **Request Feature**: [Create Issue](../../issues/new?template=feature_request.md)

## 📋 Daftar Isi

- [Quick Start](#-quick-start)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Instalasi](#-instalasi)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)

## ✨ Fitur Utama

### Frontend Publik
- 📊 **Display Total Donasi Real-time** - Menampilkan akumulasi donasi dengan update otomatis
- 🏆 **Ranking Top 10 Kelompok** - Toggle untuk melihat kelompok dengan donasi terbesar
- 📱 **Grid 83 Kelompok** - Menampilkan semua kelompok donasi dalam layout responsif
- 📈 **Progress Bar Visual** - Menunjukkan pencapaian terhadap target donasi
- 🎨 **Desain Islami & Ornamen Dayak** - Tema visual yang sesuai dengan kultur lokal

### Panel Admin
- 🔐 **Sistem Autentikasi** - Login aman dengan Firebase Auth
- ➕ **Input Donasi Manual** - Form untuk mencatat donasi baru
- 🎯 **Setting Target Donasi** - Pengaturan target penggalangan dana
- 📊 **Integrasi Google Sheets** - Sinkronisasi data dari spreadsheet
- 📝 **Audit Log** - Riwayat perubahan data untuk transparansi

### Sistem
- ⚡ **Real-time Updates** - Data ter-update tanpa refresh halaman
- 🏗️ **Architecture Modern** - Firebase backend dengan React frontend
- 📱 **Responsive Design** - Optimal di desktop, tablet, dan mobile
- 🔒 **Security** - Firebase Security Rules dan validasi server-side

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: React Hooks + Context

### Backend
- **Platform**: Firebase
- **Functions**: Cloud Functions (Node.js)
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting

### Development Tools
- **Build Tool**: Vite
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library + Cypress
- **CI/CD**: GitHub Actions

## 📋 Prerequisite

Pastikan sistem Anda memiliki:

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 atau **yarn** >= 1.22.0
- **Git** >= 2.30.0
- **Firebase CLI** >= 12.0.0

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/username/donation-app.git
cd donation-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit dengan konfigurasi Firebase Anda
nano .env.local
```

### 4. Firebase Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login ke Firebase
firebase login

# Inisialisasi project
firebase use --add
```

<details>
<summary>📋 Environment Variables</summary>

Buat file `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Sheets API (Optional)
GOOGLE_SHEETS_API_KEY=your_sheets_api_key
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com

# Application Settings
NEXT_PUBLIC_APP_NAME=Aplikasi Donasi Live
NEXT_PUBLIC_DEFAULT_TARGET=100000000
```

</details>

## 💻 Development

### Menjalankan Development Server

```bash
# Frontend (Next.js)
npm run dev

# Firebase Functions (terminal terpisah)
cd functions
npm run serve

# Firebase Emulator Suite (optional)
firebase emulators:start
```

Aplikasi akan berjalan di:
- **Frontend**: http://localhost:3000
- **Functions**: http://localhost:5001
- **Firestore**: http://localhost:8080

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Generate coverage report

# Firebase
npm run deploy       # Deploy to Firebase
npm run deploy:functions # Deploy functions only
npm run deploy:hosting   # Deploy hosting only
```

### Project Structure

```
donation-app/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   ├── admin/          # Admin panel components
│   │   └── public/         # Public page components
│   ├── pages/              # Next.js pages
│   ├── lib/                # Utilities & configurations
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles
├── functions/              # Firebase Cloud Functions
├── public/                 # Static assets
├── docs/                   # Documentation
├── tests/                  # Test files
└── .firebase/             # Firebase configuration
```

## 🚀 Deployment

### 1. Build Production

```bash
npm run build
```

### 2. Deploy ke Firebase

```bash
# Deploy semua
firebase deploy

# Deploy hosting saja
firebase deploy --only hosting

# Deploy functions saja
firebase deploy --only functions
```

### 3. Setup Custom Domain (Optional)

```bash
firebase hosting:channel:deploy preview --expires 7d
firebase hosting:channel:clone live preview
```

## 📚 API Documentation

### Endpoints

#### Public API

```typescript
GET /api/donations/total
// Response: { total: number, lastUpdated: string }

GET /api/donations/groups
// Response: { groups: Group[], ranking: Group[] }

GET /api/donations/progress
// Response: { current: number, target: number, percentage: number }
```

#### Admin API (Requires Authentication)

```typescript
POST /api/admin/donations
// Body: { groupId: string, amount: number, notes?: string }
// Response: { success: boolean, data: Donation }

PUT /api/admin/target
// Body: { amount: number }
// Response: { success: boolean, data: Target }

POST /api/admin/sync-sheets
// Body: { sheetsUrl: string }
// Response: { success: boolean, imported: number, errors: string[] }
```

### Firestore Collections

Lihat [Database Schema](#-database-schema) untuk detail struktur data.

## 🗄️ Database Schema

### Collections Structure

```typescript
// donations
interface Donation {
  id: string;
  groupId: string;
  groupName: string;
  amount: number;
  createdAt: Timestamp;
  createdBy: string;
  createdByEmail: string;
  metadata: {
    source: 'manual' | 'google_sheets';
    notes?: string;
  };
}

// groups
interface Group {
  id: string;
  name: string;
  description?: string;
  totalDonations: number;
  donationCount: number;
  lastUpdated: Timestamp;
  createdAt: Timestamp;
  isActive: boolean;
}

// targets
interface Target {
  id: string;
  amount: number;
  periodStart: Timestamp;
  periodEnd: Timestamp;
  currentTotal: number;
  lastCalculated: Timestamp;
  createdAt: Timestamp;
  createdBy: string;
}

// admins
interface Admin {
  id: string; // Firebase Auth UID
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin';
  permissions: string[];
  lastLogin: Timestamp;
  createdAt: Timestamp;
  isActive: boolean;
}
```

### Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /donations/{document} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }
    
    match /groups/{document} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }
    
    // Admin only
    match /admins/{document} {
      allow read, write: if request.auth != null && isSuperAdmin();
    }
    
    // Helper functions
    function isAdmin() {
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    function isSuperAdmin() {
      return isAdmin() && 
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'super_admin';
    }
  }
}
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Integration Tests

```bash
# Start Firebase emulators
firebase emulators:start

# Run integration tests
npm run test:integration
```

### E2E Tests

```bash
# Run Cypress tests
npm run test:e2e

# Open Cypress UI
npm run cypress:open
```

### Test Structure

```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
│   ├── api/
│   └── firebase/
└── e2e/
    ├── admin/
    └── public/
```

## 🤝 Contributing

### Development Workflow

1. **Fork** repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

### Code Standards

- Gunakan **TypeScript** untuk type safety
- Follow **ESLint** dan **Prettier** configuration
- Write **unit tests** untuk functions dan components
- Update **documentation** jika diperlukan
- Gunakan **conventional commits** format

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(admin): add google sheets integration

- Add sheets API service
- Implement data mapping
- Add error handling for API limits

Closes #123
```

## 🗺️ Roadmap

### Phase 1: MVP ✅
- [x] Halaman utama dengan total donasi
- [x] Ranking Top 10 kelompok  
- [x] Panel admin basic
- [x] Input donasi manual
- [x] Real-time updates

### Phase 2: Enhancement 🚧
- [ ] Integrasi Google Sheets API [#12](../../issues/12)
- [ ] Target donasi & progress bar [#15](../../issues/15)
- [ ] Search & filter kelompok [#18](../../issues/18)
- [ ] Export laporan (PDF/Excel) [#21](../../issues/21)

### Phase 3: Polish 📋
- [ ] Animasi & micro-interactions [#25](../../issues/25)
- [ ] 2FA authentication [#28](../../issues/28)
- [ ] Dashboard analytics [#31](../../issues/31)
- [ ] PWA support [#34](../../issues/34)

Lihat [Projects](../../projects) untuk detail timeline dan [Milestones](../../milestones) untuk release planning.

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/username/donation-app)
![GitHub contributors](https://img.shields.io/github/contributors/username/donation-app)
![GitHub last commit](https://img.shields.io/github/last-commit/username/donation-app)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/username/donation-app)

## 🐛 Known Issues

Lihat [Issues](../../issues) untuk bug reports dan feature requests terkini.

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

## 🤝 Contributors

Thanks to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/username1"><img src="https://avatars.githubusercontent.com/u/12345?v=4" width="100px;" alt=""/><br /><sub><b>Nama Developer 1</b></sub></a><br /><a href="https://github.com/username/donation-app/commits?author=username1" title="Code">💻</a> <a href="#design-username1" title="Design">🎨</a></td>
      <td align="center"><a href="https://github.com/username2"><img src="https://avatars.githubusercontent.com/u/67890?v=4" width="100px;" alt=""/><br /><sub><b>Nama Developer 2</b></sub></a><br /><a href="https://github.com/username/donation-app/commits?author=username2" title="Code">💻</a> <a href="#maintenance-username2" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) untuk backend infrastructure
- [Vercel](https://vercel.com/) untuk deployment platform  
- [Tailwind CSS](https://tailwindcss.com/) untuk CSS framework
- [Framer Motion](https://www.framer.com/motion/) untuk animation library
- Komunitas open source yang telah berkontribusi

## 📞 Support & Community

- 💬 **Discussions**: [GitHub Discussions](../../discussions)
- 🐛 **Issues**: [Bug Reports](../../issues)
- 📧 **Email**: support@donasi-app.com
- 📱 **Telegram**: [@donasi-app-support](https://t.me/donasi_app_support)

---

<div align="center">

**⭐ Jangan lupa berikan star jika project ini membantu! ⭐**

[📝 Report Bug](../../issues/new?template=bug_report.md) • [🚀 Request Feature](../../issues/new?template=feature_request.md) • [💬 Ask Question](../../discussions/new)

**Dibuat dengan ❤️ untuk transparansi donasi di Kalimantan Timur**

</div>
