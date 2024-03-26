'use server'

import { redirect } from 'next/navigation'
import prisma from './lib/db'
import { supabase } from './lib/supabase'
import { revalidatePath } from 'next/cache'
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function createCoorEvent({ userId }: { userId: string }) {
  const data = await prisma.event.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAT: 'desc',
    },
  })

  if (data === null) {
    const data = await prisma.event.create({
      data: {
        userId: userId,
      },
    })

    return redirect(`/create/${data.id}/structure`)
  } else if (
    !data.addedCategory &&
    !data.addedDescription &&
    !data.addedLocation
  ) {
    return redirect(`/create/${data.id}/structure`)
  } else if (data.addedCategory && !data.addedDescription) {
    return redirect(`/create/${data.id}/description`)
  } else if (
    data.addedCategory &&
    data.addedDescription &&
    !data.addedLocation
  ) {
    return redirect(`/create/${data.id}/address`)
  } else if (
    data.addedCategory &&
    data.addedDescription &&
    data.addedLocation
  ) {
    const data = await prisma.event.create({
      data: {
        userId: userId,
      },
    })

    return redirect(`/create/${data.id}/structure`)
  }
}

export async function createCategoryPage(formData: FormData) {
  const categoryName = formData.get('categoryName') as string
  const eventId = formData.get('eventId') as string
  const data = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      categoryName: categoryName,
      addedCategory: true,
    },
  })

  return redirect(`/create/${eventId}/description`)
}

export async function CreateDescription(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = formData.get('price')
  const imageFile = formData.get('image') as File
  const eventId = formData.get('eventId') as string

  const guestNumber = formData.get('guest') as string
  const daysNumber = formData.get('days') as string
  const timeNumber = formData.get('time') as string

  // const { data: imageData } = await supabase.storage
  //   .from('images')
  //   .upload(`${imageFile.name}-${new Date()}`, imageFile, {
  //     cacheControl: '2592000',
  //     contentType: 'image/png',
  //   })

  // const { resources: imageData } = await cloudinary.api.resources_by_tag(
  //   'images'
  // )

  const arrayBuffer = await imageFile.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  const imageData: UploadApiResponse = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({}, function (error, result) {
        if (error) {
          reject(error)
          return
        }
        resolve(result as UploadApiResponse)
        return result
      })
      .end(buffer)
  })
  console.log(imageData.url)
  const data = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      title: title,
      description: description,
      price: Number(price),
      days: daysNumber,
      time: timeNumber,
      guests: guestNumber,
      photo: imageData!.url,
      addedDescription: true,
    },
  })

  return redirect(`/create/${eventId}/address`)
}

export async function createLocation(formData: FormData) {
  const eventId = formData.get('eventId') as string
  const countryValue = formData.get('countryValue') as string
  const data = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      addedLocation: true,
      country: countryValue,
    },
  })
  return redirect('/')
}

export async function addToFavorite(formData: FormData) {
  const eventId = formData.get('eventId') as string
  const userId = formData.get('userId') as string
  const pathName = formData.get('pathName') as string

  const data = await prisma.favorite.create({
    data: {
      eventId: eventId,
      userId: userId,
    },
  })

  revalidatePath(pathName)
}

export async function DeleteFromFavorite(formData: FormData) {
  const favoriteId = formData.get('favoriteId') as string
  const pathName = formData.get('pathName') as string
  const userId = formData.get('userId') as string

  const data = await prisma.favorite.delete({
    where: {
      id: favoriteId,
      userId: userId,
    },
  })
  revalidatePath(pathName)
}

export async function createReservation(formData: FormData) {
  const userId = formData.get('userId') as string
  const eventId = formData.get('eventId') as string

  const data = await prisma.reservation.create({
    data: {
      userId: userId,
      eventId: eventId,
    },
  })

  return redirect('/')
}
