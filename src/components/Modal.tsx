import { Fragment } from "react";
import type { ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void> | void;
  title: string;
  confirmText?: string;
  closeText?: string;
  loading?: boolean;
  footer?: boolean;
  children: ReactNode;
  size?: string;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText = "Potvrdi",
  closeText = "Otkaži",
  loading = false,
  footer = true,
  size = "md",
  children,
}: ModalProps) {
  const sizeClasses: Record<string, string> = {
    "sm": "max-w-sm",
    "md": "max-w-md",
    "lg": "max-w-lg",
    "xl": "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${sizeClasses[size] ?? "max-w-md"} transform rounded-xl bg-white p-6 shadow-xl transition-all`}>
                <Dialog.Title
                  as="h3"
                  className="text-2xl leading-6 text-gray-900 mb-10 flex justify-between items-center"
                >
                  {title}
                  <div className="hover:bg-gray-300 cursor-pointer transition duration-300 rounded-full w-8 h-8 flex justify-center items-center" onClick={onClose}>
                    <X size={20} />
                  </div>
                </Dialog.Title>

                {/* Body */}
                <div className="mb-10">{children}</div>

                {/* Footer */}
                {footer && (
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={onClose}
                      disabled={loading}
                    >
                      {closeText}
                    </button>

                    {onConfirm && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onConfirm}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : confirmText}
                      </button>
                    )}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
