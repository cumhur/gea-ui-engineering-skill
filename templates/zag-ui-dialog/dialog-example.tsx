import { Component } from '@geajs/core'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, Button } from '@geajs/ui'

export default class AccessibleModalDemo extends Component {
  template() {
    return (
      <div class="demo-container">
        <Dialog>
          <DialogTrigger>
            <Button>Open Accessible Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accessible Dialog (@geajs/ui)</DialogTitle>
              <DialogDescription>
                Powered by Zag.js state machine. Focus-trapped, ESC-closable, ARIA compliant.
              </DialogDescription>
            </DialogHeader>
            <div class="dialog-body">
              <p>This modal is fully accessible and weighs only a few kilobytes.</p>
            </div>
            <div class="dialog-actions">
              <DialogClose>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}
