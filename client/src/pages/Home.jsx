import React, { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterPage, setFilterPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filtering, setFiltering] = useState(false);

  //get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get total products count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };




  //get all products (non-filtered)
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/get-product`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };






  //filter products (with pagination & append support)
 const filterProduct = async (pageToLoad = 1, append = false) => {
  try {
    setLoading(true);
    const { data } = await axios.post("/api/v1/product/product-filters", {
      checked,
      radio,
      page: pageToLoad,
      limit: 12,
    });

    if (append) {
      setProducts((prevProducts) => {
  const newProducts = data?.products || [];
  const uniqueProducts = newProducts.filter(
    (p) => !prevProducts.find((existing) => existing._id === p._id)
  );
  return [...prevProducts, ...uniqueProducts];
});

    } else {
      setProducts(data.products);
    }

    setTotal(data?.total || 0); //  update filtered total count

    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
};

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  //handle filter checkbox changes
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // run filter or reset products when filters change
  useEffect(() => {
    if (checked.length || radio.length) {
      setFiltering(true);
      setFilterPage(1);
      filterProduct(1, false);
    } else {
      setFiltering(false);
      getAllProducts();
    }
  }, [checked, radio]);

  // load more filtered products if filterPage changes
  useEffect(() => {
    if (filterPage === 1) return;
    if (filtering) {
      filterProduct(filterPage, true);
    }
  }, [filterPage]);

  //load more for non-filtered products
  useEffect(() => {
    if (page === 1) return;
    if (!filtering) {
      loadMore();
    }
  }, [page]);

  //load more non-filtered products
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="container-fluid row mt-3">



<SearchBar setProducts={setProducts} />






      <div className="col-md-2">
        <h4 className="text-center">Filter By Category</h4>
        <div className="d-flex flex-column">
          {categories?.map((c) => (
            <Checkbox
              key={c._id}
              onChange={(e) => handleFilter(e.target.checked, c._id)}
            >
              {c.name}
            </Checkbox>
          ))}
        </div>
        {/* price filter */}
        <h4 className="text-center mt-4">Filter By Price</h4>
        <div className="d-flex flex-column">
          <Radio.Group onChange={(e) => setRadio(e.target.value)}>
            {Prices?.map((p) => (
              <div key={p._id}>
                <Radio value={p.array}>{p.name}</Radio>
              </div>
            ))}
          </Radio.Group>
        </div>
        <div className="d-flex flex-column">
          <button
            className="btn btn-danger"
            onClick={() => window.location.reload()}
          >
            RESET FILTERS
          </button>
        </div>
      </div>
      <div className="col-md-9">
        <h1 className="text-center">All Products</h1>
        <div className="d-flex flex-wrap">
          {products?.map((p) => (
            <div key={p._id} className="card m-2" style={{ width: "18rem" }}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}...</p>
                <p className="card-text"> $ {p.price}</p>
                <button className="btn btn-primary ms-1">More Details</button>
                <button className="btn btn-secondary ms-1">ADD TO CART</button>
              </div>
            </div>
          ))}
        </div>
        <div className="m-2 p-3">
          {products && (
  <button
    className="btn btn-warning"
    onClick={(e) => {
      e.preventDefault();
      if (filtering) {
        setFilterPage(filterPage + 1);
      } else {
        setPage(page + 1);
      }
    }}
  >
    {loading ? "Loading ..." : "Load More"}
  </button>
)}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
