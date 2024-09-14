import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FaEye, FaTrashAlt, FaEdit } from 'react-icons/fa';
import ConfirmDialog from '../components/ConfirmDialog';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const ordersPerPage = 10;

  // Fetch orders from API
  const fetchOrders = () => {
    setLoading(true);
    const token = sessionStorage.getItem('token');
    fetch('https://thomasapi.eu/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${token}`,
      },
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        const offset = 0;
        setCurrentOrders(data.slice(offset, ordersPerPage));
        setPageCount(Math.ceil(data.length / ordersPerPage));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);



  // Handle page click for pagination
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    const offset = selected * ordersPerPage;
    const newCurrentOrders = orders.slice(offset, offset + ordersPerPage);
    setCurrentOrders(newCurrentOrders);
    window.scrollTo(0, 0);
  };


  // delete function
  const handleDeleteClick = (orderId) => {
    setOrderIdToDelete(orderId);
    setShowConfirmDialog(true);
  };


  const deleteOrder = () => {
    const token = sessionStorage.getItem('token');
    fetch(`https://thomasapi.eu/api/order/${orderIdToDelete}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setShowConfirmDialog(false);
        fetchOrders();
        setCurrentPage(0);
      })
      .catch((error) => console.error('Error:', error));
  };



  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setOrderIdToDelete(null);
  };


  if (loading) {
    return <div className="data-loading">
      <div>Töltés...</div>
    </div>
  }



  return (
    <div className="orders-page-container">
      <h1>Rendelések</h1>
      <div className="table-wrapper">
        {orders.length === 0 ? (
          <p>Nincs megjeleníthető rendelés!</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>OrderID</th>
                <th>CustomerID</th>
                <th>Rendelési dátum</th>
                <th>Összeg</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.OrderID}>
                  <td>{order.OrderID}</td>
                  <td>{order.CustomerID}</td>
                  <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                  <td>{order.TotalDue} Ft</td>
                  <td>
                    <Link to={`/rendelés/${order.OrderID}`} className="icon-button">
                      <FaEye /> {/* Megtekintés ikon */}
                    </Link>
                    <Link to={`/rendelés/szerkesztés/${order.OrderID}`} className="icon-button">
                      <FaEdit /> {/* Szerkesztés ikon */}
                    </Link>
                    <button onClick={() => handleDeleteClick(order.OrderID)} className="icon-button delete-button">
                      <FaTrashAlt /> {/* Törlés ikon */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}


        {showConfirmDialog && (
          <ConfirmDialog
            message="Biztosan törölni szeretnéd a rendelést?"
            onConfirm={deleteOrder}
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

export default Orders;
