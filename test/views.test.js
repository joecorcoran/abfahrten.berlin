import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as Im from 'immutable';
import {AppView, NavView, SearchView} from '../src/views';

Enzyme.configure({ adapter: new Adapter() });

describe('AppView', () => {
  it('renders NavView with no content', () => {
    const stationSearchStore = Im.Map();
    const stationsViaStore = Im.Map();
    const boardStore = Im.Set();

    const wrapper = shallow(
      <AppView stationSearch={stationSearchStore}
        stationsVia={stationsViaStore}
        boards={boardStore} />
    );

    expect(wrapper.contains(<NavView />));
    expect(wrapper.find('.get-started').length).toBe(1);
  });
});

describe('NavView', () => {
  it('renders header', () => {
    const stationSearchStore = Im.Map();
    const stationsViaStore = Im.Map();

    const wrapper = shallow(
      <NavView stationSearch={stationSearchStore}
        stationsVia={stationsViaStore}
        stationSearchLoading={false}
        stationsViaLoading={false} />
    );

    expect(wrapper.find('header.nav').length).toBe(1);
  });
});
