import React, { Component } from 'react';
import Registry from '../utils/Registry';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import BaseComponent from './BaseComponent';
import Card from './Card';
import {updateFilter} from './App';
import {push} from 'react-router-redux';

let actions = {updateFilter: updateFilter, push: push}; // @@STUB - this should be imported from ../actions


/**
 * A NOTE: This defined what part of the redux store our connected component watches
 * ** Currently we are only watching filter params and redux router info **
 * ** Ultimately we should track all application state here **
 **/
function mapStateToProps(state, ownProps) {
  console.log('MAP', state.filterReducer, ownProps);
  // @@TODO 
  
  return {
    appFilterParams: state.filterReducer, // state.filterParams 
    routing: state.routing
  }
}

function mapDispatchToProps(dispatch) {
  console.log('DISPATCH',dispatch, updateFilter)
  // do something with actions here
  return {
    reduxActions: bindActionCreators(actions, dispatch),
  };
}

class Dashboard extends BaseComponent {
  
  /**
   * @@TODO
   * @@ Recursively parse settings tree, rendering components
   * and children 
   * @@ This should also parse the store and pass
   * the proper piece of store/state to children
   **/
  walkSettingsTree() {
    // recurse tree
    // render children
    // poorMansMapToProps(); // parse from the store the piece that we need and add to props
  }
  
  // @@TODO -  add helper function to parse the store and pass to components poorMansMapStateToProps

  let reduxGlue = {
    appFilterParams: this.props.appFilterParams,
    reduxActions: this.props.reduxActions
  }
 
  render() {
    console.log('Render DASH', this);
    let markup;
    let props = Object.assign({globalData: this.state.data || [], q: this.state.q}, this.props.route || this.props);
    if (props.layout) {
      let layout = (typeof this.props.layout === 'String') ? Registry.get(this.props.layout) : this.props.layout;
      return (
        <div className="container">
          <h1 className="dashboard-title">{this.props.title}</h1>
          {React.createElement(layout, props)}
        </div>
      );
    } 
    

    return (
        <div className="container">
          <h1 className="dashboard-title">{this.props.title}</h1>
          {props.components.map((element, key) => { 
            return (
              <Card key={key} {...element}>
                // @@TODO - get own piece of state and pass to children @params - (cid, overrides
                // @@ alternately - use connect for each child component / components that need access to store
                // @@ ^^ not sure if there is a way to dynamically apply mapStateToProps
                // @@ I think that we need to handle our own business - using poorMansMapStateToProps 
                {React.createElement(Registry.get(element.type), Object.assign(props.components[key], reduxGlue))}
              </Card>
            )
          })}
        </div>
    );
  }
}

// hydrate dashboard from redux store (currently -> just filterParams)
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
