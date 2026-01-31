
Estructura de SmartatTasks

/SmartatTasks
│
├── /docs
│     ├── /assets
│     │   ├── /css
│     │   │   ├── styles.css
│     │   │   └── theme.css (Temas de index ya configurado)
│     │   ├── /icons
│     │   │   ├── icon-192.png (logo app) 
│     │   │   └── icon-512.png (igual logo app)
│     │   └── /js
│     │       ├── app.js (app se encarga de las peticiones backend)
│     │       ├── charts.js ← (futuro V2)
│     │       ├── storage.js 
│     │       ├── supabase.js
│     │       ├── auth.js 
│     │       ├── ui.js (se ecarga delo visual en la app, pinta las peticiones del usuario) toastManager
│     │       │
│     │       ├── /ui
│     │       │
│     │       ├── /scheduler
│     │       │   ├── scheduler.js       ← lógica de fechas y cálculos
│     │       │   ├── reminders.js       ← notificaciones
│     │       │   └── repeat.engine.js   ← (futuro V2)
│     │       │
│     │       │
│     │       ├── /modals
│     │       │   ├── /warning_messages
│     │       │   │   └── warningMessages.js
│     │       │   ├── modals.js
│     │       │   └── scrollModals.js
│     │       │ 
│     │       ├── /overlayManager
│     │       │   └── overlayManager.js
│     │       │ 
│     │       ├── /security
│     │       │   └── inputSanitizer.js
│     │       │
│     │       ├── /themeManager
│     │       │   ├── theme.helpers.js
│     │       │   ├── theme.js
│     │       │   ├── theme.orchestrator.js
│     │       │   └── theme.core.js
│     │       │ 
│     │       └── /toastManager
│     │           ├── /sunsSystem
│     │           │   ├── errorMsg.wav
│     │           │   ├── warning.mp3
│     │           │   └── succes.mp3
│     │           ├── haptic.js
│     │           ├── sound.js
│     │           └── toast.js
│     │ 
│     ├── /pages
│     │   ├── /autentication
│     │   │   ├── login.html
│     │   │   ├── signup.html
│     │   │   ├── reset-password.html
│     │   │   └── recover.html
│     │   │ 
│     │   ├──sttings.html
│     │   └──stats.html
│     │
│     ├── index.html 
│     ├── ofiline.html
│     ├── manifest.json
│     └── sw.js 
│     
├── .env (Aún no tiene nada)
│  
├── .gitignore (ya comfigurado par .env) 
│ 
└── README

