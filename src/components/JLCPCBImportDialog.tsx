import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAxios } from "@/hooks/use-axios"
import { useToast } from "@/hooks/use-toast"
import { useLocation } from "wouter"

interface JLCPCBImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JLCPCBImportDialog({ open, onOpenChange }: JLCPCBImportDialogProps) {
  const [partNumber, setPartNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const axios = useAxios()
  const { toast } = useToast()
  const [, navigate] = useLocation()

  const handleImport = async () => {
    if (!partNumber.startsWith("C")) {
      toast({
        title: "Invalid Part Number",
        description: "JLCPCB part numbers should start with 'C'.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post("/snippets/generate_from_jlcpcb", { part_number: partNumber })
      const { snippet } = response.data
      toast({
        title: "Import Successful",
        description: "JLCPCB component has been imported successfully.",
      })
      onOpenChange(false)
      navigate(`/editor?snippet_id=${snippet.snippet_id}`)
    } catch (error) {
      console.error("Error importing JLCPCB component:", error)
      toast({
        title: "Import Failed",
        description: "Failed to import the JLCPCB component. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import from JLCPCB</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Enter JLCPCB part number (e.g., C46749)"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleImport} disabled={isLoading}>
            {isLoading ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
