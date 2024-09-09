import React, { useState, useEffect, useCallback } from 'react';
import DashboardCard from '../components/DashboardCard';
import { FaUserFriends, FaShoppingBag, FaDollarSign } from "react-icons/fa";
import { BsFillBoxSeamFill } from "react-icons/bs";


const Dashboard = () => {
  const [data, setData] = useState({ users: [], orders: [], products: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Token lekérése a session storage-ból
      const token = sessionStorage.getItem('token');

      // Az API végpontok URL-jei
      const usersUrl = 'https://thomasapi.eu/api/users';
      const ordersUrl = 'https://thomasapi.eu/api/orders';
      const productsUrl = 'https://thomasapi.eu/api/products';

      // Header információk beállítása
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8'
      };

      // Az összes fetch hívás egy tömbbe gyűjtése
      const [usersResponse, ordersResponse, productsResponse] = await Promise.all([
        fetch(usersUrl, { headers }),
        fetch(ordersUrl, { headers }),
        fetch(productsUrl, { headers })
      ]);

      // Az adatok JSON formátumúra alakítása
      const users = await usersResponse.json();
      const orders = await ordersResponse.json();
      const products = await productsResponse.json();

      // Az adatok beállítása
      setData({ users, orders, products });
      setLoading(false); // Betöltés befejezve
    } catch (error) {
      // Hibakezelés
      console.error('Hiba történt a fetch hívások során:', error);
      setError(error);
      setLoading(false); // Betöltés befejezve hibával
    }
  }, []); // Az üres dependency array biztosítja, hogy csak egyszer fut le a komponens betöltődésekor

  // Különálló függvény a frissítéshez
  const handleRefresh = () => {
    window.scrollTo(0, 0)
    fetchAllData();
  };

  useEffect(() => {
    fetchAllData(); // Adatok betöltése az első renderkor
  }, [fetchAllData]);

  if (loading) {
    return <div className='dashboard'>
      <div className="data-loading">
        <div>Töltés...</div>
      </div>
    </div>
  }

  if (error) {
    return <div className='dashboard'>
      <div className="data-cards">
        <div>Error: {error.message}</div>
        <button className='btn fresh-btn' onClick={handleRefresh}>Adatok frissítése</button>
      </div>
    </div>
  }

  // Szűrés az admin felhasználók kizárásával
  const userCount = data.users.filter(user => !user.isAdmin).length;

  // Összes rendelés
  const orderCount = data.orders.length;

  // Összes termék
  const productCount = data.products.length;

  // Összes bevétel
  const totalRevenue = data.orders.reduce((total, order) => total + order.TotalDue, 0);
  const formattedRevenue = totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');


  // Színek beállítása
  const backgroundColors = [
    'linear-gradient(to right, #28a745, #81c784)', // Zöld
    'linear-gradient(to right, #007bff, #6baaf7)', // Kék
    'linear-gradient(to right, #dc3545, #f28b8c)', // Piros
    'linear-gradient(to right, #6f42c1, #9f7edb)' // lila
  ];


  return (
    <div className='dashboard'>
      <div className="data-cards">
        <div className="dashboard-card-container">
          <DashboardCard
            title="Vásárlók"
            value={userCount}
            background={backgroundColors[0]}
            icon={<FaUserFriends />}
            unit={'db'}
          />
          <DashboardCard
            title="Rendelések"
            value={orderCount}
            background={backgroundColors[1]}
            icon={<FaShoppingBag />}
            unit={'db'}
          />
          <DashboardCard
            title="Termékek"
            value={productCount}
            background={backgroundColors[2]}
            icon={<BsFillBoxSeamFill />}
            unit={'db'}
          />
          <DashboardCard
            title="Össz. bevétel"
            value={`${formattedRevenue}`}
            background={backgroundColors[3]}
            icon={<FaDollarSign />
            } unit={'ft'}
          />

        </div>
        <section className="datas">
          <h3>Legutóbbi Rendelések</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rendelés ID</th>
                  <th>Ügyfél ID</th>
                  <th>Összesen</th>
                  <th>Dátum</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.slice(-5).map(order => (
                  <tr key={order.OrderID}>
                    <td>{order.OrderID}</td>
                    <td>{order.CustomerID}</td>
                    <td>{order.TotalDue} FT</td>
                    <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="datas">
          <h3>Legújabb Vásárlók</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vásárló ID</th>
                  <th>Név</th>
                  <th>Email</th>
                  <th>Regisztráció dátuma</th>
                </tr>
              </thead>
              <tbody>
                {data.users.slice(-5).map(user => (
                  <tr key={user.UserID}>
                    <td>{user.UserID}</td>
                    <td>{user.LastName} {user.FirstName}</td>
                    <td>{user.EmailAddress}</td>
                    <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="datas">
          <h3>Legnagyobb Bevételt Generáló Termékek</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Termék ID</th>
                  <th>Név</th>
                  <th>Bevétel</th>
                </tr>
              </thead>
              <tbody>
                {data.products
                  .map(product => ({
                    ...product,
                    revenue: data.orders
                      .filter(order => order.OrderItems.some(item => item.ProductID === product.ProductID))
                      .reduce((total, order) => total + order.OrderItems.find(item => item.ProductID === product.ProductID).LineTotal, 0)
                  }))
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5) // Top 5
                  .map(product => (
                    <tr key={product.ProductID}>
                      <td>{product.ProductID}</td>
                      <td>{product.BrandName} {product.Name}</td>
                      <td>{product.revenue} FT</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>




        <button className='btn fresh-btn' onClick={handleRefresh}>Adatok frissítése</button>
      </div>




    </div>
  );
};

export default Dashboard;
