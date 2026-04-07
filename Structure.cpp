src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Button.jsx
│   ├── landing/
│   │   ├── Hero.jsx
│   │   ├── FeaturedBooks.jsx
│   │   ├── HowItWorks.jsx
│   │   └── Testimonials.jsx
│   └── auth/
│       ├── Login.jsx
│       └── Register.jsx
├── pages/
│   ├── LandingPage.jsx      # page publique
│   ├── Dashboard.jsx         # après connexion
│   ├── BooksList.jsx
│   ├── BookDetails.jsx
│   ├── MyRentals.jsx
│   └── Profile.jsx
├── services/
│   └── api.js                # appels axios
├── contexts/
│   └── AuthContext.jsx       # gestion auth
├── App.jsx
└── main.jsx