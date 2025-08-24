import axios from 'axios';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import StarIcon from './StarIcon';

type Props = {
   productId: number;
};

type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

type GetReviewsResponse = {
   reviews: Review[];
   summary: string | null;
};

const ReviewList = ({ productId }: Props) => {
   const [reviewData, setReviewData] = useState<GetReviewsResponse>();
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const fetchReviews = async () => {
      try {
         setIsLoading(true);
         const { data } = await axios.get<GetReviewsResponse>(
            `/api/products/${productId}/reviews`
         );
         setReviewData(data);
      } catch (error) {
         console.log(error);
         setError('Unable to get reviews. Please try later!');
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchReviews();
   }, []);

   if (isLoading) {
      return (
         <div className="flex flex-col gap-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
               <div key={i}>
                  <Skeleton width={130} />
                  <Skeleton width={90} />
                  <Skeleton count={2} />
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return <p className="text-red-600">{error}</p>;
   }

   return (
      <div className="flex flex-col gap-6">
         {reviewData?.reviews.map((review) => (
            <div key={review.id}>
               <div className="font-semibold">{review.author}</div>
               <div>
                  <StarIcon rating={review.rating} />
               </div>
               <p className="py-1">{review.content}</p>
            </div>
         ))}
      </div>
   );
};

export default ReviewList;
