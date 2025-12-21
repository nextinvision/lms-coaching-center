// Toast Component Tests
import { render, screen } from '@testing-library/react';
import { ToastProvider, useToast } from '@/shared/components/ui/Toast';

function TestComponent() {
    const { showToast } = useToast();

    return (
        <button onClick={() => showToast({ message: 'Test toast', variant: 'success' })}>
            Show Toast
        </button>
    );
}

describe('Toast Component', () => {
    it('should render toast provider', () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        expect(screen.getByText('Show Toast')).toBeInTheDocument();
    });
});

