import type { ReactNode } from 'react'
import { Alert, Button, Modal, Spinner } from 'react-bootstrap'

interface ConfirmModalProps {
  show: boolean
  title: string
  message: ReactNode
  confirmLabel?: string
  busyLabel?: string
  variant?: 'primary' | 'danger'
  isBusy?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmModal({
  show,
  title,
  message,
  confirmLabel = 'Confirm',
  busyLabel = 'Working…',
  variant = 'danger',
  isBusy = false,
  error = null,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          Cancel
        </Button>
        <Button variant={variant} onClick={onConfirm} disabled={isBusy}>
          {isBusy ? (
            <>
              <Spinner animation="border" size="sm" className="me-1" />{' '}
              {busyLabel}
            </>
          ) : (
            confirmLabel
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal
