import { useContext, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Installment } from "../../types/installment";
import { UserContext } from "../../context/UserContext";
import Tooltip from "../Tooltip";
import { Check, Eye, ImagePlus } from "lucide-react";
import Modal from "../Modal";
import type { LogoUpload } from "../../types/company";
import { confirmInstallment, uploadInstallmentProof } from "../../services/installmentService";
import { handleError } from "../../utils/handleError";
import { PopupType, useToast } from "../../hooks/useToast";
import { formatDate } from "../../utils/dateFormatter";

interface Props {
  installments: Installment[];
  setReload: Dispatch<SetStateAction<boolean>>;
  lateCount: number;
}

export default function InstallmentList({ installments, setReload, lateCount }: Props) {
  const { getUserType } = useContext(UserContext);
  const [isOpenUpload, setIsOpenUpload] = useState<boolean>(false);
  const [isOpenCheck, setIsOpenCheck] = useState<boolean>(false);
  const [isOpenApprove, setIsOpenApprove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [ImgData, setImgData] = useState<LogoUpload | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { showToast } = useToast();

  const handleImgClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgData({ id: "", file });
      const reader = new FileReader();
      reader.onload = () => {
        setImgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (ImgData && selectedId) {
      try {
        setLoading(true);
        await uploadInstallmentProof({ ...ImgData, id: selectedId });

        showToast(PopupType.Success, "Uspešno ste dodali dokaz o uplati");
        setSelectedId(null);
        setReload(prev => !prev);
      }
      catch (err) {
        handleError(err);
      }
      finally {
        setLoading(false);
      }
    }
  };

  const handleApprove = async () => {
    if (selectedId) {
      try {
        setLoading(true);
        await confirmInstallment(selectedId);

        showToast(PopupType.Success, "Uspešno ste potvrdili uplatu");
        setSelectedId(null);
        setReload(prev => !prev);
      }
      catch (err) {
        handleError(err);
      }
      finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4 mb-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl">Rate</h1>
        <p>
          Broj zakasnelih uplata:
          {" "}
          {lateCount}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {installments.map((item, index) => (
          <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-2 sm:grid-cols-5 gap-2 relative py-3">
            <div className="flex sm:items-center flex-col sm:flex-row gap-2 text-gray-600">
              <span>Broj rate:</span>
              <span>
                {item.sequenceNumber}
              </span>
            </div>
            <div className="flex sm:items-center flex-col sm:flex-row gap-2 text-gray-600">
              <span>Iznos rate:</span>
              <span>
                {item.amount}
                €
              </span>
            </div>
            <div className="flex sm:items-center flex-col sm:flex-row gap-2 text-gray-600">
              <span>Rok uplate:</span>
              <span>
                {formatDate(item.dueDate)}
              </span>
            </div>
            <div className="flex sm:items-center flex-col sm:flex-row gap-2 text-gray-600">
              <span>Status uplate:</span>
              <span className={`${item.isConfirmed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text-xs h-fit w-fit font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{item.isConfirmed ? "Potvrđeno" : "Nije potvrđeno"}</span>
            </div>
            <div className="flex sm:justify-end gap-2 text-gray-600">
              {item.paymentProof
                && (
                  <Tooltip text="Vidi" position="top">
                    <button
                      className="btn btn-info px-3"
                      onClick={() => {
                        setImgPreview(item.paymentProof ?? "");
                        setIsOpenCheck(true);
                      }}
                    >
                      <Eye />
                    </button>
                  </Tooltip>
                )}
              {(getUserType() === "User" && !item.isConfirmed)
                && (
                  <Tooltip text="Dodaj dokaz" position="top">
                    <button
                      className="btn btn-primary px-3"
                      onClick={() => {
                        setIsOpenUpload(true);
                        setImgData(null);
                        setImgPreview(null);
                        setSelectedId(item.id);
                      }}
                    >
                      <ImagePlus />
                    </button>
                  </Tooltip>
                )}
              {(getUserType() === "Agency" && !item.isConfirmed)
                && (
                  <Tooltip text="Potvrdi" position="top">
                    <button
                      className="btn btn-success px-3"
                      onClick={() => {
                        setIsOpenApprove(true);
                        setSelectedId(item.id);
                      }}
                    >
                      <Check />
                    </button>
                  </Tooltip>
                )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpenUpload} onClose={() => setIsOpenUpload(false)} title="Pošalji dokaz o uplati" onConfirm={handleUpload} confirmText="Pošalji" size="xl" loading={loading}>
        <div className="col-span-1 sm:col-span-2 flex flex-col">
          <label className="form-label mb-2">Dokaz:</label>
          <div
            onClick={handleImgClick}
            className="w-auto min-h-[200px] rounded-xl border-2 border-dashed border-primary flex items-center justify-center cursor-pointer overflow-hidden hover:bg-primary/10 transition"
          >
            {imgPreview
              ? (
                  <img
                    src={imgPreview}
                    alt="Logo preview"
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                )
              : (
                  <span className="text-sm text-primary">Dodaj sliku</span>
                )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </Modal>

      <Modal isOpen={isOpenApprove} onClose={() => setIsOpenApprove(false)} title="Potvrda uplate" onConfirm={handleApprove} loading={loading}>
        <div><p>Da li ste sigurni da želite da potvrdite ovu uplatu?</p></div>
      </Modal>

      <Modal isOpen={isOpenCheck} onClose={() => setIsOpenCheck(false)} title="Dokaz o uplati" size="2xl">
        <div
          className="w-auto h-full rounded-xl flex items-center justify-center cursor-pointer overflow-hidden hover:bg-primary/10 transition"
        >
          <img
            src={imgPreview ?? ""}
            alt="Dokaz o uplati"
            className="w-auto h-full object-contain"
          />
        </div>
      </Modal>
    </div>
  );
}
