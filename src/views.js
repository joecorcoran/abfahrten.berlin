import classnames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import data from './data';
import dispatcher from './dispatcher';

function AppView(props) {
  return (
    <div>
      <NavView {...props} />
      <div className="flex flex-wrap mw9 center cf">
        {props.boards.map(b => (
          <BoardView key={b.id} departures={props.departures.get(b.id) || []} {...b} />
        ))}
      </div>
    </div>
  );
}

class NavView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showSearch: false };
  }

  start() {
    // abfahrten.berlin/dashboard?s[]=900000120004|900000120004&s[]=900000120004|900000120003
    dispatcher.dispatch({
      actionType: 'board:create',
      board: { id: `${900000120004}:${900000120003}`, fromId: 900000120004, fromName: 'S+U Warschauer Str.', toId: 900000120003, toName: 'S Ostkreuz' } 
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
    return (
      <header className="nav">
        <h1 className="nav-heading">abfahrten.berlin</h1>
        <a className="nav-search-link pointer underline" onClick={this.showSearch}>Abfahrtstafel erstellen</a>
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
      value: null
    };
  }

  search = (event) => {
    this.setState({ value: event.target.value });
    data.searchStations(event.target.value);
  }

  close = (event) => {
    this.setState({ value: '' });
    dispatcher.dispatch({ actionType: 'stations:cleared' });
    return this.props.hide();
  }

  selectStation = (station) => {
    this.setState({ value: '' });

    if (!this.state.from) {
      dispatcher.dispatch({ actionType: 'stations:selected' });
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
    const from = this.state.from ? (<p>Von: {this.state.from.name}</p>) : null;
    const placeholder = this.state.from ? 'Richtung...' : 'Von...';
    return ReactDOM.createPortal((
      <div className="search">
        <div className="search-container w-100 w-third-l center pa4">
          <a className="search-close pointer absolute right-1 top-1 f3" onClick={this.close}>&#10006;</a>
          <h2>Stationen hinzufügen</h2>
          { from }
          <input autoFocus className="search-input w-100" value={this.state.value} type="search" placeholder={placeholder} onChange={this.search} />
          <ul className="search-results list pa0 w-100">
            {this.props.stations.map(s => (
              <li key={s.key} onClick={this.selectStation.bind(this, s)}>{s.name}</li>
            ))}
          </ul>
        </div>
      </div>
    ), document.getElementById('search'));
  }
}

function BoardView(props) {
  return (
    <section className="board fl w-100 w-third-l">
      <HeaderView {...props} />
      <DeparturesView {...props} />
    </section>
  );
};

function HeaderView(props) {
  return (
    <header className="station">
      <h2 className="station-name">{props.fromName}</h2>
      <p className="station-direction">Richtung {props.toName}</p>
    </header>
  );
};

function DeparturesView(props) {
  return (
    <section className="departures">
      <ul className="w-100 pa0 ma0">
        {props.departures.map(d => (
          <li key={d.key} className={classnames({ departure: true, 'w-100': true, cancelled: d.isCancelled})}>
            <span className="departure-destination">{d.destination}</span>
            <span className={classnames('departure-line-num', `departure-line-num--${d.lineNum}`)}>{d.lineNum}</span>
            <span className="departure-time">{d.timeText}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export {AppView, NavView, BoardView, HeaderView, DeparturesView};
