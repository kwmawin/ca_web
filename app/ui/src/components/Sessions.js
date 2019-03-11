import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import * as api from '../api';

class Sessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionsInfo: props.sessionsInfo
    };

    this.submit = this.submit.bind(this);
    this.arrayToOptions = this.arrayToOptions.bind(this);
  }

  componentDidMount() {
  }
  
  componentWillUnmount() {
  }

  submit () {
    let revs = this.refs.selectRev.select.state.selectValue.map(option=>option.value);
    let blocks = this.refs.selectBlock.select.state.selectValue.map(option=>option.value);
    let modes = this.refs.selectMode.select.state.selectValue.map(option=>option.value);
    let corners = this.refs.selectCorner.select.state.selectValue.map(option=>option.value);
    api.getSessions(this.props.project, {
      revs: revs,
      blocks: blocks,
      modes: modes,
      corners: corners
    })
      .then(data => {
        console.log(data);
      })
      .catch(console.error);

    // console.log(revs);
    // console.log(blocks);
    // console.log(modes);
    // console.log(corners);
  }

  arrayToOptions (array) {
    return array.map(value=>({value:value, label:value}));
  }

  render() {
    return (
      <div className='Sessions'>
        <div className="container">
          <div className="row">
            <div className="col">
              <p> Rev: </p>
              <Select
                defaultValue={[]}
                isMulti
                name="select-rev"
                options={this.arrayToOptions(this.props.sessionsInfo.revs)}
                className="basic-multi-select"
                classNamePrefix="select"
                ref="selectRev"
              />
            </div>
            <div className="col">
              <p> Block: </p>
              <Select
                defaultValue={[]}
                isMulti
                name="select-block"
                options={this.arrayToOptions(this.props.sessionsInfo.blocks)}
                className="basic-multi-select"
                classNamePrefix="select"
                ref="selectBlock"
              />
            </div>
            <div className="col">
              <p> Mode: </p>
              <Select
                defaultValue={[]}
                isMulti
                name="select-mode"
                options={this.arrayToOptions(this.props.sessionsInfo.modes)}
                className="basic-multi-select"
                classNamePrefix="select"
                ref="selectMode"
              />
            </div>
            <div className="col">
              <p> Corner: </p>
              <Select
                defaultValue={[]}
                isMulti
                name="select-corner"
                options={this.arrayToOptions(this.props.sessionsInfo.corners)}
                className="basic-multi-select"
                classNamePrefix="select"
                ref="selectCorner"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <a role="button" onClick={this.submit} className="btn btn-light btn-lg btn-block mt-3">Submit</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Sessions.propTypes = {
  project: PropTypes.string
};

export default Sessions;