import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchInput from './SearchInput';

describe('SearchInput Component', () => {
  it('должен вызывать onChange при вводе текста', () => {
    const handleChange = jest.fn();
    render(<SearchInput value="" onChange={handleChange} />);
    const inputElement = screen.getByPlaceholderText('Search');
    fireEvent.change(inputElement, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('test');
  });

  it('должен отображать переданное значение', () => {
    render(<SearchInput value="Hello" onChange={() => {}} />);
    const inputElement = screen.getByDisplayValue('Hello');
    expect(inputElement).toBeInTheDocument();
  });

  it('должен применять переданный плейсхолдер', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Search users..." />);
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
  });
});