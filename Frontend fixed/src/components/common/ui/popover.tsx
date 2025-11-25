import * as React from "react"

import { cn } from "@/utils"

type PopoverContextValue = {
  open: boolean
  setOpen: (o: boolean) => void
  triggerRef: React.RefObject<HTMLElement>
  contentId: string
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

let __popoverId = 0

const Popover: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLElement>(null)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const [contentId] = React.useState(() => `popover-${++__popoverId}`)

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("mousedown", onClick)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("mousedown", onClick)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <PopoverContext.Provider value={{ open, setOpen, triggerRef, contentId }}>
        {children}
      </PopoverContext.Provider>
    </div>
  )
}

type TriggerProps = React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean
  children: React.ReactElement
}

const PopoverTrigger = React.forwardRef<HTMLElement, TriggerProps>(
  ({ asChild = false, children, onClick, ...props }, forwardedRef) => {
    const ctx = React.useContext(PopoverContext)
    if (!ctx) throw new Error("PopoverTrigger must be used within Popover")
    const { open, setOpen, triggerRef, contentId } = ctx

    const setRefs = (node: HTMLElement | null) => {
      ;(triggerRef as any).current = node
      if (typeof forwardedRef === "function") forwardedRef(node)
      else if (forwardedRef) (forwardedRef as any).current = node
    }

    const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
      onClick?.(e)
      setOpen(!open)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref: setRefs,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "aria-controls": contentId,
        onClick: handleClick,
      } as any)
    }

    return (
      <button
        type="button"
        ref={setRefs}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
PopoverTrigger.displayName = "PopoverTrigger"

type ContentProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "center" | "end"
  sideOffset?: number
}

const PopoverContent = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ className, align = "center", sideOffset = 4, style, ...props }, ref) => {
    const ctx = React.useContext(PopoverContext)
    if (!ctx) throw new Error("PopoverContent must be used within Popover")
    const { open, contentId } = ctx

    if (!open) return null

    const alignmentClass =
      align === "start" ? "align-start" : align === "end" ? "align-end" : "align-center"

    return (
      <div
        id={contentId}
        role="dialog"
        data-state={open ? "open" : "closed"}
        ref={ref}
        className={cn("popover-content", alignmentClass, className)}
        style={{ marginTop: sideOffset, ...(style || {}) }}
        {...props}
      />
    )
  }
)
PopoverContent.displayName = "PopoverContent"

export const usePopover = () => {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error("usePopover must be used within Popover")
  return ctx
}

export { Popover, PopoverTrigger, PopoverContent }
