"use client";

import { useState, useCallback } from "react";
// Using lucide-react for professional icons
import {
  Utensils,
  Clock,
  Menu,
  CalendarCheck,
  Zap,
  Check,
  Save,
  Trash2,
  PlusCircle,
} from "lucide-react";

// --- Type Definitions ---
type SettingValue = string | number | boolean;

type Integration = {
    id: string;
    name: string;
    apiKey: string;
    enabled: boolean;
};

type RestaurantSettingsState = {
    operational: {
        openingTime: string;
        closingTime: string;
        isDeliveryEnabled: boolean;
        weeklyOff: string;
    };
    menu: {
        baseTaxRate: number;
        defaultCategory: string;
        allowCustomRequests: boolean;
        inventoryAlertThreshold: number;
    };
    reservations: {
        maxPartySize: number;
        tableBufferTime: number; // minutes
        autoConfirmReservations: boolean;
        maxDailyReservations: number;
    };
    integrations: Integration[];
};


// --- Initial State (Restaurant Specific) ---
const initialRestaurantSettings: RestaurantSettingsState = {
  operational: {
    openingTime: "09:00",
    closingTime: "23:00",
    isDeliveryEnabled: true,
    weeklyOff: "Monday",
  },
  menu: {
    baseTaxRate: 5, // in percentage
    defaultCategory: "Main Course",
    allowCustomRequests: true,
    inventoryAlertThreshold: 5,
  },
  reservations: {
    maxPartySize: 12,
    tableBufferTime: 15, // in minutes
    autoConfirmReservations: false,
    maxDailyReservations: 50,
  },
  integrations: [
    { id: 'pos', name: 'Cloud POS Sync', apiKey: 'SK-P0S-7890-ABCDEF', enabled: true },
    { id: 'delivery_agg', name: 'Delivery Aggregator API', apiKey: 'SK-DEL-1234-GHIJKL', enabled: false },
  ],
};

// --- Reusable UI Components ---

/**
 * Custom Toggle Switch Component
 */
const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (value: boolean) => void; description: string }> = ({
  label,
  enabled,
  setEnabled,
  description,
}) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#FFF9EE] last:border-b-0">
      <div className="flex-1 pr-4">
        <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
          enabled ? "bg-amber-600" : "bg-gray-300"
        }`}
        aria-checked={enabled}
        role="switch"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-[#E8F4F1] transition-transform duration-200 shadow 
            ${enabled ? "translate-x-6 bg-[#E8F4F1]" : "translate-x-1 bg-[#E8F4F1]"}`}
        />
      </button>
    </div>
  );
};

/**
 * Section Header Component
 */
const SettingsSectionHeader: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <header className="flex items-center gap-3 mb-6 pb-4 border-b border-[#FFF9EE]">
    <div className="p-3 rounded-full bg-amber-100 text-amber-600 shadow-md">{icon}</div>
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </header>
);

/**
 * Input field with optional unit
 */
const SettingInput: React.FC<{ label: string; value: SettingValue; onChange: (value: SettingValue) => void; type?: 'text' | 'number' | 'time' | 'password'; unit?: string }> = ({
    label,
    value,
    onChange,
    type = 'text',
    unit,
}) => {
    // Convert number to string for input value, handle null/undefined gracefully
    const displayValue = value !== undefined && value !== null ? String(value) : '';

    return (
        <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <div className="mt-1 flex rounded-lg shadow-sm border border-gray-300 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition duration-150">
                <input
                    type={type}
                    className="block w-full rounded-l-lg p-3 text-sm focus:outline-none border-none focus:ring-0"
                    value={displayValue}
                    onChange={(e) => {
                        const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
                        onChange(newValue);
                    }}
                    min={type === 'number' ? 0 : undefined}
                />
                {unit && (
                    <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border-l border-gray-300 rounded-r-lg">
                        {unit}
                    </span>
                )}
            </div>
        </label>
    );
};


// --- Section Components ---

