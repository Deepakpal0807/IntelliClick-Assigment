import CitiesTable from './components/CitiesTable';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 transition-colors duration-500">
   
  <div className="container mx-auto py-8">
    {/* <h1 className="text-3xl font-bold mb-6 text-center text-white">Weather Dashboard</h1> */}
    <CitiesTable />
  </div>
</main>

  );
}