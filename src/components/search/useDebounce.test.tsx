import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('задерживает обновление значения', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'init', delay: 500 } }
    );
    rerender({ value: 'new value', delay: 500 });
    expect(result.current).toBe('init');
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('new value');
  });
});