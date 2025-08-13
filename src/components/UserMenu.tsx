import { useMsal } from '@azure/msal-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export function UserMenu({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { accounts, instance } = useMsal();
  const account = accounts[0];

  const logout = async () => {
    await instance.logoutPopup();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">{account?.name || 'Account'}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onOpenSettings}>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}