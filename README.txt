
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
│     │       ├── charts.js (aun vacio pero la idea es para las graficas)
│     │       ├── storage.js 
│     │       ├── supabase.js
│     │       ├── auth.js 
│     │       ├── theme.js (Funcion de temas por botones de prefencia de stylo Claro, Oscuro, Sistema)
│     │       └── ui.js (se ecarga delo visual en la app, pinta las peticiones del usuario)
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
│     ├── manifest.json
│     ├── ofiline.html
│     └── sw.js
│     
├── .env (Aún no tiene nada)
│  
├── .gitignore (ya comfigurado par .env) 
│ 
└── README

