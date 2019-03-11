import React from 'react';
import PropTypes from 'prop-types';

const Projects = ({projects}) => (
  <div className='Projects'>
    <h1 className="text-center">Projects</h1> 
    <div className="container">
      {projects.map((project, index) =>
        <div key={index} className="row">
          <div className="col">
          {/*Reserved space*/}
          </div>
          <div className="col">
            <a role="button" href={"/project/"+project} className="btn btn-light btn-lg btn-block mt-3">{project.toUpperCase()}</a>
          </div>
          <div className="col">
          {/*Reserved space*/}
          </div>
        </div>
      )}
    </div>
  </div>
);

Projects.propTypes = {
  projects: PropTypes.array
};

export default Projects;