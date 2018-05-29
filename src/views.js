import classnames from 'classnames';
import React from 'react';
import dispatcher from './dispatcher';

function start() {
  // abfahrten.berlin/dashboard?s[]=900000120004|900000120004&s[]=900000120004|900000120003

  dispatcher.dispatch({
    actionType: 'add-station',
    station: { key: `${900000120004}:${900000120003}`, fromId: 900000120004, fromName: 'S+U Warschauer Str.', toId: 900000120003, toName: 'S Ostkreuz' } 
  });
}

function AppView(props) {
  return (
    <div>
      <NavView />
      <div className="flex flex-wrap mw9 center cf">
        {props.stations.map(s => (
          <BoardView departures={props.departures.get(s.key) || []} {...s} />
        ))}
      </div>
    </div>
  );
}

function NavView(props) {
  return (
    <header className="nav">
      <h1 className="nav-heading">abfahrten.berlin</h1>
      <button className="nav-add-button fr" onClick={start}>Station hinzufügen</button>
    </header>
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
        {props.departures.sort((a, b) => {
          if (a.time < b.time) return -1;
          if (a.time > b.time) return 1;
          if (a.time === b.time) return 0;
        }).map(d => (
          <li key={d.key} className="departure w-100">
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
