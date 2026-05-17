import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuth();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    let isMounted = true;
    
    const verify = async () => {
      const success = await verifyEmail(token);
      if (isMounted) {
        setStatus(success ? 'success' : 'error');
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 text-center">
          
          {status === 'verifying' && (
            <div>
              <Loader2 className="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
              <h2 className="mt-6 text-xl font-medium text-gray-900">Verifying your email...</h2>
              <p className="mt-2 text-sm text-gray-500">Please wait a moment while we verify your account.</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="mt-6 text-xl font-medium text-gray-900">Verified Successfully!</h2>
              <p className="mt-2 text-sm text-gray-500 mb-6">Your Gmail is verified. You can now return to the login page to access your account.</p>
              <Link 
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-6 text-xl font-medium text-gray-900">Verification Failed</h2>
              <p className="mt-2 text-sm text-gray-500 mb-6">
                The verification link is invalid or has expired.
              </p>
              <Link 
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Return to Login
              </Link>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
