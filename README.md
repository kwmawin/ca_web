1. Set up Flask back-end server
```
cd ca_web
python3 -m venv venv
source venv/bin/activate
(venv) pip install flask
# Run server
(venv) python ca_web.py
```

2. Set up React front-end dev (React/Babel/Webpack)
```
cd ca_web/app/ui
npm install
# Build bundle.js (in ca_web/app/ui/public)
npm run dev
```