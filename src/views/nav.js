import React from 'react';
import classnames from 'classnames';
import screenfull from 'screenfull';
import {SearchView} from './search';

class NavView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { showSearch: false, fullscreen: false };
    this.fullscreenEnabled = screenfull.enabled;
  }

  componentWillMount() {
    if (this.fullscreenEnabled) screenfull.on('change', this.resolveFullscreen);
  }

  componentWillUnmount() {
    if (this.fullscreenEnabled) screenfull.off('change', this.resolveFullscreen);
  }

  resolveFullscreen = () => {
    this.setState({ fullscreen: screenfull.isFullscreen });
  }

  requestFullscreen = () => {
    this.setState({ fullscreen: !this.state.fullscreen }, () => {
      screenfull.toggle();
    });
  }

  showSearch = () => {
    return this.setState({ showSearch: true });
  }

  hideSearch = () => {
    return this.setState({ showSearch: false });
  }

  render() {
    const search = this.state.showSearch ? (<SearchView {...this.props} hide={this.hideSearch} />) : null;
    const fullscreen = this.fullscreenEnabled ? (
      <button className="nav-fullscreen-button nav-big-button mb2 mb0-l" onClick={this.requestFullscreen}>
        <i className="fas fa-expand"></i>&nbsp; {this.state.fullscreen ? 'Vollbild beenden' : 'Vollbild'}
      </button>
    ) : null;
    return (
      <header className={classnames({ nav: true, 'nav--fullscreen': this.state.fullscreen })}>
        <div className="nav-container mw9 center flex flex-column flex-row-l">
          <h1 className="nav-heading tc tl-l mb3 mb0-l flex-grow-1 flex-row-l">abfahrten</h1>
          {fullscreen}
          <button className="nav-search-button nav-big-button ml2-l" onClick={this.showSearch}>
            <i className="fas fa-th-list"></i>&nbsp; Abfahrtstafel erstellen
          </button>
          { search }
        </div>
      </header>
    );
  }
}

export {NavView};
