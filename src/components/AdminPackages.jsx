import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const AdminPackages = () => {
  const { i18n } = useTranslation();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    type: 'nutrition',
    title: '',
    duration: '',
    oldPrice: '',
    price: '',
    currency: 'EGP',
    save: '',
    bestValue: false,
    features: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "packages"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by price
      data.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      setPackages(data);
    } catch (err) {
      console.error('Failed to fetch packages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg.id);
    setFormData({
      ...pkg,
      features: Array.isArray(pkg.features) ? pkg.features.join('\n') : pkg.features
    });
    window.scrollTo(0, 0);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      type: 'nutrition', title: '', duration: '', oldPrice: '', price: '', currency: 'EGP', save: '', bestValue: false, features: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const featuresArray = formData.features.split('\n').filter(f => f.trim() !== '');
      const packageData = {
        ...formData,
        price: Number(formData.price),
        features: featuresArray
      };

      if (editingId) {
        await setDoc(doc(db, "packages", editingId), packageData);
      } else {
        await addDoc(collection(db, "packages"), packageData);
      }
      
      handleCancel();
      fetchPackages();
    } catch (error) {
      console.error("Error saving package", error);
      alert("Error saving package");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(i18n.language === 'ar' ? 'متأكد إنك عايز تمسح الباقة دي؟' : 'Are you sure you want to delete this package?')) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "packages", id));
        fetchPackages();
      } catch (error) {
        console.error("Error deleting package", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-packages">
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h2 className="admin-card-title">{editingId ? (i18n.language === 'ar' ? 'تعديل الباقة' : 'Edit Package') : (i18n.language === 'ar' ? 'إنشاء باقة جديدة' : 'Create New Package')}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-group">
            <label>{i18n.language === 'ar' ? 'نوع الباقة' : 'Package Type'}</label>
            <select name="type" value={formData.type} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}>
              <option value="nutrition">{i18n.language === 'ar' ? 'خطة دايت' : 'Nutrition Plan'}</option>
              <option value="training">{i18n.language === 'ar' ? 'خطة تمرين' : 'Training Plan'}</option>
              <option value="vip">{i18n.language === 'ar' ? 'خطة شاملة VIP' : 'VIP / Full Plan'}</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>{i18n.language === 'ar' ? 'عنوان الباقة (مثلاً: دايت)' : 'Title (e.g. NUTRITION PLAN)'}</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
          </div>

          <div className="form-group">
            <label>{i18n.language === 'ar' ? 'المدة (مثلاً: ٣٠ يوم)' : 'Duration (e.g. 30 DAYS)'}</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
          </div>

          <div className="form-group">
            <label>{i18n.language === 'ar' ? 'السعر كـ رقم (مثلاً: 500)' : 'Price (Number only)'}</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
          </div>

          <div className="form-group">
            <label>{i18n.language === 'ar' ? 'نص السعر القديم (اختياري، مثلاً: 1000 ج.م)' : 'Old Price Text (Optional, e.g. 500 EGP)'}</label>
            <input type="text" name="oldPrice" value={formData.oldPrice} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
          </div>

          <div className="form-group">
            <label>{i18n.language === 'ar' ? 'نص التخفيض (اختياري، مثلاً: وفر ٥٠٪)' : 'Save Badge Text (Optional, e.g. Save 50%)'}</label>
            <input type="text" name="save" value={formData.save} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>{i18n.language === 'ar' ? 'المميزات (كل ميزة في سطر منفصل)' : 'Features (One per line)'}</label>
            <textarea name="features" value={formData.features} onChange={handleChange} rows="5" required style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} placeholder={i18n.language === 'ar' ? "نظام دايت مخصص\nمتابعة يومية\nتعديل كل أسبوع" : "Customized diet plan\nDaily follow up\nWeekly adjustments"}></textarea>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="bestValue" id="bestValue" checked={formData.bestValue} onChange={handleChange} />
            <label htmlFor="bestValue" style={{ margin: 0 }}>{i18n.language === 'ar' ? 'أضف علامة "أفضل قيمة"' : 'Mark as "Best Value"'}</label>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2rem' }} disabled={loading}>
              {loading ? (i18n.language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (editingId ? (i18n.language === 'ar' ? 'تحديث الباقة' : 'Update Package') : (i18n.language === 'ar' ? 'إنشاء الباقة' : 'Create Package'))}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} style={{ padding: '0.8rem 2rem', background: 'transparent', color: '#fff', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}>
                {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">{i18n.language === 'ar' ? 'الباقات المتاحة' : 'Active Packages'}</h2>
        {loading && packages.length === 0 ? (
          <p>{i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        ) : packages.length === 0 ? (
          <p className="text-muted">{i18n.language === 'ar' ? 'مفيش باقات في قاعدة البيانات. الموقع حالياً بيعرض الباقات الافتراضية.' : 'No packages found in database. The website is using the hardcoded default packages.'}</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{i18n.language === 'ar' ? 'النوع' : 'Type'}</th>
                  <th>{i18n.language === 'ar' ? 'العنوان' : 'Title'}</th>
                  <th>{i18n.language === 'ar' ? 'المدة' : 'Duration'}</th>
                  <th>{i18n.language === 'ar' ? 'السعر' : 'Price'}</th>
                  <th>{i18n.language === 'ar' ? 'المميزات' : 'Features'}</th>
                  <th>{i18n.language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(pkg => (
                  <tr key={pkg.id}>
                    <td><span style={{textTransform: 'uppercase', fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px'}}>{pkg.type}</span></td>
                    <td>{pkg.title} {pkg.bestValue && <span style={{color: '#f5a623', fontSize:'0.8rem', marginLeft:'0.5rem'}}>★</span>}</td>
                    <td>{pkg.duration}</td>
                    <td>{pkg.price} {pkg.currency}</td>
                    <td>{pkg.features?.length || 0} items</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-approve" onClick={() => handleEdit(pkg)} title="Edit"><Edit2 size={16} /></button>
                        <button className="btn-reject" onClick={() => handleDelete(pkg.id)} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPackages;
