import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://thomasapi.eu/api/product/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            mode: 'cors',
        })
            .then((res) => res.json())
            .then((data) => setProduct(data))
            .catch((error) => console.error('Error fetching product details:', error));
    }, [id]);

    if (!product) {
        return <div className="data-loading">
            <div>Töltés...</div>
        </div>
    }
    return (
        <div className="product-details-container">
            <h1>{product.BrandName} - {product.Name}</h1>
            <div className="details-container">
                <div className="img-wrapper">
                    <img src={product.ProductPhotoURL} alt={product.Name} className="product-image" />
                </div>
                <div className="product-info">
                    {product.Model && product.Model !== "" && <p><strong>Modell:</strong> {product.Model}</p>}
                    {product.Color && product.Color !== "" && <p><strong>Szín:</strong> {product.Color}</p>}
                    {product.Quality && product.Quality !== "" && <p><strong>Minőség:</strong> {product.Quality}</p>}
                    {product.BundsNumber && product.BundsNumber !== "" && <p><strong>Bundok száma:</strong> {product.BundsNumber}</p>}
                    {product.Body && product.Body !== "" && <p><strong>Test:</strong> {product.Body}</p>}
                    {product.Neck && product.Neck !== "" && <p><strong>Nyak:</strong> {product.Neck}</p>}
                    {product.FretBoard && product.FretBoard !== "" && <p><strong>Fretboard:</strong> {product.FretBoard}</p>}
                    {product.Pickup && product.Pickup !== "" && <p><strong>Pickup:</strong> {product.Pickup}</p>}
                    {product.Weight !== undefined && product.Weight !== 0 && <p><strong>Súly:</strong> {product.Weight}</p>}
                    {product.ChannelsNumber !== undefined && product.ChannelsNumber !== 0 && <p><strong>Csatornák száma:</strong> {product.ChannelsNumber}</p>}
                    {product.SpeakersNumber !== undefined && product.SpeakersNumber !== 0 && <p><strong>Hangszórók száma:</strong> {product.SpeakersNumber}</p>}
                    {product.Wattage !== undefined && product.Wattage !== 0 && <p><strong>Teljesítmény:</strong> {product.Wattage} Watt</p>}
                    {product.Width !== undefined && product.Width !== 0 && <p><strong>Szélesség:</strong> {product.Width} mm</p>}
                    {product.Length !== undefined && product.Length !== 0 && <p><strong>Hossz:</strong> {product.Length} mm</p>}
                    {product.Thickness !== undefined && product.Thickness !== 0 && <p><strong>Vastagság:</strong> {product.Thickness} mm</p>}
                    {product.CableLength !== undefined && product.CableLength !== 0 && <p><strong>Kábel hossz:</strong> {product.CableLength} m</p>}
                    {product.ConnectorType && product.ConnectorType !== "" && <p><strong>Csatlakozó típus:</strong> {product.ConnectorType}</p>}
                    {product.Radius && product.Radius !== "" && <p><strong>Rádiusz:</strong> {product.Radius}</p>}
                    {product.CategoryName && product.CategoryName !== "" && <p><strong>Kategória:</strong> {product.CategoryName}</p>}
                    {product.SubCategoryName && product.SubCategoryName !== "" && <p><strong>Alkategória:</strong> {product.SubCategoryName}</p>}
                    {product.Price !== undefined && product.Price !== 0 && <p><strong>Ár:</strong> {product.Price} Ft</p>}
                    {product.Description && product.Description !== "" && <p><strong>Leírás:</strong> {product.Description}</p>}
                    {product.OnSale !== undefined && <p><strong>Akciós:</strong> {product.OnSale ? 'Igen' : 'Nem'}</p>}
                    {product.SalePrice !== undefined && product.SalePrice !== 0 && <p><strong>Akciós ár:</strong> {product.SalePrice} Ft</p>}
                    {product.InStock !== undefined && <p><strong>Raktáron:</strong> {product.InStock ? 'Igen' : 'Nem'}</p>}
                </div>
            </div>

            <div className="button-group">
                <button onClick={() => navigate(-1)} className="btn">Vissza</button>
                <button onClick={() => navigate(`/termékek/szerkesztés/${product.ProductID}`)} className="btn">Termék szerkesztése</button>
            </div>
        </div>
    );
};

export default ProductDetails;
