import Image from 'next/image'
import Link from 'next/link'
import DesktopLogo from '../../public/coordinadora.png'
import MobileLogo from '../../public/coordi-logo.webp'
import { UserNav } from './UserNav'
import { SearchModalComponent } from './SearchComponent'

export function Navbar() {
  return (
    <nav className="w-full border-b">
      <div className="flex items-center justify-between container mx-auto px-5 lg:px-10 py-5">
        <Link href="/">
          <Image
            src={DesktopLogo}
            alt="Desktop lovo"
            className="w-54 hidden lg:block"
          />
          <Image
            src={MobileLogo}
            alt="Mobile lovo"
            className="block lg:hidden w-12"
          />
        </Link>
        <SearchModalComponent />
        <UserNav />
      </div>
    </nav>
  )
}
export default Navbar