const OperationalSettings: React.FC<{ settings: RestaurantSettingsState['operational'], setSettings: (key: keyof RestaurantSettingsState, value: any) => void }> = ({ settings, setSettings }) => {
    
    // settings is already settings.operational here
    const handleUpdate = (field: keyof RestaurantSettingsState['operational'], value: SettingValue) => {
        setSettings('operational', { ...settings, [field]: value });
    };
    
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SettingInput 
                    label="Opening Time" 
                    value={settings.openingTime}
                    onChange={(v) => handleUpdate('openingTime', v as string)} 
                    type="time" 
                />
                <SettingInput 
                    label="Closing Time" 
                    value={settings.closingTime}
                    onChange={(v) => handleUpdate('closingTime', v as string)} 
                    type="time" 
                />
            </div>
            
            <label className="block">
                <span className="text-sm font-medium text-gray-700">Weekly Day Off</span>
                <select
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:border-amber-500 focus:ring-amber-500 text-sm appearance-none bg-[#E8F4F1] transition duration-150"
                    value={settings.weeklyOff}
                    onChange={(e) => handleUpdate('weeklyOff', e.target.value)}
                >
                    {weekDays.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
            </label>

            <ToggleSwitch
                label="Enable Food Delivery"
                enabled={settings.isDeliveryEnabled}
                setEnabled={(v) => handleUpdate('isDeliveryEnabled', v)}
                description="Allow customers to place orders for home delivery through online platforms."
            />
        </div>
    );
};

const MenuConfiguration: React.FC<{ settings: RestaurantSettingsState['menu'], setSettings: (key: keyof RestaurantSettingsState, value: any) => void }> = ({ settings, setSettings }) => {
    
    const handleUpdate = (field: keyof RestaurantSettingsState['menu'], value: SettingValue) => {
        setSettings('menu', { ...settings, [field]: value });
    };

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="col-span-1">
                    <SettingInput 
                        label="Base Tax Rate" 
                        value={settings.baseTaxRate} 
                        onChange={(v) => handleUpdate('baseTaxRate', v as number)} 
                        type="number" 
                        unit="%"
                    />
                </div>
                 <div className="col-span-2">
                    <SettingInput 
                        label="Inventory Alert Threshold" 
                        value={settings.inventoryAlertThreshold} 
                        onChange={(v) => handleUpdate('inventoryAlertThreshold', v as number)} 
                        type="number" 
                        unit="Units"
                    />
                </div>
            </div>
            
            <SettingInput 
                label="Default New Item Category" 
                value={settings.defaultCategory} 
                onChange={(v) => handleUpdate('defaultCategory', v as string)} 
                type="text"
            />

            <ToggleSwitch
                label="Allow Custom Order Requests"
                enabled={settings.allowCustomRequests}
                setEnabled={(v) => handleUpdate('allowCustomRequests', v)}
                description="Customers can add special instructions to their items (e.g., 'no onions, extra spicy')."
            />
        </div>
    );
};

const ReservationSettings: React.FC<{ settings: RestaurantSettingsState['reservations'], setSettings: (key: keyof RestaurantSettingsState, value: any) => void }> = ({ settings, setSettings }) => {
    
    const handleUpdate = (field: keyof RestaurantSettingsState['reservations'], value: SettingValue) => {
        setSettings('reservations', { ...settings, [field]: value });
    };

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SettingInput 
                    label="Maximum Party Size" 
                    value={settings.maxPartySize} 
                    onChange={(v) => handleUpdate('maxPartySize', v as number)} 
                    type="number" 
                    unit="Guests"
                />
                
                <SettingInput 
                    label="Table Turnover Buffer Time" 
                    value={settings.tableBufferTime} 
                    onChange={(v) => handleUpdate('tableBufferTime', v as number)} 
                    type="number" 
                    unit="Minutes"
                />
            </div>
            
            <SettingInput 
                label="Maximum Daily Online Reservations" 
                value={settings.maxDailyReservations} 
                onChange={(v) => handleUpdate('maxDailyReservations', v as number)} 
                type="number"
            />

            <ToggleSwitch
                label="Auto-Confirm Reservations"
                enabled={settings.autoConfirmReservations}
                setEnabled={(v) => handleUpdate('autoConfirmReservations', v)}
                description="Reservations are confirmed instantly without manual approval (use cautiously)."
            />
        </div>
    );
};

