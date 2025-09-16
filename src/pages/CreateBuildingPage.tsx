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
  const navigate = useNavigate();

  const { showToast } = useToast();

  const handleChange = (key: keyof BuildingToAdd, value: any) => {
    setBuildingData(prev => ({
      ...prev,
      [key]: value,
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

  const handleBuildingCreate = async () => {
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
        <div className="col-span-1 sm:col-span-2">
          <label>Broj parcele:</label>
          <input
            type="text"
            className="form-input"
            placeholder="Unesite broj parcele zgrade"
            value={buildingData.parcelNumber}
            onChange={e => handleChange("parcelNumber", e.target.value)}
          />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label>Površina placa:</label>
          <input
            type="text"
            className="form-input"
            placeholder="Unesite površinu placa zgrade"
            value={buildingData.area}
            onChange={e => handleChange("area", Number.parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="col-span-1 sm:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="col-span-1">
            <label>Broj spratova:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Unesite broj spratova zgrade"
              value={buildingData.floorCount}
              onChange={e => handleChange("floorCount", Number.parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="col-span-1">
            <label>Broj liftova:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Unesite broj liftova zgrade"
              value={buildingData.elevatorCount}
              onChange={e => handleChange("elevatorCount", Number.parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="col-span-1">
            <label>Broj garažnih mesta:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Unesite broj garažnih mesta zgrade"
              value={buildingData.garageSpotCount}
              onChange={e => handleChange("garageSpotCount", Number.parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label>Datum početka izgradnje:</label>
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
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label>Datum završetka izgradnje:</label>
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
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label>Grad:</label>
          <input
            type="text"
            className="form-input"
            placeholder="Unesite grad"
            value={buildingData.city}
            onChange={e => handleChange("city", e.target.value)}
          />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label>Adresa:</label>
          <input
            type="text"
            className="form-input"
            placeholder="Unesite adresu zgrade"
            value={buildingData.address}
            onChange={e => handleChange("address", e.target.value)}
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label>Cena po kvadratu:</label>
          <input
            type="text"
            className="form-input"
            placeholder="Unesite cenu stanova po kvadratu"
            value={buildingData.priceList.pricePerM2}
            onChange={e => handlePriceListChange("pricePerM2", Number.parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label>Cena penala za kašnjenje po kvadratu:</label>
          <input
            type="text"
            className="form-input"
            placeholder="Unesite cena penala za kašnjenje po kvadratu stana"
            value={buildingData.priceList.penaltyPerM2}
            onChange={e => handlePriceListChange("penaltyPerM2", Number.parseFloat(e.target.value) || 0)}
          />
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
