'use client'

import { categoryItems } from '@/app/lib/categoryItems'
import { Card, CardHeader } from '../../components/ui/card'
import Image from 'next/image'
import { useState } from 'react'

export function SelectedCategory() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  )
  return (
    <div className="grid grid-cols-4 gap-8 mt-10 w-3/5 mx-auto mb-36">
      <input
        type="hidden"
        name="categoryName"
        value={selectedCategory as string}
      />
      {categoryItems.map((item) => (
        <div key={item.id} className="cursor-pointer">
          <Card
            className={selectedCategory === item.name ? 'border-primary' : ''}
            onClick={() => setSelectedCategory(item.name)}
          >
            <CardHeader>
              <Image
                src={item.imageUrl}
                alt={item.name}
                className="h-8 w-8"
                width={32}
                height={32}
              />
              <h3 className="font-medium">{item.title}</h3>
            </CardHeader>
          </Card>
        </div>
      ))}
    </div>
  )
}
