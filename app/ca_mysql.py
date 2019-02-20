# import mysql.connector
# config = {
#     'user': 'clockauditor_usr',
#     'password': 'dev',
#     'host': 'gpu-db-clockauditor-dev',
#     'database' : "ga100_ca"
# }

# def connect_db ():
#     return mysql.connector.connect(user=config['user'], password=config['password'], host=config['host'], database=config['database'])

# def create_database (name):
#     db_connector = mysql.connector.connect(user=config['user'], password=config['password'], host=config['host'])
#     cursor = db_connector.cursor()
#     try:
#         cursor.execute(
#         "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(name))
#     except mysql.connector.Error as err:
#         print("Failed creating database: {}".format(err))
#     db_connector.close()


### FIXME: temporary use sqlite
import sqlite3
import json

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

class CaMySQL:
    def __init__ (self, project):
        self.db_path = "./data/projects/" + project + "/ca/ca.db"
        self.db_connector = None
        self.ca_project_info_path = "./data/projects/" + project + "/ca/ca_project_info.json"
        self.ca_project_data_path = "./data/projects/" + project + "/ca/ca_project_data.json"    

    def connect_db (self):
        self.db_connector = sqlite3.connect(self.db_path)

    def disconnect_db (self):
        if self.db_connector:
            self.db_connector.commit()
            self.db_connector.close()
            self.db_connector = None

    def get_connector (self):
        return self.db_connector

    def db_execute_and_close (self, command):
        self.connect_db()
        cursor = self.db_connector.cursor()
        cursor.execute(command)
        self.disconnect_db() 

    def db_execute (self, command):
        if not self.db_connector:
            raise Exception("Not connected")
        cursor = self.db_connector.cursor()
        return cursor.execute(command)

    def create_rep_dir_table (self):
        self.db_execute_and_close("CREATE TABLE rep_dirs(rep_dir_id INTEGER PRIMARY KEY, tag text, dir text, type text)")

    def create_rep_index_table (self):
        self.db_execute_and_close("CREATE TABLE rep_indexes(rep_index_id INTEGER PRIMARY KEY, rep_dir_id INTEGER, rev text, block text, netlist_type text, mode text)")

    def drop_rep_dir_table (self):
        self.db_execute_and_close("DROP TABLE rep_dirs")

    def drop_rep_index_table (self):
        self.db_execute_and_close("DROP TABLE rep_indexes")
    
    def add_rep_dir (self, tag, dir, type):
        self.db_execute_and_close("INSERT INTO rep_dirs (tag, dir, type) VALUES ('%s', '%s', '%s')" %(tag, dir, type))

    def add_rep_index (self, rep_dir_id, rev, block, netlist_type, mode, connected=False):
        if connected:
            self.db_execute("INSERT INTO rep_indexes (rep_dir_id, rev, block, netlist_type, mode) VALUES ('%s', '%s', '%s', '%s', '%s')" %(rep_dir_id, rev, block, netlist_type, mode))
        else:
            self.db_execute_and_close("INSERT INTO rep_indexes (rep_dir_id, rev, block, netlist_type, mode) VALUES ('%s', '%s', '%s', '%s', '%s')" %(rep_dir_id, rev, block, netlist_type, mode))

    def add_ca_status_json_entries (self, json_file, ca_status_entry, rep_dir_id):
        ca_status = self.parse_json(json_file)
        self.connect_db()
        if ca_status_entry in ca_status:
            for mode in ca_status[ca_status_entry].keys():
                for rev in sorted(ca_status[ca_status_entry][mode].keys()):
                    for block in sorted(ca_status[ca_status_entry][mode][rev].keys()):
                        for netlist_type in ca_status[ca_status_entry][mode][rev][block].keys():
                            print("Adding rep index: %s, %s, %s, %s" %(mode, rev, block, netlist_type))
                            self.add_rep_index(rep_dir_id, rev, block, netlist_type, mode, True)
        self.disconnect_db()

    def print_table (self, table_name):
        print("#" * 50)
        print("# %s:\n" %(table_name))
        self.connect_db()
        for row in self.db_execute("SELECT * FROM %s" %(table_name)):
            print (row)
        self.disconnect_db()
        print("#" * 50)

    def print_rep_index_table (self):
        self.print_table("rep_indexes")

    def print_rep_dir_table (self):
        self.print_table("rep_dirs")

    def get_rep_index_table (self):
        table_name = "rep_indexes"
        self.connect_db()
        # rows = []
        table = {}
        for row in self.db_execute("SELECT * FROM %s" %(table_name)):
            # rows.append(row)
            rev, block, netlist_type, mode = [str(item) for item in row[2:6]]
            if rev not in table:
                table[rev] = {}
            if block not in table[rev]:
                table[rev][block] = {}
            if netlist_type not in table[rev][block]:
                table[rev][block][netlist_type] = {}
            table[rev][block][netlist_type][mode] = 1
        self.disconnect_db()
        return table
        # return rows

    def parse_json (self, json_file):
        ### Parse the JSON file
        f = open(json_file, 'r')
        stream = f.read()
        f.close()
        return json.loads(stream)

    def get_project_info_and_data (self):
        ca_project_info = self.parse_json(self.ca_project_info_path)
        ca_project_data = self.parse_json(self.ca_project_data_path)
        # Populate data
        for rev in ca_project_info['revs']:
            if rev not in ca_project_data:
                ca_project_data[rev] = {}
            for block in ca_project_info['blocks']:
                if block not in ca_project_data[rev]:
                    ca_project_data[rev][block] = {}
                for netlist_type in ca_project_info['netlist_types']:
                    if netlist_type not in ca_project_data[rev][block]:
                        ca_project_data[rev][block][netlist_type] = {}
                    for mode in ca_project_info['modes']:
                        if mode not in ca_project_data[rev][block][netlist_type]:
                            ca_project_data[rev][block][netlist_type][mode] = {
                                'total_checks': "NA",
                                'passed_checks': 0
                            }
        return [ca_project_info, ca_project_data]

if __name__ == "__main__":
    sql = CaMySQL('ga100')
    ### Report dir table
    # sql.drop_rep_dir_table()
    # sql.create_rep_dir_table()
    # sql.add_rep_dir("vlsiclock_project", "/home/scratch.koweim_cad/ca_web/ga100_test_tree/ga100/vlsiclock/rep", "vlsiclock")
    # sql.add_rep_dir("vlsiclock_project_official", "/home/scratch.koweim_gpu_2/vlsiclock_shared_ampere/ga100_shared/hw/ga100/vlsiclock/rep", "vlsiclock")
    # sql.print_rep_dir_table()

    ### Report index table
    #sql.drop_rep_index_table()
    # sql.create_rep_index_table()
    # sql.add_rep_index(1, "revP4.0", "NV_gaa_mx0", "ipo", "std_max")
    # sql.add_rep_index(1, "revP4.0", "NV_gaa_g0", "noscan", "std_max")
    # sql.add_ca_status_json_entries("./data/vlsiclock/status/ca_status_rep.json", "ga100_checks", 1)
    # sql.print_rep_index_table()
    # print(sql.get_rep_index_table())

    print(sql.build_index_table())
