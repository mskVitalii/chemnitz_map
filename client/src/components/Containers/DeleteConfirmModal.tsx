import { DialogTitle } from '@headlessui/react';
import ModalTemplate from './ModalTemplate';

interface IDeleteConfirmModal {
  isOpen: boolean;
  onClose: () => void;
  confirm: () => void;
  deleteTarget: string;
}

const DeleteConfirmModal = ({ isOpen, onClose, confirm, deleteTarget }: IDeleteConfirmModal) => {
  return (
    <ModalTemplate isOpen={isOpen} onClose={onClose}>
      <>
        <div>
          <DialogTitle
            as="h3"
            className="text-lg font-semibold leading-6 dark:text-white text-black"
          >
            Delete {deleteTarget}
          </DialogTitle>
          <div className="mt-6">
            <div>
              <p className="dark:text-white text-black">
                Are you sure? You can&apos;t undo this action afterwards.
              </p>
              {/*<p className="dark:text-white text-black">{message}</p>*/}
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            onClick={confirm}
            className="inline-flex w-full disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-500 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2"
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md dark:bg-slate-700 bg-slate-300 px-3 py-2 text-sm font-semibold dark:text-white text-black shadow-sm ring-1 ring-inset dark:ring-slate-700 ring-slate-200 dark:hover:bg-slate-600 hover:bg-slate-300  sm:col-start-1 sm:mt-0"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </>
    </ModalTemplate>
  );
};

export default DeleteConfirmModal;