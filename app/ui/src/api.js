import axios from 'axios';

export const getProjects = () => {
	return axios.get('/api/projects')
		.then(res => res.data);
}


export const getSessionsInfo = (project) => {
	return axios.get(`/api/sessions_info/${project}`)
		.then(res => res.data);
}


export const getSessions = (project, sessionsInfo) => {
	return axios.post(`/api/sessions/${project}`, sessionsInfo)
		.then(res => res.data);
}