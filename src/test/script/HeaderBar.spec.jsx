import React from 'react';
import HeaderBar from '../../main/script/HeaderBar';
import { render, screen } from '@testing-library/react';

describe('HeaderBar', () => {
    it("has a link to the github repo", function() {
        render(<HeaderBar />);
        
        // Check for the GitHub link
        const githubLink = screen.getByRole('link', { href: /github/i });
        expect(githubLink).to.exist;
        
        // Check that the link contains the GitHub icon span
        expect(githubLink.querySelector('span')).to.exist;
    });
});

