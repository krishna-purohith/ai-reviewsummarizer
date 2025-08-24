import { StarIcon } from 'lucide-react';
import ReviewList from './components/reviews/ReviewList';

function App() {
   return (
      <div className="p-4 h-screen w-full">
         <ReviewList productId={1} />
         <StarIcon />
      </div>
   );
}

export default App;
