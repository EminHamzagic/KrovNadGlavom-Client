import { useContext, useState } from "react";
import type { Building, BuildingToAdd } from "../../types/building";
import DatePicker from "react-datepicker";
import { MapContainer, TileLayer } from "react-leaflet";
import MapSearchControl from "../../components/MapSearchControl";
import { UserContext } from "../../context/UserContext";
import { createBuiding, editBuilding } from "../../services/buildingService";
import { PopupType, useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router";
import SetBuildingApartments from "../../components/Apartment/SetBuildingApartments";
import type { ApartmentToAdd } from "../../types/apartment";
import LocationMarker from "../../components/LocationMarker";
import Stepper from "../../components/Stepper";
import { handleError } from "../../utils/handleError";

interface Props {
  building?: Building;
}

export default function CreateBuildingPage({ building }: Props) {
  const { user } = useContext(UserContext);
  const [buildingData, setBuildingData] = useState<BuildingToAdd>({
    companyId: user.constructionCompanyId ?? "",
    parcelNumber: building?.parcelNumber ?? "",
    area: building?.area ?? 0,
    floorCount: building?.floorCount ?? 0,
    elevatorCount: building?.elevatorCount ?? 0,
    garageSpotCount: building?.garageSpotCount ?? 0,
    startDate: building?.startDate ?? "",
    endDate: building?.endDate ?? "",
    city: building?.city ?? "",
    address: building?.address ?? "",
    longitude: building?.longitude ?? 0,
    latitude: building?.latitude ?? 0,
    description: building?.description ?? "",
    apartments: [],
    garages: [],
    priceList: {
      pricePerM2: building?.priceList?.pricePerM2 ?? 0,
      penaltyPerM2: building?.priceList?.penaltyPerM2 ?? 0,
    },
  });
  const [apartments, setApartments] = useState<ApartmentToAdd[]>([]);
  const [startDate, setStartDate] = useState<Date>(building?.startDate ? new Date(building.startDate) : new Date());
  const [endDate, setEndDate] = useState<Date>(building?.endDate ? new Date(building.endDate) : new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<number>(1);
  const navigate = useNavigate();

  const { showToast } = useToast();

  const steps = [
    { id: 1, label: "Informacije" },
    { id: 2, label: "Stanovi" },
  ];

  const handleChange = (key: keyof BuildingToAdd, value: any) => {
    setBuildingData(prev => ({
      ...prev,
      [key]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [key]: "",
    }));
  };

  // Helper for priceList
  const handlePriceListChange = (key: keyof BuildingToAdd["priceList"], value: any) => {
    setBuildingData(prev => ({
      ...prev,
      priceList: {
        ...prev.priceList,
        [key]: value,
      },
    }));
    setErrors(prev => ({
      ...prev,
      [key]: "",
    }));
  };

  const validateBuildingData = (data: BuildingToAdd) => {
    const newErrors: Record<string, string> = {};

    if (!data.parcelNumber.trim())
      newErrors.parcelNumber = "Broj parcele je obavezan";
    if (!data.area || data.area <= 0)
      newErrors.area = "Površina mora biti veća od 0";
    if (!data.floorCount || data.floorCount <= 0)
      newErrors.floorCount = "Broj spratova mora biti veći od 0";
    if (!data.elevatorCount || data.elevatorCount < 0)
      newErrors.elevatorCount = "Broj liftova ne može biti negativan";
    if (!data.garageSpotCount || data.garageSpotCount < 0)
      newErrors.garageSpotCount = "Broj parking mesta u garaži ne može biti negativan";
    if (!data.startDate)
      newErrors.startDate = "Datum početka je obavezan";
    if (!data.endDate)
      newErrors.endDate = "Datum završetka je obavezan";
    if (!data.city.trim())
      newErrors.city = "Grad je obavezan";
    if (!data.address.trim())
      newErrors.address = "Adresa je obavezna";
    if (!data.longitude || !data.latitude)
      newErrors.longitude = "Geografska dužina i širina su obavezni";
    if (!data.priceList.pricePerM2 || data.priceList.pricePerM2 <= 0)
      newErrors.pricePerM2 = "Cena po m² je obavezna";
    if (!data.priceList.penaltyPerM2 || data.priceList.penaltyPerM2 <= 0)
      newErrors.penaltyPerM2 = "Kazna po m² je obavezna";

    return newErrors;
  };

  const goNextStep = () => {
    const validationErrors = validateBuildingData({
      ...buildingData,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    if (Object.keys(validationErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast(PopupType.Danger, "Nevalidni podaci, molimo vas ponovo proverite");
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  const handleBuildingCreate = async () => {
    setBuildingData(prev => ({
      ...prev,
      apartments,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }));

    const sendData = {
      ...buildingData,
      apartments,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    } as BuildingToAdd;

    try {
      setLoading(true);
      await createBuiding(sendData);

      showToast(PopupType.Success, "Uspešno ste se kreirali novu zgradu");
      navigate("/buildings");
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleBuildingEdit = async () => {
    if (building) {
      setBuildingData(prev => ({
        ...prev,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }));

      const sendData = {
        ...buildingData,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      } as BuildingToAdd;

      try {
        setLoading(true);
        await editBuilding(sendData, building?.id);

        showToast(PopupType.Success, "Uspešno ste izmenili zgradu");
        navigate(`/buildings/${building?.id}`);
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
    <div className="planel flex-col shadow-md flex justify-center bg-white rounded-md p-4">
      {!building && <Stepper step={step} stepArray={steps} />}
      {step === 1 && (
        <div className="flex flex-col justify-center">
          <p className="text-2xl">Informacije o zgradi</p>

          <div className="w-full grid grid-cols-1 sm:grid-cols-4 mt-4 gap-5">
            <div className={`col-span-1 sm:col-span-2 ${errors.parcelNumber && "has-error"}`}>
              <label className="form-label">Broj parcele:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Unesite broj parcele zgrade"
                value={buildingData.parcelNumber}
                onChange={e => handleChange("parcelNumber", e.target.value)}
              />
              {errors.parcelNumber && (
                <p className="text-danger text-sm mt-1">{errors.parcelNumber}</p>
              )}
            </div>
            <div className={`col-span-1 sm:col-span-2 ${errors.area && "has-error"}`}>
              <label className="form-label">Površina placa:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Unesite površinu placa zgrade"
                value={buildingData.area}
                onChange={e => handleChange("area", Number.parseFloat(e.target.value) || 0)}
              />
              {errors.area && (
                <p className="text-danger text-sm mt-1">{errors.area}</p>
              )}
            </div>

            <div className="col-span-1 sm:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className={`col-span-1 ${errors.floorCount && "has-error"}`}>
                <label className="form-label">Broj spratova:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Unesite broj spratova zgrade"
                  value={buildingData.floorCount}
                  onChange={e => handleChange("floorCount", Number.parseInt(e.target.value) || 0)}
                />
                {errors.floorCount && (
                  <p className="text-danger text-sm mt-1">{errors.floorCount}</p>
                )}
              </div>
              <div className={`col-span-1 ${errors.elevatorCount && "has-error"}`}>
                <label className="form-label">Broj liftova:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Unesite broj liftova zgrade"
                  value={buildingData.elevatorCount}
                  onChange={e => handleChange("elevatorCount", Number.parseInt(e.target.value) || 0)}
                />
                {errors.elevatorCount && (
                  <p className="text-danger text-sm mt-1">{errors.elevatorCount}</p>
                )}
              </div>
              <div className={`col-span-1 ${errors.garageSpotCount && "has-error"}`}>
                <label className="form-label">Broj garažnih mesta:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Unesite broj garažnih mesta zgrade"
                  value={buildingData.garageSpotCount}
                  onChange={e => handleChange("garageSpotCount", Number.parseInt(e.target.value) || 0)}
                />
                {errors.garageSpotCount && (
                  <p className="text-danger text-sm mt-1">{errors.garageSpotCount}</p>
                )}
              </div>
            </div>

            <div className={`col-span-1 sm:col-span-2  ${errors.startDate && "has-error"}`}>
              <label className="form-label">Datum početka izgradnje:</label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  if (date)
                    setStartDate(date);
                }}
                className={`form-input w-full ${building?.startDate && "bg-gray-200"}`}
                wrapperClassName="w-full"
                dateFormat="dd.MM.yyyy"
                disabled={Boolean(building?.startDate)}
              />
              {errors.startDate && (
                <p className="text-danger text-sm mt-1">{errors.startDate}</p>
              )}
            </div>
            <div className={`col-span-1 sm:col-span-2 ${errors.endDate && "has-error"}`}>
              <label className="form-label">Datum završetka izgradnje:</label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => {
                  if (date)
                    setEndDate(date);
                }}
                className={`form-input w-full ${building?.endDate && "bg-gray-200"}`}
                wrapperClassName="w-full"
                dateFormat="dd.MM.yyyy"
                disabled={Boolean(building?.endDate)}
              />
              {errors.endDate && (
                <p className="text-danger text-sm mt-1">{errors.endDate}</p>
              )}
            </div>

            <div className={`col-span-1 sm:col-span-2 ${errors.city && "has-error"}`}>
              <label className="form-label">Grad:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Unesite grad"
                value={buildingData.city}
                onChange={e => handleChange("city", e.target.value)}
              />
              {errors.city && (
                <p className="text-danger text-sm mt-1">{errors.city}</p>
              )}
            </div>
            <div className={`col-span-1 sm:col-span-2 ${errors.address && "has-error"}`}>
              <label className="form-label">Adresa:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Unesite adresu zgrade"
                value={buildingData.address}
                onChange={e => handleChange("address", e.target.value)}
              />
              {errors.address && (
                <p className="text-danger text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {!building && (
              <>
                <div className={`col-span-1 sm:col-span-2 ${errors.pricePerM2 && "has-error"}`}>
                  <label className="form-label">Cena po kvadratu (€):</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Unesite cenu stanova po kvadratu"
                    value={buildingData.priceList.pricePerM2}
                    onChange={e => handlePriceListChange("pricePerM2", Number.parseFloat(e.target.value) || 0)}
                  />
                  {errors.pricePerM2 && (
                    <p className="text-danger text-sm mt-1">{errors.pricePerM2}</p>
                  )}
                </div>
                <div className={`col-span-1 sm:col-span-2 ${errors.penaltyPerM2 && "has-error"}`}>
                  <label className="form-label">Cena penala za kašnjenje po kvadratu (€):</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Unesite cena penala za kašnjenje po kvadratu stana"
                    value={buildingData.priceList.penaltyPerM2}
                    onChange={e => handlePriceListChange("penaltyPerM2", Number.parseFloat(e.target.value) || 0)}
                  />
                  {errors.penaltyPerM2 && (
                    <p className="text-danger text-sm mt-1">{errors.penaltyPerM2}</p>
                  )}
                </div>
              </>
            )}

            <div className="sm:col-span-4 col-span-1 mt-6">
              <label>Odaberite lokaciju na mapi:</label>
              <MapContainer
                center={[
                  buildingData.latitude || 44.8176,
                  buildingData.longitude || 20.4569,
                ]}
                zoom={13}
                style={{ height: "450px", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapSearchControl
                  onSelect={(lat, lng) =>
                    setBuildingData(prev => ({
                      ...prev,
                      latitude: lat,
                      longitude: lng,
                    }))}
                />
                <LocationMarker buildingData={buildingData} setBuildingData={setBuildingData} setErrors={setErrors} />
              </MapContainer>
              {errors.longitude && (
                <p className="text-danger text-sm mt-1">{errors.longitude}</p>
              )}
              {buildingData.latitude !== 0 && (
                <p className="mt-2 text-sm">
                  Koordinate:
                  {" "}
                  {buildingData.latitude.toFixed(6)}
                  ,
                  {" "}
                  {buildingData.longitude.toFixed(6)}
                </p>
              )}
            </div>

            <div className="col-span-1 sm:col-span-4">
              <label>Opis:</label>
              <textarea
                className="form-input h-64"
                placeholder="Unesite opis zgrade (opcionalno)"
                value={buildingData.description}
                onChange={e => handleChange("description", e.target.value)}
              />
            </div>

          </div>
        </div>
      )}
      {step === 2 && (
        <>
          <SetBuildingApartments floorCount={buildingData.floorCount} buildingApartments={apartments} setBuildingApartments={setApartments} />
        </>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-10">
        {step === 2
          ? (
              <div className="col-span-2 sm:col-span-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
                <button className="btn btn-danger" onClick={() => setStep(1)} disabled={loading}>Nazad</button>
                <button
                  className="btn btn-primary w-full sm:col-start-4"
                  onClick={handleBuildingCreate}
                  disabled={loading}
                >
                  {loading
                    ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      )
                    : (
                        "+ Dodaj"
                      )}
                </button>
              </div>
            )
          : building
            ? (
                <button className="btn btn-primary col-span-2 sm:col-span-4" onClick={handleBuildingEdit} disabled={loading}>
                  {loading
                    ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      )
                    : (
                        "Izmeni"
                      )}
                </button>
              )
            : <button className="btn btn-primary sm:col-start-4" onClick={goNextStep}>Dalje</button>}
      </div>
    </div>
  );
}
