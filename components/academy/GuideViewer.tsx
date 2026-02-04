import React from 'react';
import { Guide } from '../../lib/guides';

interface GuideViewerProps {
    guide: Guide;
}

const GuideViewer: React.FC<GuideViewerProps> = ({ guide }) => {
    // The `prose` classes from Tailwind Typography will style the HTML content.
    // In a real application, this content should be sanitized to prevent XSS attacks.
    return (
        <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: guide.content }}
        />
    );
};

export default GuideViewer;
