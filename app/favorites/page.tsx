import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import prisma from '../lib/db'
import { redirect } from 'next/navigation'
import { NoItem } from '../components/NoItem'
import { ListingCard } from '../components/ListingCard'

async function getData(userId: string) {
  const data = await prisma.favorite.findMany({
    where: {
      userId: userId,
    },
    select: {
      Event: {
        select: {
          photo: true,
          id: true,
          Favorite: true,
          price: true,
          country: true,
          description: true,
        },
      },
    },
  })
  return data
}

export default async function FavoriteRoute() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user) return redirect('/')
  const data = await getData(user.id)
  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Tus Favoritos</h2>
      {data.length === 0 ? (
        <NoItem
          title="Aun no tienes favoritos"
          description="Por favor agrega favoritos para ver aqui..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={item.Event?.id}
              description={item.Event?.description as string}
              location={item.Event?.country as string}
              pathName="/favorites"
              eventId={item.Event?.id as string}
              imagePath={item.Event?.photo as string}
              price={item.Event?.price as number}
              userId={user.id}
              favoriteId={item.Event?.Favorite[0].id as string}
              isInFavoriteList={
                (item.Event?.Favorite.length as number) > 0 ? true : false
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}
