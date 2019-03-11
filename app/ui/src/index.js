import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

ReactDOM.render(
	<App {...window.initialData}/>,
	document.getElementById('react-root')
);