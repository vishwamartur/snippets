import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { useState, useEffect } from "react"
import { createUseDialog } from "./create-use-dialog"
import { useAxios } from "@/hooks/use-axios"
import { useToast } from "@/hooks/use-toast"
import { useQueryClient } from "react-query"

export const CreateOrderDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const axios = useAxios()
  const { toast } = useToast()
  const qc = useQueryClient()
  const [pending, setPending] = useState(false)
  const [checkpoints, setCheckpoints] = useState({
    shipping: false,
    errors: false,
    parts: false,
  })

  useEffect(() => {
    if (open) {
      validateCheckpoints()
    }
  }, [open])

  const validateCheckpoints = async () => {
    try {
      // Placeholder: Check if shipping information is in profile
      const hasShippingInfo = await checkShippingInfo()
      
      // Placeholder: Check if PCB has no errors
      const hasNoErrors = await checkPCBErrors()
      
      // Placeholder: Check if all parts are available at PCB fab
      const allPartsAvailable = await checkPartsAvailability()

      setCheckpoints({
        shipping: hasShippingInfo,
        errors: hasNoErrors,
        parts: allPartsAvailable,
      })
    } catch (error) {
      console.error("Error validating checkpoints:", error)
    }
  }

  const checkShippingInfo = async () => {
    // Placeholder: Implement actual check for shipping info
    return true
  }

  const checkPCBErrors = async () => {
    // Placeholder: Implement actual check for PCB errors
    return true
  }

  const checkPartsAvailability = async () => {
    // Placeholder: Implement actual check for parts availability
    return true
  }

  const handleSubmit = async () => {
    try {
      setPending(true)
      // TODO: Implement order submission logic
      onOpenChange(false)
      setPending(false)
      toast({
        title: "Order submitted",
        description: "Your order has been successfully submitted.",
      })
      qc.invalidateQueries({ queryKey: ["orders"] })
    } catch (error) {
      console.error("Error submitting order:", error)
      toast({
        title: "Error",
        description: "Failed to submit the order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500 mb-4">
          Order the circuit board fully assembled from a PCB fabricator
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="shipping" checked={checkpoints.shipping} />
            <label
              htmlFor="shipping"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Shipping Information in Profile
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="errors" checked={checkpoints.errors} />
            <label
              htmlFor="errors"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              PCB Has No Errors
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="parts" checked={checkpoints.parts} />
            <label
              htmlFor="parts"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              All parts available at PCB fabricator
            </label>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={pending || !Object.values(checkpoints).every(Boolean)}
          >
            {pending ? "Submitting..." : "Submit Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const useCreateOrderDialog = createUseDialog(CreateOrderDialog)
