const TypingIndicator = () => {
   return (
      <div className="flex gap-1 px-3 py-3 bg-gray-100 self-start rounded-xl">
         <Dot />
         <Dot className="[animation-delay:0.2s]" />
         <Dot className="[animation-delay:0.4s]" />
      </div>
   );
};

type Props = {
   className?: string;
};

const Dot = ({ className }: Props) => {
   return (
      <div
         className={`w-2 h-2 rounded-full bg-gray-800 animate-pulse ${className}`}
      ></div>
   );
};

export default TypingIndicator;
