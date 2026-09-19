# 💻 CodeConnect — Frontend Web Application

A modern, responsive, type-safe developer networking and snippet-sharing platform built with **React**, **TypeScript**, and **CSS Modules/Tailwind**. CodeConnect enables engineers to publish code snippets, engage in peer reviews, analyze developer engagement metrics, and discover projects across multiple programming ecosystems.

---

## ✨ Key Features & User Interface

- **🏠 Interactive Home & Feed**: Curated trending code snippets with syntax highlighting, tag filters, and engagement counters.
- **🔍 Explore & Search**: Real-time filtering by programming language (Python, JS, TS, C++, Go, Java, Rust) and search queries.
- **📝 Code Snippet Studio**: Create, edit, and publish rich code snippets with language selection and markdown descriptions.
- **💬 Snippet Detail & Peer Discussions**: Syntax-highlighted code viewer with threaded comments and copy-to-clipboard functionality.
- **📊 Developer Analytics Dashboard**: View snippet impression statistics, bookmark counts, and community engagement charts.
- **👤 Developer Profiles**: Showcase bio, active repositories, published snippets, and social handles.
- **🔐 Auth & Route Guards**: Context-driven JWT authentication handling login, registration, and persistent user sessions.

---

## 🏗️ Application Architecture

```
code-connect-frontend/
├── public/                 # Static assets & index.html
└── src/
    ├── components/         # Reusable UI widgets (Navbar, Cards, SnippetEditor)
    ├── context/            # AuthContext & global state providers
    ├── pages/              # Application Routes
    │   ├── HomePage.tsx          # Main community feed
    │   ├── ExplorePage.tsx       # Snippet discovery & filters
    │   ├── CreateSnippetPage.tsx # Code publishing editor
    │   ├── SnippetDetailPage.tsx # Single snippet view & comments
    │   ├── AnalyticsPage.tsx     # Performance analytics & metrics
    │   ├── ProfilePage.tsx       # Developer profile & portfolio
    │   ├── LoginPage.tsx         # User authentication
    │   └── RegisterPage.tsx      # User registration
    ├── services/           # Axios / REST API communication layer
    ├── App.tsx             # Route definitions & layout wrappers
    └── index.tsx           # React DOM root mounting
```

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Modern CSS3 / Flexbox & CSS Grid
- **Icons & UI**: Lucide Icons / React Icons
- **State Management**: React Context API + Custom Hooks
- **HTTP Client**: Axios / Fetch API

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16 or higher)
- Running instance of [code-connect-backend](https://github.com/revanthbaspally6-cell/code-connect-backend)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/revanthbaspally6-cell/code-connect-frontend.git
cd code-connect-frontend

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run the Development Server
```bash
npm start
```
The application will launch at [`http://localhost:3000`](http://localhost:3000).

---

## 👨‍💻 Author
- **Revanth Baspally** — [GitHub Profile](https://github.com/revanthbaspally6-cell)
