import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

//
// Context & Provider
//
const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

const SidebarProvider = React.forwardRef((props, ref) => {
  const {
    defaultOpen = true,
    open: openProp,
    onOpenChange: onOpenChangeProp,
    className,
    style,
    children,
    ...restProps
  } = props;

  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // controlled vs uncontrolled
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp != null ? openProp : _open;
  const setOpen = React.useCallback(
    (val) => {
      const next = typeof val === "function" ? val(open) : val;
      if (onOpenChangeProp) {
        onOpenChangeProp(next);
      } else {
        _setOpen(next);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [open, onOpenChangeProp]
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((o) => !o);
    } else {
      setOpen((o) => !o);
    }
  }, [isMobile, setOpen]);

  React.useEffect(() => {
    const handleKey = (e) => {
      if (
        e.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          ref={ref}
          style={{
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          }}
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
            className
          )}
          {...restProps}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

//
// Main Sidebar Frame
//
const Sidebar = React.forwardRef((props, ref) => {
  const {
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...restProps
  } = props;

  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  // non-collapsible
  if (collapsible === "none") {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
          className
        )}
        {...restProps}
      >
        {children}
      </div>
    );
  }

  // mobile sheet
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...restProps}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          side={side}
          className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE }}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // desktop
  return (
    <div
      ref={ref}
      className="group peer hidden md:block text-sidebar-foreground"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      {/* gap handler */}
      <div
        className={cn(
          "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
        )}
      />
      <div
        className={cn(
          "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...restProps}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
        >
          {children}
        </div>
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

//
// Trigger, Rail & Inset Wrapper
//
const SidebarTrigger = React.forwardRef((props, ref) => {
  const { className, onClick, ...rest } = props;
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(e) => {
        onClick?.(e);
        toggleSidebar();
      }}
      {...rest}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      title="Toggle Sidebar"
      onClick={toggleSidebar}
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]*&]:cursor-w-resize [[data-side=right]*&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]*&]:cursor-e-resize [[data-side=right][data-state=collapsed]*&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]*&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]*&]:-left-2",
        className
      )}
      {...rest}
    />
  );
});
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...rest}
    />
  );
});
SidebarInset.displayName = "SidebarInset";

//
// Inputs & Sections
//
const SidebarInput = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...rest}
    />
  );
});
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...rest}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...rest}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...rest}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";

//
// Content & Grouping
//
const SidebarContent = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...rest}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...rest}
    />
  );
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef((props, ref) => {
  const { asChild = false, className, ...rest } = props;
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...rest}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef((props, ref) => {
  const { asChild = false, className, ...rest } = props;
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...rest}
    />
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...rest}
    />
  );
});
SidebarGroupContent.displayName = "SidebarGroupContent";

//
// Menu Items & Variants
//
const SidebarMenu = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...rest}
    />
  );
});
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...rest}
    />
  );
});
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const SidebarMenuButton = React.forwardRef((props, ref) => {
  const {
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...rest
  } = props;
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        sidebarMenuButtonVariants({ variant, size }),
        className
      )}
      {...rest}
    />
  );

  if (!tooltip) {
    return button;
  }

  const tooltipProps =
    typeof tooltip === "string"
      ? { children: tooltip }
      : tooltip;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltipProps}
      />
    </Tooltip>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef((props, ref) => {
  const { asChild = false, showOnHover = false, className, ...rest } = props;
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...rest}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...rest}
    />
  );
});
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef((props, ref) => {
  const { showIcon = false, className, ...rest } = props;
  const width = React.useMemo(
    () => `${Math.floor(Math.random() * 40) + 50}%`,
    []
  );
  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
      {...rest}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={{ "--skeleton-width": width }}
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...rest}
    />
  );
});
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef((props, ref) => (
  <li ref={ref} {...props} />
));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef((props, ref) => {
  const { asChild = false, size = "md", isActive, className, ...rest } = props;
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...rest}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

//
// Exports
//
export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
};
