import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import StarIcon from './StarIcon';
import { IoSparklesSharp } from 'react-icons/io5';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import ReviewSkeleton from './ReviewSkeletion';

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

type SummarizeResponse = {
   summary: string;
};

type GetReviewsResponse = {
   reviews: Review[];
   summary: string | null;
};

const ReviewList = ({ productId }: Props) => {
   const reviewsQuery = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const summaryMutation = useMutation<SummarizeResponse>({
      mutationFn: () => summarizeReviews(),
   });

   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   const summarizeReviews = async () => {
      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/reviews/summarize`
      );
      return data;
   };

   if (reviewsQuery.isLoading) {
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

   if (reviewsQuery.isError) {
      return (
         <p className="text-red-600">{'Could not fetch reviews. Try again!'}</p>
      );
   }

   if (!reviewsQuery.data?.reviews.length) {
      return null;
   }

   const currentSummary =
      reviewsQuery.data.summary || summaryMutation.data?.summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>
                  <span className="font-semibold">Summary: </span>
                  {currentSummary}
               </p>
            ) : (
               <div>
                  <Button
                     onClick={() => summaryMutation.mutate()}
                     className="cursor-pointer"
                     disabled={summaryMutation.isPending}
                  >
                     <IoSparklesSharp />
                     Summarize
                  </Button>
                  {summaryMutation.isPending && <ReviewSkeleton />}
                  {summaryMutation.isError && (
                     <p className="text-red-500">
                        'Could not load summary, try again!'
                     </p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-6">
            {reviewsQuery.data?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarIcon rating={review.rating} />
                  </div>
                  <p className="py-1">{review.content}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
