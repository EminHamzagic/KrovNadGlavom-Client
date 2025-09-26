import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Apartment } from "../../types/apartment";
import { getApartmentById } from "../../services/apartmentService";
import { handleError } from "../../utils/handleError";
import FullScreenLoader from "../../components/FullScreenLoader";
import { PopupType, useToast } from "../../hooks/useToast";
import type { ContractToAdd } from "../../types/contract";
import { UserContext } from "../../context/UserContext";
import { createContract } from "../../services/contractService";
import { StatusEnum } from "../../types/agencyRequest";

export default function ApartmentBuyPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingBuy, setLoadingBuy] = useState<boolean>(false);
  const [apartment, setApartment] = useState<Apartment>({} as Apartment);
  const [paymentLength, setPaymentLength] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [installmentCount, setInstallmentCount] = useState<number>(0);
  const [installmentAmount, setInstallmentAmount] = useState<number>(0);
  const [installmentText, setInstallmentText] = useState<string>("");

  const { user } = useContext(UserContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const getDiscountPrice = (data: Apartment): number => {
    if (data.discountRequest && data.discountRequest.status === StatusEnum.Approved) {
      const price = data.area * (data.building.priceList?.pricePerM2 ?? 1);
      const newPrice = price - price * ((data.discountRequest?.percentage ?? 1) / 100);
      return Math.floor(newPrice);
    }
    else {
      return data.area * (data.building.priceList?.pricePerM2 ?? 1);
    }
  };

  useEffect(() => {
    const fetchApartment = async () => {
      if (apartmentId) {
        try {
          setLoading(true);
          const data = await getApartmentById(apartmentId);

          if (data.reservation) {
            if (data.reservation.userId !== user.id)
              navigate("/apartments");
          }

          setApartment(data);
          setPrice(getDiscountPrice(data));
        }
        catch (err) {
          handleError(err);
        }
        finally {
          setLoading(false);
        }
      }
    };

    fetchApartment();
  }, []);

  useEffect(() => {
    if (!apartment?.area || !apartment?.building?.priceList?.pricePerM2)
      return;

    const totalInstallments = paymentLength * 12;

    setInstallmentCount(totalInstallments);

    if (totalInstallments > 0) {
      const baseInstallment = Math.floor(price / totalInstallments);
      const remainder = price - baseInstallment * (totalInstallments - 1);
      setInstallmentAmount(baseInstallment);

      if (remainder === baseInstallment) {
        setInstallmentText(`${totalInstallments} rata po <span class="font-bold">${baseInstallment}€</span>`);
      }
      else {
        setInstallmentText(
          `${totalInstallments - 1} rata po <span class="font-bold">${baseInstallment}€</span> i poslednja rata <span class="font-bold">${remainder}€</span>`,
        );
      }
    }
    else {
      setInstallmentText("");
    }
  }, [paymentLength, apartment]);

  const handleBuy = async () => {
    if (paymentLength > 10 || paymentLength <= 0) {
      showToast(PopupType.Danger, "Izaberite validnu dužinu isplate");
      return;
    }
    if (installmentCount <= 0 || installmentCount > 120) {
      showToast(PopupType.Danger, "Molimo vas proverite podatke");
      return;
    }

    const createData = {
      userId: user.id,
      agencyId: apartment.agency?.id,
      apartmentId: apartment.id,
      price,
      installmentAmount,
      installmentCount,
    } as ContractToAdd;

    try {
      setLoadingBuy(true);
      const data = await createContract(createData);
      showToast(PopupType.Success, "Uspešno ste kupili stan, predugovor je kreiran");
      navigate(`/contracts/${data.id}`);
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoadingBuy(false);
    }
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4 mb-10">
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl">Informacije o kupovini</h1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 mt-4 gap-2">
          <div className="col-span-1 sm:col-span-3 flex flex-col mb-2">
            <span className="font-bold">Cena stana:</span>
            <span>
              {price}
              €
            </span>
          </div>
          <div className="col-span-1 sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="col-span-1 flex flex-col mb-2">
              <span className="font-bold">Dužina ispate:</span>
              <select className="form-input" value={paymentLength} onChange={e => setPaymentLength(Number(e.target.value))}>
                <option value="">Izaberite duzinu isplate</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(year => (
                  <option value={year} key={year}>
                    {year}
                    {" "}
                    godina
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-3 flex flex-col mb-2">
            <span className="font-bold">Broj rata(12 rata po godini):</span>
            <span>
              {installmentCount}
            </span>
          </div>

          <div className="col-span-1 sm:col-span-3 flex flex-col mb-2">
            <span className="font-bold text-xl">Iznos po rati:</span>
            <span className="text-xl" dangerouslySetInnerHTML={{ __html: installmentText }} />
          </div>

          <div className="col-span-1 sm:col-span-3 mt-10">
            <h2 className="text-xl font-bold mb-4">Pravni uslovi kupovine stana putem aplikacije</h2>
            <ol className="list-decimal list-inside space-y-3 text-justify">
              <li>
                Kupovinom stana putem aplikacije, automatski se zaključuje
                {" "}
                <span className="font-bold">Predugovor o kupoprodaji stana</span>
                , kojim se utvrđuje
                ukupan iznos kupoprodajne cene, broj izabranih rata, kao i visina pojedinačne rate.
              </li>
              <li>
                Kupac se obavezuje da svaku ratu uplaćuje najkasnije do dana dospelosti utvrđenog
                Predugovorom. Dozvoljava se kašnjenje u uplati rate u maksimalnom trajanju od
                {" "}
                <span className="font-bold">sedam (7) dana</span>
                {" "}
                od dana dospelosti.
              </li>
              <li>
                U slučaju da kupac zakasni sa uplatom više od
                {" "}
                <span className="font-bold">tri (3) rate</span>
                , smatraće se da je kupac povredio ugovorne
                obaveze, te se Predugovor raskida po sili prava. U tom slučaju, kupcu se vraća ukupan do
                tada uplaćeni iznos, umanjen za
                {" "}
                <span className="font-bold">deset procenata (10%)</span>
                {" "}
                kupoprodajne cene, koji iznos
                ostaje agenciji na ime nadoknade dodatnih troškova i nastalog gubitka.
              </li>
              <li>
                Sve rate se uplaćuju isključivo na zvanični bankovni račun agencije, naveden u
                Predugovoru. Kupac je obavezan da nakon svake izvršene uplate dostavi dokaz o uplati
                (fotografiju uplatnice) putem aplikacije.
              </li>
              <li>
                Rata se smatra uredno plaćenom tek pošto agencija izvrši proveru i potvrdi prijem uplate.
                Do momenta potvrde od strane agencije, uplata se neće smatrati konačno izvršenom.
              </li>
              <li>
                Kupac je saglasan da agencija zadržava pravo raskida Predugovora u slučaju ponovljenog ili
                namernog neizvršenja obaveza od strane kupca, kao i u slučaju pokušaja dostavljanja
                falsifikovanih ili netačnih dokaza o uplati.
              </li>
            </ol>
          </div>

          <button className="btn btn-primary sm:col-span-3 mt-10 text-xl" onClick={handleBuy} disabled={loadingBuy}>
            {loadingBuy
              ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )
              : (
                  "Kupi"
                )}
          </button>
        </div>
      </div>
    </div>
  );
}
