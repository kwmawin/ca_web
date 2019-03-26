import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import * as api from '../api';
import * as utils from '../utils';

class Sessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionsInfo: {
        revs: [],
        blocks: [],
        modes: [],
        corners: []
      },
      selectOptions: {
        revs: [],
        blocks: [],
        modes: [],
        corners: []
      },
      ignores: {
        hyperscale: true,
        ILM: true,
      },
      filterBlocks: {
        showTopBlocks: true,
        showChipletBlocks: true,
        showPartitionBlocks: false,
        showMacroBlocks: false,
      },
      filterModes: {
        showFuncModes: true,
        showShiftModes: true,
        showScanDebugModes: true,
        showRamAccessModes: true,
        showCaptureModes: true,
        showCmnoneModes: false,
        showOtherModes: false,
      },
      filterCorners: {
        showMinCorners: false,
        showEMCorners: false,
        showMVCorners: false,
        showGlitchCorners: false,
        showTranCorners: false,
        showOtherCorners: true,
      }
    };

    this.submit = this.submit.bind(this);
    this.handleBlockFilterChange = this.handleBlockFilterChange.bind(this);
    this.handleModeFilterChange = this.handleModeFilterChange.bind(this);
    this.handleCornerFilterChange = this.handleCornerFilterChange.bind(this);
    this.getBlockOptions = this.getBlockOptions.bind(this);
    this.getModeOptions = this.getModeOptions.bind(this);
    this.getCornerOptions = this.getCornerOptions.bind(this);
  }

  componentDidMount() {
    api.getSessionsInfo(this.props.project)
      .then(sessionsInfo => {
        this.setState({
          ...this.state,
          sessionsInfo: sessionsInfo,
          selectOptions: {
            revs: sessionsInfo.revs.sort().reverse(),
            blocks: this.getBlockOptions(this.state.filterBlocks, sessionsInfo.blocks),
            modes: this.getModeOptions(this.state.filterModes, sessionsInfo.modes),
            corners: this.getCornerOptions(this.state.filterCorners, sessionsInfo.corners)
          },
        });
      })
      .catch(console.error);
  }
  
  componentWillUnmount() {
  }

  handleBlockFilterChange(event) {
    let filterBlocks = {
      ...this.state.filterBlocks,
      [event.target.name]: event.target.checked
    }

    this.setState({
      ...this.state,
      filterBlocks: filterBlocks,
      selectOptions: {
        ...this.state.selectOptions,
        blocks: this.getBlockOptions(filterBlocks, this.state.sessionsInfo.blocks)
      },
    });
  }

  handleModeFilterChange(event) {
    let filterModes = {
      ...this.state.filterModes,
      [event.target.name]: event.target.checked
    }

    this.setState({
      ...this.state,
      filterModes: filterModes,
      selectOptions: {
        ...this.state.selectOptions,
        modes: this.getModeOptions(filterModes, this.state.sessionsInfo.modes)
      },
    });
  }

  handleCornerFilterChange(event) {
    let filterCorners = {
      ...this.state.filterCorners,
      [event.target.name]: event.target.checked
    }

    this.setState({
      ...this.state,
      filterCorners: filterCorners,
      selectOptions: {
        ...this.state.selectOptions,
        corners: this.getCornerOptions(filterCorners, this.state.sessionsInfo.corners)
      },
    });
  }

  getBlockOptions(filterBlocks, blockAndHiers) {
    let blockOptions = [];
    
    if (filterBlocks.showTopBlocks) {
      blockOptions = blockOptions.concat(blockAndHiers
        .filter(blockAndHier=>{return blockAndHier[1] == "TOP"})
        .map(blockAndHier=>blockAndHier[0])
      );
    }

    if (filterBlocks.showChipletBlocks) {
      blockOptions = blockOptions.concat(blockAndHiers
        .filter(blockAndHier=>{return blockAndHier[1] == "CHIPLET"})
        .map(blockAndHier=>blockAndHier[0])
      );
    }

    if (filterBlocks.showPartitionBlocks) {
      blockOptions = blockOptions.concat(blockAndHiers
        .filter(blockAndHier=>{return blockAndHier[1] == "PARTITION"})
        .map(blockAndHier=>blockAndHier[0])
      );
    }

    if (filterBlocks.showMacroBlocks) {
      blockOptions = blockOptions.concat(blockAndHiers
        .filter(blockAndHier=>{return blockAndHier[1] == "MACRO"})
        .map(blockAndHier=>blockAndHier[0])
      );
    }

    return blockOptions;
  }

  getModeOptions(filterModes, modes) {
    let modeOptions = [];
    let matched = [];
    let unMatched = modes;

    [matched, unMatched] = utils.splitArray(unMatched, /^STD_.*$/);
    if (filterModes.showFuncModes) {
      modeOptions = modeOptions.concat(matched);
    }

    [matched, unMatched] = utils.splitArray(unMatched, /^SHIFT_.*$/);
    if (filterModes.showShiftModes) {
      modeOptions = modeOptions.concat(matched);
    }

    [matched, unMatched] = utils.splitArray(unMatched, /^SCAN_DEBUG_.*$/);
    if (filterModes.showScanDebugModes) {
      modeOptions = modeOptions.concat(matched);
    }

    [matched, unMatched] = utils.splitArray(unMatched, /^RAM_ACCESS_.*$/);
    if (filterModes.showRamAccessModes) {
      modeOptions = modeOptions.concat(matched);
    }

    [matched, unMatched] = utils.splitArray(unMatched, /^CAPTURE_.*$/);
    if (filterModes.showCaptureModes) {
      modeOptions = modeOptions.concat(matched);
    }

    [matched, unMatched] = utils.splitArray(unMatched, /^CMNONE$/);
    if (filterModes.showCmnoneModes) {
      modeOptions = modeOptions.concat(matched);
    }

    if (filterModes.showOtherModes) {
      modeOptions = modeOptions.concat(unMatched);
    }

    return modeOptions;
  }

  getCornerOptions(filterCorners, corners) {
    let cornerOptions = [];
    let matched = [];
    let unMatched = corners;

    [matched, unMatched] = utils.splitArray(unMatched, /^.*_MIN.*$/);
    if (filterCorners.showMinCorners) {
      cornerOptions = cornerOptions.concat(matched);
    }

    [matched, unMatched] = utils.splitArray(unMatched, /^.*_EM$/);
    if (filterCorners.showEMCorners) {
      cornerOptions = cornerOptions.concat(matched);
    }

    [matched, unMatched] = utils.splitArray(unMatched, /^.*_MV$/);
    if (filterCorners.showMVCorners) {
      cornerOptions = cornerOptions.concat(matched);
    }

    [matched, unMatched] = utils.splitArray(unMatched, /^.*_GLITCH$/);
    if (filterCorners.showGlitchCorners) {
      cornerOptions = cornerOptions.concat(matched);
    }

    [matched, unMatched] = utils.splitArray(unMatched, /^.*_TRAN$/);
    if (filterCorners.showTranCorners) {
      cornerOptions = cornerOptions.concat(matched);
    }

    if (filterCorners.showOtherCorners) {
      cornerOptions = cornerOptions.concat(unMatched);
    }

    return cornerOptions;
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
      corners: corners,
      ignores: this.state.ignores
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

  render() {
    return (
      <div className='Sessions'>
        <div className="container-fluid">
          <div className="row">
            <div className="col-1">
              <p> Rev: </p>
              <Select
                defaultValue={[]}
                isMulti
                name="select-rev"
                options={utils.arrayToOptions(this.state.selectOptions.revs)}
                className="basic-multi-select"
                classNamePrefix="select"
                ref="selectRev"
              />
            </div>
            <div className="col-2">
              <p> Block: </p>
              <Select
                defaultValue={[]}
                isMulti
                name="select-block"
                options={utils.arrayToOptions(this.state.selectOptions.blocks)}
                className="basic-multi-select"
                classNamePrefix="select"
                ref="selectBlock"
              />
            </div>
            <div className="col-3">
              <p> Mode: </p>
              <Select
                defaultValue={[]}
                isMulti
                name="select-mode"
                options={utils.arrayToOptions(this.state.selectOptions.modes)}
                className="basic-multi-select"
                classNamePrefix="select"
                ref="selectMode"
              />
            </div>
            <div className="col-3">
              <p> Corner: </p>
              <Select
                defaultValue={[]}
                isMulti
                name="select-corner"
                options={utils.arrayToOptions(this.state.selectOptions.corners)}
                className="basic-multi-select"
                classNamePrefix="select"
                ref="selectCorner"
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              Block hier filters: 
              <label> 
                <input
                  name="showTopBlocks"
                  type="checkbox"
                  checked={this.state.filterBlocks.showTopBlocks}
                  onChange={this.handleBlockFilterChange}
                  className="checkbox"
                />
                TOP
              </label>
              <label> 
                <input
                  name="showChipletBlocks"
                  type="checkbox"
                  checked={this.state.filterBlocks.showChipletBlocks}
                  onChange={this.handleBlockFilterChange}
                  className="checkbox"
                />
                CHIPLET
              </label>
              <label> 
                <input
                  name="showPartitionBlocks"
                  type="checkbox"
                  checked={this.state.filterBlocks.showPartitionBlocks}
                  onChange={this.handleBlockFilterChange}
                  className="checkbox"
                />
                PARTITION
              </label>
              <label> 
                <input
                  name="showMacroBlocks"
                  type="checkbox"
                  checked={this.state.filterBlocks.showMacroBlocks}
                  onChange={this.handleBlockFilterChange}
                  className="checkbox"
                />
                MACRO
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col">
              Mode filters: 
              <label> 
                <input
                  name="showFuncModes"
                  type="checkbox"
                  checked={this.state.filterModes.showFuncModes}
                  onChange={this.handleModeFilterChange}
                  className="checkbox"
                />
                STD_.*
              </label>
              <label> 
                <input
                  name="showShiftModes"
                  type="checkbox"
                  checked={this.state.filterModes.showShiftModes}
                  onChange={this.handleModeFilterChange}
                  className="checkbox"
                />
                SHIFT_.*
              </label>
              <label> 
                <input
                  name="showScanDebugModes"
                  type="checkbox"
                  checked={this.state.filterModes.showScanDebugModes}
                  onChange={this.handleModeFilterChange}
                  className="checkbox"
                />
                SCAN_DEBUG_.*
              </label>
              <label> 
                <input
                  name="showRamAccessModes"
                  type="checkbox"
                  checked={this.state.filterModes.showRamAccessModes}
                  onChange={this.handleModeFilterChange}
                  className="checkbox"
                />
                RAM_ACCESS_.*
              </label>
              <label> 
                <input
                  name="showCaptureModes"
                  type="checkbox"
                  checked={this.state.filterModes.showCaptureModes}
                  onChange={this.handleModeFilterChange}
                  className="checkbox"
                />
                CAPTURE_.*
              </label>
              <label> 
                <input
                  name="showCmnoneModes"
                  type="checkbox"
                  checked={this.state.filterModes.showCmnoneModes}
                  onChange={this.handleModeFilterChange}
                  className="checkbox"
                />
                CMNONE
              </label>
              <label> 
                <input
                  name="showOtherModes"
                  type="checkbox"
                  checked={this.state.filterModes.showOtherModes}
                  onChange={this.handleModeFilterChange}
                  className="checkbox"
                />
                OTHERS
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col">
              Corner filters: 
              <label> 
                <input
                  name="showMinCorners"
                  type="checkbox"
                  checked={this.state.filterCorners.showMinCorners}
                  onChange={this.handleCornerFilterChange}
                  className="checkbox"
                />
                .*_MIN.*
              </label>
              <label> 
                <input
                  name="showEMCorners"
                  type="checkbox"
                  checked={this.state.filterCorners.showEMCorners}
                  onChange={this.handleCornerFilterChange}
                  className="checkbox"
                />
                .*_EM
              </label>
              <label> 
                <input
                  name="showMVCorners"
                  type="checkbox"
                  checked={this.state.filterCorners.showMVCorners}
                  onChange={this.handleCornerFilterChange}
                  className="checkbox"
                />
                .*_MV
              </label>
              <label> 
                <input
                  name="showGlitchCorners"
                  type="checkbox"
                  checked={this.state.filterCorners.showGlitchCorners}
                  onChange={this.handleCornerFilterChange}
                  className="checkbox"
                />
                .*_GLITCH
              </label>
              <label> 
                <input
                  name="showTranCorners"
                  type="checkbox"
                  checked={this.state.filterCorners.showTranCorners}
                  onChange={this.handleCornerFilterChange}
                  className="checkbox"
                />
                .*_TRAN
              </label>
              <label> 
                <input
                  name="showOtherCorners"
                  type="checkbox"
                  checked={this.state.filterCorners.showOtherCorners}
                  onChange={this.handleCornerFilterChange}
                  className="checkbox"
                />
                OTHERS
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col">
              Ignore:
              <label> 
                <input
                  name="ignoreHyperscale"
                  type="checkbox"
                  defaultChecked={this.state.ignores.hyperscale}
                  className="checkbox"
                />
                hyperscale
              </label>
              <label> 
                <input
                  name="ignoreILM"
                  type="checkbox"
                  defaultChecked={this.state.ignores.ILM}
                  className="checkbox"
                />
                ILM
              </label>
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
