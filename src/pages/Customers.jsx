import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FaEye, FaEdit , FaTrashAlt } from 'react-icons/fa';
import ConfirmDialog from '../components/ConfirmDialog';

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const usersPerPage = 10;

  // Fetch users from API
  const fetchUsers = () => {
    const token = sessionStorage.getItem('token');
    fetch('https://thomasapi.eu/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${token}`,
      },
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((data) => {
        // Filter out non-admin users
        const customers = data.filter(user => !user.IsAdmin);
        setUsers(customers);
        setCurrentUsers(customers.slice(0, usersPerPage));
        setPageCount(Math.ceil(customers.length / usersPerPage));
      })
      .catch((error) => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle page click for pagination
  const handlePageClick = ({ selected }) => {
    const offset = selected * usersPerPage;
    const newCurrentUsers = users.slice(offset, offset + usersPerPage);
    setCurrentUsers(newCurrentUsers);
    window.scrollTo(0, 0);
  };

  // delete function
  const handleDeleteClick = (userId) => {
    setUserIdToDelete(userId); // Tároljuk a törlendő felhasználó ID-jét
    setShowConfirmDialog(true); // Megjelenítjük a megerősítő ablakot
  };



  const deleteCustomer = () => {
    const token = sessionStorage.getItem('token');
    fetch(`https://thomasapi.eu/api/user/${userIdToDelete}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setShowConfirmDialog(false); // Bezárjuk a megerősítő ablakot
        fetchUsers(); // Törlés után újra lekérjük az adatokat
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false); // Bezárjuk a megerősítő ablakot
    setUserIdToDelete(null); // Töröljük a tárolt ID-t
  };

  return (
    <div className="customers-page-container">
      <h1>Vásárlók</h1>
      <div className="table-wrapper">
        {users.length === 0 ? (
          <p>Nincs megjeleníthető vásárló!</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>UserID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Telefonszám</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.UserID}>
                  <td>{user.UserID}</td>
                  <td>{user.UserName}</td>
                  <td>{user.EmailAddress}</td>
                  <td>{user.PhoneNumber}</td>
                  <td>
                    <Link to={`/vasarlok/${user.UserID}`} className="icon-button">
                      <FaEye /> {/* Megtekintés ikon */}
                    </Link>
                    <Link to={`/vasarlok/szerkesztés/${user.UserID}`} className="icon-button">
                      <FaEdit /> {/* Szerkesztés ikon */}
                    </Link>
                    <button onClick={() => handleDeleteClick(user.UserID)}className="icon-button delete-button">
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
            message="Biztosan törölni szeretnéd ezt a felhasználót?"
            onConfirm={deleteCustomer}
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
      />
    </div>
  );
};

export default Customers;
