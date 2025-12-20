// Notice Card Component Tests
import { render, screen } from '@testing-library/react';
import { NoticeCard } from '@/modules/notices/components/NoticeCard';

const mockNotice = {
    id: 'notice-1',
    title: 'Important Notice',
    content: 'School will be closed tomorrow',
    type: 'IMPORTANT',
    priority: 5,
    createdAt: new Date(),
};

describe('NoticeCard Component', () => {
    it('should render notice information', () => {
        render(<NoticeCard notice={mockNotice as any} />);

        expect(screen.getByText('Important Notice')).toBeInTheDocument();
        expect(screen.getByText('School will be closed tomorrow')).toBeInTheDocument();
    });

    it('should display notice type', () => {
        render(<NoticeCard notice={mockNotice as any} />);
        const importantElements = screen.getAllByText(/important/i);
        expect(importantElements.length).toBeGreaterThan(0);
    });
});

