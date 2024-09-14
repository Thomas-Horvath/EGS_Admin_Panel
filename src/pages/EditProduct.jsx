import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { colors, brands, models, categoryMap } from '../assets/assets';
import { FaCheck } from 'react-icons/fa';

const EditProduct = () => {
  const { id } = useParams(); // Termék ID lekérése az URL-ből
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Model: '',
    Color: '',
    Quality: 'S',
    BundsNumber: 21,
    Body: '',
    Neck: '',
    FretBoard: '',
    Pickup: '',
    Weight: 0,
    ChannelsNumber: 0,
    SpeakersNumber: 0,
    Wattage: 0,
    Width: 0,
    Length: 0,
    Thickness: 0,
    CableLength: 0,
    ConnectorType: '',
    Radius: '',
    CategoryName: 'Válasz egy kategóriát',
    SubCategoryName: '',
    BrandName: '',
    Price: 0,
    Description: 'Termék leírása .. ',
    OnSale: false,
    SalePrice: 0,
    InStock: true,
    productPhoto: null
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const subCategories = {
    Gitár: ['Balkezes', 'Jobbkezes', 'Héthúros'],
    Erősítő: ['Gitáresősítő fej', 'Gitár kombó', 'Gitár láda'],
    Effekt: ['Effekt pedál', 'Multieffekt pedál'],
    Kiegészítő: ['Gitár kábel', 'Pengető', 'Puha tok', 'Heveder', 'Gitárhúr', 'Kemény tok']
  };


  useEffect(() => {
    setLoading(true);
    // Termék adatainak lekérése az API-ból
    fetch(`https://thomasapi.eu/api/product/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      mode: 'cors'
    })
      .then(res => res.json())
      .then(data => {
        setFormData(data);
        setCategory(data.CategoryName);
        setSubCategory(data.SubCategoryName);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      }); // Hibakezelés
  }, [id]);


  useEffect(() => {
    if (category) {
      setSubCategory(formData.SubCategoryName);
      setFormData(prevData => ({
        ...prevData,
        CategoryName: category,
        SubCategoryName: subCategory
      }));
    }
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
    setFormData(prevData => ({
      ...prevData,
      SubCategoryName: e.target.value
    }));
  };

  const handleQualityChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      Quality: e.target.value === 'Standard' ? 'S' : 'P'
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Name) newErrors.Name = 'A termék neve kötelező';
    if (!formData.Model) newErrors.Model = 'A modell kötelező';
    if (!formData.CategoryName || formData.CategoryName === 'Válasz egy kategóriát') newErrors.CategoryName = 'A kategória kötelező';
    if (!formData.SubCategoryName) newErrors.SubCategoryName = 'Az alkategória kötelező';
    if (!formData.BrandName) newErrors.BrandName = 'A márka kötelező';
    if (formData.Price <= 0) newErrors.Price = 'Az ár kötelező és nagyobb kell legyen, mint 0';
    if (!formData.Description) newErrors.Description = 'A leírás kötelező';
    if (formData.OnSale && formData.SalePrice <= 0) newErrors.SalePrice = 'Az akciós ár kötelező, ha az akciós be van pipálva';


    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }


    const formDataToSend = new FormData();

    for (const key in formData) {
      // amiket nem akarok küldeni azokat kizárom az adatok közül
      if (['ProductPhotoURL', 'ProductID', '_id', 'createdAt', 'updatedAt', '__v'].includes(key)) {
        continue;
      }

      if (key === 'productPhoto' && !formData[key]) {
        // Ha a productPhoto mező null, ne add hozzá a FormData-hoz
        continue;
      }

      formDataToSend.append(key, formData[key]);
    }



    const token = sessionStorage.getItem('token');

    fetch(`https://thomasapi.eu/api/productupdate/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      mode: 'cors',
      body: formDataToSend
    })
      .then(res => res.json())
      .then(data => {
        setSuccessMessage('A termék sikeresen frissítve!');
        setTimeout(() => { navigate('/termékek'); }, 2000);
      })
      .catch(err => {
        console.error(err);
        setSuccessMessage('Hiba történt a frissítés során.');
      });
  };

  if (loading) {
    return <div className="data-loading">
      <div>Töltés...</div>
    </div>
  }

  return (
    <div className="update-container">
      <h2>Termék szerkesztése</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-container">
          <div className="form-group-container">
            {/* Form mezők */}
            <div className="form-group">
              <label htmlFor="Name">Termék neve:</label>
              <input className={errors.Name ? 'input-error' : ''} type="text" id="Name" name="Name" value={formData.Name} onChange={handleInputChange} required />
              {errors.Name && <p className="error">{errors.Name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="Model">Modell:</label>
              <select className={errors.Model ? 'input-error' : ''} id="Model" name="Model" value={formData.Model} onChange={handleInputChange} required>
                <option value="">Válassz modellt</option>
                {models.map(model => <option key={model} value={model}>{model}</option>)}
              </select>
              {errors.Model && <p className="error">{errors.Model}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="Color">Szín:</label>
              <select id="Color" name="Color" value={formData.Color} onChange={handleInputChange}>
                <option value="">Válassz színt</option>
                {colors.map(color => <option key={color} value={color}>{color}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="Quality">Minőség:</label>
              <select id="Quality" name="Quality" value={formData.Quality === 'S' ? 'Standard' : 'Premium'} onChange={handleQualityChange} required>
                <option value="Standard">Standard</option>
                <option value="Premium">Prémium</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="CategoryName">Kategória:</label>
              <select className={errors.CategoryName ? 'input-error' : ''} id="CategoryName" name="CategoryName" value={formData.CategoryName} onChange={handleCategoryChange} required>
                <option value="">Válassz kategóriát</option>
                <option value="Gitár">Gitárok</option>
                <option value="Erősítő">Erősítők</option>
                <option value="Effekt">Effektek</option>
                <option value="Kiegészítő">Kiegészítők</option>
              </select>
              {errors.CategoryName && <p className="error">{errors.CategoryName}</p>}
            </div>


            <div className="form-group">
              <label htmlFor="SubCategoryName">Alkategória:</label>
              <select className={errors.SubCategoryName ? 'input-error' : ''} id="SubCategoryName" name="SubCategoryName" value={formData.SubCategoryName} onChange={handleSubCategoryChange} required>
                <option value="">Válassz alkategóriát</option>
                {(subCategories[category] || []).map(subCat => (
                  <option key={subCat} value={subCat}>{categoryMap[subCat]}</option>
                ))}
              </select>
              {errors.SubCategoryName && <p className="error">{errors.SubCategoryName}</p>}
            </div>


            <div className="form-group">
              <label htmlFor="Description">Leírás:</label>
              <textarea className={errors.Description ? 'input-error' : ''} id="Description" name="Description" value={formData.Description} onChange={handleInputChange} required />
              {errors.Description && <p className="error">{errors.Description}</p>}
            </div>


            <div className="form-group">
              <label htmlFor="BrandName">Márka:</label>
              <select className={errors.Name ? 'input-error' : ''} id="BrandName" name="BrandName" value={formData.BrandName} onChange={handleInputChange} required>
                <option value="">Válassz márkát</option>
                {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
              {errors.BrandName && <p className="error">{errors.BrandName}</p>}
            </div>


          </div>
          <div className="form-group-container">



            <div className="form-group">
              <label htmlFor="Price">Ár:</label>
              <input type="number" id="Price" name="Price" min="0" step={1000} value={formData.Price} onChange={handleInputChange} required />
              {errors.Price && <p className="error">{errors.Price}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="productPhoto">Termék kép:</label>
              <input type="file" id="productPhoto" name="productPhoto" onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>
                <input type="checkbox" id="OnSale" name="OnSale" checked={formData.OnSale} onChange={handleInputChange} />
                <div className="custom-checkbox">
                  {formData.OnSale && <FaCheck className="custom-checkbox-icon" />}
                </div>
                Akciós
              </label>
            </div>

            {formData.OnSale && (
              <div className="form-group">
                <label htmlFor="SalePrice">Akciós ár:</label>
                <input type="number" id="SalePrice" name="SalePrice" min="0" step={1} value={formData.SalePrice} onChange={handleInputChange} />
                {errors.SalePrice && <p className="error">{errors.SalePrice}</p>}
              </div>
            )}


            <div className="form-group">
              <label>
                <input type="checkbox" name="InStock" checked={formData.InStock} onChange={handleInputChange} />
                <div className="custom-checkbox">
                  {formData.InStock && <FaCheck className="custom-checkbox-icon" />}
                </div>
                Raktáron
              </label>
            </div>



            {/* Dinamikus mezők a kiválasztott kategória alapján */}
            {category === 'Gitár' && (
              <>
                <div className="form-group">
                  <label htmlFor="BundsNumber">Bundok száma:</label>
                  <input type="number" id="BundsNumber" name="BundsNumber" min={0} step={1} value={formData.BundsNumber} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="Body">Test:</label>
                  <input type="text" id="Body" name="Body" value={formData.Body} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="Neck">Nyak:</label>
                  <input type="text" id="Neck" name="Neck" value={formData.Neck} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="FretBoard">Fretboard:</label>
                  <input type="text" id="FretBoard" name="FretBoard" value={formData.FretBoard} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="Pickup">Hagszedő kiosztás:</label>
                  <select type="text" id="Pickup" name="Pickup" value={formData.Pickup} onChange={handleInputChange} >
                    <option value="H-H">H-H</option>
                    <option value="H-H-H">H-H-H</option>
                    <option value="H-S-S">H-S-S</option>
                    <option value="S-S-S">S-S-S</option>
                    <option value="H-S-H">H-S-H</option>
                  </select>
                </div>
              </>
            )}
            {category === 'Erősítő' && (
              <>
                <div className="form-group">
                  <label htmlFor="Weight">Súly:</label>
                  <input type="number" id="Weight" name="Weight" min={0} step={1} value={formData.Weight} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="ChannelsNumber">Csatornák száma:</label>
                  <input type="number" id="ChannelsNumber" name="ChannelsNumber" min={0} step={1} value={formData.ChannelsNumber} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="SpeakersNumber">Hangszórók száma:</label>
                  <input type="number" id="SpeakersNumber" name="SpeakersNumber" min={0} step={1} value={formData.SpeakersNumber} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="Wattage">Teljesítmény:</label>
                  <input type="number" id="Wattage" name="Wattage" min={0} step={1} value={formData.Wattage} onChange={handleInputChange} />
                </div>
              </>
            )}
            {category === 'Kiegészítő' && (
              <>
                <div className="form-group">
                  <label htmlFor="Width">Szélesség:</label>
                  <input type="number" id="Width" name="Width" min={0} step={1} value={formData.Width} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="Length">Hossz:</label>
                  <input type="number" id="Length" name="Length" min={0} step={1} value={formData.Length} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="Thickness">Vastagság:</label>
                  <input type="number" id="Thickness" name="Thickness" min={0} step={1} value={formData.Thickness} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="CableLength">Kábelhossz:</label>
                  <input type="number" id="CableLength" name="CableLength" min={0} step={1} value={formData.CableLength} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="ConnectorType">Csatlakozó típus:</label>
                  <input type="text" id="ConnectorType" name="ConnectorType" value={formData.ConnectorType} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="Radius">Radius:</label>
                  <input type="text" id="Radius" name="Radius" value={formData.Radius} onChange={handleInputChange} />
                </div>
              </>
            )}
          </div>
        </div>
        {successMessage && <p className="success">{successMessage}</p>}

        <div className="button-group">
          <button onClick={() => navigate(-1)} className="btn">Vissza</button>
          <button className='btn' type="submit">Frissítés</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
