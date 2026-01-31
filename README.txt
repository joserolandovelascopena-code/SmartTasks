
Estructura de SmartatTasks

/SmartatTasks
│
├── /docs
│     ├── /assets
│     │   ├── /css
│     │   │   ├── /app-css
│     │   │   │   ├── styles.css
│     │   │   │   ├── style2.css
│     │   │   │   └── styles3.css
│     │   │   │ 
│     │   │   └── /autentication-css
│     │   │       ├── login.css
│     │   │       ├── recover.css 
│     │   │       ├── resetPass.css
│     │   │       ├── signup.css
│     │   │       └── verify.css
│     │   │  
│     │   ├── /icons
│     │   │   ├── icon-192.png (logo app) 
│     │   │   └── icon-512.png (igual logo app)
│     │   │
│     │   └── /js
│     │       ├── main.js (entrada del DOM)
│     │       ├── charts.js ← (futuro V2)
│     │       ├── storage.js 
│     │       ├── supabase.js
│     │       ├── auth.js 
│     │       ├── ui.js (esta ui estoy modulado en /ui) en proceso de migración
│     │       │
│     │       ├── /core  
│     │       │   ├── app.js (esta app esta en proceso de migración) aqui esta todo ahora mismo( vamos apasarlo)
│     │       │   ├── auth.service.js
│     │       │   ├── scheduler.service.js
│     │       │   ├── ui.selectors.js
│     │       │   └── task.service.js
│     │       │
│     │       ├── /ui
│     │       │   ├── /templates 
│     │       │   │   ├── empty.states.js
│     │       │   │   ├── modals.templates.js
│     │       │   │   ├── task.card.js
│     │       │   │   └── task.details.js
│     │       │   │  
│     │       │   ├── events.js
│     │       │   ├── render.details.js
│     │       │   ├── render.tasks.js
│     │       │   ├── ui.selectors.js
│     │       │   └── TaskCalendar.js
│     │       │
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
│     │           │ 
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

