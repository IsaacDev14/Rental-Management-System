import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, AlertTriangle, Search, ChevronDown } from 'lucide-react'; // Icons
import { useData } from '../../hooks/useData'; // Assuming these hooks and components exist
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/ui/Modal';
import InputField from '../../components/ui/InputField';
import SelectField from '../../components/ui/SelectField';
import Button from '../../components/ui/Button';
import DataTable from '../../components/tables/DataTable';
import type { Expense, Property } from '../../types/models'; // Assuming these types exist

/**
 * ExpenseTracking component.
 * Allows landlords to log, view, edit, and delete property expenses.
 * Includes search and filter functionalities.
 */
const ExpenseTracking: React.FC = () => {
  // Destructure data fetching and manipulation functions from useData hook
  const {
    data,
    fetchExpenses,
    fetchProperties,
    addExpense,
    updateExpense,
    deleteExpense,
    logAction,
    sendNotification,
  } = useData();
  // Get current user ID from useAuth hook
  const { currentUserId } = useAuth();

  // State variables for UI control and data management
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls visibility of the add/edit expense modal
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null); // Stores expense being edited
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // Controls visibility of the delete confirmation modal
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null); // Stores expense to be deleted
  const [searchTerm, setSearchTerm] = useState(''); // Stores the current search term
  const [filterCategory, setFilterCategory] = useState('All'); // Stores the current filter category
  const [loading, setLoading] = useState(false); // Indicates if data is being loaded

  // Effect hook to fetch properties and expenses when the component mounts or currentUserId changes
  useEffect(() => {
    if (currentUserId) {
      setLoading(true); // Set loading to true before fetching data
      Promise.all([fetchProperties(), fetchExpenses()]) // Fetch both properties and expenses concurrently
        .finally(() => setLoading(false)); // Set loading to false once all fetches are complete
    }
  }, [currentUserId, fetchProperties, fetchExpenses]); // Dependencies array: re-run effect if these change

  // Memoized list of properties owned by the current landlord
  const landlordProperties = useMemo(() => {
    return data.properties.filter(p => p.landlordId === currentUserId);
  }, [data.properties, currentUserId]); // Re-calculate if properties data or currentUserId changes

  // Memoized list of expenses associated with the landlord's properties
  const landlordExpenses = useMemo(() => {
    const propIds = landlordProperties.map(p => p.id); // Get IDs of landlord's properties
    return data.expenses.filter(e => propIds.includes(e.propertyId)); // Filter expenses by property ID
  }, [data.expenses, landlordProperties]); // Re-calculate if expenses data or landlordProperties change

  // Memoized list of unique expense categories for filtering
  const expenseCategories = useMemo(() => {
    const categories = new Set<string>(); // Use a Set to store unique categories
    landlordExpenses.forEach(e => categories.add(e.category)); // Add each expense's category to the set
    return ['All', ...Array.from(categories).sort()]; // Convert set to array, add 'All' option, and sort alphabetically
  }, [landlordExpenses]); // Re-calculate if landlordExpenses change

  // Memoized list of expenses filtered by search term and category
  const filteredExpenses = useMemo(() => {
    let expenses = landlordExpenses; // Start with all landlord expenses

    // Apply search term filter
    if (searchTerm) {
      expenses = expenses.filter(e =>
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by description
        e.category.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by category
        (data.properties.find(p => p.id === e.propertyId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) // Search by associated property name
      );
    }

    // Apply category filter
    if (filterCategory !== 'All') {
      expenses = expenses.filter(e => e.category === filterCategory);
    }

    return expenses;
  }, [landlordExpenses, searchTerm, filterCategory, data.properties]); // Re-calculate if any of these dependencies change

  // Handler to open the modal for logging a new expense
  const handleLogExpenseClick = () => {
    setEditingExpense(null); // Clear any existing expense data
    setIsModalOpen(true); // Open the modal
  };

  // Handler to open the modal for editing an existing expense
  const handleEditExpenseClick = (expense: Expense) => {
    setEditingExpense(expense); // Set the expense to be edited
    setIsModalOpen(true); // Open the modal
  };

  // Handler to save a new or updated expense
  const handleSaveExpense = async (expenseData: Expense) => {
    try {
      const property = data.properties.find(p => p.id === expenseData.propertyId); // Find the associated property
      if (editingExpense) {
        // If editing an existing expense
        await updateExpense(expenseData); // Call update API
        logAction(`Updated expense for property "${property?.name || 'N/A'}": ${expenseData.description} - KES ${expenseData.amount.toLocaleString()}`);
      } else {
        // If logging a new expense
        await addExpense(expenseData); // Call add API
        logAction(`Logged new expense for property "${property?.name || 'N/A'}": ${expenseData.description} - KES ${expenseData.amount.toLocaleString()}`);
        sendNotification(`New expense logged for "${property?.name || 'an unknown property'}": ${expenseData.description}.`);
      }
    } catch (error) {
      console.error('Failed to save expense:', error);
      // TODO: Optionally, show user-friendly error notification here
    } finally {
      setIsModalOpen(false); // Close the modal
      setEditingExpense(null); // Clear editing expense state
    }
  };

  // Handler to initiate expense deletion (opens confirmation modal)
  const handleDeleteExpenseClick = (expense: Expense) => {
    setExpenseToDelete(expense); // Set the expense to be deleted
    setIsDeleteConfirmOpen(true); // Open the delete confirmation modal
  };

  // Handler to perform the actual expense deletion
  const performDeleteExpense = async () => {
    if (!expenseToDelete) return; // Do nothing if no expense is selected for deletion

    try {
      const property = data.properties.find(p => p.id === expenseToDelete.propertyId); // Find the associated property
      await deleteExpense(expenseToDelete.id); // Call delete API
      logAction(`Deleted expense for property "${property?.name || 'N/A'}": ${expenseToDelete.description} - KES ${expenseToDelete.amount.toLocaleString()}`);
      sendNotification(`Expense "${expenseToDelete.description}" for "${property?.name || 'an unknown property'}" was deleted.`);
    } catch (error) {
      console.error('Failed to delete expense:', error);
      // TODO: Optionally, show user-friendly error notification here
    } finally {
      setIsDeleteConfirmOpen(false); // Close the delete confirmation modal
      setExpenseToDelete(null); // Clear expense to delete state
    }
  };

  /**
   * ExpenseForm component for adding or editing expense details.
   * @param {object} props - Component props.
   * @param {Expense | null} props.expense - The expense object to edit, or null for a new expense.
   * @param {(data: Expense) => void} props.onSave - Callback function to save the expense.
   * @param {() => void} props.onCancel - Callback function to cancel the form.
   * @param {Property[]} props.properties - List of properties to select from.
   */
  const ExpenseForm: React.FC<{
    expense: Expense | null;
    onSave: (data: Expense) => void;
    onCancel: () => void;
    properties: Property[];
  }> = ({ expense, onSave, onCancel, properties }) => {
    // State for form data, initialized with existing expense or default values
    const [formData, setFormData] = useState<Expense>(() => expense || {
      id: `e${Date.now()}`, // Generate a unique ID for new expenses
      propertyId: '',
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    });
    // State for form validation errors
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

    // Effect to reset form data and errors when the 'expense' prop changes
    useEffect(() => {
      if (expense) {
        setFormData(expense); // Populate form with existing expense data
      } else {
        setFormData({ // Reset form for a new expense
          id: `e${Date.now()}`,
          propertyId: '',
          category: '',
          description: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
        });
      }
      setErrors({}); // Clear any previous errors
    }, [expense]); // Re-run effect when 'expense' prop changes

    // Handle input changes and update form data
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value } as Expense)); // Update corresponding field in formData
      setErrors(prev => ({ ...prev, [id]: undefined })); // Clear error for the changed field
    };

    // Validate form fields and return an object of errors
    const validate = (): { [key: string]: string | undefined } => {
      const newErrors: { [key: string]: string | undefined } = {};
      if (!formData.propertyId) newErrors.propertyId = 'Property is required.';
      if (!formData.category) newErrors.category = 'Category is required.';
      if (!formData.description) newErrors.description = 'Description is required.';
      // Validate amount: must be a number and greater than 0
      if (!formData.amount || isNaN(parseFloat(String(formData.amount))) || parseFloat(String(formData.amount)) <= 0) newErrors.amount = 'Valid amount is required.';
      if (!formData.date) newErrors.date = 'Date is required.';
      return newErrors;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault(); // Prevent default form submission behavior
      const validationErrors = validate(); // Run validation
      setErrors(validationErrors); // Set validation errors state
      if (Object.keys(validationErrors).length === 0) {
        // If no errors, save the expense, ensuring amount is parsed as a float
        onSave({ ...formData, amount: parseFloat(String(formData.amount)) });
      }
    };

    // Predefined categories for expense selection
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
        <InputField
          id="description"
          type="text"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          isTextArea // Render as a textarea for longer descriptions
          required
        />
        <InputField
          id="amount"
          type="number"
          label="Amount (KES)"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
          required
          min="0" // Ensure amount is non-negative
        />
        <InputField
          id="date"
          type="date"
          label="Date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">{expense ? "Update Expense" : "Log Expense"}</Button>
        </div>
      </form>
    );
  };

  /**
   * DeleteConfirmationModal component for confirming deletion actions.
   * @param {object} props - Component props.
   * @param {boolean} props.isOpen - Controls modal visibility.
   * @param {() => void} props.onClose - Callback to close the modal.
   * @param {() => void} props.onConfirm - Callback to confirm the deletion.
   * @param {string} props.itemType - Type of item being deleted (e.g., "Expense").
   * @param {string | undefined} props.itemName - Name of the item being deleted.
   */
  const DeleteConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemType: string;
    itemName: string | undefined;
  }> = ({ isOpen, onClose, onConfirm, itemType, itemName }) => {
    if (!isOpen) return null; // Don't render if not open
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Confirm Delete ${itemType}`}>
        <div className="p-4 text-center">
          {/* Alert icon with red color */}
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-6" />
          <p className="text-lg text-white mb-8">
            Are you sure you want to delete {itemType} <span className="font-bold text-red-400">"{itemName}"</span>? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="danger" onClick={onConfirm}>Delete</Button>
          </div>
        </div>
      </Modal>
    );
  };

  // Memoized column definitions for the expenses data table
  const expenseTableColumns = useMemo(() => [
    {
      key: 'property',
      header: 'Property',
      render: (row: Expense) => {
        const property = data.properties.find(p => p.id === row.propertyId);
        return property?.name || 'N/A'; // Display property name or 'N/A'
      },
    },
    { key: 'category', header: 'Category' },
    { key: 'description', header: 'Description' },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: Expense) => `KES ${row.amount.toLocaleString()}`, // Format amount as currency
    },
    { key: 'date', header: 'Date' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Expense) => (
        <div className="flex space-x-2">
          {/* Edit button with a blue icon */}
          <Button variant="ghost" size="sm" onClick={() => handleEditExpenseClick(row)} title="Edit Expense">
            <Edit size={18} className="text-blue-400 hover:text-blue-300" />
          </Button>
          {/* Delete button with a red icon */}
          <Button variant="ghost" size="sm" onClick={() => handleDeleteExpenseClick(row)} title="Delete Expense">
            <Trash2 size={18} className="text-red-400 hover:text-red-300" />
          </Button>
        </div>
      ),
    },
  ], [data.properties]); // Re-calculate if properties data changes

  return (
    <>
      {/* Log/Edit Expense Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExpense ? "Edit Expense" : "Log New Expense"}>
        <ExpenseForm
          expense={editingExpense}
          onSave={handleSaveExpense}
          onCancel={() => setIsModalOpen(false)}
          properties={landlordProperties}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={performDeleteExpense}
        itemType="Expense"
        itemName={expenseToDelete ? `${expenseToDelete.description} (KES ${expenseToDelete.amount.toLocaleString()})` : undefined}
      />

      <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700 text-white mx-auto max-w-7xl my-4 sm:my-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <h3 className="text-2xl font-bold text-cyan-400">Expense Log</h3>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow w-full sm:w-auto">
              {/* Search icon with gray color */}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition-all duration-200 placeholder-gray-400"
              />
            </div>
            {/* Filter by Category Select Field */}
            <div className="relative w-full sm:w-auto">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-full pl-3 pr-10 py-2.5 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg text-white appearance-none transition-all duration-200"
              >
                {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {/* ChevronDown icon with gray color */}
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            {/* Log Expense Button */}
            <Button onClick={handleLogExpenseClick} className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center">
              {/* PlusCircle icon with white color */}
              <PlusCircle className="mr-2 text-white" size={20} /> Log Expense
            </Button>
          </div>
        </div>

        {/* Loading or Expenses Table */}
        {loading ? (
          <p className="text-center text-gray-300 py-10">Loading expenses...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <DataTable<Expense>
              data={filteredExpenses}
              columns={expenseTableColumns}
              emptyMessage="No expenses found matching your criteria."
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ExpenseTracking;
