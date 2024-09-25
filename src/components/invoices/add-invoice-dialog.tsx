import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import InvoiceForm from './form'

type Props = {
  customerId: string
}

export default function AddInvoiceDialog({ customerId }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Tambah</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[calc(100vh-160px)] overflow-auto">
        <DialogHeader>
          <DialogTitle>Tambah Invoice</DialogTitle>
        </DialogHeader>
        <InvoiceForm
          type="create"
          customerId={customerId}
          successMessage="Invoice berhasil ditambahkan"
        />
      </DialogContent>
    </Dialog>
  )
}
