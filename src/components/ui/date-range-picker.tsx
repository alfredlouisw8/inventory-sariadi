import * as React from 'react'
import { addDays, format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatInTimeZone } from 'date-fns-tz'
import { TIMEZONE } from '@/utils/const'

interface DatePickerWithRangeProps {
  className?: string // Optional className prop
  label?: string
  onChange: (range: DateRange | undefined) => void // Callback when date range is selected
}

export function DatePickerWithRange({
  className,
  label,
  onChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  // Handle date change internally and pass the new range to onChange
  const handleSelect = (range: DateRange | undefined) => {
    setDate(range)
    onChange(range) // Pass the selected range to the parent component
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {formatInTimeZone(date.from, TIMEZONE, 'dd/MM/yyyy')} -{' '}
                  {formatInTimeZone(date.to, TIMEZONE, 'dd/MM/yyyy')}
                </>
              ) : (
                formatInTimeZone(date.from, TIMEZONE, 'dd/MM/yyyy')
              )
            ) : (
              <span>Pilih {label || 'tanggal'}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect} // Use the internal handler for date selection
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
