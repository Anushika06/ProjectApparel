import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import './HomePage.css'; // add this import for the new hero styles

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error('Could not load products.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="homepage">
      {/* ✅ Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Custom Apparel Made Easy!</h1>
          <p>From corporate polos to sports jerseys — we manufacture apparel that represents your identity.</p>
          <a href="#products" className="hero-btn">Shop Now</a>
        </div>
        <div className="hero-image">
          <img
            src="https://immago.com/wp-content/uploads/2023/07/history-of-apparel-industry-1.jpg"
            alt="Hero banner"
          />
        </div>
      </section>

      {/* ✅ Product Section */}
      <section id="products" className="product-section">
        <h2>All T-Shirts</h2>
        <div className="product-list">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p>No T-shirts found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
