// Input Component Tests
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/shared/components/ui/Input';

describe('Input Component', () => {
    it('should render input with label', () => {
        render(<Input label="Email" id="email-input" />);
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should handle value changes', async () => {
        const handleChange = jest.fn();
        render(<Input onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'test@example.com');

        expect(handleChange).toHaveBeenCalled();
    });

    it('should show error message', () => {
        render(<Input error="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Input disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should show helper text', () => {
        render(<Input helperText="Enter your email address" />);
        expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });
});

