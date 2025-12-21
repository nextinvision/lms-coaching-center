// Badge Component Tests
import { render, screen } from '@testing-library/react';
import { Badge } from '@/shared/components/ui/Badge';

describe('Badge Component', () => {
    it('should render badge with text', () => {
        render(<Badge>Test Badge</Badge>);
        expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('should apply variant styles', () => {
        const { container } = render(<Badge variant="success">Success</Badge>);
        expect(container.firstChild).toHaveClass('bg-green-100');
    });

    it('should apply size styles', () => {
        const { container } = render(<Badge size="sm">Small</Badge>);
        expect(container.firstChild).toHaveClass('text-xs');
    });
});

