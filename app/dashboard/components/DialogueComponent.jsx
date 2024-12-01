import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function DialogueComponent({ variant, handleDialogue }) {
  if (variant === 'selectMultiple') {
    return (
      <Dialog
        defaultOpen
        onOpenChange={() => {
          handleDialogue(false);
        }}
      >
        {console.log('inside dialogue')}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
}

export default DialogueComponent;
