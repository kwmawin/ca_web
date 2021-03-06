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
		};

		this.fetchData = this.fetchData.bind(this);
		this.getNavbarBrand = this.getNavbarBrand.bind(this);
		this.getNavbarOptions = this.getNavbarOptions.bind(this);
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

	getNavbarOptions () {
		if (this.props.page == 'projects') {
			return {
				'home': true,
				'wiki': true
			};
		} else if (this.props.page == 'project') {
			return {
				'home': true,
				'wiki': true
			};
		} else if (this.props.page == 'sessions') {
			return {
				'home': true,
				'project': true,
				'wiki': true
			};
		}

		return {
			'home': true,
			'wiki': true
		};
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
				<Sessions project={this.props.project}/>
			);
		}

		return 'PAGE TBD';
	}

	render() {
		return (
			<div className='App'>
			<Navbar brandText={this.getNavbarBrand()} options={this.getNavbarOptions()} project={this.props.project} />
			<div className='gap-for-navbar'> </div>
			{this.getContent()}
			</div>
		);
	}
}

export default App;