import React from 'react';
import { shallow } from 'enzyme';
import Dashboard from './components/Dashboard';

it('renders without crashing', () => {
  wrapper = shallow(<Dashboard />);
  expect(wrapper).toMatchSnapshot();
});