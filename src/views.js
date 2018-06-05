import classnames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import data from './data';
import dispatcher from './dispatcher';

function AppView(props) {
  return (
    <div>
      <NavView stationSearchLoading={props.stationSearch.get('loading')}
        stationSearch={props.stationSearch.get('stations')}
        stationsViaLoading={props.stationsVia.get('loading')}
        stationsVia={props.stationsVia.get('stations')} />
      <div className="flex flex-wrap mw9 center cf">
        {props.boards.map(b => (
          <BoardView key={b.id}
            loading={props.departures.get(b.id).get('loading')}
            departures={props.departures.get(b.id).get('departures') || []}
            board={b} />
        ))}
      </div>
    </div>
  );
}

class NavView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { showSearch: false };
  }

  showSearch = () => {
    return this.setState({ showSearch: true });
  }

  hideSearch = () => {
    return this.setState({ showSearch: false });
  }

  render() {
    const search = this.state.showSearch ? (<SearchView {...this.props} hide={this.hideSearch} />) : null;
    return (
      <header className="nav mw9 center flex flex-column flex-row-l">
        <h1 className="nav-heading tc tl-l">abfahrten</h1>
        <ul className="nav-menu list pa0 pl3-l ml0 ml3-l tc tl-l flex-grow-1 flex flex-column flex-row-l">
          <li className=""><a>Worum geht es?</a></li>
        </ul>
        <button className="nav-search-link" onClick={this.showSearch}>Abfahrtstafel erstellen</button>
        { search }
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

  search = (event) => {
    this.setState({ value: event.target.value });
    if (event.target.value.length > 0) {
      dispatcher.dispatch({
        actionType: 'stationSearch:requested',
        stations: data.searchStations(event.target.value)
      });
    } else {
      dispatcher.dispatch({ actionType: 'stationSearch:cleared' });
    }
  }

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

    const fromSelector = !this.state.from ? (
      <React.Fragment>
        <form autocomplete="off">
          <label htmlFor="search-input-from">Von</label>
          <input name="search-input-from"
            tabIndex={fromTabIndex}
            autoFocus
            className="search-input w-100"
            value={this.state.value}
            type="search"
            placeholder="S Ostkreuz"
            onChange={this.search} />
        </form>
        <div className="search-results-container">
          <ul className="search-results list pa0 w-100">
            {this.props.stationSearch.map(s => (
              <li key={s.key}>
                <button role="menuitem" tabIndex={fromTabIndex} onMouseOver={(e) => { e.target.focus() }} onClick={this.selectStation.bind(this, s)}>
                  {s.name}
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
        <h3>Über</h3>
        <div className="search-results-container">
          <ul className="search-results list pa0 w-100">
            {this.props.stationsVia.map(s => (
              <li key={s.key}>
                <button role="menuitem" tabIndex={viaTabIndex} onMouseOver={(e) => { e.target.focus() }} autoFocus={viaCounter++ === 0} onClick={this.selectStation.bind(this, s)}>
                  {s.name}
                </button>
              </li>
            ))}
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
          <h3>Von <span className="search-from-name">{this.state.from && this.state.from.name}</span></h3>
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
        <p className="station-direction">Richtung {props.board.toName}</p>
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
              <span className={classnames('departure-line-num', `departure-line-num--${d.lineNum}`, `departure-line-product--${d.lineProduct}`)}>{d.lineNum}</span>
              <span className="departure-time">{d.timeText}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

export {AppView, NavView, BoardView, HeaderView, DeparturesView};
