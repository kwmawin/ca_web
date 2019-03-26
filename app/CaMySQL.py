import mysql.connector

config = {
	"user": "vlsi_clocks_usr",
	"password": "SB4cK2L!",
	"host": "gpu-db-vlsi-clocks-dev.nvidia.com",
	"database": "vlsi_clocks"
}

class CaMySQL:
	def __init__ (self):
		self.db_connector = None

	def connect_db (self):
		self.db_connector = mysql.connector.connect(user=config["user"], password=config["password"], host=config["host"], database=config["database"])

	def disconnect_db (self):
		if self.db_connector:
			self.db_connector.disconnect()

	def db_execute (self, sql):
		self.connect_db()
		cursor = self.db_connector.cursor()
		cursor.execute(sql)
		result = cursor.fetchall()
		self.disconnect_db()
		return result

	def get_projects (self):
		projects = []
		for item in self.db_execute("SELECT ProjectName FROM Projects"):
			project = item[0]
			if project != "" and project != "UNKNOWN":
				projects.append(project.lower())
		return sorted(projects)

	def get_sessions_info (self, project):
		revs = []
		blocks = []
		modes = []
		corners = []
		for item in self.db_execute("SELECT DISTINCT RevName FROM PtSessions JOIN PtRev ON PtSessions.RevID = PtRev.ID JOIN Projects ON PtSessions.ProjectID=Projects.ID WHERE ProjectName = '%s'" %(project)):
			rev = item[0]
			revs.append(rev)
		for item in self.db_execute("SELECT DISTINCT BlockName,HierName FROM PtSessions JOIN PtHier ON PtSessions.Hier = PtHier.ID JOIN Projects ON PtSessions.ProjectID=Projects.ID WHERE ProjectName = '%s'" %(project)):
			block_and_hier = item[0:2]
			blocks.append(block_and_hier)
		for item in self.db_execute("SELECT DISTINCT PtMode FROM PtSessions JOIN PtMode ON PtSessions.ModeID = PtMode.ID JOIN Projects ON PtSessions.ProjectID=Projects.ID WHERE ProjectName = '%s'" %(project)):
			mode = item[0]
			modes.append(mode)
		for item in self.db_execute("SELECT DISTINCT CornerName FROM PtSessions JOIN PtCorners ON PtSessions.CornerID = PtCorners.ID JOIN Projects ON PtSessions.ProjectID=Projects.ID WHERE ProjectName = '%s'" %(project)):
			corner = item[0]
			corners.append(corner)
		
		infos = {
			'revs': sorted(revs),
			'blocks': sorted(blocks),
			'modes': sorted(modes),
			'corners': sorted(corners),
		}
		return infos
