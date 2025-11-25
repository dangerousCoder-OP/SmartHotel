import * as React from "react"

export type ButtonVariant =
  | "default"
  | "brand"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"

export type ButtonSize = "default" | "sm" | "lg" | "icon"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const variantClass: Record<ButtonVariant, string> = {
  default: "btn-primary",
  brand: "btn-brand",
  destructive: "btn-danger",
  outline: "btn-outline",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  link: "btn-link",
}

const sizeClass: Record<ButtonSize, string> = {
  default: "",
  sm: "btn-sm",
  lg: "btn-lg",
  icon: "btn-icon",
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const classes = ["btn", variantClass[variant], sizeClass[size], className]
      .filter(Boolean)
      .join(" ")

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>
      return React.cloneElement(child, {
        className: [child.props?.className, classes].filter(Boolean).join(" "),
        ref,
        ...props,
      })
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
