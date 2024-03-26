import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import prisma from '../lib/db'
import { redirect } from 'next/navigation'
import { NoItem } from '../components/NoItem'
import { ListingCard } from '../components/ListingCard'

async function getData(userId: string) {
  const data = await prisma.event.findMany({
    where: {
      userId: userId,
      addedCategory: true,
      addedDescription: true,
      addedLocation: true,
    },
    select: {
      id: true,
      country: true,
      photo: true,
      description: true,
      price: true,
      Favorite: {
        where: {
          userId: userId,
        },
      },
    },
    orderBy: {
      createdAT: 'desc',
    },
  })

  return data
}

export default async function MyEvents() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    return redirect('/')
  }

  const data = await getData(user.id)
  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Tus Eventos</h2>
      {data.length === 0 ? (
        <NoItem
          title="Aun no tienes eventos en la lista"
          description="Por favor agrega eventos para ver en esta lista..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={item.id}
              imagePath={item.photo as string}
              eventId={item.id}
              price={item.price as number}
              description={item.description as string}
              location={item.country as string}
              userId={user.id}
              pathName="/my-events"
              favoriteId={item.Favorite[0]?.id}
              isInFavoriteList={item.Favorite.length > 0 ? true : false}
            />
          ))}
        </div>
      )}
    </section>
  )
}
