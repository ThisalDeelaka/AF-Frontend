
import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim(), searchType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-32 py-3 bg-secondary/70 border-0 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search countries..."
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="h-full py-0 pl-3 pr-9 border-0 text-sm bg-transparent text-gray-300 focus:outline-none focus:ring-0"
          >
            <option value="name" className="bg-secondary">By Name</option>
            <option value="region" className="bg-secondary">By Region</option>
            <option value="capital" className="bg-secondary">By Capital</option>
          </select>
          
          <button
            type="submit"
            className="ml-2 mr-2 px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
