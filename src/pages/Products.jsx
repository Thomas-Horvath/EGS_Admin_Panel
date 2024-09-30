import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import ConfirmDialog from '../components/ConfirmDialog';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const productsPerPage = 10;

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        // Alapértelmezett szűrés
        const savedFilters = JSON.parse(localStorage.getItem('searchFilters'));
        if (savedFilters?.categoryFilter) {
          setCategoryFilter(savedFilters.categoryFilter);
        } else {
          setFilteredProducts(data); // Szűrés nélküli lista
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  };

  const applyFilters = (category) => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter((product) => product.SubCategoryName === category || (category === 'akciók' && product.OnSale));
    }

    setFilteredProducts(filtered);
    setCurrentPage(0); // Oldalszám visszaállítása az első oldalra szűrés után
  };

  useEffect(() => {
    fetchProducts(); // Alapértelmezett termékek betöltése
  }, []);

  useEffect(() => {
    // Alapértelmezett szűrés alkalmazása, ha van mentett kategória
    const savedFilters = JSON.parse(localStorage.getItem('searchFilters'));
    if (savedFilters?.categoryFilter) {
      applyFilters(savedFilters.categoryFilter);
    } else {
      setFilteredProducts(products); // Alapértelmezett lista megjelenítése
    }
  }, [products]);

  const offset = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(offset, offset + productsPerPage);
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0);
  };

  const handleSearch = () => {
    // Szűrés alkalmazása és kategória mentése
    localStorage.setItem('searchFilters', JSON.stringify({ categoryFilter }));
    applyFilters(categoryFilter);
  };

  const handleReset = () => {
    setCategoryFilter('');
    localStorage.removeItem('searchFilters');
    setFilteredProducts(products);
    setCurrentPage(0); // Oldalszám visszaállítása az első oldalra reset után
  };



  // termék törlése 
  const handleDeleteClick = (productId) => {
    setProductIdToDelete(productId);
    setShowConfirmDialog(true);
  };

  const deleteProduct = () => {
    const token = sessionStorage.getItem('token');
    fetch(`${process.env.REACT_APP_API_URL}/api/product/${productIdToDelete}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setShowConfirmDialog(false);
        setProductIdToDelete(null);
        fetchProducts(); // Frissítjük a termékeket
      })
      .catch((error) => console.error('Error deleting product:', error));
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setProductIdToDelete(null);
  };


  if (loading) {
    return <div className="data-loading">
      <div>Töltés...</div>
    </div>
  }

  return (
    <div className="product-page-container">
      <h1>Termékek</h1>
      <div className="filter-container">
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
                    <td>
                      {product.OnSale ? (
                        <>
                          <span style={{ textDecoration: 'line-through' }}> {product.Price} FT</span> {product.SalePrice} FT
                        </>
                      ) : (
                        `${product.Price} FT`
                      )}
                    </td>
                    <td>
                      <Link to={`/termékek/${product.ProductID}`} className="icon-button">
                        <FaEye />
                      </Link>
                      <Link to={`/termékek/szerkesztés/${product.ProductID}`} className="icon-button">
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDeleteClick(product.ProductID)} className="icon-button delete-button">
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {showConfirmDialog && (
          <ConfirmDialog
            message="Biztosan törölni szeretnéd a terméket?"
            onConfirm={deleteProduct}
            onCancel={cancelDelete}
          />
        )}
      </div>
      <ReactPaginate
        previousLabel={'Előző'}
        nextLabel={'Következő'}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
        forcePage={currentPage}
      />
    </div>
  );
};

export default Products;
