import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Plus, X } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/ui/Modal';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import type { Property, Unit } from '../../types/models';

const PropertyManagement: React.FC = () => {
  const {
    data,
    // setData,
    // logAction,
    // sendNotification,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
  } = useData();

  const { currentUserId } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const landlordProperties = useMemo(() => {
    return data.properties.filter(p => p.landlordId === currentUserId);
  }, [data.properties, currentUserId]);

  const handleSaveProperty = async (propertyData: {
    name: string;
    location: string;
    imageUrl: string;
    units: Unit[];
  }) => {
    if (editingProperty) {
      await updateProperty({
        ...editingProperty,
        name: propertyData.name,
        location: propertyData.location,
        images: [propertyData.imageUrl],
        units: propertyData.units,
      });
      await fetchProperties();
    } else {
      const newProperty = {
        name: propertyData.name,
        location: propertyData.location,
        images: [propertyData.imageUrl],
        landlordId: currentUserId || 'l1',
        coordinates: { lat: 0, lng: 0 },
        units: propertyData.units,
      };

      await addProperty(newProperty);
      await fetchProperties();
    }

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

  const performDeleteProperty = async () => {
    if (propertyToDelete) {
      await deleteProperty(propertyToDelete.id);
      await fetchProperties();
      setIsDeleteConfirmOpen(false);
      setPropertyToDelete(null);
    }
  };

  const PropertyForm: React.FC<{
    property: Property | null;
    onSave: (data: { name: string; location: string; imageUrl: string; units: Unit[] }) => void;
    onCancel: () => void;
  }> = ({ property, onSave, onCancel }) => {
    const [name, setName] = useState(property?.name || '');
    const [location, setLocation] = useState(property?.location || '');
    const [imageUrl, setImageUrl] = useState(property?.images?.[0] || '');
    const [units, setUnits] = useState<Unit[]>(
      property?.units.length
        ? property.units
        : [
            {
              id: `unit${Date.now()}`,
              name: '',
              rent: 0,
              type: 'residential',
              tenantId: null,
            },
          ]
    );

    const addUnit = () => {
      setUnits(prev => [
        ...prev,
        {
          id: `unit${Date.now() + Math.random()}`,
          name: '',
          rent: 0,
          type: 'residential',
          tenantId: null,
        },
      ]);
    };

    const removeUnit = (unitId: string) => {
      setUnits(prev => prev.filter(u => u.id !== unitId));
    };

    const updateUnitField = (
      unitId: string,
      field: keyof Unit,
      value: string | number | null
    ) => {
      setUnits(prev =>
        prev.map(u =>
          u.id === unitId
            ? {
                ...u,
                [field]: value,
              }
            : u
        )
      );
    };

    const unitAvailable = (unit: Unit) => unit.tenantId == null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const sanitizedUnits = units.map(u => ({
        ...u,
        tenantId: unitAvailable(u) ? null : u.tenantId,
      }));

      onSave({ name, location, imageUrl, units: sanitizedUnits });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          id="prop-name"
          type="text"
          label="Property Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <InputField
          id="prop-location"
          type="text"
          label="Location / Address"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
        />
        <InputField
          id="prop-image"
          type="url"
          label="Image URL"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Units</label>
          {units.map(unit => (
            <div
              key={unit.id}
              className="flex items-center space-x-2 mb-2 bg-gray-700 p-3 rounded-md"
            >
              <InputField
                id={`unit-name-${unit.id}`}
                type="text"
                label="Unit Name / Number"
                value={unit.name}
                onChange={e => updateUnitField(unit.id, 'name', e.target.value)}
                required
                className="flex-1"
              />
              <InputField
                id={`unit-rent-${unit.id}`}
                type="number"
                label="Rent (KES)"
                value={unit.rent.toString()}
                onChange={e => updateUnitField(unit.id, 'rent', Number(e.target.value))}
                min={0}
                required
                className="w-28"
              />
              <label className="flex items-center space-x-1 text-sm select-none">
                <input
                  type="checkbox"
                  checked={unitAvailable(unit)}
                  onChange={e => {
                    const available = e.target.checked;
                    setUnits(prev =>
                      prev.map(u =>
                        u.id === unit.id
                          ? { ...u, tenantId: available ? null : u.tenantId }
                          : u
                      )
                    );
                  }}
                  className="form-checkbox h-5 w-5 text-cyan-400"
                />
                <span>Available</span>
              </label>
              <button
                type="button"
                onClick={() => removeUnit(unit.id)}
                className="text-red-400 hover:text-red-600"
                title="Remove unit"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={addUnit}
            className="mt-2 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Unit</span>
          </Button>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {property ? 'Update Property' : 'Add Property'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <>
      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProperty ? 'Edit Property' : 'Add New Property'}
      >
        <PropertyForm
          property={editingProperty}
          onSave={handleSaveProperty}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Property Deletion"
      >
        <div className="p-4 text-center">
          <p className="text-lg text-white mb-8">
            Are you sure you want to delete property{' '}
            <span className="font-bold text-red-400">"{propertyToDelete?.name}"</span>? This action
            cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={performDeleteProperty}>
              Delete Property
            </Button>
          </div>
        </div>
      </Modal>

      {/* Property Cards */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold">My Properties</h3>
          <Button
            onClick={() => {
              setEditingProperty(null);
              setIsModalOpen(true);
            }}
          >
            <PlusCircle className="mr-2" /> Add Property
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {landlordProperties.length > 0 ? (
            landlordProperties.map(p => {
              const occupied = p.units.filter(u => u.tenantId).length;
              const total = p.units.length;
              const income = p.units.reduce(
                (sum, unit) => (unit.tenantId ? sum + unit.rent : sum),
                0
              );

              return (
                <div
                  key={p.id}
                  className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 flex flex-col justify-between hover:scale-105 transition-transform"
                >
                  <div>
                    <h4 className="font-bold text-xl text-cyan-400 mb-1">{p.name}</h4>
                    <p className="text-sm text-gray-400 mb-2">{p.location}</p>
                    {p.images.length > 0 && (
                      <img
                        src={p.images[0]}
                        alt={`${p.name} preview`}
                        className="rounded-lg w-full h-40 object-cover mb-4"
                      />
                    )}
                    <p className="text-sm text-gray-400 mb-2">Units: {total}</p>
                    <p className="text-sm text-gray-400 mb-2">Occupied: {occupied}</p>
                    <p className="text-sm text-emerald-400">
                      KES {income.toLocaleString()} / month
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-cyan-300 mb-2">Units Details:</h5>
                    <ul className="text-sm text-gray-300 space-y-1 max-h-32 overflow-auto">
                      {p.units.map(unit => (
                        <li key={unit.id || `${unit.name}-${unit.rent}`}>
                          <span>{unit.name || 'Unnamed Unit'}</span>
                          <span>
                            {' '}KES {unit.rent.toLocaleString()} -{' '}
                            {unit.tenantId ? (
                              <span className="text-red-400 font-semibold">Occupied</span>
                            ) : (
                              <span className="text-green-400 font-semibold">Available</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div />
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditPropertyClick(p)}>
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePropertyClick(p)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">No properties found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PropertyManagement;
