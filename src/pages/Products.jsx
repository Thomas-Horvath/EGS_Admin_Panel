// import React, { useEffect, useState } from 'react';
// import ReactPaginate from 'react-paginate';
// import { Link } from 'react-router-dom';
// import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';


// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const productsPerPage = 20;


//   useEffect(() => {
//     fetch('https://thomasapi.eu/api/products', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json; charset=UTF-8',
//       },
//       mode: 'cors',
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setProducts(data);
//         setFilteredProducts(data);
//       })
//       .catch((error) => console.error('Error fetching products:', error));
//   }, []);



//   useEffect(() => {
//     if (isSearching) {
//       let filtered = products;

//       if (categoryFilter) {
//         filtered = filtered.filter((product) => product.SubCategoryName === categoryFilter || (categoryFilter === 'akciók' && product.OnSale));
//       }

//       if (searchQuery.length >= 3) { // Minimum 3 karakter
//         const lowerCaseQuery = searchQuery.toLowerCase();
//         filtered = filtered.filter((product) =>
//           product.Name.toLowerCase().includes(lowerCaseQuery) ||
//           product.BrandName.toLowerCase().includes(lowerCaseQuery)
//         );
//       }

//       setFilteredProducts(filtered);
//       setIsSearching(false); // Reset keresési állapot
//     }
//   }, [isSearching, categoryFilter, searchQuery, products]);


//   const offset = currentPage * productsPerPage;
//   const currentProducts = filteredProducts.slice(offset, offset + productsPerPage);
//   const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//     window.scrollTo(0, 0);
//   };

//   const handleSearch = () => {
//     setIsSearching(true); // Indítsa el a keresést
//   };


//   const handleReset = () => {
//     setSearchQuery('');
//     setCategoryFilter('');
//     setIsSearching(false);
//     setFilteredProducts(products)
//   };




//   const deleteProduct = (id) => {
//     fetch(`https://thomasapi.eu/api/product/${id}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json; charset=UTF-8',
//         'Authorization': 'Bearer saját-token',
//       },
//       mode: 'cors',
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log('Deleted:', data);
//         setProducts(products.filter((product) => product.ProductID !== id));
//       })
//       .catch((error) => console.error('Error deleting product:', error));
//   };

//   return (
//     <div className="product-page-container">
//       <h1>Termékek</h1>
//       <div className="filter-container">
//         <div className="input-group">
//           <label htmlFor="search">Termék keresése</label>
//           <input
//             id='search'
//             type="text"
//             placeholder="Termék keresése..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value.trim())}
//           />

//         </div>
//         <div className="input-group">
//           <label htmlFor="select">Válassz egy kategóriát:</label>
//           <select
//             id='select'
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//           >
//             <option value="">Összes kategória</option>
//             <option value="Balkezes">Balkezes</option>
//             <option value="Jobbkezes">Jobbkezes</option>
//             <option value="Héthúros">Héthúros</option>
//             <option value="Fej">Fej</option>
//             <option value="Gitár kábel">Gitár kábel</option>
//             <option value="Pedál">Pedál</option>
//             <option value="Mulltieffekt">Mulltieffekt</option>
//             <option value="Pengető">Pengető</option>
//             <option value="Láda">Láda</option>
//             <option value="Puha tok">Puha tok</option>
//             <option value="Combó">Combó</option>
//             <option value="Heveder">Heveder</option>
//             <option value="Húr">Húr</option>
//             <option value="Kemény tok">Kemény tok</option>
//             <option value="akciók">Akciók</option>
//           </select>
//         </div>
//         <div className="button-group">
//           <button className='btn' onClick={handleSearch}>Keresés</button>
//           <button className='btn' onClick={handleReset} >Reset</button>
//         </div>
//       </div>
//       <div className="table-wrapper">
//         {filteredProducts.length === 0 ? (
//           <p className='search-alert'>Nincs a keresésnek megfelelő termék!</p>
//         ) : (
//           <>
//             <table className="product-table">
//               <thead>
//                 <tr>
//                   <th>ProductID</th>
//                   <th>Kép</th>
//                   <th>Márka és Név</th>
//                   <th>Ár</th>
//                   <th>Műveletek</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentProducts.map((product) => (
//                   <tr key={product.ProductID}>
//                     <td>{product.ProductID}</td>
//                     <td>
//                       <img src={product.ProductPhotoURL} alt={product.Name} width="50" />
//                     </td>
//                     <td>{product.BrandName} - {product.Name}</td>
//                     <td>{product.Price} Ft</td>
//                     <td>
//                       <Link to={`/termékek/${product.ProductID}`} className="icon-button">
//                         <FaEye /> {/* Megtekintés ikon */}
//                       </Link>
//                       <Link to={`/termékek/szerkesztés/${product.ProductID}`} className="icon-button">
//                         <FaEdit /> {/* Szerkesztés ikon */}
//                       </Link>
//                       <button onClick={() => deleteProduct(product.ProductID)} className="icon-button delete-button">
//                         <FaTrashAlt /> {/* Törlés ikon */}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         )}
//       </div>
//       <ReactPaginate
//         previousLabel={'Előző'}
//         nextLabel={'Következő'}
//         pageCount={pageCount}
//         onPageChange={handlePageClick}
//         containerClassName={'pagination'}
//         activeClassName={'active'}
//       />
//     </div>
//   );
// };

