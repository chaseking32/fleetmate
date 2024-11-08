import React, { useState } from 'react';

const ShipmentDetailsModal = ({ isOpen, onClose, shipment, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState(shipment?.dispatch_status || '');
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'customer', name: 'Customer' },
    { id: 'carrier', name: 'Carrier' },
    { id: 'pricing', name: 'Pricing' },
    { id: 'details', name: 'Details' }
  ];

  React.useEffect(() => {
    setEditedStatus(shipment?.dispatch_status || '');
    setIsEditing(false);
  }, [shipment]);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate({
      ...shipment,
      dispatch_status: editedStatus
    });
    setIsEditing(false);
  };

  const statusConfig = {
    'Available': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    'Planned': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    'PU TRACKING': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    'LOADING': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    'DEL TRACKING': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
    'DELIVERING': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' }
  };

  const renderDispatchStatus = () => {
    const status = shipment.dispatch_status;
    const statusStyle = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };

    if (isEditing) {
      return (
        <div className="max-w-xs bg-blue-50 p-2 rounded-md border border-blue-200">
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
            className="block w-full border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {Object.keys(statusConfig).map(statusOption => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center">
        <span className="text-sm font-medium text-gray-500 mr-2">Status:</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}>
          {status}
        </span>
      </div>
    );
  };

  const renderActions = () => {
    if (isEditing) {
      return (
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditedStatus(shipment.dispatch_status);
            }}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      );
    }
    return (
      <div className="flex space-x-2 ml-4">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Change Status
        </button>
        <button
          type="button"
          className="px-2 py-1 text-xs font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50"
        >
          Cancel Shipment
        </button>
      </div>
    );
  };

  const statusSection = (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Status Information</h3>
      <div className="grid grid-cols-2 gap-4">
        {renderDispatchStatus()}
        <div>
          <label className="block text-sm font-medium text-gray-500">Planner</label>
          <p className="mt-1 text-sm text-gray-900">{shipment.planner}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
             onClick={onClose}></div>

        <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              {/* Header */}
              <div className="px-4 py-6 bg-gray-50 sm:px-6">
                <div className="space-y-4">
                  {/* Title and close button */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h2 className="text-lg font-medium text-gray-900">
                        Shipment #{shipment.id}
                      </h2>
                      <p className="text-sm text-gray-500">
                        View and manage shipment details
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close panel</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex-1">
                      {renderDispatchStatus()}
                    </div>
                    <div className="flex space-x-3 ml-4">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setEditedStatus(shipment.dispatch_status);
                            }}
                            className="px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSave}
                            className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          >
                            Save Changes
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          >
                            Change Status
                          </button>
                          <button
                            type="button"
                            className="px-2 py-1 text-xs font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50"
                          >
                            Cancel Shipment
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px px-4 space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                          ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="px-4 py-6 sm:px-6">
                  <div className="space-y-6">
                    {activeTab === 'customer' && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Customer Name</label>
                            <p className="mt-1 text-sm text-gray-900">{shipment.customer}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Customer Reference</label>
                            <p className="mt-1 text-sm text-gray-900">{shipment.customer_reference || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Contact Name</label>
                            <p className="mt-1 text-sm text-gray-900">{shipment.customer_contact || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Contact Phone</label>
                            <p className="mt-1 text-sm text-gray-900">{shipment.customer_phone || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Contact Email</label>
                            <p className="mt-1 text-sm text-gray-900">{shipment.customer_email || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'carrier' && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Carrier Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Carrier Name</label>
                            <p className="mt-1 text-sm text-gray-900">{shipment.carrier || 'Not Assigned'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Equipment Type</label>
                            <p className="mt-1 text-sm text-gray-900">{shipment.equipment_type || 'Not Specified'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Driver Name</label>
                            <p className="mt-1 text-sm text-gray-900">{shipment.driver_name || 'Not Assigned'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Driver Phone</label>
                            <p className="mt-1 text-sm text-gray-900">{shipment.driver_phone || 'Not Available'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Truck Number</label>
                            <p className="mt-1 text-sm text-gray-900">{shipment.truck_number || 'Not Available'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'pricing' && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Customer Rate</label>
                            <p className="mt-1 text-sm text-gray-900">${shipment.rate?.toLocaleString() || '0'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Carrier Rate</label>
                            <p className="mt-1 text-sm text-gray-900">${shipment.carrier_rate?.toLocaleString() || '0'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Margin</label>
                            <p className="mt-1 text-sm text-gray-900">
                              ${((shipment.rate || 0) - (shipment.carrier_rate || 0)).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Additional Charges</label>
                            <p className="mt-1 text-sm text-gray-900">${shipment.additional_charges?.toLocaleString() || '0'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Payment Terms</label>
                            <p className="mt-1 text-sm text-gray-900">{shipment.payment_terms || 'Standard Terms'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'details' && (
                      <div className="space-y-8">
                        {/* Locations Section */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Locations</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Pickup Location</label>
                              <p className="mt-1 text-sm text-gray-900">{shipment.pickupLocation}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Delivery Location</label>
                              <p className="mt-1 text-sm text-gray-900">{shipment.deliveryLocation}</p>
                            </div>
                          </div>
                        </div>

                        {/* Schedule Section */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Pickup Date</label>
                              <p className="mt-1 text-sm text-gray-900">
                                {new Date(shipment.pickupDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Delivery Date</label>
                              <p className="mt-1 text-sm text-gray-900">
                                {new Date(shipment.deliveryDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Pickup Time</label>
                              <p className="mt-1 text-sm text-gray-900">{shipment.pickupTime || 'Not Specified'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Delivery Time</label>
                              <p className="mt-1 text-sm text-gray-900">{shipment.deliveryTime || 'Not Specified'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Additional Details Section */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Special Instructions</label>
                              <p className="mt-1 text-sm text-gray-900">{shipment.special_instructions || 'None'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Reference Numbers</label>
                              <p className="mt-1 text-sm text-gray-900">{shipment.reference_numbers || 'None'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShipmentDetailsModal; 