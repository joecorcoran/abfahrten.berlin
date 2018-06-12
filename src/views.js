import classnames from 'classnames';
import {debounce} from 'throttle-debounce';
import React from 'react';
import ReactDOM from 'react-dom';
import screenfull from 'screenfull';
import data from './data';
import dispatcher from './dispatcher';

class AppView extends React.Component {
  constructor(props) {
    super(props);
    this.nav = React.createRef();
  }

  showSearch = () => {
    this.nav.current && this.nav.current.showSearch();
  }

  render() {
    const getStarted = <p className="get-started">
      Du hast noch keine Abfahrtstafeln erstellt. <a onClick={this.showSearch}>Lass uns loslegen!</a>
    </p>;
    return (
      <React.Fragment>
        <NavView ref={this.nav}
          stationSearchLoading={this.props.stationSearch.get('loading')}
          stationSearch={this.props.stationSearch.get('stations')}
          stationsViaLoading={this.props.stationsVia.get('loading')}
          stationsVia={this.props.stationsVia.get('stations')} />
        <div className="flex flex-wrap mw9 center cf">
          {this.props.boards.isEmpty() ? (getStarted) : (
            this.props.boards.map(b => (
              <BoardView key={b.id}
                loading={this.props.departures.get(b.id).get('loading')}
                departures={this.props.departures.get(b.id).get('departures') || []}
                board={b} />
            ))
          )}
        </div>
        <div className="footer"><p>Worum geht das? • <a href="https://github.com/joecorcoran/abfahrten.berlin" target="_blank">Code</a> • <a href="https://github.com/joecorcoran/abfahrten.berlin/blob/master/LICENSE.md" target="_blank">PPL</a></p></div>
      </React.Fragment>
    );
  }
}

class NavView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { showSearch: false, fullscreen: false };
  }

  showSearch = () => {
    return this.setState({ showSearch: true });
  }

  hideSearch = () => {
    return this.setState({ showSearch: false });
  }

  handleFullscreen = () => {
    this.setState({ fullscreen: !this.state.fullscreen }, () => {
      screenfull.toggle();
    });
  }

  render() {
    const search = this.state.showSearch ? (<SearchView {...this.props} hide={this.hideSearch} />) : null;
    const fullscreen = screenfull.enabled ? (
      <button className="nav-fullscreen-button nav-big-button mb2 mb0-l" onClick={this.handleFullscreen}>
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
        actionType: 'board:created',
        board: {
          id: `${this.state.from.key}:${station.key}`,
          fromId: this.state.from.key,
          fromName: this.state.from.name,
          toId: station.key,
          toName: station.name
        } 
      });
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

class BoardView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="board fl w-100 w-third-l">
        <HeaderView {...this.props} />
        <DeparturesView {...this.props} />
      </section>
    );
  }
}

function HeaderView(props) {
  return (
    <header className="station">
      <div className="station-text">
        <h2 className="station-name">{props.board.fromName}</h2>
        <p className="station-direction"><i className="fas fa-arrow-right"></i> {props.board.toName}</p>
      </div>
      <div className="station-loader">
        <div className={classnames({ loader: true, 'loader--loading': props.loading })}></div>
      </div>
    </header>
  );
}

class DeparturesView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.ticker = setInterval(() => {
      dispatcher.dispatch({
        actionType: 'board:tick',
        board: this.props.board
      });
    }, 20000);
  }

  componentWillUnmount() {
    clearInterval(this.ticker);
  }

  render() {
    const none = (this.props.departures.isEmpty()) ? (<p className="departures-none">Es wurden keine Abfahrten für diese Strecke gefunden.</p>) : null;
    return (
      <section className="departures">
        {none}
        <ul className="w-100 pa0 ma0">
          {this.props.departures.map(d => (
            <li key={d.key} className={classnames({ departure: true, 'w-100': true, cancelled: d.isCancelled})}>
              <span className="departure-destination">{d.destination}</span>
              <span className={classnames('line-num', 'line-num--departure', `line-num--${d.lineNum}`, `line-product--${d.lineProduct}`)}>{d.lineNum}</span>
              <span className="departure-time">{d.timeText}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

export {AppView, NavView, BoardView, HeaderView, DeparturesView};
