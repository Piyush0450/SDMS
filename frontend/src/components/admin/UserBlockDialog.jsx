import React, { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ShieldAlert } from "lucide-react"

export function UserBlockDialog({ open, onOpenChange, targetUser, onConfirm, isBlocking }) {
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  if (!targetUser) return null

  const isBlock = targetUser.action === "block"

  const handleAction = async () => {
    setLoading(true)
    try {
      await onConfirm(targetUser.role, targetUser.uid, isBlock, reason)
      onOpenChange(false)
      setReason("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className={isBlock ? "text-destructive" : "text-emerald-500"} />
            <span>{isBlock ? "Block User Account" : "Unblock User Account"}</span>
          </DialogTitle>
          <DialogDescription>
            Target: <strong className="font-mono text-foreground">{targetUser.name || targetUser.uid}</strong> ({targetUser.uid})
          </DialogDescription>
        </DialogHeader>

        {isBlock ? (
          <div className="space-y-3 py-2">
            <Label htmlFor="block-reason">Reason for Account Suspension</Label>
            <Input
              id="block-reason"
              placeholder="e.g. Policy violation / Fee default"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to restore full portal access for this account?
          </p>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={isBlock ? "destructive" : "default"}
            onClick={handleAction}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isBlock ? "Confirm Block" : "Confirm Unblock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
