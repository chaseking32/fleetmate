import React, { useState } from 'react';
import { mockShipments } from '../components/Shipments';
import ShipmentDetailsModal from '../components/ShipmentDetailsModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const statusColors = {
  'NOT_STARTED': 'bg-blue-200',
  'CAUTION': 'bg-yellow-200',
  'ON_TRACK': 'bg-green-200',
  'DELAYED': 'bg-red-200'
};

const DispatchColumn = ({ title, shipments, statusColor, onShipmentClick }) => {
  return (
    <Droppable droppableId={title}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-1 min-w-[200px] border-r border-gray-300 last:border-r-0 px-2 
            ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
        >
          <h3 className="font-bold mb-2 text-center bg-gray-100 py-1 text-sm">
            {title}
          </h3>
          <div className="space-y-1">
            {shipments.map((shipment, index) => (
              <Draggable 
                key={shipment.id} 
                draggableId={shipment.id.toString()} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-2 rounded text-xs ${statusColor} 
                      hover:opacity-80 hover:shadow-md transition-all duration-200
                      ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                    onClick={() => onShipmentClick(shipment)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold truncate pr-1">
                        {shipment.pickupLocation} → {shipment.deliveryLocation}
                      </div>
                      <div className="text-gray-500 flex-shrink-0">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 6h8v2H8V6zm0 4h8v2H8v-2zm0 4h8v2H8v-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="truncate text-[11px]">
                      {shipment.customer} | {shipment.carrier}
                    </div>
                    <div className="text-[11px] font-medium">
                      {new Date(shipment.pickupDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

const Dispatch = () => {
  const [planner, setPlanner] = useState('');
  const [customer, setCustomer] = useState('');
  const [pickRegion, setPickRegion] = useState('');
  const [date, setDate] = useState('');
  const [carrier, setCarrier] = useState('');
  const [delRegion, setDelRegion] = useState('');

  // Add state for managing the slideout
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false);

  // Add state for managing shipments
  const [shipments, setShipments] = useState(mockShipments);

  // Add these new states in the Dispatch component
  const [dragConfirmation, setDragConfirmation] = useState({
    isOpen: false,
    shipmentId: null,
    newStatus: null,
    sourceStatus: null
  });

  // Add this state near the other state declarations
  const [selectedCarrier, setSelectedCarrier] = useState('');

  const handleShipmentClick = (shipment) => {
    setSelectedShipment(shipment);
    setIsSlideoutOpen(true);
  };

  const handleCloseSlideout = () => {
    setIsSlideoutOpen(false);
    setSelectedShipment(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    
    // Don't show confirmation if dropped in same column
    if (source.droppableId === destination.droppableId) return;

    setDragConfirmation({
      isOpen: true,
      shipmentId: draggableId,
      newStatus: destination.droppableId,
      sourceStatus: source.droppableId
    });
  };

  // Add this new function to handle the status update
  const handleStatusUpdate = (confirmed) => {
    if (confirmed) {
      setShipments(prevShipments =>
        prevShipments.map(shipment =>
          shipment.id.toString() === dragConfirmation.shipmentId
            ? { 
                ...shipment, 
                dispatch_status: dragConfirmation.newStatus,
                // Update carrier if moving to Planned status
                ...(dragConfirmation.newStatus === 'Planned' && { carrier: selectedCarrier })
              }
            : shipment
        )
      );
    }
    setDragConfirmation({ isOpen: false, shipmentId: null, newStatus: null, sourceStatus: null });
    setSelectedCarrier(''); // Reset selected carrier
  };

  // Function to distribute shipments into columns based on dates
  const distributeShipments = () => {
    return {
      available: shipments.filter(s => s.dispatch_status === "Available"),
      planned: shipments.filter(s => s.dispatch_status === "Planned"),
      puTracking: shipments.filter(s => s.dispatch_status === "PU TRACKING"),
      loading: shipments.filter(s => s.dispatch_status === "LOADING"),
      delTracking: shipments.filter(s => s.dispatch_status === "DEL TRACKING"),
      delivering: shipments.filter(s => s.dispatch_status === "DELIVERING")
    };
  };

  const filteredShipments = distributeShipments();

  // Filter function for search
  const applyFilters = (shipments) => {
    return Object.keys(shipments).reduce((acc, key) => {
      acc[key] = shipments[key].filter(shipment => {
        return (
          (!planner || shipment.planner.toLowerCase().includes(planner.toLowerCase())) &&
          (!customer || shipment.customer.toLowerCase().includes(customer.toLowerCase())) &&
          (!pickRegion || shipment.pickupLocation.toLowerCase().includes(pickRegion.toLowerCase())) &&
          (!delRegion || shipment.deliveryLocation.toLowerCase().includes(delRegion.toLowerCase())) &&
          (!carrier || shipment.carrier.toLowerCase().includes(carrier.toLowerCase()))
        );
      });
      return acc;
    }, {});
  };

  const displayShipments = applyFilters(filteredShipments);

  // Add this function in the Dispatch component
  const handleShipmentUpdate = (updatedShipment) => {
    setShipments(prevShipments =>
      prevShipments.map(shipment =>
        shipment.id === updatedShipment.id ? updatedShipment : shipment
      )
    );
  };

  return (
    <div className="p-4">
      {/* Filters Section */}
      <div className="mb-6 border rounded-lg p-4">
        <h2 className="font-bold mb-4">FILTERS</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="PLANNER"
              className="border p-2 w-full"
              value={planner}
              onChange={(e) => setPlanner(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="date"
                className="border p-2 flex-1"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <select className="border p-2 w-20">
                <option>+/-</option>
                <option>+1</option>
                <option>-1</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="CUSTOMER"
              className="border p-2 w-full"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
            <input
              type="text"
              placeholder="CARRIER"
              className="border p-2 w-full"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="PICK REGION"
              className="border p-2 w-full"
              value={pickRegion}
              onChange={(e) => setPickRegion(e.target.value)}
            />
            <input
              type="text"
              placeholder="DEL REGION"
              className="border p-2 w-full"
              value={delRegion}
              onChange={(e) => setDelRegion(e.target.value)}
            />
          </div>
        </div>
        
        {/* Status Legend */}
        <div className="mt-4 flex justify-end gap-2">
          <div className="bg-blue-200 px-2 py-1 text-sm">NOT STARTED</div>
          <div className="bg-yellow-200 px-2 py-1 text-sm">CAUTION</div>
          <div className="bg-green-200 px-2 py-1 text-sm">ON TRACK</div>
          <div className="bg-red-200 px-2 py-1 text-sm">DELAYED/BLOCKED</div>
        </div>
      </div>

      {/* Dispatch Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex min-h-[600px] border-l border-r border-gray-300 w-full">
          <DispatchColumn 
            title="Available" 
            shipments={displayShipments.available} 
            statusColor="bg-yellow-200"
            onShipmentClick={handleShipmentClick}
          />
          <DispatchColumn 
            title="Planned" 
            shipments={displayShipments.planned} 
            statusColor="bg-blue-200"
            onShipmentClick={handleShipmentClick}
          />
          <DispatchColumn 
            title="PU TRACKING" 
            shipments={displayShipments.puTracking} 
            statusColor="bg-green-200"
            onShipmentClick={handleShipmentClick}
          />
          <DispatchColumn 
            title="LOADING" 
            shipments={displayShipments.loading} 
            statusColor="bg-yellow-200"
            onShipmentClick={handleShipmentClick}
          />
          <DispatchColumn 
            title="DEL TRACKING" 
            shipments={displayShipments.delTracking} 
            statusColor="bg-red-200"
            onShipmentClick={handleShipmentClick}
          />
          <DispatchColumn 
            title="DELIVERING" 
            shipments={displayShipments.delivering} 
            statusColor="bg-yellow-200"
            onShipmentClick={handleShipmentClick}
          />
        </div>
      </DragDropContext>

      {/* Add the ShipmentDetailsModal */}
      <ShipmentDetailsModal
        isOpen={isSlideoutOpen}
        onClose={handleCloseSlideout}
        shipment={selectedShipment}
        onUpdate={handleShipmentUpdate}
      />

      {/* Add this JSX right before the closing div of the return statement
      // (before the ShipmentDetailsModal) */}
      {dragConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Status Change</h3>
            <p className="mb-4">
              Are you sure you want to move this shipment from "{dragConfirmation.sourceStatus}" to "{dragConfirmation.newStatus}"?
            </p>
            
            {dragConfirmation.sourceStatus === 'Available' && dragConfirmation.newStatus === 'Planned' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Carrier *
                </label>
                <select
                  value={selectedCarrier}
                  onChange={(e) => setSelectedCarrier(e.target.value)}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select a carrier</option>
                  <option value="Carrier A">Carrier A</option>
                  <option value="Carrier B">Carrier B</option>
                  <option value="Carrier C">Carrier C</option>
                  <option value="Carrier D">Carrier D</option>
                </select>
                {selectedCarrier === '' && (
                  <p className="text-red-500 text-xs mt-1">Please select a carrier</p>
                )}
              </div>
            )}
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleStatusUpdate(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={dragConfirmation.newStatus === 'Planned' && selectedCarrier === ''}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dispatch; 