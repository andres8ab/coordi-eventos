import Image from 'next/image'
import Link from 'next/link'
import { useCountries } from '../lib/getCountries'
import { AddToFavoriteButton, DeleteFromFavoriteButton } from './SubmitButtons'
import { DeleteFromFavorite, addToFavorite } from '../actions'

interface iAppProps {
  imagePath: string
  description: string
  location: string
  price: number
  userId: string | undefined
  isInFavoriteList: boolean
  favoriteId: string
  eventId: string
  pathName: string
}

export function ListingCard({
  description,
  imagePath,
  location,
  price,
  userId,
  favoriteId,
  isInFavoriteList,
  eventId,
  pathName,
}: iAppProps) {
  const { getCountriesByValue } = useCountries()
  const country = getCountriesByValue(location)
  return (
    <div className="flex flex-col">
      <div className="relative h-72">
        <Image
          src={imagePath}
          // src={`https://res.cloudinary.com/dd3i3urhx/image/upload/v1711410065/uqzzbragyqvcudfkuzed.webp`}
          alt="Image of Event"
          fill
          className="rounded-lg h-full object-cover"
        />
        {userId && (
          <div className="z-10 absolute top-2 right-2">
            {isInFavoriteList ? (
              <form action={DeleteFromFavorite}>
                <input type="hidden" name="favoriteId" value={favoriteId} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="pathName" value={pathName} />
                <DeleteFromFavoriteButton />
              </form>
            ) : (
              <form action={addToFavorite}>
                <input type="hidden" name="eventId" value={eventId} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="pathName" value={pathName} />
                <AddToFavoriteButton />
              </form>
            )}
          </div>
        )}
      </div>
      <Link className="mt-2" href={`/event/${eventId}`}>
        <h3 className="font-medium text-base">
          {country?.flag} {country?.label} / {country?.region}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>
        <p className="pt-2 text-muted-foreground">
          <span className="font-medium text-black">${price}</span>
        </p>
      </Link>
    </div>
  )
}