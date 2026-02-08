'use client'

import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// --- Types & Context ---

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  labels: Record<string, string>
  registerOption: (value: string, label: string) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

function useSelect() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('Select compound components must be used within a Select provider')
  }
  return context
}

export interface SelectProps {
  children: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// --- Main Component ---

export function Select({
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '')
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const [labels, setLabels] = React.useState<Record<string, string>>({})

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)

      // Close on selection
      if (controlledOpen === undefined) {
        setUncontrolledOpen(false)
      }
      onOpenChange?.(false)
    },
    [controlledValue, onValueChange, controlledOpen, onOpenChange]
  )

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange]
  )

  const registerOption = React.useCallback((val: string, label: string) => {
    setLabels(prev => {
      // Only update if not exists to avoid render loops, 
      // or strictly we might want to allow updates. 
      // For simple strings, check equality.
      if (prev[val] === label) return prev
      return { ...prev, [val]: label }
    })
  }, [])

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen: handleOpenChange,
        labels,
        registerOption,
      }}
    >
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  )
}

// --- Subcomponents ---

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useSelect()

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-xl border bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "border-slate-200 dark:border-slate-800",
        "hover:border-slate-300 dark:hover:border-slate-700",
        "focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})
SelectTrigger.displayName = 'SelectTrigger'

export const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => {
  const { value, labels } = useSelect()

  return (
    <span
      ref={ref}
      className={cn("block truncate", className)}
      {...props}
    >
      {value ? (labels[value] || value) : (placeholder || "")}
    </span>
  )
})
SelectValue.displayName = 'SelectValue'

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { position?: 'popper' | 'item-aligned' }
>(({ className, children, position = 'popper', ...props }, ref) => {
  const { open, setOpen } = useSelect()

  return (
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 cursor-default"
            onClick={() => setOpen(false)}
          />
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.150 }}
            className={cn(
              "absolute top-full mt-2 z-50 min-w-[8rem] overflow-hidden rounded-xl border bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 shadow-md animate-in fade-in-80",
              "border-slate-200 dark:border-slate-800",
              position === "popper" && "w-full",
              className
            )}
            {...(props as any)}
          >
            <div className="p-1 max-h-60 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
})
SelectContent.displayName = 'SelectContent'

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const { value: selectedValue, onValueChange, registerOption } = useSelect()

  // Extract text content for the label registry
  React.useEffect(() => {
    // Only register if children is a string to avoid complex object issues
    if (typeof children === 'string') {
      registerOption(value, children)
    }
  }, [registerOption, value, children])

  const isSelected = selectedValue === value

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
        isSelected && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
        className
      )}
      onClick={(e) => {
        e.stopPropagation()
        onValueChange(value)
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
})
SelectItem.displayName = 'SelectItem'
