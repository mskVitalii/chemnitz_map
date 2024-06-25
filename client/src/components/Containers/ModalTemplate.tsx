import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, ReactElement, useRef } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactElement;
  dialogSize?: "small" | "medium" | "large" | "xl";
}

function ModalTemplate({
  isOpen,
  onClose,
  children,
  dialogSize = "medium",
}: IProps) {
  const cancelButtonRef = useRef(null);

  const getDialogClass = () => {
    switch (dialogSize) {
      case "small":
        return "relative transform overflow-hidden rounded-lg dark:bg-slate-800 bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6";
      case "large":
        return "relative transform overflow-hidden rounded-lg dark:bg-slate-800 bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6";
      case "xl":
        return "relative transform overflow-hidden rounded-lg dark:bg-slate-800 bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6";
      case "medium":
      default:
        return "relative transform overflow-hidden rounded-lg dark:bg-slate-800 bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6";
    }
  };
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[1002]"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className={getDialogClass()}>
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-3 right-3 rounded-full text-black hover:text-white bg-transparent p-1 ring-1 ring-inset focus:outline-none dark:ring-slate-700 ring-slate-200 shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ModalTemplate;
