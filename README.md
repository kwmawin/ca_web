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

3. Set up server on Apache. Sample server script:
```
#!/usr/bin/python
activate_this = '/home/scratch.vlsiclock_tegra/env/rel68/py3_env/bin/activate_this.py'
with open(activate_this) as file_:
        exec(file_.read(), dict(__file__=activate_this))

import sys
sys.path.insert(0,"/home/scratch.koweim_cad/ca_web/repot/ca_web")

from app import server as application

if __name__ == '__main__':
        application.config.from_object('config.ProductionConfig')
        application.run()
```
