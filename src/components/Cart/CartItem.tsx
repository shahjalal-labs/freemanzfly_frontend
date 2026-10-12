"use client"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/Checkbox"

interface CartItemProps {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  selected: boolean
  maxQuantity?: number
  onQuantityChange: (id: string, changeType: 'increase' | 'decrease') => void
  onSelectionChange: (id: string, selected: boolean) => void
  onRemove: (id: string) => void
}

export function CartItem({
  id,
  name,
  price,
  quantity,
  image,
  selected,
  maxQuantity,
  onQuantityChange,
  onSelectionChange,
  onRemove,
}: CartItemProps) {
  // Strict equality check for max quantity
  const canIncrease = !maxQuantity || quantity < maxQuantity;
  const canDecrease = quantity > 1;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      <Checkbox
        checked={selected}
        onCheckedChange={(checked) => onSelectionChange(id, checked as boolean)}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />

      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{name}</h3>
        {maxQuantity && (
          <p className={`text-xs mt-1 ${
            quantity >= maxQuantity ? "text-red-600" : "text-green-600"
          }`}>
            {quantity >= maxQuantity ? "Max quantity reached" : ``}
          </p>
        )}
      </div>

      <div className="text-lg font-semibold text-gray-900">${price}</div>

      <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-200"
          onClick={() => onQuantityChange(id, 'decrease')}
          disabled={!canDecrease}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium">
          {quantity}
          {/* {maxQuantity && `/${maxQuantity}`} */}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-200"
          onClick={() => onQuantityChange(id, 'increase')}
          disabled={!canIncrease}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-lg font-semibold text-gray-900 w-20 text-right">
        ${(price * quantity).toFixed(2)}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={() => onRemove(id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}