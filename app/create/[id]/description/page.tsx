'use client'

import { CreateDescription } from '@/app/actions'
import { Counter } from '@/app/components/Counter'
import { CreationBottomBar } from '@/app/components/CreationBottomBar'
import { Card, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function DescriptionPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <>
      <div className="w-3/5 mx-auto">
        <h2 className="text-3xl font-semibold tracking-tight transition-colors">
          Describe los detalles del evento!
        </h2>
      </div>
      <form action={CreateDescription}>
        <input type="hidden" name="eventId" value={params.id} />
        <div className="mx-auto w-3/5 mt-10 flex flex-col gap-y-5 mb-36">
          <div className="flex flex-col gap-y-2">
            <Label>Titulo</Label>
            <Input
              name="title"
              type="text"
              required
              placeholder="Sensillo y corto..."
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Descipcion</Label>
            <Textarea
              name="description"
              required
              placeholder="Por favor describe el evento"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Precio</Label>
            <Input
              name="price"
              type="number"
              required
              placeholder="Precio en COP"
              min={10000}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Imagen</Label>
            <Input name="image" type="file" required />
          </div>
          <Card>
            <CardHeader className="flex flex-col gap-y-5">
              <div className="flex item-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Invitados</h3>
                  <p className="text-muted-foreground text-sm">
                    Cual es la cantidad de invitados?
                  </p>
                </div>
                <Counter name="guest" />
              </div>
              <div className="flex item-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Dias</h3>
                  <p className="text-muted-foreground text-sm">
                    Cuantos dias dura el evento?
                  </p>
                </div>
                <Counter name="days" />
              </div>
              <div className="flex item-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Tiempo</h3>
                  <p className="text-muted-foreground text-sm">
                    Cuantas horas dura el evento?
                  </p>
                </div>
                <Counter name="time" />
              </div>
            </CardHeader>
          </Card>
        </div>
        <CreationBottomBar />
      </form>
    </>
  )
}
