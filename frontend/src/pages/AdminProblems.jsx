import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { problemsAPI } from '../api/services.js';

const emptyForm = {
  title: '',
  description: '',
  constraints: '',
  inputFormat: '',
  outputFormat: '',
  sampleInput: '',
  sampleOutput: '',
  difficulty: 'Easy',
  tags: '',
  hiddenTestCases: [{ input: '', output: '' }],
};

export default function AdminProblems() {
  const [problems, setProblems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    problemsAPI
      .getAll()
      .then(({ data }) => setProblems(data.problems))
      .catch(() => toast.error('Failed to load problems'))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleTestCase = (i, field, value) => {
    const cases = [...form.hiddenTestCases];
    cases[i] = { ...cases[i], [field]: value };
    setForm((f) => ({ ...f, hiddenTestCases: cases }));
  };

  const addTestCase = () => {
    setForm((f) => ({ ...f, hiddenTestCases: [...f.hiddenTestCases, { input: '', output: '' }] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await problemsAPI.update(editingId, payload);
        toast.success('Problem updated');
      } else {
        await problemsAPI.create(payload);
        toast.success('Problem created');
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data } = await problemsAPI.getById(id);
      const p = data.problem;
      setEditingId(id);
      setForm({
        title: p.title,
        description: p.description,
        constraints: p.constraints || '',
        inputFormat: p.inputFormat || '',
        outputFormat: p.outputFormat || '',
        sampleInput: p.sampleInput || '',
        sampleOutput: p.sampleOutput || '',
        difficulty: p.difficulty,
        tags: (p.tags || []).join(', '),
        hiddenTestCases: p.hiddenTestCases?.length ? p.hiddenTestCases : [{ input: '', output: '' }],
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      toast.error('Failed to load problem for editing');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this problem?')) return;
    try {
      await problemsAPI.delete(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Admin — Manage Problems</h1>
        <p className="text-gray-400 text-sm">{editingId ? 'Editing problem' : 'Create a new problem'}</p>
      </header>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4 mb-8 max-w-3xl">
        <input name="title" placeholder="Title" className="input-field" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="input-field min-h-[120px]" value={form.description} onChange={handleChange} required />
        <textarea name="constraints" placeholder="Constraints" className="input-field" value={form.constraints} onChange={handleChange} />
        <textarea name="inputFormat" placeholder="Input format" className="input-field" value={form.inputFormat} onChange={handleChange} />
        <textarea name="outputFormat" placeholder="Output format" className="input-field" value={form.outputFormat} onChange={handleChange} />
        <textarea name="sampleInput" placeholder="Sample input" className="input-field font-mono text-sm" value={form.sampleInput} onChange={handleChange} />
        <textarea name="sampleOutput" placeholder="Sample output" className="input-field font-mono text-sm" value={form.sampleOutput} onChange={handleChange} />
        <select name="difficulty" className="input-field" value={form.difficulty} onChange={handleChange}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <input name="tags" placeholder="Tags (comma separated)" className="input-field" value={form.tags} onChange={handleChange} />

        <fieldset>
          <legend className="text-sm text-cyan-400 mb-2">Hidden test cases</legend>
          {form.hiddenTestCases.map((tc, i) => (
            <div key={i} className="grid sm:grid-cols-2 gap-2 mb-2">
              <textarea placeholder="Input" className="input-field font-mono text-xs" value={tc.input} onChange={(e) => handleTestCase(i, 'input', e.target.value)} />
              <textarea placeholder="Output" className="input-field font-mono text-xs" value={tc.output} onChange={(e) => handleTestCase(i, 'output', e.target.value)} />
            </div>
          ))}
          <button type="button" onClick={addTestCase} className="text-sm text-cyan-400">
            + Add test case
          </button>
        </fieldset>

        <button type="submit" disabled={saving} className="gradient-btn">
          {saving ? 'Saving...' : editingId ? 'Update Problem' : 'Create Problem'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
            className="ml-3 text-sm text-gray-400"
          >
            Cancel edit
          </button>
        )}
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="glass-card p-4">
          <h2 className="font-semibold mb-4">Existing problems</h2>
          <ul className="space-y-2">
            {problems.map((p) => (
              <li key={p._id} className="flex flex-wrap justify-between items-center gap-2 py-2 border-b border-white/5">
                <span>
                  {p.title} <span className="text-gray-500 text-xs">({p.difficulty})</span>
                </span>
                <span className="flex gap-2">
                  <button onClick={() => handleEdit(p._id)} className="text-sm text-cyan-400">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="text-sm text-red-400">
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
          {problems.length === 0 && (
            <p className="text-gray-500 text-sm py-4">No problems yet. Create one above.</p>
          )}
        </section>
      )}
    </>
  );
}
