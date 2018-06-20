import React from 'react';
import ReactDOM from 'react-dom';
import {debounce} from 'throttle-debounce';
import classnames from 'classnames';
import dispatcher from '../dispatcher';
import data from '../data';

class SearchView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from: null,
      value: ''
    };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value }, () => {
      this.search(this.state.value);
    });
  }

  search = debounce(300, (q) => {
    this.setState({ value: q });
    if (q.length > 0) {
      dispatcher.dispatch({
        actionType: 'stationSearch:requested',
        stations: data.searchStations(q)
      });
    } else {
      dispatcher.dispatch({ actionType: 'stationSearch:cleared' });
    }
  })

  close = (event) => {
    this.setState({ value: '' });
    dispatcher.dispatch({ actionType: 'stationSearch:cleared' });
    return this.props.hide();
  }

  selectStation = (station) => {
    this.setState({ value: '' });

    if (!this.state.from) {
      dispatcher.dispatch({ actionType: 'stationSearch:selected' });
      dispatcher.dispatch({
        actionType: 'stationsVia:requested',
        stations: data.getStations(station.connected)
      });
      return this.setState({ from: station });
    } else {
      dispatcher.dispatch({
        actionType: 'board:requested',
        key: `${this.state.from.key}:${station.key}`
      });
      data.getBoard(this.state.from.key, station.key);
      this.close();
    }
  }

  render() {
    let fromTabIndex = 0;
    let viaTabIndex = 0;

    const linesFor = function(station) {
      return station.lines ? (
        <div className="search-lines">
          {station.lines.map(l => (<span key={l.key} className={`line-num line-num--search line-num--${l.num} line-product--${l.product}`}>{l.num}</span>))}
        </div>
      ) : null; 
    };

    const fromSelector = !this.state.from ? (
      <React.Fragment>
        <form autoComplete="off">
          <label htmlFor="search-input-from">Von</label>
          <input name="search-input-from"
            tabIndex={fromTabIndex}
            autoFocus
            className="search-input w-100"
            value={this.state.value}
            type="search"
            placeholder="S Ostkreuz"
            onChange={this.handleChange} />
        </form>
        <div className="search-results-container">
          <ul className="search-results list pa0 w-100">
            {this.props.stationSearch.map(s => (
              <li key={s.key}>
                <button role="menuitem" tabIndex={fromTabIndex} onMouseOver={(e) => { e.target.focus() }} onClick={this.selectStation.bind(this, s)}>
                  {s.name}
                  {linesFor(s)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </React.Fragment>
    ) : null;

    let viaCounter = 0;
    const viaSelector = this.state.from ? (
      <React.Fragment>
        <h3><i className="fas fa-arrow-right"></i>&nbsp; Über</h3>
        <div className="search-results-container">
          <ul className="search-results list pa0 w-100">
            {this.props.stationsVia.map(s => {
              return (
                <li key={s.key}>
                  <button role="menuitem" tabIndex={viaTabIndex} onMouseOver={(e) => { e.target.focus() }} autoFocus={viaCounter++ === 0} onClick={this.selectStation.bind(this, s)}>
                  {s.name}
                  {linesFor(s)}
                </button>
              </li>
              );
            })}
          </ul>
        </div>
      </React.Fragment>
    ) : null;

    return ReactDOM.createPortal((
      <div className="search">
        <div className="search-container w-100 w-third-l center pa4">
          <button className="search-close" onClick={this.close}>&#10006;</button>
          <header className="search-header flex">
            <h2 className="flex-grow-1">Stationen hinzufügen</h2>
            <div className="search-loader">
              <div className={classnames({ loader: true, 'loader--loading': this.props.stationSearchLoading || this.props.stationsViaLoading })}></div>
            </div>
          </header>
          <h3><i className="fas fa-map-marker"></i>&nbsp; Von <span className="search-from-name">{this.state.from && this.state.from.name}</span></h3>
          { fromSelector }
          { viaSelector }
        </div>
      </div>
    ), document.getElementById('search'));
  }
}

export {SearchView};
