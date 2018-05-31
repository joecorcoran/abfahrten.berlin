import classnames from 'classnames';
import React from 'react';
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

function NavView(props) {
  function start() {
    // abfahrten.berlin/dashboard?s[]=900000120004|900000120004&s[]=900000120004|900000120003
    dispatcher.dispatch({
      actionType: 'board:create',
      board: { id: `${900000120004}:${900000120003}`, fromId: 900000120004, fromName: 'S+U Warschauer Str.', toId: 900000120003, toName: 'S Ostkreuz' } 
    });
  }

  return (
    <header className="nav">
      <h1 className="nav-heading">abfahrten.berlin</h1>
      <SearchView {...props} />
    </header>
  );
}

function SearchView(props) {
  function search(event) {
    data.searchStations(event.target.value);
  }

  return (
    <div className="search">
      <input className="search-input" type="search" placeholder="Station suchen" onChange={search} />
      <ul className="search-results">
        {props.stations.map(s => (
          <li key={s.key}>{s.name}</li>
        ))}
      </ul>
    </div>
  );
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
