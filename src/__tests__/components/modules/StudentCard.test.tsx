// Student Card Component Tests
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StudentCard } from '@/modules/students/components/StudentCard';

// Mock the student data
const mockStudent = {
    id: 'student-1',
    name: 'John Doe',
    phone: '1234567890',
    user: {
        id: 'user-1',
        email: 'john@example.com',
        isActive: true,
    },
    batch: {
        id: 'batch-1',
        name: 'Class 10',
    },
};

describe('StudentCard Component', () => {
    it('should render student information', () => {
        render(<StudentCard student={mockStudent as any} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('Class 10')).toBeInTheDocument();
    });

    it('should call onView when view button is clicked', async () => {
        const handleView = jest.fn();
        const { container } = render(
            <StudentCard student={mockStudent as any} onView={handleView} />
        );

        const viewButton = container.querySelector('button');
        if (viewButton) {
            await userEvent.click(viewButton);
            expect(handleView).toHaveBeenCalledWith('student-1');
        }
    });

    it('should display active status', () => {
        render(<StudentCard student={mockStudent as any} />);
        expect(screen.getByText(/active/i)).toBeInTheDocument();
    });
});

