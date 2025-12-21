// Homework Card Component Tests
import { render, screen } from '@testing-library/react';
import { HomeworkCard } from '@/modules/homework/components/HomeworkCard';

const mockAssignment = {
    id: 'assignment-1',
    title: 'Math Homework',
    description: 'Complete chapter 5',
    dueDate: new Date('2024-12-31'),
    batch: { name: 'Class 10' },
    subject: { name: 'Mathematics' },
    status: 'PENDING',
};

describe('HomeworkCard Component', () => {
    it('should render assignment information', () => {
        render(<HomeworkCard assignment={mockAssignment as any} />);

        expect(screen.getByText('Math Homework')).toBeInTheDocument();
        expect(screen.getByText('Complete chapter 5')).toBeInTheDocument();
    });

    it('should display due date', () => {
        render(<HomeworkCard assignment={mockAssignment as any} />);
        const dueElements = screen.getAllByText(/due/i);
        expect(dueElements.length).toBeGreaterThan(0);
    });
});

