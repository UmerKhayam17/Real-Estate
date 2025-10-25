// app/super_admin/companies/components/StatusUpdateDialog.jsx
'use client'

import { useState } from 'react'
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const STATUS_OPTIONS = [
   {
      value: 'approved',
      label: 'Approve',
      description: 'Company meets all requirements and can start using the platform',
      icon: CheckCircle,
      color: 'text-green-600'
   },
   {
      value: 'rejected',
      label: 'Reject',
      description: 'Company does not meet requirements or provided invalid information',
      icon: XCircle,
      color: 'text-red-600'
   },
   {
      value: 'suspended',
      label: 'Suspend',
      description: 'Temporarily suspend company access due to issues',
      icon: AlertCircle,
      color: 'text-orange-600'
   }
]

export function StatusUpdateDialog({
   company,
   isOpen,
   onClose,
   onUpdate,
   isLoading
}) {
   const [status, setStatus] = useState('')
   const [reason, setReason] = useState('')

   const handleSubmit = (e) => {
      e.preventDefault()
      if (!status) return

      onUpdate({
         status,
         reason: reason.trim() || undefined
      })
   }

   const handleClose = () => {
      setStatus('')
      setReason('')
      onClose()
   }

   const selectedStatus = STATUS_OPTIONS.find(opt => opt.value === status)

   return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle>Update Company Status</DialogTitle>
               <DialogDescription>
                  Update the status for {company?.name}
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-4">
                  <RadioGroup value={status} onValueChange={setStatus} className="space-y-3">
                     {STATUS_OPTIONS.map((option) => {
                        const IconComponent = option.icon
                        return (
                           <div key={option.value} className="flex items-start space-x-3">
                              <RadioGroupItem value={option.value} id={option.value} />
                              <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                                 <div className="flex items-center space-x-2">
                                    <IconComponent className={`h-4 w-4 ${option.color}`} />
                                    <span className="font-medium">{option.label}</span>
                                 </div>
                                 <p className="text-sm text-gray-500 mt-1">
                                    {option.description}
                                 </p>
                              </Label>
                           </div>
                        )
                     })}
                  </RadioGroup>
               </div>

               {status && (
                  <div className="space-y-2">
                     <Label htmlFor="reason">
                        Reason {status !== 'approved' && '(Required)'}
                     </Label>
                     <Textarea
                        id="reason"
                        placeholder={
                           status === 'approved'
                              ? 'Optional notes about this approval...'
                              : 'Please provide a reason for this action...'
                        }
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required={status !== 'approved'}
                        rows={3}
                     />
                     {status !== 'approved' && !reason.trim() && (
                        <p className="text-sm text-red-600">
                           Reason is required for {selectedStatus?.label.toLowerCase()}
                        </p>
                     )}
                  </div>
               )}

               <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={handleClose}
                     disabled={isLoading}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     disabled={isLoading || !status || (status !== 'approved' && !reason.trim())}
                  >
                     {isLoading ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Updating...
                        </>
                     ) : (
                        `Update Status`
                     )}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   )
}