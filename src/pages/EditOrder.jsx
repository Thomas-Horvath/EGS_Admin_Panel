import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderDetails = () => {
  const [orderData, setOrderData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shippingPostcode, setShippingPostcode] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [message, setMessage] = useState();
  const [validationErrors, setValidationErrors] = useState({});
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
        setShippingPostcode(order.ShippingPostcode || customer.Postcode);
        setShippingCity(order.ShippingCity || customer.City);
        setShippingAddress(order.ShippingAddress || customer.Address);
        setLoading(false);
      });
    });
  }, [id]);


  const validateShippingInfo = () => {
    const errors = {};
    if (!shippingPostcode) errors.shippingPostcode = 'Szállítási irányítószám megadása kötelező.';
    if (!shippingCity) errors.shippingCity = 'Szállítási város megadása kötelező.';
    if (!shippingAddress) errors.shippingAddress = 'Szállítási cím megadása kötelező.';
    return errors;
  };


  const handleSaveShipping = () => {
    const token = sessionStorage.getItem('token');

    // Validate shipping info
    const validationErrors = validateShippingInfo();
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    // Check if there are items in the order
    if (!orderData || orderData.OrderItems.length === 0) {
      setMessage('Nem lehet rendelést frissíteni termékek nélkül.');
      return;
    }

    // Új SubTotal és TotalDue kiszámítása
    const subtotal = orderData.OrderItems.reduce((sum, item) => sum + item.LineTotal, 0);
    const freight = subtotal < 25000 ? 2500 : 0;
    const totalDue = subtotal + freight;

    // OrderItems tömbből eltávolítjuk az _id mezőt
    const cleanedOrderItems = orderData.OrderItems.map(({ _id, ...rest }) => rest);

    // Létrehozzuk a frissített rendelési adatokat
    const { _id, OrderID, __v, ...cleanedOrderData } = {
      ...orderData,
      ShippingPostcode: Number(shippingPostcode),
      ShippingCity: shippingCity,
      ShippingAddress: shippingAddress,
      SubTotal: subtotal,
      Freight: freight,
      TotalDue: totalDue,
      OrderItems: cleanedOrderItems
    };



    // PUT kérés az API-nak a rendelés frissítéséhez
    fetch(`https://thomasapi.eu/api/order/${orderData.OrderID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${token}`
      },
      mode: 'cors',
      body: JSON.stringify(cleanedOrderData)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Hiba történt a rendelés frissítése során');
        }
        return res.json();
      })
      .then((updatedOrder) => {
        setOrderData(updatedOrder); // Frissített adatok beállítása
        setMessage('Rendelés sikeresen frissítve!');
        setTimeout(() => { navigate(-1) }, 2000)
      })
      .catch(err => {
        console.error(err);
        setMessage('Nem sikerült frissíteni a rendelést.');
      });
  };


  const updateQuantity = (productId, newQuantity) => {
    const updatedItems = orderData.OrderItems.map(item => {
      if (item.ProductID === productId) {
        return { ...item, Quantity: newQuantity, LineTotal: newQuantity * item.UnitPrice };
      }
      return item;
    });

    const subtotal = updatedItems.reduce((sum, item) => sum + item.LineTotal, 0);
    const totalDue = subtotal < 25000 ? subtotal + 2500 : subtotal;

    setOrderData(prev => ({ ...prev, OrderItems: updatedItems, TotalDue: totalDue }));
  };

  const removeProduct = (productId) => {
    const updatedItems = orderData.OrderItems.filter(item => item.ProductID !== productId);

    const subtotal = updatedItems.reduce((sum, item) => sum + item.LineTotal, 0);
    const totalDue = subtotal < 25000 ? subtotal + 2500 : subtotal;
    const Freight = subtotal < 25000 ? 2500 : 0;

    setOrderData(prev => ({ ...prev, OrderItems: updatedItems, TotalDue: totalDue, Freight: Freight }));
  };

  if (loading) {
    return <div className="data-loading">
      <div>Töltés...</div>
    </div>;
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
            <h3>Szállítási cím szerkesztése:</h3>
            <p>
              <label>Szállítási irányítószám: </label>
              <input type="text" value={shippingPostcode} onChange={(e) => setShippingPostcode(e.target.value)} />
            </p>
              {validationErrors.shippingPostcode && <span className="error-text">{validationErrors.shippingPostcode}</span>}
            <p>
              <label>Szállítási város: </label>
              <input type="text" value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} />
            </p>
              {validationErrors.shippingCity && <span className="error-text">{validationErrors.shippingCity}</span>}
            <p>
              <label>Szállítási cím: </label>
              <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
            </p>
              {validationErrors.shippingAddress && <span className="error-text">{validationErrors.shippingAddress}</span>}

          </div>

          <p>Rendelés dátuma: {new Date(orderData.OrderDate).toLocaleDateString()}</p>
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
                    <button className="btn" onClick={() => updateQuantity(item.ProductID, item.Quantity - 1)} disabled={item.Quantity <= 1}>-</button>
                    <button className="btn" onClick={() => updateQuantity(item.ProductID, item.Quantity + 1)}>+</button>
                    <button className="btn" onClick={() => removeProduct(item.ProductID)}>Törlés</button>
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

      {message && <div className="error-message">{message}</div>}
      <div className="button-group">
        <button onClick={() => navigate(-1)} className="btn">Vissza</button>
        <button className='btn' onClick={handleSaveShipping}>Mentés</button>
      </div>
    </div>
  );
};

export default OrderDetails;
