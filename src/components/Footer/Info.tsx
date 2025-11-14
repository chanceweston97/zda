import Link from 'next/link'

const hours = [
  {
    id: 1,
    label: 'Mon - Fri : 8:30AM - 5:00PM',
    href: '#',
  }
]
const address = [
  {
    id: 1,
    label: '3040 McNaughton Dr. Ste. A Columbia, SC 29223',
    href: '#',
  },
  {
    id: 2,
    label: 'sales@zdacomm.com',
    href: 'email:sales@zdacomm.com',
  },
  {
    id: 3,
    label: '+1 (803) 419-4702',
    href: 'tel:18034194702',
  }
]

export default function Info() {
  return (
    <div className="w-full sm:w-auto">
      <h2 className="mb-7.5 text-custom-1 font-medium text-white">
        Hours
      </h2>

      <ul className="flex flex-col gap-3">
        {
          hours.map((link) => (
            <li key={link.id}>
              <Link
                className="ease-out duration-200 hover:text-white"
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}

      </ul>
      <h2 className="mb-7.5 mt-7.5 text-custom-1 font-medium text-white">
        Address
      </h2>

      <ul className="flex flex-col gap-3">
        {
          address.map((link) => (
            <li key={link.id}>
              <Link
                className="ease-out duration-200 hover:text-white"
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}

      </ul>
    </div>
  )
}
