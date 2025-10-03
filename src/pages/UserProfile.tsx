import { useContext, useEffect, useRef, useState } from "react";
import type { UserChangePassword, UserToUpdate } from "../types/user";
import { changePassword, updateUser, uploadUserPfp } from "../services/userService";
import { handleError } from "../utils/handleError";
import FullScreenLoader from "../components/FullScreenLoader";
import { Eye, EyeOff, KeyRound, PenLine } from "lucide-react";
import Modal from "../components/Modal";
import { PopupType, useToast } from "../hooks/useToast";
import type { LogoUpload } from "../types/company";
import { UserContext } from "../context/UserContext";

export default function UserProfile() {
  const { user, updateLocalUser } = useContext(UserContext);
  // sklonio iz loading setLoading
  const [loading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserToUpdate>({} as UserToUpdate);
  const [passwordForm, setPasswordForm] = useState<UserChangePassword>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<LogoUpload | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (user.id) {
      setImagePreview(user.imageUrl);
      setEditForm({
        name: user.name,
        lastname: user.lastname,
        username: user.username,
      });
    }
  }, [user]);

  const handleFileUpload = async (userId: string) => {
    if (imageData) {
      try {
        await uploadUserPfp({ ...imageData, id: userId });
      }
      catch (err) {
        handleError(err);
      }
    }
  };

  const handleEdit = async () => {
    if (!user.id)
      return;
    try {
      setLoadingModal(true);
      await handleFileUpload(user.id);
      const updatedUser = await updateUser(user.id, editForm);

      updateLocalUser(updatedUser);

      showToast(PopupType.Success, "Profil je uspešno ažuriran");
      setIsEditOpen(false);
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoadingModal(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast(PopupType.Danger, "Lozinke se ne poklapaju");
      return;
    }
    const passwordRegex
      = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%.])[A-Za-z\d!@#$%.]{7,}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      showToast(PopupType.Danger, "Lozinka mora imati najmanje 7 karaktera, jedno veliko i malo slovo, jedan broj i jedan specijalan znak (!@#$%.)", 8000);
      return;
    }

    try {
      setLoadingModal(true);
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      showToast(PopupType.Success, "Lozinka je uspešno promenjena");
      setIsPasswordOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoadingModal(false);
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file)
      return;
    setImageData({ id: "", file });
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  if (loading)
    return <FullScreenLoader />;

  return (
    <>
      {/* --- Profilni podaci --- */}
      <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4 mb-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl">Moj profil</h1>
          <div className="flex gap-2">
            <button className="btn btn-primary px-3 flex items-center gap-2" onClick={() => setIsEditOpen(true)}>
              <PenLine size={18} />
              <span>Uredi profil</span>
            </button>
            <button className="btn btn-primary px-3 flex items-center gap-2" onClick={() => setIsPasswordOpen(true)}>
              <KeyRound size={18} />
              <span>Promeni lozinku</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex justify-center mb-7 col-span-full">
            <img
              src={user.imageUrl || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
              alt="Profilna slika"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">Ime:</span>
            <span>{user.name}</span>
          </div>
          <div className="flex flex-col mb-3">
            <span className="font-bold">Prezime:</span>
            <span>{user.lastname}</span>
          </div>
          <div className="flex flex-col mb-3">
            <span className="font-bold">Korisničko ime:</span>
            <span>{user.username}</span>
          </div>
          <div className="flex flex-col mb-3">
            <span className="font-bold">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex flex-col mb-3">
            <span className="font-bold">Uloga:</span>
            <span>{user.role}</span>
          </div>
        </div>
      </div>

      {/* --- Modal za edit profila --- */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setImagePreview(user.imageUrl);
          setImageData(null);
        }}
        title="Uredi profil"
        onConfirm={handleEdit}
        loading={loadingModal}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full flex flex-col items-center">
            <label className="form-label mb-2">Profilna slika:</label>
            <div
              onClick={handleImageClick}
              className="w-32 h-32 rounded-full border-2 border-dashed border-primary flex items-center justify-center cursor-pointer overflow-hidden hover:bg-primary/10 transition"
            >
              {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-sm text-primary">Klikni za upload</span>}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">Ime:</label>
            <input type="text" name="name" value={editForm.name || ""} onChange={handleInputChange} className="form-input" />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">Prezime:</label>
            <input type="text" name="lastname" value={editForm.lastname || ""} onChange={handleInputChange} className="form-input" />
          </div>

          <div className="flex flex-col col-span-full">
            <label className="font-bold mb-2">Korisničko ime:</label>
            <input type="text" name="username" value={editForm.username || ""} onChange={handleInputChange} className="form-input" />
          </div>
        </div>
      </Modal>

      {/* --- Modal za promenu lozinke --- */}
      <Modal
        isOpen={isPasswordOpen}
        onClose={() => {
          setIsPasswordOpen(false);
          setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        }}
        title="Promeni lozinku"
        onConfirm={handlePasswordChange}
        loading={loadingModal}
        size="md"
      >
        <div className="flex flex-col gap-4">
          {/* Current password */}
          <div className="flex flex-col">
            <label className="font-bold mb-2">Trenutna lozinka:</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                placeholder="Unesi staru lozinku"
                value={passwordForm.currentPassword}
                onChange={handlePasswordInputChange}
                className="form-input w-full"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 cursor-pointer"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="flex flex-col">
            <label className="font-bold mb-2">Nova lozinka:</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                placeholder="Unesi novu lozinku"
                value={passwordForm.newPassword}
                onChange={handlePasswordInputChange}
                className="form-input w-full"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 cursor-pointer"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm new password */}
          <div className="flex flex-col">
            <label className="font-bold mb-2">Potvrdi novu lozinku:</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Potvrdi novu lozinku"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordInputChange}
                className="form-input w-full"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
