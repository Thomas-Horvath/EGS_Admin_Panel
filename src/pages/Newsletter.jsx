import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';



const Newsletter = () => {
    const [users, setUsers] = useState([]);
    const [currentUsers, setCurrentUsers] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const usersPerPage = 10;



    const fetchNewsletters = () => {
        setLoading(true);
        const token = sessionStorage.getItem('token');

        fetch('https://thomasapi.eu/api/newslettersAll', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`,
            },
            mode: 'cors',
        })
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setCurrentUsers(data.slice(0, usersPerPage));
                setPageCount(Math.ceil(data.length / usersPerPage));
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchNewsletters();
    }, []);


    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
        const offset = selected * usersPerPage;
        const newCurrentUsers = users.slice(offset, offset + usersPerPage);
        setCurrentUsers(newCurrentUsers);
        window.scrollTo(0, 0);
    };




    // Checkbox változtatás kezelése és PUT kérés küldése
    const handleCheckboxChange = (email, isActive) => {
        const token = sessionStorage.getItem('token');


        // Küldj PUT kérést az isActive mező frissítéséhez
        fetch(`https://thomasapi.eu/api/newsletterUpdate`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                email: email,
                isActive: !isActive // az új isActive érték fordítva
            }),
        })
            .then((res) => res.json())
            .then((updatedUser) => {
                // Frissítjük a felhasználókat a lokális állapotban
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.email === updatedUser.email ? { ...user, isActive: updatedUser.isActive } : user
                    )
                );
                setCurrentUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.email === updatedUser.email ? { ...user, isActive: updatedUser.isActive } : user
                    )
                );
            })
            .catch((error) => {
                console.error('Error updating user status:', error);
            });
    };


    const handleDelete = (email) => {
        const token = sessionStorage.getItem('token');

        fetch(`https://thomasapi.eu/api/newsletterDelete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email }),
        })
            .then((res) => res.json())
            .then((response) => {
                const updatedUsers = users.filter((user) => user.email !== email);
                setUsers(updatedUsers);

                const newPageCount = Math.ceil(updatedUsers.length / usersPerPage);
                setPageCount(newPageCount);

                // Frissítsd az aktuális oldalt, ha a törölt elem az utolsó az aktuális oldalon
                if (currentPage >= newPageCount && newPageCount > 0) {
                    setCurrentPage(newPageCount - 1);
                }

                // Frissítsd a jelenlegi felhasználókat
                const offset = (currentPage >= newPageCount ? newPageCount - 1 : currentPage) * usersPerPage;
                const newCurrentUsers = updatedUsers.slice(offset, offset + usersPerPage);
                setCurrentUsers(newCurrentUsers);

            })
            .catch((error) => {
                console.error('Error deleting user:', error);
            });
    };





    if (loading) {
        return <div className="data-loading">
            <div>Töltés...</div>
        </div>
    }

    return (
        <div className="customers-page-container">
            <h1>Hírlevél felíratkozások</h1>
            <div className="table-wrapper">
                {users.length === 0 ? (
                    <p>Nincs megjeleníthető vásárló!</p>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Sorszám</th>
                                <th>Email cím</th>
                                <th>Státusz</th>
                                <th>Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <tr key={index}>
                                    <td>#{(currentPage * usersPerPage) + index + 1}</td>
                                    <td>{user.email}</td>
                                    <td className={`status ${user.isActive ? 'active' : 'inactive'}`}>{user.isActive ? "Felíratkozva" : "Leíratkozva"}</td>
                                    <td>
                                        <div className="content-wrapper">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="status"
                                                    checked={user.isActive}
                                                    onChange={() => handleCheckboxChange(user.email, user.isActive)}
                                                /> Felíratkozás ki- és bekapcsolása
                                            </label>
                                            <button className="icon-button delete-button" onClick={() => handleDelete(user.email)}>Törlés</button>
                                        </div>
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
                forcePage={currentPage}
            />
        </div>
    );
};

export default Newsletter;
