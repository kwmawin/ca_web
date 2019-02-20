from flask import render_template
from app import server
from app import ca_mysql
from glob import glob
from os import path

@server.route('/')
@server.route('/index')
def index():
    return "TBD"

@server.route('/ca')
def ca_index():
    # Get all projects
    projects = []
    for dir in glob('./data/projects/*'):
        project = path.basename(dir)
        projects.append(project)
    return render_template('/projects-index.html', projects=projects)

@server.route('/ca/<project>')
def project_ca(project):
    ca_db = ca_mysql.CaMySQL(project)
    [ca_project_info, ca_project_data] = ca_db.get_project_info_and_data()
    params = {
        'table_cols': 1+len(ca_project_info["netlist_types"])
    }
    return render_template('/project-ca/index.html', project=project, ca_project_info=ca_project_info, ca_project_data=ca_project_data, params=params)

@server.route('/ca-details/<project>/<rev>/<block>/<netlist_type>/<mode>')
def project_ca_details(project, rev, block, netlist_type, mode):
    return render_template('/project-ca/details.html', project=project, rev=rev, block=block, netlist_type=netlist_type, mode=mode)