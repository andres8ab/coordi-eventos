import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { ListingCard } from '../components/ListingCard'
import { NoItem } from '../components/NoItem'
import prisma from '../lib/db'
import { redirect } from 'next/navigation'

async function getData(userId: string) {
  const data = await prisma.reservation.findMany({
    where: {
      userId: userId,
    },
    select: {
      Event: {
        select: {
          photo: true,
          id: true,
          price: true,
          country: true,
          description: true,
          Favorite: {
            where: {
              userId: userId,
            },
          },
        },
      },
    },
  })
  return data
}

export default async function ReservationsRoute() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return redirect('/')
  const data = await getData(user?.id)
  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">
        Tus Suscripciones
      </h2>
      {data.length === 0 ? (
        <NoItem
          title="Aun no tienes suscripciones"
          description="Por favor suscribe eventos para ver aqui..."
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
              favoriteId={item.Event?.Favorite[0]?.id as string}
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
