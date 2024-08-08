import CreateAppPage from '../../new/page'
import { BackableDialog } from './backable-dialog'
import { DialogContent } from '@/components/ui/dialog'

export default function CreateAppPageIntercepting() {
  return (
    <BackableDialog>
      <DialogContent>
        <CreateAppPage></CreateAppPage>
      </DialogContent>
    </BackableDialog>
  )
}
