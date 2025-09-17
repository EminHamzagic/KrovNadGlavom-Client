import { useContext, useState } from "react";
import type { BuildingToAdd } from "../types/building";
import DatePicker from "react-datepicker";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import MapSearchControl from "../components/MapSearchControl";
import { UserContext } from "../context/UserContext";
import { createBuiding } from "../services/buildingService";
import { PopupType, useToast } from "../hooks/useToast";
import axios from "axios";
import { useNavigate } from "react-router";

export default function CreateBuildingPage() {
  const { user } = useContext(UserContext);
  const [buildingData, setBuildingData] = useState<BuildingToAdd>({
    companyId: user.constructionCompanyId ?? "",
    parcelNumber: "",
    area: 0,
    floorCount: 0,
    elevatorCount: 0,
    garageSpotCount: 0,
    startDate: "",
    endDate: "",
    city: "",
    address: "",
    longitude: 0,
    latitude: 0,
    description: "",
    apartments: [],
    garages: [],
    priceList: {
      pricePerM2: 0,
      penaltyPerM2: 0,
    },
  });
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const { showToast } = useToast();

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

  // Map click component
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setBuildingData(prev => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
      },
    });

    return buildingData.latitude && buildingData.longitude
      ? (
          <Marker position={[buildingData.latitude, buildingData.longitude]} />
        )
      : null;
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
    if (!data.longitude)
      newErrors.longitude = "Geografska dužina je obavezna";
    if (!data.latitude)
      newErrors.latitude = "Geografska širina je obavezna";
    if (!data.priceList.pricePerM2 || data.priceList.pricePerM2 <= 0)
      newErrors.pricePerM2 = "Cena po m² je obavezna";
    if (!data.priceList.penaltyPerM2 || data.priceList.penaltyPerM2 <= 0)
      newErrors.penaltyPerM2 = "Kazna po m² je obavezna";

    return newErrors;
  };

  const handleBuildingCreate = async () => {
    const validationErrors = validateBuildingData({
      ...buildingData,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    if (Object.keys(validationErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setErrors(validationErrors);
      return;
    }

    setErrors({});

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
      await createBuiding(sendData);

      showToast(PopupType.Success, "Uspešno ste se kreirali novu zgradu");
      navigate("/buildings");
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        showToast(PopupType.Danger, err.response?.data);
      }
      else {
        showToast(PopupType.Danger, `Unkown error: ${err}`);
        setLoading(false);
      }
    }
  };

  return (
    <div className="planel flex-col shadow-md flex justify-center bg-white rounded-md p-4">
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

        <div className={`col-span-1 sm:col-span-2 ${errors.startDate && "has-error"}`}>
          <label className="form-label">Datum početka izgradnje:</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => {
              if (date)
                setStartDate(date);
            }}
            className="form-input w-full"
            wrapperClassName="w-full"
            dateFormat="dd.MM.yyyy"
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
            className="form-input w-full"
            wrapperClassName="w-full"
            dateFormat="dd.MM.yyyy"
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

        <div className={`col-span-1 sm:col-span-2 ${errors.pricePerM2 && "has-error"}`}>
          <label className="form-label">Cena po kvadratu:</label>
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
          <label className="form-label">Cena penala za kašnjenje po kvadratu:</label>
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

        <div className="sm:col-span-4 col-span-1 mt-6">
          <label>Odaberite lokaciju na mapi:</label>
          <MapContainer
            center={[44.8176, 20.4569]}
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
            <LocationMarker />
          </MapContainer>
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

        <button
          className="btn btn-primary w-full sm:col-span-4 col-span-1"
          onClick={handleBuildingCreate}
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
    </div>
  );
}
