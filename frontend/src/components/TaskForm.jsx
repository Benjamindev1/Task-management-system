import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
};

export default function TaskForm({ initialValues, onSubmit, onCancel, saving }) {
  const [formData, setFormData] = useState(initialValues || emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialValues || emptyForm);
    setErrors({});
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = 'Title is required.';
    } else if (formData.title.trim().length > 120) {
      nextErrors.title = 'Title must be 120 characters or fewer.';
    }

    if (formData.description && formData.description.length > 1000) {
      nextErrors.description = 'Description must be 1000 characters or fewer.';
    }

    if (!['pending', 'completed'].includes(formData.status)) {
      nextErrors.status = 'Invalid status.';
    }

    if (!['low', 'medium', 'high'].includes(formData.priority)) {
      nextErrors.priority = 'Invalid priority.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description?.trim() || '',
      status: formData.status,
      priority: formData.priority,
    };

    const ok = await onSubmit(payload);

    if (!ok) {
      setErrors((current) => ({ ...current, submit: 'Unable to save task.' }));
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          maxLength={120}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <small className="error-text">{errors.title}</small>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Optional details"
          maxLength={1000}
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description && <small className="error-text">{errors.description}</small>}
      </div>

      <div className="two-col">
        <div className="field">
          <span>Status</span>
          <div className="radio-row">
            <label>
              <input
                type="radio"
                name="status"
                value="pending"
                checked={formData.status === 'pending'}
                onChange={handleChange}
              />
              Pending
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="completed"
                checked={formData.status === 'completed'}
                onChange={handleChange}
              />
              Completed
            </label>
          </div>
          {errors.status && <small className="error-text">{errors.status}</small>}
        </div>

        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <small className="error-text">{errors.priority}</small>}
        </div>
      </div>

      {errors.submit && <div className="form-error-banner">{errors.submit}</div>}

      <div className="modal-actions">
        <button type="button" className="secondary-button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="primary-button" disabled={saving}>
          {saving ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </form>
  );
}
