import React, { Component, useDebugValue } from "react";
import { useState, useEffect } from 'react'
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
  POSTER_SIZE,
} from "../../config";
import HeroImage from "../elements/HeroImage/HeroImage";
import SearchBar from "../elements/SearchBar/SearchBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import MovieThumb from "../elements/MovieThumb/MovieThumb";
import LoadMoreBtn from "../elements/LoadMoreBtn/LoadMoreBtn";
import Spinner from "../elements/Spinner/Spinner";
import "./Home.css";

const Home = () => {
  const [loading, setLoading] = useState(true)
  const [movies, setMovies] = useState([])
  const [heroImage, setHeroImage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [nextPage, setNextPage] = useState(1);
  const [shouldLoadMore, setShouldLoadMore] = useState(false);



  useEffect(() => {
    
    if(!loading){
      return
    }

    const endpoint = searchTerm === '' ? `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${nextPage}` : `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=${nextPage}`

    const fetchItems = async (endpoint) => {
      try{
        const result = await fetch(endpoint)
      const data = await result.json()
      console.log(data)
      setMovies((prevMovies) => [...prevMovies, ...data.results])
      setHeroImage((prevHeroImage) => prevHeroImage || data.results[0])
      setLoading(false)
      setCurrentPage(data.page)
      setTotalPages(data.total_pages) 
      setNextPage(data.page + 1)
      }catch(error){
        console.error('Failed to fetch movies:', error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchItems(endpoint)
  }, [searchTerm, nextPage])

  const searchItems = (searchTerm) => {
    console.log(searchTerm)
    setMovies([])
    setLoading(true)
    setSearchTerm(searchTerm)
  }

  const loadMoreItems = () => {
    setLoading(true)
    setNextPage((prevPage) => prevPage + 1)
  }

  return (
    
    <div className="rmdb-home">
      {heroImage && (
        <div>
          <HeroImage
           image = {`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
           title = {heroImage.original_title}
           text = {heroImage.overview}
          />
          <SearchBar callback = {searchItems} /> 
        </div>
      )}
      <div className="emdb-home-grid">
        <FourColGrid 
          header = {searchTerm ? "Search Result" : "Popular Movies"}
          loading = {loading}
        >
          {movies.map((element, i) => (
            <MovieThumb
              key={i}
              clickable={true}
              image={
                element.poster_path
                ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}`
                : "./images/no_image.jpg"
              }
              movieId={element.id}
              movieName={element.original_title}
            />
          ))}
        </FourColGrid>
        
        {loading ? <Spinner /> : null}
        {currentPage < totalPages && !loading && (
          <LoadMoreBtn text="Load More" onClick={loadMoreItems} />
          
        )}
      </div>
    </div>
  )
}

export default Home;
