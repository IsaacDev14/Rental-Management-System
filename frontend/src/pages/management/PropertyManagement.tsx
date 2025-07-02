import React, { useState, useMemo } from 'react';
import { PlusCircle, MapPin, Edit, Trash2, Home, User } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/ui/Modal';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import ImageCarousel from '../../components/common/ImageCarousel';
import type { Property, Unit } from '../../types/models'; // ✅ Use type-only import

/**
 * PropertyManagement component.
 * Allows landlords to add, view, edit, and delete properties and their units.
 */
const PropertyManagement: React.FC = () => {
  const { data, setData, logAction, sendNotification } = useData();
  const { currentUserId } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const landlordProperties = useMemo(() => {
    return data.properties.filter(p => p.landlordId === currentUserId);
  }, [data.properties, currentUserId]);

  const handleSaveProperty = (propertyData: { name: string; location: string }) => {
    setData(prev => {
      if (editingProperty) {
        logAction(`Updated property: ${propertyData.name}`);
        return {
          ...prev,
          properties: prev.properties.map(p =>
            p.id === editingProperty.id ? { ...p, ...propertyData, units: p.units } : p
          )
        };
      } else {
        const newProperty: Property = {
          id: `prop${Date.now()}`,
          landlordId: currentUserId || 'l1',
          ...propertyData,
          units: [],
          images: [],
          coordinates: { lat: 0, lng: 0 }
        };
        logAction(`Added new property: ${newProperty.name}`);
        sendNotification(`New property "${newProperty.name}" added.`);
        return { ...prev, properties: [...prev.properties, newProperty] };
      }
    });
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const handleEditPropertyClick = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleDeletePropertyClick = (property: Property) => {
    setPropertyToDelete(property);
    setIsDeleteConfirmOpen(true);
  };

  const performDeleteProperty = () => {
    if (propertyToDelete) {
      setData(prev => {
        const updatedTenants = prev.tenants.filter(t => t.propertyId !== propertyToDelete.id);
        const updatedProperties = prev.properties.map(p => {
          if (p.id === propertyToDelete.id) return null;
          return {
            ...p,
            units: p.units.map(unit => ({
              ...unit,
              tenantId: updatedTenants.some(t => t.id === unit.tenantId) ? unit.tenantId : null
            }))
          };
        }).filter(Boolean) as Property[];

        logAction(`Deleted property: ${propertyToDelete.name}`);
        sendNotification(`Property "${propertyToDelete.name}" has been deleted.`);
        return {
          ...prev,
          properties: updatedProperties,
          tenants: updatedTenants,
          payments: prev.payments.filter(p => !updatedTenants.some(t => t.id === p.tenantId)),
          expenses: prev.expenses.filter(e => e.propertyId !== propertyToDelete.id),
          deposits: prev.deposits.filter(d => d.propertyId !== propertyToDelete.id),
        };
      });
      setIsDeleteConfirmOpen(false);
      setPropertyToDelete(null);
    }
  };

  const PropertyForm: React.FC<{ property: Property | null; onSave: (data: { name: string; location: string }) => void; onCancel: () => void }> = ({ property, onSave, onCancel }) => {
    const [name, setName] = useState(property?.name || '');
    const [location, setLocation] = useState(property?.location || '');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({ name, location });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField id="prop-name" type="text" label="Property Name" value={name} onChange={e => setName(e.target.value)} required />
        <InputField id="prop-location" type="text" label="Location / Address" value={location} onChange={e => setLocation(e.target.value)} required />
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">{property ? "Update Property" : "Add Property"}</Button>
        </div>
      </form>
    );
  };

  const PropertyDetailView: React.FC<{ property: Property; onBack: () => void }> = ({ property, onBack }) => {
    const { data } = useData();
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [isUnitDeleteConfirmOpen, setIsUnitDeleteConfirmOpen] = useState(false);
    const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);

    const handleSaveUnit = (unitData: { name: string; type: string; rent: number }) => {
      setData(prev => {
        const updatedProperties = prev.properties.map(p => {
          if (p.id === property.id) {
            let updatedUnits;
            if (editingUnit) {
              updatedUnits = p.units.map(u => u.id === editingUnit.id ? { ...u, ...unitData } : u);
              logAction(`Updated unit "${unitData.name}" in property "${property.name}".`);
            } else {
              const newUnit: Unit = { id: `unit${Date.now()}`, tenantId: null, ...unitData };
              updatedUnits = [...p.units, newUnit];
              logAction(`Added new unit "${newUnit.name}" to property "${property.name}".`);
              sendNotification(`New unit "${newUnit.name}" added to "${property.name}".`);
            }
            return { ...p, units: updatedUnits };
          }
          return p;
        });
        return { ...prev, properties: updatedProperties };
      });
      setIsUnitModalOpen(false);
      setEditingUnit(null);
    };

    const handleEditUnitClick = (unit: Unit) => {
      setEditingUnit(unit);
      setIsUnitModalOpen(true);
    };

    const handleDeleteUnitClick = (unit: Unit) => {
      setUnitToDelete(unit);
      setIsUnitDeleteConfirmOpen(true);
    };

    const performDeleteUnit = () => {
      if (unitToDelete) {
        setData(prev => {
          const updatedProperties = prev.properties.map(p => {
            if (p.id === property.id) {
              if (unitToDelete.tenantId) {
                const tenant = prev.tenants.find(t => t.id === unitToDelete.tenantId);
                if (tenant) {
                  logAction(`Tenant ${tenant.name} unassigned from unit ${unitToDelete.name} due to unit deletion.`);
                  sendNotification(`Tenant ${tenant.name} unassigned from unit ${unitToDelete.name}.`);
                }
              }
              const filteredUnits = p.units.filter(u => u.id !== unitToDelete.id);
              return { ...p, units: filteredUnits };
            }
            return p;
          });
          logAction(`Deleted unit "${unitToDelete.name}" from property "${property.name}".`);
          sendNotification(`Unit "${unitToDelete.name}" deleted from "${property.name}".`);
          return { ...prev, properties: updatedProperties };
        });
        setIsUnitDeleteConfirmOpen(false);
        setUnitToDelete(null);
      }
    };

    const UnitForm: React.FC<{ unit: Unit | null; onSave: (data: { name: string; type: string; rent: number }) => void; onCancel: () => void }> = ({ unit, onSave, onCancel }) => {
      const [name, setName] = useState(unit?.name || '');
      const [type, setType] = useState(unit?.type || '');
      const [rent, setRent] = useState(unit?.rent || 0);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, type, rent: Number(rent) });
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField id="unit-name" type="text" label="Unit Name" value={name} onChange={e => setName(e.target.value)} required />
          <InputField id="unit-type" type="text" label="Unit Type (e.g., 1-Bedroom, Studio)" value={type} onChange={e => setType(e.target.value)} required />
          <InputField id="unit-rent" type="number" label="Monthly Rent (KES)" value={rent} onChange={e => setRent(Number(e.target.value))} required min="0" />
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="primary">{unit ? "Update Unit" : "Add Unit"}</Button>
          </div>
        </form>
      );
    };

    return (
      <>
        <Modal isOpen={isUnitModalOpen} onClose={() => setIsUnitModalOpen(false)} title={editingUnit ? "Edit Unit" : "Add New Unit"}>
          <UnitForm unit={editingUnit} onSave={handleSaveUnit} onCancel={() => setIsUnitModalOpen(false)} />
        </Modal>
        <Modal isOpen={isUnitDeleteConfirmOpen} onClose={() => setIsUnitDeleteConfirmOpen(false)} title="Confirm Unit Deletion">
          <div className="p-4 text-center">
            <p className="text-lg text-white mb-8">Are you sure you want to delete unit <span className="font-bold text-red-400">"{unitToDelete?.name}"</span>? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <Button variant="secondary" onClick={() => setIsUnitDeleteConfirmOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={performDeleteUnit}>Delete Unit</Button>
            </div>
          </div>
        </Modal>
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 text-white">
          <Button variant="ghost" onClick={onBack} className="mb-6 flex items-center text-cyan-400 hover:text-cyan-300">← Back to All Properties</Button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h3 className="text-3xl font-bold">{property.name}</h3>
              <p className="text-gray-400 text-lg flex items-center mt-1"><MapPin size={20} className="mr-2" />{property.location}</p>
            </div>
            <Button onClick={() => { setEditingUnit(null); setIsUnitModalOpen(true); }} className="mt-4 md:mt-0">
              <PlusCircle className="mr-2" /> Add Unit
            </Button>
          </div>
          {property.images.length > 0 && (
            <div className="mb-8">
              <ImageCarousel images={property.images} />
            </div>
          )}
          <div className="mt-6">
            <h4 className="text-xl font-semibold mb-4">Units</h4>
            <div className="space-y-4">
              {property.units.length > 0 ? property.units.map(unit => {
                const tenant = data.tenants.find(t => t.id === unit.tenantId);
                return (
                  <div key={unit.id} className="bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-600">
                    <div className="mb-2 sm:mb-0">
                      <p className="font-semibold text-lg">{unit.name} ({unit.type})</p>
                      <p className="text-sm text-gray-300">Rent: KES {unit.rent.toLocaleString()}</p>
                    </div>
                    {tenant ? (
                      <div className='text-left sm:text-right'>
                        <p className="font-semibold text-gray-200 flex items-center"><User size={16} className="mr-2 text-cyan-400" />{tenant.name}</p>
                        <p className="text-xs text-gray-400 flex items-center"><Home size={16} className="mr-2 text-gray-500" />Lease ends: {tenant.leaseEnd}</p>
                      </div>
                    ) : (
                      <span className="px-4 py-1 text-sm rounded-full bg-amber-500/20 text-amber-400 font-semibold">Vacant</span>
                    )}
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <Button variant="ghost" size="sm" onClick={() => handleEditUnitClick(unit)} title="Edit Unit">
                        <Edit size={18} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUnitClick(unit)} title="Delete Unit">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-gray-400 text-lg text-center py-4">No units added to this property yet.</p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProperty ? "Edit Property" : "Add New Property"}>
        <PropertyForm property={editingProperty} onSave={handleSaveProperty} onCancel={() => setIsModalOpen(false)} />
      </Modal>
      <Modal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} title="Confirm Property Deletion">
        <div className="p-4 text-center">
          <p className="text-lg text-white mb-8">Are you sure you want to delete property <span className="font-bold text-red-400">"{propertyToDelete?.name}"</span>? This action cannot be undone and will also remove associated tenants, payments, expenses, and deposits.</p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={performDeleteProperty}>Delete Property</Button>
          </div>
        </div>
      </Modal>
      {selectedProperty ? (
        <PropertyDetailView property={selectedProperty} onBack={() => setSelectedProperty(null)} />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold">My Properties</h3>
            <Button onClick={() => { setEditingProperty(null); setIsModalOpen(true); }}>
              <PlusCircle className="mr-2" /> Add Property
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {landlordProperties.length > 0 ? landlordProperties.map(p => {
              const occupied = p.units.filter(u => u.tenantId).length;
              const total = p.units.length;
              const income = p.units.reduce((sum, unit) => unit.tenantId ? sum + unit.rent : sum, 0);
              return (
                <div key={p.id} className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 flex flex-col justify-between transition-all duration-300 hover:shadow-cyan-500/20 hover:scale-[1.02]">
                  <div>
                    <h4 className="font-bold text-xl text-cyan-400 mb-1">{p.name}</h4>
                    <p className="text-sm text-gray-400 mb-4">{p.location}</p>
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-300">
                      <span>Occupancy:</span>
                      <span className="font-semibold text-white">{occupied} / {total}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                      <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${total > 0 ? (occupied / total) * 100 : 0}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-3 text-sm text-gray-300">
                      <span>Monthly Income:</span>
                      <span className="font-semibold text-emerald-400">KES {income.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-6">
                    <Button variant="secondary" className="flex-1" onClick={() => setSelectedProperty(p)}>View Details</Button>
                    <Button variant="ghost" size="md" onClick={() => handleEditPropertyClick(p)} title="Edit Property">
                      <Edit size={20} />
                    </Button>
                    <Button variant="ghost" size="md" onClick={() => handleDeletePropertyClick(p)} title="Delete Property">
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full p-8 text-center bg-gray-800 rounded-xl shadow-xl border border-gray-700">
                <p className="text-gray-400 text-lg">No properties added yet. Click "Add Property" to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyManagement;
