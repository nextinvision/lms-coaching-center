// Select Component Tests
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '@/shared/components/ui/Select';

describe('Select Component', () => {
    const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
    ];

    it('should render select with options', () => {
        render(<Select options={options} />);

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should handle value changes', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} onChange={handleChange} />);

        const select = screen.getByRole('combobox');
        await userEvent.selectOptions(select, '2');

        expect(handleChange).toHaveBeenCalled();
    });

    it('should display selected value', () => {
        render(<Select options={options} value="2" />);
        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('2');
    });
});

