from flask import jsonify
from flask import request
from glob import glob
from os import path

from app.api import bp
from app.CaMySQL import CaMySQL

@bp.route('projects', methods=['GET'])
def get_projects():
	db = CaMySQL()
	projects = db.get_projects()
	return jsonify(projects)


@bp.route('/sessions_info/<project>', methods=['GET'])
def get_sessions_info(project):
	db = CaMySQL()
	infos = db.get_sessions_info(project)
	return jsonify(infos)


@bp.route('/sessions/<project>', methods=['POST'])
def get_sessions(project):
	request_json = request.get_json()
	if request_json != None:
		return "Getting sessions for Project: %s, data: %s" %(project, str(request_json))
	else:
		return "415 Unsupported request type"