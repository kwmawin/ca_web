import React from 'react';

import Navbar from './Navbar';
import Projects from './Projects';
import ProjectPage from './ProjectPage';
import Sessions from './Sessions';
import * as api from '../api';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			sessionsInfo: {
				revs: [],
				blocks: [],
				modes: [],
				corners: []
			}
		};

		this.fetchData = this.fetchData.bind(this);
		this.getNavbarBrand = this.getNavbarBrand.bind(this);
		this.getContent = this.getContent.bind(this);
	}

	componentDidMount() {
		this.fetchData();
	}
	
	componentWillUnmount() {
	}

	fetchData () {
		// Fetch projects
		if (this.props.page == 'projects') {
			api.getProjects()
			.then(projects => {
				this.setState({
					projects: projects
				});
			})
			.catch(console.error);
		}

		// Fetch sessions info
		if (this.props.page == 'sessions') {
			api.getSessionsInfo()
			.then(sessionsInfo => {
				this.setState({
					sessionsInfo: sessionsInfo
				});
			})
			.catch(console.error);
		}
	}

	getNavbarBrand () {
		if (this.props.page == 'projects') {
			return 'Clock Auditor';
		} else if (this.props.page == 'project') {
			return this.props.project.toUpperCase() + " Clock Auditor";
		} else if (this.props.page == 'sessions') {
			return this.props.project.toUpperCase() + " Sessions";
		}

		return 'Clock Auditor';
	}

	getContent () {
		if (this.props.page == 'projects') {
			return (
				<Projects projects={this.state.projects}/>
			);
		} else if (this.props.page == 'project') {
			return (
				<ProjectPage project={this.props.project}/>
			);
		} else if (this.props.page == 'sessions') {
			return (
				<Sessions project={this.props.project} sessionsInfo={this.state.sessionsInfo}/>
			);
		}

		return 'PAGE TBD';
	}

	render() {
		return (
			<div className='App'>
			<Navbar brandText={this.getNavbarBrand()} />
			<div className='gap-for-navbar'> </div>
			{this.getContent()}
			</div>
		);
	}
}

export default App;