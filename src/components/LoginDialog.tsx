import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

export function LoginDialog() {
  const { instance } = useMsal();

  const handleLogin = async () => {
    await instance.loginPopup(loginRequest);
  };

  return (
    <Dialog open>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">Sign in to Microsoft</DialogTitle>
          <DialogDescription>Connect your OneDrive to store Reptile settings and projects.</DialogDescription>
        </DialogHeader>
        <Button className="w-full" onClick={handleLogin}>Sign in with Microsoft</Button>
      </DialogContent>
    </Dialog>
  );
}