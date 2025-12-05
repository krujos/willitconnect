import React from 'react';
import HeaderBar from '../../main/script/HeaderBar';
import { render, screen } from '@testing-library/react';

describe('HeaderBar', () => {
    it("has a link to the github repo", function() {
        const { container } = render(<HeaderBar />);
        
        // Check for the GitHub link by href attribute
        const githubLink = container.querySelector('a[href*="github.com/krujos/willitconnect"]');
        expect(githubLink).to.exist;
        
        // Check that the link contains the GitHub icon span
        expect(githubLink.querySelector('span')).to.exist;
    });
});

