from flask import render_template
from app import ca_mysql

from app.main import bp

@bp.route('/')
@bp.route('/index')
@bp.route('/project/<project_project>')
@bp.route('/sessions/<sessions_project>')
def index(project_project=None, sessions_project=None):
	if project_project != None:
		initial_data = {
			'page': 'project',
			'project': project_project
		}
	elif sessions_project != None:
		initial_data = {
			'page': 'sessions',
			'project': sessions_project
		}
	else:
		initial_data = {
			'page': 'projects',
		}
	return render_template('/index.html', initial_data=initial_data)


@bp.route('/ca/<project>')
def project_ca(project):
    ca_db = ca_mysql.CaMySQL(project)
    [ca_project_info, ca_project_data] = ca_db.get_project_info_and_data()
    params = {
        'table_cols': 1+len(ca_project_info["netlist_types"])
    }
    return render_template('/project-ca/index.html', project=project, ca_project_info=ca_project_info, ca_project_data=ca_project_data, params=params)

@bp.route('/ca-details/<project>/<rev>/<block>/<netlist_type>/<mode>')
def project_ca_details(project, rev, block, netlist_type, mode):
    return render_template('/project-ca/details.html', project=project, rev=rev, block=block, netlist_type=netlist_type, mode=mode)