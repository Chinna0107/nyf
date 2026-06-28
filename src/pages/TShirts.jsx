import { useSearchParams } from 'react-router-dom';
import CategoryPage from '../components/CategoryPage';

const TShirts = () => {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('category');
  
  let category = 'tshirts';
  let title = 'T-Shirts';

  if (catParam === 'male') {
    category = 'male-tshirts';
    title = 'Male T-Shirts';
  } else if (catParam === 'female') {
    category = 'female-tshirts';
    title = 'Female T-Shirts';
  } else if (catParam === 'oversized') {
    category = 'oversized-tshirts';
    title = 'Oversized T-Shirts';
  }

  return <CategoryPage category={category} title={title} />;
};

export default TShirts;
