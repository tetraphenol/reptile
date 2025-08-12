import { useState } from 'react';
import { useMsal } from '@azure/msal-react';

export function UserMenu({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { accounts, instance } = useMsal();
  const account = accounts[0];
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await instance.logoutPopup();
  };

  return (
    <div className="relative">
      <button className="button" onClick={() => setOpen((v) => !v)}>{account?.name || 'Account'}</button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 card p-2 shadow-xl">
          <button className="button w-full mb-2" onClick={() => { setOpen(false); onOpenSettings(); }}>Settings</button>
          <button className="button w-full" onClick={logout}>Sign out</button>
        </div>
      )}
    </div>
  );
}