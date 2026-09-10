import type { CourseSummary } from '../../types/course'
import ConfirmModal from '../ConfirmModal'

interface DeleteCourseModalProps {
  isDeleting: boolean
  deleteError: string | null
  handleConfirmDelete: () => Promise<void>
  courseToDelete: CourseSummary | null
  setCourseToDelete: React.Dispatch<React.SetStateAction<CourseSummary | null>>
}

const DeleteCourseModal = ({
  isDeleting,
  deleteError,
  handleConfirmDelete,
  courseToDelete,
  setCourseToDelete,
}: DeleteCourseModalProps) => {
  return (
    <ConfirmModal
      show={Boolean(courseToDelete)}
      title="Delete Course"
      confirmLabel="Delete Course"
      busyLabel="Deleting..."
      variant="danger"
      isBusy={isDeleting}
      error={deleteError}
      onConfirm={handleConfirmDelete}
      onCancel={() => setCourseToDelete(null)}
      message={
        <>
          Are you sure you want to delete{' '}
          <strong>{courseToDelete?.name}</strong>? This action cannot be undone.
        </>
      }
    />
  )
}

export default DeleteCourseModal
