import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SnippetList from './components/Snippet';

test('searches snippets correctly', () => {
  const snippets = [
    { id: 1, title:'Javascript', language: 'JavaScript', code: 'console.log("Hello World");' },
    { id: 2, title:'Python', language: 'Python', code: 'print("Hello World")' },
    { id: 3, title:'Ruby', language: 'Ruby', code: 'puts "Hello World"' },
    { id: 4, title:'Javascript 2', language: 'JavaScript', code: 'alert("Hello World");' },
    { id: 5, title:'Python 2', language: 'Python', code: 'print("Hello again")' },
  ];

  const { getByPlaceholderText, getByText, queryByText } = render(<SnippetList snippets={snippets} />);

  // Simulate a search query
  const searchInput = getByPlaceholderText('Search Snippets');
  fireEvent.change(searchInput, { target: { value: 'Ruby' } });
  fireEvent.submit(searchInput);

  // Verify the search results
  expect(getByText('puts "Hello World"')).toBeInTheDocument();
  expect(queryByText('console.log("Hello World");')).not.toBeInTheDocument();
  expect(queryByText('print("Hello World")')).not.toBeInTheDocument();
});
