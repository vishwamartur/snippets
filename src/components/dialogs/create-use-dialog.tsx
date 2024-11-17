import { FunctionComponent, useMemo, useState } from "react"

export const createUseDialog = <DialogType extends React.ComponentType<any>>(
  DialogComponent: DialogType,
) => {
  return () => {
    const [open, setOpen] = useState(false)

    return useMemo(
      () => ({
        openDialog: () => {
          setOpen(true)
        },
        closeDialog: () => {
          setOpen(false)
        },
        Dialog: (
          props: Omit<
            React.ComponentProps<DialogType>,
            "open" | "onOpenChange"
          >,
        ) => (
          <DialogComponent
            {...(props as any)}
            open={open}
            onOpenChange={setOpen}
          />
        ),
        open,
      }),
      [open],
    )
  }
}