const IntegrationsSettings: React.FC<{ settings: RestaurantSettingsState['integrations'], setSettings: (key: keyof RestaurantSettingsState, value: any) => void }> = ({ settings: integrations, setSettings }) => {
    
    const updateIntegrations = (newIntegrations: Integration[]) => {
        setSettings('integrations', newIntegrations);
    };

    const handleToggle = (id: string, enabled: boolean) => {
        const newIntegrations = integrations.map(int => 
            int.id === id ? { ...int, enabled } : int
        );
        updateIntegrations(newIntegrations);
    };

    const handleRemove = (id: string) => {
        const newIntegrations = integrations.filter(int => int.id !== id);
        updateIntegrations(newIntegrations);
    };

    const handleAdd = () => {
        const newIntegration: Integration = {
            id: crypto.randomUUID(),
            name: 'New Service Integration',
            apiKey: '',
            enabled: false,
        };
        updateIntegrations([...integrations, newIntegration]);
    };
    
    const handleApiKeyChange = (id: string, newApiKey: string) => {
        const newIntegrations = integrations.map(int => 
            int.id === id ? { ...int, apiKey: newApiKey } : int
        );
        updateIntegrations(newIntegrations);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#FFF9EE]">
                <h3 className="text-lg font-semibold text-gray-800">Connected Services ({integrations.length})</h3>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-800 transition duration-150"
                >
                    <PlusCircle size={20} /> Add Integration
                </button>
            </div>
            
            {integrations.length === 0 ? (
                <p className="text-gray-500 italic p-4 border rounded-lg bg-gray-50 text-center">
                    No third-party services are currently integrated.
                </p>
            ) : (
                <div className="space-y-4">
                    {integrations.map((integration, index) => (
                        <div key={integration.id} className="p-4 border border-[#FFF9EE] rounded-xl shadow-sm bg-[#E8F4F1]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-md font-bold text-gray-900">{integration.name}</h4>
                                    <p className="text-xs text-gray-500 mb-2">Integration ID: {integration.id.substring(0, 8)}...</p>
                                </div>
                                <button 
                                    onClick={() => handleRemove(integration.id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                    title="Remove Integration"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <SettingInput 
                                label="API Key" 
                                value={integration.apiKey} 
                                onChange={(v) => handleApiKeyChange(integration.id, v as string)} 
                                type="password" 
                            />
                            
                            <div className="pt-2">
                                <ToggleSwitch
                                    label="Service Status"
                                    enabled={integration.enabled}
                                    setEnabled={(v) => handleToggle(integration.id, v)}
                                    description={integration.enabled ? "Currently Active" : "Currently Disabled"}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Main Component ---
export default function RestaurantSettings() {
  const [settings, setSettings] = useState(initialRestaurantSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('operational'); // State for sidebar navigation

  // General handler to update any setting property
  const updateSettings = useCallback(
    (key: keyof RestaurantSettingsState, value: any) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
      setSaveSuccess(false); // Reset success message on change
    },
    []
  );

  // Handle Save functionality (Mock API call)
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500)); 

    console.log("Restaurant Settings saved:", settings); // Log saved state

    setIsSaving(false);
    setSaveSuccess(true);
    // Auto-hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000); 
  };
  
  // Check if settings have been modified from initial state
  const isModified = JSON.stringify(settings) !== JSON.stringify(initialRestaurantSettings);

  const navigationItems = [
    { id: 'operational', name: 'Operational Details', icon: Clock, component: OperationalSettings, settingsKey: 'operational' },
    { id: 'menu', name: 'Menu Configuration', icon: Menu, component: MenuConfiguration, settingsKey: 'menu' },
    { id: 'reservations', name: 'Reservations & Dining', icon: CalendarCheck, component: ReservationSettings, settingsKey: 'reservations' },
    { id: 'integrations', name: 'System Integrations', icon: Zap, component: IntegrationsSettings, settingsKey: 'integrations' },
  ];

  const currentNavItem = navigationItems.find(item => item.id === activeSection) || navigationItems[0]; 
  
  const CurrentSettingsComponent = currentNavItem.component;
  const CurrentIcon = currentNavItem.icon; 
  const CurrentTitle = currentNavItem.name;
  const currentSettingsSectionKey = currentNavItem.settingsKey as keyof RestaurantSettingsState;

  // This prop structure is crucial: settings[key] passes only the relevant section data.
  const currentSettingsProps = {
    settings: settings[currentSettingsSectionKey],
    setSettings: updateSettings, // Passed the main updater function
  };

  return (
    // Outer container: Soft Neutral background
    <main className="min-h-screen bg-neutral-50 p-4 sm:p-8 md:p-12 font-sans">
      <div className="max-w-6xl w-full mx-auto bg-[#E8F4F1] rounded-2xl shadow-2xl border border-[#FFF9EE]">
        
        {/* Header */}
        <header className="p-6 md:p-8 border-b-4 border-amber-500">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Utensils className="text-amber-600 w-8 h-8"/> Restaurant Settings
          </h1>
          <p className="text-md text-gray-500 mt-1">Configure your daily operations, menu pricing, reservations, and third-party integrations.</p>
        </header>

        <div className="flex flex-col lg:flex-row">
            
            {/* Sidebar Navigation (1/4 width) */}
            <aside className="lg:w-1/4 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[#FFF9EE] bg-gray-50 lg:rounded-bl-2xl">
                <nav className="space-y-2">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`flex items-center w-full px-4 py-3 rounded-xl transition duration-200 
                                ${activeSection === item.id 
                                    ? 'bg-amber-100 text-amber-700 font-bold shadow-md ring-1 ring-amber-300'
                                    : 'text-gray-600 hover:bg-[#FFF9EE] hover:text-gray-900 font-medium'
                                }`}
                        >
                            <item.icon size={20} className="mr-3" />
                            {item.name}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Content Area (3/4 width) */}
            <div className="lg:w-3/4 p-6 md:p-8">
                
                {/* Dynamically render the selected section */}
                <section id={activeSection} className="pb-8">
                    <SettingsSectionHeader 
                        icon={<CurrentIcon size={20} />} 
                        title={CurrentTitle || 'Settings'} 
                        description={
                            activeSection === 'operational' ? "Set your restaurant's working hours and delivery options." :
                            activeSection === 'menu' ? "Manage tax rates and inventory alerts for menu items." :
                            activeSection === 'reservations' ? "Define seating capacity, party limits, and booking policies." :
                            activeSection === 'integrations' ? "Manage third-party API connections (e.g., POS, delivery platforms)." :
                            "Configure system settings."
                        }
                    />
                    {/* <CurrentSettingsComponent settings={currentSettingsProps.settings} setSettings={currentSettingsProps.setSettings} /> */}
                </section>

                {/* Save Changes Footer (Stays visible below content) */}
                <footer className="mt-8 pt-6 border-t border-[#FFF9EE] flex justify-end items-center gap-4">
                    {saveSuccess && (
                        <div className="flex items-center gap-2 text-green-600 font-semibold transition duration-300 ease-in-out">
                            <Check size={20} /> Settings saved successfully!
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!isModified || isSaving}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[#E8F4F1] font-bold transition duration-300 shadow-lg 
                            ${isModified && !isSaving 
                                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-300/50' 
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-[#E8F4F1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </footer>
            </div>
        </div>
      </div>
    </main>
  );
}