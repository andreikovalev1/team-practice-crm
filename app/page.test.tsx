import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Главная страница', () => {
  it('рендерит ссылку на документацию Next.js', () => {
    render(<Home />)
    
    const link = screen.getByRole('link', { name: /Documentation/i })
    
    expect(link).toBeInTheDocument()
  })
})