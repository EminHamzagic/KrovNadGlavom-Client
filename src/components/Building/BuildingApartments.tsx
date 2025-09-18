import { useState } from "react";
import type { Apartment } from "../../types/apartment";
import Modal from "../Modal";
import { getOrientationLabel } from "../../utils/orientation";

interface Props {
  apartments: Apartment[];
}

export default function BuildingApartments({ apartments }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | undefined>();

  return (
    <>
      <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl">Stanovi</h1>
          <button className="btn btn-outline-primary">+ Dodaj stanove</button>
        </div>

        {apartments && apartments.length
          ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {apartments.map((item, index) => (
                  <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
                    <div className="mb-2">
                      <span className="font-bold whitespace-nowrap">Broj stana: </span>
                      {item.apartmentNumber}
                    </div>
                    <div className="mb-2">
                      <span className="font-bold whitespace-nowrap">Površina stana: </span>
                      {item.area}
                    </div>
                    <div className="mb-5">
                      <span className="font-bold whitespace-nowrap">Status stana: </span>
                      <span className={`${item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{item.isAvailable ? "Slobodan" : "Zauzet"}</span>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setSelectedApartment(item);
                        setIsOpen(true);
                      }}
                    >
                      Više
                    </button>
                  </div>
                ))}
              </div>
            )
          : <span>Zgrada ne sadrži stanove</span>}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Detalji stana"
        footer={false}
      >
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Broj stanal: </span>
            {selectedApartment?.apartmentNumber}
          </div>
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Broj stanal: </span>
            {selectedApartment?.apartmentNumber}
          </div>
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Površina stana: </span>
            {selectedApartment?.area}
          </div>
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Broj soba: </span>
            {selectedApartment?.roomCount}
          </div>
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Broj terasa: </span>
            {selectedApartment?.balconyCount}
          </div>
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Orijentacija: </span>
            {getOrientationLabel(selectedApartment?.orientation)}
          </div>
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Status: </span>
            <span className={`${selectedApartment?.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{selectedApartment?.isAvailable ? "Slobodan" : "Zauzet"}</span>
          </div>
        </div>
      </Modal>
    </>
  );
}
