import React, { useState, useEffect, useCallback } from 'react';
import DashboardCard from '../components/DashboardCard';


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
    fetchAllData();
  };

  useEffect(() => {
    fetchAllData(); // Adatok betöltése az első renderkor
  }, [fetchAllData]);

  if (loading) {
    return <div className='dashboard'>
      <div className="data-cards">
        <div>Töltés...</div>
        <button className='btn fresh-btn' onClick={handleRefresh}>Adatok frissítése</button>
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
    'linear-gradient(to right, #6f42c1, #9f7edb)'
  ];


  return (
    <div className='dashboard'>
      <div className="data-cards">
        <div className="card-container">
          <DashboardCard title="Vásárlók" value={userCount} background={backgroundColors[0]} />
          <DashboardCard title="Rendelések" value={orderCount} background={backgroundColors[1]} />
          <DashboardCard title="Termékek" value={productCount} background={backgroundColors[2]} />
          <DashboardCard title="Össz. bevétel" value={`${formattedRevenue} FT`} background={backgroundColors[3]} />
        </div>
        <button className='btn fresh-btn' onClick={handleRefresh}>Adatok frissítése</button>
      </div>




    </div>
  );
};

export default Dashboard;
