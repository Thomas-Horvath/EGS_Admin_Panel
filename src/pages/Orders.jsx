import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FaEye, FaTrashAlt, FaEdit } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const ordersPerPage = 10;

  // Fetch orders from API
  const fetchOrders = () => {
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
      })
      .catch((error) => console.error('Error fetching orders:', error));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle page click for pagination
  const handlePageClick = ({ selected }) => {
    const offset = selected * ordersPerPage;
    const newCurrentOrders = orders.slice(offset, offset + ordersPerPage);
    setCurrentOrders(newCurrentOrders);
    window.scrollTo(0, 0);
  };

  // Delete order function (example)
  const deleteOrder = (orderId) => {
    const token = sessionStorage.getItem('token');
    fetch(`https://thomasapi.eu/api/order/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        fetchOrders(); // Törlés után újra lekérjük az adatokat
      })
      .catch((error) => console.error('Error deleting order:', error));
  };

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
                    <Link to={`/rendelesek/${order.OrderID}`} className="icon-button">
                      <FaEye /> {/* Megtekintés ikon */}
                    </Link>
                    <Link to={`/rendelesek/szerkesztés/${order.OrderID}`} className="icon-button">
                      <FaEdit /> {/* Szerkesztés ikon */}
                    </Link>
                    <button onClick={() => deleteOrder(order.OrderID)} className="icon-button delete-button">
                      <FaTrashAlt /> {/* Törlés ikon */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default Orders;
