import React from 'react';

import {BoardView} from './board';
import {SearchView} from './search';
import {NavView} from './nav';
import {QueryView} from './query';

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
        <QueryView query={this.props.query} history={this.props.history} />
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
        <div className="footer">
          <p>Worum geht das? • <a href="https://github.com/joecorcoran/abfahrten.berlin" target="_blank">Code</a> • <a href="https://github.com/joecorcoran/abfahrten.berlin/blob/master/LICENSE.md" target="_blank">PPL</a></p>
        </div>
      </React.Fragment>
    );
  }
}

export {AppView};
