from app import server
server.config.from_object('config.DevelopmentConfig')
server.run()