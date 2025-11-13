'use client';

import {
  BasketIcon,
  DashboardIcon,
  DownloadsIcon,
  HomeIcon,
  LogOutIcon,
  UserIcon,
} from '@/components/MyAccount/icons';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
      <div className="flex xl:flex-col">
        <div className="hidden lg:flex flex-wrap items-center gap-5 py-6 px-4 sm:px-7.5 xl:px-9 border-r xl:border-r-0 xl:border-b border-gray-3">
          <div className="max-w-[64px] w-full h-16 rounded-full overflow-hidden">
            <Image
              src={session?.user?.image || '/images/avatar.jpeg'}
              alt="user"
              width={64}
              height={64}
            />
          </div>
          <div>
            <p className="font-medium text-dark mb-0.5">
              {session?.user?.name}
            </p>
            <p className="text-custom-xs">Member Since Sep 2020</p>
          </div>
        </div>

        <div className="p-4 sm:p-7.5 xl:p-9">
          <div className="flex flex-wrap xl:flex-nowrap xl:flex-col gap-4">
            <Link href="/my-account">
              <DashboardIcon />
              Dashboard
            </Link>

            <Link href="/my-account/orders">
              <BasketIcon />
              Orders
            </Link>

            <Link href="/my-account/downloads">
              <DownloadsIcon />
              Downloads
            </Link>

            <Link href="/my-account/addresses">
              <HomeIcon />
              Addresses
            </Link>

            <Link href="/my-account/account-details">
              <UserIcon />
              Account Details
            </Link>

            <button
              onClick={() =>
                signOut({
                  callbackUrl: '/signin',
                })
              }
              className="flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white text-dark-2 bg-gray-1"
            >
              <LogOutIcon />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Link({ children, href }: { children: React.ReactNode; href: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NextLink
      href={href}
      className="flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white text-dark-2 bg-gray-1 data-[active=true]:bg-blue data-[active=true]:text-white"
      data-active={isActive}
    >
      {children}
    </NextLink>
  );
}
