import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const OrderDetails = () => {
  const [orderData, setOrderData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    // Fetch the order data
    const fetchOrder = fetch(`https://thomasapi.eu/api/order/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
    })
      .then((res) => res.json())
      .catch((err) => {
        setError("Nem sikerült lekérni a rendelés adatokat");
        console.error(err);
      });

    fetchOrder.then((order) => {
      if (!order || !order.OrderItems) {
        setError("Nincsenek termékek a rendelésben.");
        setLoading(false);
        return;
      }

      // Fetch customer data
      const fetchCustomer = fetch(`https://thomasapi.eu/api/user/${order.CustomerID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
      }).then((res) => res.json());

      // Fetch all products in parallel
      const fetchProducts = Promise.all(
        order.OrderItems.map((item) =>
          fetch(`https://thomasapi.eu/api/product/${item.ProductID}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
            mode: 'cors',
          }).then((res) => res.json())
        )
      );

      // Handle all promises
      Promise.all([fetchCustomer, fetchProducts]).then(([customer, products]) => {
        setOrderData(order);
        setCustomerData(customer);
        setProductData(products);
        setLoading(false);
      });
    });
  }, [id]);

  if (loading) {
    return <div className="data-loading">
      <div>Töltés...</div>
    </div>
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="order-details">
      <h2>Rendelés Részletei</h2>
      {orderData && (
        <>
          <p>Rendelés azonosító: #{orderData.OrderID}</p>
          <h3><span>Megrendelő adatai:</span></h3>
          <div className="customer-info">
            <p><span>Megrendelő neve:</span> {customerData.LastName} {customerData.FirstName}</p>
            <p><span>Email címe:</span> {customerData.EmailAddress}</p>
            <p><span>Telefonszám:</span> {customerData.PhoneNumber}</p>
            <p><span>Cím:</span> {customerData.Postcode} {customerData.City} {customerData.Address}</p>
          </div>
          <div className="shipping-info">
            <p>
              <span>Szállítási cím: </span>{orderData.ShippingPostcode || customerData.Postcode}{" "}
              {orderData.ShippingCity || customerData.City}{" "}
              {orderData.ShippingAddress || customerData.Address}
            </p>
          </div>

          <p>Rendelés dátuma: {new Date(orderData.OrderDate).toLocaleDateString()}</p>
          <p>Megjegyzés: {orderData.Comment ? orderData.Comment : 'Nincs megjegyzés!'}</p>
          <p>Szállítás: {orderData.DeliveryTypeID === 1 ? 'Futárszolgálat' : ''}</p>
          <p>Szállítás díj: {orderData.Freight} Ft</p>
          <h3>Termékek:</h3>
          <div className="order-summary">
            {orderData.OrderItems.map((item, index) => (
              <div key={item._id} className="summary-item">
                <div className="product-details-wrapper">
                  <h4>{productData[index].BrandName} - {productData[index].Name}</h4>
                  <div className="product-details">
                    <p>Mennyiség: {item.Quantity} db</p>
                    <p>Egységár: {item.UnitPrice} Ft</p>
                    <p>Teljes ár: {item.LineTotal} Ft</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h2 className="total-price-text">Rendelés végösszege: </h2>
          <span className="total-price">{orderData.TotalDue} Ft</span>
        </>
      )}

      <div className="button-group">
        <button onClick={() => navigate(-1)} className="btn">Vissza</button>
        <Link to={`/rendelés/szerkesztés/${id}`}><button className="btn">Rendelés szerkesztése</button></Link>
      </div>
    </div>

  );
};

export default OrderDetails;
