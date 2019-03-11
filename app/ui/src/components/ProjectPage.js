import React from 'react';
import PropTypes from 'prop-types';

const ProjectPage = ({project}) => (
  <div className='ProjectsIndex'>
    <div className="container">
      <div className="row">
        <div className="col">
        {/*Reserved space*/}
        </div>
        <div className="col">
          <a role="button" href={'/sessions/'+project} className="btn btn-light btn-lg btn-block mt-3">Sessions</a>
          <a role="button" href={'/ca/'+project} className="btn btn-light btn-lg btn-block mt-3">Reports</a>
        </div>
        <div className="col">
        {/*Reserved space*/}
        </div>
      </div>
    </div>
  </div>
);

ProjectPage.propTypes = {
  project: PropTypes.string
};

export default ProjectPage;