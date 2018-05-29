import dayjs from 'dayjs';
import dispatcher from './dispatcher';
import VBB from './vbb';

function fakeDeparture() {
  return {
    key: '0',
    lineNum: '--',
    destination: 'Loading...',
    timeText: 'now'
  }
}

function departure(data) {
  let mins = dayjs(data.when).diff(dayjs(), 'minutes');
  return {
    key: data.journeyId,
    lineNum: data.line.name,
    destination: data.direction,
    time: mins,
    timeText: mins === 0 ? 'now' : `${mins} min`
  };
}

const data = {
  departures: function(fromId, toId) {
    VBB.getDepartures(fromId, toId, function(error, response) {
      if (error) return;
      dispatcher.dispatch({
        actionType: 'departures-done',
        stationKey: `${fromId}:${toId}`,
        departures: response.body.map(departure)
      });
    });
    return [fakeDeparture()];
  }
};

export default data;
