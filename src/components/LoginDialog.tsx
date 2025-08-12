import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';

export function LoginDialog() {
  const { instance } = useMsal();

  const handleLogin = async () => {
    await instance.loginPopup(loginRequest);
  };

  return (
    <div className="dialog-backdrop">
      <div className="card w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-2">Sign in to Microsoft</h2>
        <p className="text-sm text-neutral-400 mb-4">Connect your OneDrive to store Reptile settings and projects.</p>
        <button className="button w-full" onClick={handleLogin}>Sign in with Microsoft</button>
      </div>
    </div>
  );
}