import Skeleton from 'react-loading-skeleton';

const ReviewSkeleton = () => {
   return (
      <div className="mb-5">
         {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
               <Skeleton />
            </div>
         ))}
      </div>
   );
};

export default ReviewSkeleton;
