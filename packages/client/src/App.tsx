import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';

function App() {
   const [message, setMessage] = useState('');

   useEffect(() => {
      fetch('/api/ai')
         .then((res) => res.json())
         .then((data) => setMessage(data.message));
   }, []);
   return (
      <div className="p-4">
         <p className="font-bold text-3xl">{message}</p>
         <Button>Shadcn!!</Button>
      </div>
   );
}

export default App;
