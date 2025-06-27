import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('Profile Form', () => {
  it('renders form fields correctly using accessible labels', () => {
    render(<App />);

    // Using getByLabelText instead of placeholder text
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
  });

  it('shows error when a non-PDF file is uploaded', async () => {
    render(<App />);
    const fileInput = screen.getByLabelText(/upload resume/i); // or adjust if label is different

    const txtFile = new File(['dummy content'], 'resume.txt', {
      type: 'text/plain',
    });

    fireEvent.change(fileInput, { target: { files: [txtFile] } });

    // You can use a matcher for flexible error text detection
    expect(await screen.findByText((content) =>
      content.toLowerCase().includes('only pdf files are allowed')
    )).toBeInTheDocument();
  });
});
