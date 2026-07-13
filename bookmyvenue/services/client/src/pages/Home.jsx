import { Navigate } from 'react-router-dom';
import keycloak from '../configs/keycloak';

export default function Home() {
  if (keycloak.authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to VenueApp</h1>
      <p className="text-xl text-gray-600 mb-8">Find the perfect venue, or list yours today.</p>
      
      <div className="flex gap-4">
        <button 
          onClick={() => keycloak.login()} 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          Login
        </button>
        
        <button 
          onClick={() => keycloak.register()} 
          className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold"
        >
          Register
        </button>
      </div>
    </div>
  );
}