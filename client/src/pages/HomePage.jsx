import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts(); // Fetches all products
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
    <div>
      <h1>All T-Shirts</h1>
      <div className="product-list">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>No T-shirts found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;