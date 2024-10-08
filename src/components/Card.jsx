import { useState, useEffect, useContext } from "react";
import './Card.css';
import { ThemeContext } from "../js/context";
import Placeholder from "./Placeholder";

const Card = () => {
  const [errors, setErrors] = useState(false);
  const { query, setLoading, loading, currentPage, setRecipe, recipe, setPagination } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      setPagination(false)
      setLoading(true);
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        if (!response.ok) throw new Error('Server problem');
        const data = await response.json();
        if (data.meals) {
          setRecipe(data.meals);
          setErrors(false);
          setPagination(true);
        }
        else {
          setErrors(`sorry couldn't find any recipe`);
          setRecipe([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = recipe != null ? recipe.slice(indexOfFirstItem, indexOfLastItem) : null;
  console.log(currentItems);


  const formatTags = (tags) => {
    return tags.split(',').slice(0, 2).join(', ');
  };

  return (
    <>
      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <Placeholder key={index} />
        ))
      ) : recipe.length > 0 ? (
        currentItems.map((recipes) => (
          <div className="card" key={recipes.idMeal}>
            <div className="card-img">
              <img src={recipes.strMealThumb} alt={recipes.strMeal} />
            </div>
            <div className="recipe-content shadow-lg">
              <h3 className="dish-title">{recipes.strMeal}</h3>
              <p className="dish-area space">Dish: {recipes.strArea}</p>
              {recipes.strTags ? <p className="space">Type: {formatTags(recipes.strTags)}</p> : null}
              <a href={recipes.strYoutube} className="link space" target="_blank" rel="noopener noreferrer">
                Watch Recipe On <span>Youtube</span>
              </a>
              <a href={recipes.strSource} className="link space" target="_blank" rel="noopener noreferrer">
                View Recipe Source
              </a>
            </div>
          </div>
        ))
      )
        :
        errors ? <p>{errors}</p>
          :
          null
      }
    </>
  );
};

export default Card;


// Asynchronous Nature:

// State updates in React are asynchronous. If you check the state immediately after setting it, you may not get the updated value right away.
// Ensure that your logic for rendering is always based on the current state values.