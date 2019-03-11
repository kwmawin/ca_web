from flask import jsonify
from flask import request
from glob import glob
from os import path

from app.api import bp

@bp.route('projects', methods=['GET'])
def get_projects():
	# Get all projects
  projects = []
  for dir in glob('./data/projects/*'):
    project = path.basename(dir)
    projects.append(project)
  return jsonify(projects)


@bp.route('/sessions_info/<project>', methods=['GET'])
def get_sessions_info(project):
	# TODO: fake data for project
	infos = {
		'revs': ['revP5.0', 'revP4.0', 'revP3.0'],
		'blocks': ['nv_top', 'NV_gaa_t0', 'NV_gaa_s0'],
		'modes': ['std_max', 'std_min', 'shift_max'],
		'corners': ['tt_105c_0p67v', 'ssg_0c_0p6v']
	};
	return jsonify(infos)


@bp.route('/sessions/<project>', methods=['POST'])
def get_sessions(project):
	request_json = request.get_json()
	if request_json != None:
		return "Getting sessions for Project: %s, data: %s" %(project, str(request_json))
	else:
		return "415 Unsupported request type"