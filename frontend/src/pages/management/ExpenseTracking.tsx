// frontend/src/pages/management/ExpenseTracking.tsx

import React, { useState, useMemo, useContext, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, AlertTriangle, Search, ChevronDown } from 'lucide-react'; // Import icons
import { useData } from '../../hooks/useData'; // Import useData hook
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook
import Modal from '../../components/ui/Modal'; // Import Modal component
import InputField from '../../components/ui/InputField'; // Import InputField component
import SelectField from '../../components/ui/SelectField'; // Import SelectField component
import Button from '../../components/ui/Button'; // Import Button component
import DataTable from '../../components/tables/DataTable'; // Import DataTable component
import { Expense, Property } from '../../types/models'; // Import Expense, Property types

/**
 * ExpenseTracking component.
 * Allows landlords to log, view, edit, and delete property expenses.
 * Includes search and filter functionalities.
 */
const ExpenseTracking: React.FC = () => {
  const { data, setData, logAction, sendNotification } = useData();
  const { currentUserId } = useAuth(); // Get the current landlord's ID

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Filter properties to show only those belonging to the current landlord
  const landlordProperties = useMemo(() => {
    return data.properties.filter(p => p.landlordId === currentUserId);
  }, [data.properties, currentUserId]);

  // Filter expenses to show only those associated with the current landlord's properties
  const landlordExpenses = useMemo(() => {
    const propIds = landlordProperties.map(p => p.id);
    return data.expenses.filter(e => propIds.includes(e.propertyId));
  }, [data.expenses, landlordProperties]);

  // Extract unique expense categories for filtering
  const expenseCategories = useMemo(() => {
    const categories = new Set<string>();
    landlordExpenses.forEach(e => categories.add(e.category));
    return ['All', ...Array.from(categories).sort()];
  }, [landlordExpenses]);

  // Filtered expenses based on search term and category
  const filteredExpenses = useMemo(() => {
    let expenses = landlordExpenses;

    if (searchTerm) {
      expenses = expenses.filter(e =>
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (data.properties.find(p => p.id === e.propertyId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'All') {
      expenses = expenses.filter(e => e.category === filterCategory);
    }

    return expenses;
  }, [landlordExpenses, searchTerm, filterCategory, data.properties]);

  /**
   * Handles opening the modal to log a new expense.
   */
  const handleLogExpenseClick = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  /**
   * Handles opening the modal to edit an existing expense.
   * @param expense The expense object to edit.
   */
  const handleEditExpenseClick = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  /**
   * Handles saving a new or updated expense.
   * Updates the global data state and logs the action.
   * @param expenseData The data of the expense to save.
   */
  const handleSaveExpense = (expenseData: Expense) => {
    setData(prev => {
      let updatedExpenses = [...prev.expenses];
      const property = prev.properties.find(p => p.id === expenseData.propertyId);

      if (editingExpense) {
        updatedExpenses = updatedExpenses.map(e => e.id === expenseData.id ? expenseData : e);
        logAction(`Updated expense for property "${property?.name || 'N/A'}": ${expenseData.description} - KES ${expenseData.amount.toLocaleString()}`);
      } else {
        updatedExpenses.push(expenseData);
        logAction(`Logged new expense for property "${property?.name || 'N/A'}": ${expenseData.description} - KES ${expenseData.amount.toLocaleString()}`);
        sendNotification(`New expense logged for "${property?.name || 'an unknown property'}": ${expenseData.description}.`);
      }
      return { ...prev, expenses: updatedExpenses };
    });
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  /**
   * Handles initiating expense deletion.
   * @param expense The expense object to delete.
   */
  const handleDeleteExpenseClick = (expense: Expense) => {
    setExpenseToDelete(expense);
    setIsDeleteConfirmOpen(true);
  };

  /**
   * Performs the actual deletion of an expense.
   */
  const performDeleteExpense = () => {
    if (expenseToDelete) {
      setData(prev => {
        const property = prev.properties.find(p => p.id === expenseToDelete.propertyId);
        logAction(`Deleted expense for property "${property?.name || 'N/A'}": ${expenseToDelete.description} - KES ${expenseToDelete.amount.toLocaleString()}`);
        sendNotification(`Expense "${expenseToDelete.description}" for "${property?.name || 'an unknown property'}" was deleted.`);
        return { ...prev, expenses: prev.expenses.filter(e => e.id !== expenseToDelete.id) };
      });
      setIsDeleteConfirmOpen(false);
      setExpenseToDelete(null);
    }
  };

  /**
   * ExpenseForm component (nested for simplicity).
   * Form for logging/editing expense details.
   */
  const ExpenseForm: React.FC<{ expense: Expense | null; onSave: (data: Expense) => void; onCancel: () => void; properties: Property[] }> = ({ expense, onSave, onCancel, properties }) => {
    const [formData, setFormData] = useState<Expense>(() => expense || {
      id: `e${Date.now()}`,
      propertyId: '',
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
    });
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

    // Update form data if editingExpense changes
    useEffect(() => {
      if (expense) {
        setFormData(expense);
      } else {
        setFormData({
          id: `e${Date.now()}`,
          propertyId: '',
          category: '',
          description: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
        });
      }
      setErrors({}); // Clear errors on form open/reset
    }, [expense]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value } as Expense));
      setErrors(prev => ({ ...prev, [id]: undefined }));
    };

    const validate = (): { [key: string]: string | undefined } => {
      const newErrors: { [key: string]: string | undefined } = {};
      if (!formData.propertyId) newErrors.propertyId = 'Property is required.';
      if (!formData.category) newErrors.category = 'Category is required.';
      if (!formData.description) newErrors.description = 'Description is required.';
      if (!formData.amount || isNaN(formData.amount) || parseFloat(String(formData.amount)) <= 0) newErrors.amount = 'Valid amount is required.';
      if (!formData.date) newErrors.date = 'Date is required.';
      return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validate();
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length === 0) {
        onSave({ ...formData, amount: parseFloat(String(formData.amount)) });
      }
    };

    // Common categories for expenses
    const categories = ['Repairs', 'Utilities', 'Management Fees', 'Security', 'Cleaning', 'Marketing', 'Other'];

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <SelectField
          id="propertyId"
          label="Property"
          value={formData.propertyId}
          onChange={handleChange}
          error={errors.propertyId}
          options={properties.map(p => ({ value: p.id, label: p.name }))}
          required
        />
        <SelectField
          id="category"
          label="Category"
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
          options={categories.map(cat => ({ value: cat, label: cat }))}
          required
        />
        <InputField id="description" type="text" label="Description" value={formData.description} onChange={handleChange} error={errors.description} isTextArea required />
        <InputField id="amount" type="number" label="Amount (KES)" value={formData.amount} onChange={handleChange} error={errors.amount} required min="0" />
        <InputField id="date" type="date" label="Date" value={formData.date} onChange={handleChange} error={errors.date} required />
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">{expense ? "Update Expense" : "Log Expense"}</Button>
        </div>
      </form>
    );
  };

  /**
   * DeleteConfirmationModal component (nested for simplicity).
   * Generic modal for confirming deletion actions.
   */
  const DeleteConfirmationModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; itemType: string; itemName: string | undefined }> = ({ isOpen, onClose, onConfirm, itemType, itemName }) => {
    if (!isOpen) return null;
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Confirm Delete ${itemType}`}>
        <div className="p-4 text-center">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-6" />
          <p className="text-lg text-white mb-8">Are you sure you want to delete {itemType} <span className="font-bold text-red-400">"{itemName}"</span>? This action cannot be undone.</p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="danger" onClick={onConfirm}>Delete</Button>
          </div>
        </div>
      </Modal>
    );
  };

  // Define columns for the DataTable
  const expenseTableColumns = useMemo(() => [
    {
      key: 'property',
      header: 'Property',
      render: (row: Expense) => {
        const property = data.properties.find(p => p.id === row.propertyId);
        return property?.name || 'N/A';
      },
    },
    { key: 'category', header: 'Category' },
    { key: 'description', header: 'Description' },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: Expense) => `KES ${row.amount.toLocaleString()}`,
    },
    { key: 'date', header: 'Date' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Expense) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditExpenseClick(row)} title="Edit Expense">
            <Edit size={18} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteExpenseClick(row)} title="Delete Expense">
            <Trash2 size={18} />
          </Button>
        </div>
      ),
    },
  ], [data.properties]); // Re-memoize if properties change to update property names

  return (
    <>
      {/* Expense Log/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExpense ? "Edit Expense" : "Log New Expense"}>
        <ExpenseForm
          expense={editingExpense}
          onSave={handleSaveExpense}
          onCancel={() => setIsModalOpen(false)}
          properties={landlordProperties} // Pass only landlord's properties
        />
      </Modal>

      {/* Expense Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={performDeleteExpense}
        itemType="Expense"
        itemName={expenseToDelete ? `${expenseToDelete.description} (KES ${expenseToDelete.amount.toLocaleString()})` : undefined}
      />

      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <h3 className="text-xl font-semibold">Expense Log</h3>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition-all duration-200"
              />
            </div>
            {/* Filter by Category */}
            <div className="relative w-full sm:w-auto">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-full pl-3 pr-10 py-2.5 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg text-white appearance-none transition-all duration-200"
              >
                {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            {/* Log Expense Button */}
            <Button onClick={handleLogExpenseClick} className="w-full sm:w-auto">
              <PlusCircle className="mr-2" /> Log Expense
            </Button>
          </div>
        </div>
        {/* Expenses Data Table */}
        <DataTable<Expense>
          data={filteredExpenses}
          columns={expenseTableColumns}
          emptyMessage="No expenses found matching your criteria."
        />
      </div>
    </>
  );
};

export default ExpenseTracking;
