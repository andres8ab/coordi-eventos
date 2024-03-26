/* eslint-disable @next/next/no-img-element */
import { createReservation } from '@/app/actions'
import { CategoryShowcase } from '@/app/components/CategoryShowcase'
import { EventMap } from '@/app/components/EventMap'
import { ReservationSubmitButton } from '@/app/components/SubmitButtons'
import prisma from '@/app/lib/db'
import { useCountries } from '@/app/lib/getCountries'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import Image from 'next/image'
import Link from 'next/link'

async function getData(eventId: string) {
  const data = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      photo: true,
      description: true,
      guests: true,
      days: true,
      time: true,
      title: true,
      categoryName: true,
      price: true,
      country: true,
      Reservation: {
        where: {
          eventId: eventId,
        },
      },
      User: {
        select: {
          profileImage: true,
          firstName: true,
        },
      },
    },
  })
  return data
}

export default async function EventRoute({
  params,
}: {
  params: { id: string }
}) {
  const data = await getData(params.id)
  const { getCountriesByValue } = useCountries()
  const country = getCountriesByValue(data?.country as string)
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  return (
    <div className="w-[75%] mx-auto mt-10 mb-12">
      <h1 className="font-medium text-2xl mb-5">{data?.title}</h1>
      <div className="relative h-[550px]">
        <Image
          alt="image of event"
          src={`${data?.photo}`}
          fill
          className="rounded-lg h-full object-cover w-full"
        />
      </div>
      <div className="flex justify-between gap-x-24 mt-8">
        <div className="w-2/3">
          <h3 className="text-xl font-medium">
            {country?.flag} {country?.label} / {country?.region}
          </h3>
          <div className="flex gap-x-2 text-muted-foreground">
            <p>{data?.guests} Personas</p> * <p>{data?.days} Dias</p> *{' '}
            <p>{data?.time} Horas</p>
          </div>
          <div className="flex item-center mt-6">
            <img
              src={
                data?.User?.profileImage ??
                'https://cdn-icons-png.flaticon.com/512/9187/9187532.png'
              }
              alt="User Profile"
              className="w-11 h-11 rounded-full"
            />
            <div className="flex flex-col ml-4">
              <h3 className="font-medium">
                Auspiciado por {data?.User?.firstName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Auspiciante desde 2012
              </p>
            </div>
          </div>
          <Separator className="my-7" />
          <CategoryShowcase categoryName={data?.categoryName as string} />
          <Separator className="my-7" />
          <p className="text-muted-foreground">{data?.description}</p>
          <Separator className="my-7" />
          <EventMap locationValue={country?.value as string} />
        </div>

        <form action={createReservation}>
          <input type="hidden" name="eventId" value={params.id} />
          <input type="hidden" name="userId" value={user?.id} />

          {user?.id ? (
            <ReservationSubmitButton />
          ) : (
            <Button className="w-full" asChild>
              <Link href="/api/auth/login">Suscribirse</Link>
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
