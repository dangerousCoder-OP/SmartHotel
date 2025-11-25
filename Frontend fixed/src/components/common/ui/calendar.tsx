import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('calendar-root', className)}
      classNames={{
        months: 'dp-months',
        month: 'dp-month',
        caption: 'dp-caption',
        caption_label: 'dp-caption-label',
        nav: 'dp-nav',
        nav_button: 'dp-nav-btn',
        nav_button_previous: 'dp-nav-prev',
        nav_button_next: 'dp-nav-next',
        table: 'dp-table',
        head_row: 'dp-head-row',
        head_cell: 'dp-head-cell',
        row: 'dp-row',
        cell: 'dp-cell',
        day: 'dp-day',
        day_selected: 'dp-day-selected',
        day_today: 'dp-day-today',
        day_outside: 'dp-day-outside',
        day_disabled: 'dp-day-disabled',
        day_range_middle: 'dp-day-range-middle',
        day_hidden: 'dp-day-hidden',
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
