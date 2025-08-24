import { FaStar, FaRegStar } from 'react-icons/fa6';

type Props = {
   rating: number;
};

const StarIcon = ({ rating }: Props) => {
   const placeholders = [1, 2, 3, 4, 5];
   return (
      <div className="flex gap-1 text-yellow-500">
         {placeholders.map((p) =>
            p <= rating ? <FaStar key={p} /> : <FaRegStar key={p} />
         )}
      </div>
   );
};

export default StarIcon;
