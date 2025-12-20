// Button Component Tests
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/shared/components/ui/Button';

describe('Button Component', () => {
    it('should render button with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should handle click events', async () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByText('Click me');
        await userEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByText('Disabled')).toBeDisabled();
    });

    it('should show loading state', () => {
        render(<Button isLoading>Loading</Button>);
        expect(screen.getByText('Loading')).toBeDisabled();
    });

    it('should apply variant styles', () => {
        const { container } = render(<Button variant="primary">Primary</Button>);
        expect(container.firstChild).toHaveClass('bg-blue-600');
    });

    it('should apply size styles', () => {
        const { container } = render(<Button size="sm">Small</Button>);
        expect(container.firstChild).toHaveClass('text-sm');
    });
});

