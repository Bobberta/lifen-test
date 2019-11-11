import { render, getByText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import FileList from './components/FileList';
import FileListItem from './components/FileListItem';

const div = document.createElement('div');

const buffer = Buffer.from([1, 2, 3]);
const pdfFile = new File([buffer], 'Un fichier PDF', { type: 'application/pdf' });

describe('<FileList />', () => {
  it('renders without files', () => {
    const wrapper = shallow(<FileList files={[]} />);
    expect(wrapper.contains(<div>Vous n'avez pas encore téléchargé de fichier.</div>)).toEqual(
      true
    );
  });
  it('renders with files', () => {
    const wrapper = shallow(<FileList files={[pdfFile, pdfFile]} />);
    expect(wrapper.contains(<FileListItem key={0} file={pdfFile} />)).toEqual(true);
  });
  it('renders when files is undefined', () => {
    ReactDOM.render(<FileList />, div);
  });
});

describe('<FileListItem />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<FileListItem file={pdfFile} />);
    expect(wrapper).toMatchSnapshot();
  });
});
