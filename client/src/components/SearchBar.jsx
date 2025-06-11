import { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = ({ setProducts }) => {
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (keyword.trim()) {
        handleSearch();
      } else {
        // if keyword is empty, fetch all products
        fetchAllProducts();
      }
    }, 300); // debounce delay

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/search/${keyword}`);
      setProducts(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product`);
      setProducts(data.products);
    } catch (error) {
      console.error("Fetch all error:", error);
    }
  };

  return (
    <div className="search-bar mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search product by name..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
