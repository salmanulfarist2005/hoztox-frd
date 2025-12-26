import React, { useContext, useEffect, useState } from "react";
import { FarzaaContext } from "../../context/FarzaaContext";
import axios from "axios";
import { BASE_URL } from "../helpers/config";
import { useSearchParams } from "react-router-dom";

const ProductCategoryList = () => {
  const { handleCategoryFilter } = useContext(FarzaaContext);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCollapsed, setCollapsed] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
const [searchParams, setSearchParams] = useSearchParams();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/categories/`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCategoryClick = (categoryName) => {
    if (activeCategory === categoryName) {
      newParams.set("id", activeCategory);
      setActiveCategory(null);
      handleCategoryFilter(null);

      return;
    }
    setActiveCategory(categoryName);
    handleCategoryFilter(categoryName);
  };

//   const handleCategoryClick = (id) => {
//   const currentId = searchParams.get("id");

//   const newParams = new URLSearchParams(searchParams);

//   if (currentId === String(id)) {
//     newParams.delete("id");
//     handleCategoryFilter(null);
//   } else {
//     newParams.set("id", id);
//     handleCategoryFilter(id);
//   }

//   setSearchParams(newParams, { replace: true });
// };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="sidebar-single-area product-categories-area">
      <div className="flex items-center gap-4  cursor-pointer">
        <h3 className="sidebar-single-area__title">Product Categories</h3>
        {viewportWidth < 992 && (
          <span
            onClick={() => setCollapsed(!isCollapsed)}
            className="fz-3-footer-subs-icon block lg:hidden pb-3"
          >
            <i
              className={`fa-light ${isCollapsed ? "fa-bars" : "fa-xmark"}`}
              style={{ fontSize: "24px", cursor: "pointer" }}
            ></i>
          </span>
        )}
      </div>

      {!isCollapsed && (
        <ul className="product-categories mt-2">
          {categories.length > 0 ? (
            categories.map((categoryObj) => (
              <li
                key={categoryObj.id}
                onClick={() => handleCategoryClick(categoryObj.id)}
                className={
                  activeCategory === categoryObj.category_name ? "active" : ""
                }
                style={{ cursor: "pointer", textTransform: "capitalize" }}
              >
                {categoryObj.category_name.toUpperCase()}
              </li>
            ))
          ) : (
            <li>No categories available</li>
          )}
        </ul>
      )}
    </section>
  );
};

export default ProductCategoryList;
