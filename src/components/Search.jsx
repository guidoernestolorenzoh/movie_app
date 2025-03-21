const Search = (props) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search thousands of movies"
          value={props.search}
          onChange={(e) => props.setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