// export default Products;




// második megoldás


import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const productsPerPage = 20;

  useEffect(() => {
    // Fetch products data
    fetch('https://thomasapi.eu/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        // Load search filters from localStorage
        const storedFilters = JSON.parse(localStorage.getItem('searchFilters')) || {};
        const { categoryFilter: storedCategoryFilter = '', searchQuery: storedSearchQuery = '' } = storedFilters;

        setCategoryFilter(storedCategoryFilter);
        setSearchQuery(storedSearchQuery);

        // Apply filters based on localStorage
        applyFilters(storedCategoryFilter, storedSearchQuery);
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);




  const applyFilters = (category, query) => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter((product) => product.SubCategoryName === category || (category === 'akciók' && product.OnSale));
    }

    if (query.length >= 3) { // Minimum 3 karakter
      const lowerCaseQuery = query.toLowerCase();
      filtered = filtered.filter((product) =>
        product.Name.toLowerCase().includes(lowerCaseQuery) ||
        product.BrandName.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    if (isSearching) {
      applyFilters(categoryFilter, searchQuery);
      setIsSearching(false);
    }
  }, [isSearching, categoryFilter, searchQuery]);

  useEffect(() => {
    // Apply filters automatically when products or search state changes
    applyFilters(categoryFilter, searchQuery);
  }, [products]);

  const offset = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(offset, offset + productsPerPage);
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0);
  };

  const handleSearch = () => {
    localStorage.setItem('searchFilters', JSON.stringify({ categoryFilter, searchQuery }));
    setIsSearching(true);
  };

  const handleReset = () => {
    setSearchQuery('');
    setCategoryFilter('');
    localStorage.removeItem('searchFilters');
    setIsSearching(true);
  };

  const deleteProduct = (id) => {
    fetch(`https://thomasapi.eu/api/product/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer saját-token',
      },
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Deleted:', data);
        setProducts(products.filter((product) => product.ProductID !== id));
      })
      .catch((error) => console.error('Error deleting product:', error));
  };

  return (
    <div className="product-page-container">
      <h1>Termékek</h1>
      <div className="filter-container">
        <div className="input-group">
          <label htmlFor="search">Termék keresése</label>
          <input
            id='search'
            type="text"
            placeholder="Termék keresése..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.trim())}
          />
        </div>
        <div className="input-group">
          <label htmlFor="select">Válassz egy kategóriát:</label>
          <select
            id='select'
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Összes kategória</option>
            <option value="Balkezes">Balkezes</option>
            <option value="Jobbkezes">Jobbkezes</option>
            <option value="Héthúros">Héthúros</option>
            <option value="Fej">Fej</option>
            <option value="Gitár kábel">Gitár kábel</option>
            <option value="Pedál">Pedál</option>
            <option value="Mulltieffekt">Mulltieffekt</option>
            <option value="Pengető">Pengető</option>
            <option value="Láda">Láda</option>
            <option value="Puha tok">Puha tok</option>
            <option value="Combó">Combó</option>
            <option value="Heveder">Heveder</option>
            <option value="Húr">Húr</option>
            <option value="Kemény tok">Kemény tok</option>
            <option value="akciók">Akciók</option>
          </select>
        </div>
        <div className="button-group">
          <button className='btn' onClick={handleSearch}>Keresés</button>
          <button className='btn' onClick={handleReset}>Reset</button>
        </div>
      </div>
      <div className="table-wrapper">
        {filteredProducts.length === 0 ? (
          <p className='search-alert'>Nincs a keresésnek megfelelő termék!</p>
        ) : (
          <>
            <table className="product-table">
              <thead>
                <tr>
                  <th>ProductID</th>
                  <th>Kép</th>
                  <th>Márka és Név</th>
                  <th>Ár</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.ProductID}>
                    <td>{product.ProductID}</td>
                    <td>
                      <img src={product.ProductPhotoURL} alt={product.Name} width="50" />
                    </td>
                    <td>{product.BrandName} - {product.Name}</td>
                    <td>{product.Price} Ft</td>
                    <td>
                      <Link to={`/termékek/${product.ProductID}`} className="icon-button">
                        <FaEye /> {/* Megtekintés ikon */}
                      </Link>
                      <Link to={`/termékek/szerkesztés/${product.ProductID}`} className="icon-button">
                        <FaEdit /> {/* Szerkesztés ikon */}
                      </Link>
                      <button onClick={() => deleteProduct(product.ProductID)} className="icon-button delete-button">
                        <FaTrashAlt /> {/* Törlés ikon */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      <ReactPaginate
        previousLabel={'Előző'}
        nextLabel={'Következő'}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default Products;
