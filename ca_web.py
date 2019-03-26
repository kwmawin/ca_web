from app import server

if __name__ == '__main__':
	server.config.from_object('config.DevelopmentConfig')
	server.run()