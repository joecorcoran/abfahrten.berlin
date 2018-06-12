import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as Im from 'immutable';
import {AppView} from '../src/views/app';
import {NavView} from '../src/views/nav';
import {SearchView} from '../src/views/search';

Enzyme.configure({ adapter: new Adapter() });

const stationSearchStore = Im.Map();
const stationsViaStore = Im.Map();
const boardStore = Im.Set();

describe('AppView', () => {
  it('renders NavView with no content', () => {
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
    const wrapper = shallow(
      <NavView stationSearch={stationSearchStore}
        stationsVia={stationsViaStore}
        stationSearchLoading={false}
        stationsViaLoading={false} />
    );

    expect(wrapper.find('header.nav').length).toBe(1);
  });

  it('shows search when button clicked', () => {
    const wrapper = shallow(
      <NavView stationSearch={stationSearchStore}
        stationsVia={stationsViaStore}
        stationSearchLoading={false}
        stationsViaLoading={false} />
    );

    wrapper.find('button.nav-search-button').simulate('click');
    expect(wrapper.instance().state.showSearch).toBe(true);
  });
});
