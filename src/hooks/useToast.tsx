import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export enum PopupType {
  Primary = "color-primary",
  Secundary = "color-secondary",
  Warning = "color-warning",
  Info = "color-info",
  Danger = "color-danger",
  Success = "color-success",
}

export function useToast() {
  const showToast = (type: PopupType, text: string, duration: number = 3000) => {
    MySwal.fire({
      toast: true,
      position: "bottom-end",
      customClass: {
        popup: type,
      },
      title: text,
      showConfirmButton: false,
      timer: duration,
      width: "35rem",
      timerProgressBar: true,
      showCloseButton: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };

  return { showToast };
}
