import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { PopupType } from "../hooks/useToast";

const MySwal = withReactContent(Swal);

function showToast(type: PopupType, text: string) {
  MySwal.fire({
    toast: true,
    position: "bottom-end",
    customClass: {
      popup: type,
    },
    title: text,
    showConfirmButton: false,
    timer: 3000,
    width: "35rem",
    timerProgressBar: true,
    showCloseButton: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
}

export function handleError(err: unknown) {
  if (axios.isAxiosError(err)) {
    const responseData = err.response?.data;

    if (typeof responseData === "string" && responseData !== "") {
      showToast(PopupType.Danger, responseData);
      if (responseData.includes("Refresh token not found") || responseData.includes("already invalidated")) {
        window.location.href = "/login";
      }
    }
    else if (responseData?.errors && typeof responseData.errors === "object") {
      const messages = Object.values(responseData.errors)
        .flat()
        .join("\n");
      showToast(PopupType.Danger, messages);
    }
    else if (responseData?.title) {
      showToast(PopupType.Danger, responseData.title);
    }
    else {
      showToast(PopupType.Danger, err.message || "An error occurred");
    }
  }
  else {
    // Non-Axios errors
    showToast(PopupType.Danger, `Unknown error: ${String(err)}`);
  }
}
