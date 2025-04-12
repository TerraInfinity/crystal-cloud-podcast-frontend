/**
 * SearchInput.tsx
 * A functional component that renders a search input field.
 *
 * @param props - The properties passed to the component.
 * @param props.id - A unique identifier for the input field, used for accessibility.
 * @returns A form containing the search input field.
 */
import React from 'react';

interface SearchInputProps {
  id: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ id }) => {
  return (
    <form id={`${id}-form`} onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">Search</label>
      <input
        type="text"
        id={id}
        placeholder="Search"
        className="px-4 py-2 text-white rounded bg-white bg-opacity-10 border-none"
      />
    </form>
  );
};

export default SearchInput;