import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchBar({ placeholder = 'Search modules or lessons...', onSearch, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8890b5]" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] placeholder-[#8890b5] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent transition-all"
      />
    </div>
  );
}