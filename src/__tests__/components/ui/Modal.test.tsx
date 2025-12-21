// Modal Component Tests
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/shared/components/ui/Modal';

describe('Modal Component', () => {
    it('should render modal when open', () => {
        render(
            <Modal isOpen={true} onClose={jest.fn()}>
                <p>Modal content</p>
            </Modal>
        );

        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should not render modal when closed', () => {
        render(
            <Modal isOpen={false} onClose={jest.fn()}>
                <p>Modal content</p>
            </Modal>
        );

        expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
        const handleClose = jest.fn();
        render(
            <Modal isOpen={true} onClose={handleClose}>
                <p>Modal content</p>
            </Modal>
        );

        const buttons = screen.getAllByRole('button');
        const closeButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Close') || buttons[0];
        
        if (closeButton) {
            await userEvent.click(closeButton);
            expect(handleClose).toHaveBeenCalled();
        }
    });
});

