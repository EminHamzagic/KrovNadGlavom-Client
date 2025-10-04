import { useState } from "react";
import UsersTableComponent from "../../components/Admin/UsersTableComponent";
import BuildingsTableComponent from "../../components/Admin/BuildingsTableComponent";
import RegRequestsTableComponent from "../../components/Admin/RegRequestsTableComponent";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<number>(1);

  return (
    <div className="planel flex-col shadow-md flex bg-white rounded-md p-4">
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-10">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <button
              onClick={() => {
                setActiveTab(1);
              }}
              className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                activeTab === 1
                  ? "text-primary border-primary"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 "
              }`}
            >
              Korisnici
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => {
                setActiveTab(2);
              }}
              className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                activeTab === 2
                  ? "text-primary border-primary"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 "
              }`}
            >
              Zgrade
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => {
                setActiveTab(3);
              }}
              className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                activeTab === 3
                  ? "text-primary border-primary"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 "
              }`}
            >
              Zahtevi
            </button>
          </li>
        </ul>
      </div>

      {activeTab === 1 && <UsersTableComponent />}
      {activeTab === 2 && <BuildingsTableComponent />}
      {activeTab === 3 && <RegRequestsTableComponent />}
    </div>
  );
}
