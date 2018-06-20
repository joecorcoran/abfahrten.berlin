import React from 'react';
import classnames from 'classnames';
import dispatcher from '../dispatcher';

class BoardView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="board fl w-100 w-third-l">
        <BoardHeaderView {...this.props} />
        <BoardDeparturesView {...this.props} />
      </section>
    );
  }
}

function BoardHeaderView(props) {
  return (
    <header className="station">
      <div className="station-text">
        <h2 className="station-name">{props.from.name}</h2>
        <p className="station-direction"><i className="fas fa-arrow-right"></i> {props.via.name}</p>
      </div>
      <div className="station-loader">
        <div className={classnames({ loader: true, 'loader--loading': props.loading })}></div>
      </div>
    </header>
  );
}

class BoardDeparturesView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.ticker = setInterval(() => {
      dispatcher.dispatch({
        actionType: 'board:tick',
        key: this.props._key,
        from: this.props.from,
        via: this.props.via
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

export {BoardView, BoardHeaderView, BoardDeparturesView};
