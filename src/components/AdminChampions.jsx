import React, { useState, useEffect } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, addDoc, setDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const AdminChampions = () => {
  const { i18n } = useTranslation();
  const [champions, setChampions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    weightLost: '',
    duration: '',
    image: null,
    existingImage: ''
  });

  const fetchChampions = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "champions"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChampions(data);
    } catch (err) {
      console.error('Failed to fetch champions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChampions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Selected file is not an image'));
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1000;
            const MAX_HEIGHT = 1000;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(dataUrl);
          } catch (e) {
            reject(e);
          }
        };
        img.onerror = (error) => {
          reject(new Error('Failed to load image'));
        };
        img.src = event.target.result;
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image && !formData.existingImage) {
      alert('Please select an image');
      return;
    }
    
    try {
      setLoading(true);
      let base64Image = formData.existingImage;
      
      if (formData.image) {
        base64Image = await compressImage(formData.image);
      }
      
      const championData = {
        name: formData.name,
        weightLost: formData.weightLost,
        duration: formData.duration,
        image: base64Image,
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        await setDoc(doc(db, "champions", editingId), championData, { merge: true });
        setEditingId(null);
      } else {
        championData.createdAt = new Date().toISOString();
        await addDoc(collection(db, "champions"), championData);
      }
      
      setFormData({ name: '', weightLost: '', duration: '', image: null, existingImage: '' });
      // Reset file input
      const fileInput = document.getElementById('championImageInput');
      if (fileInput) fileInput.value = '';
      
      fetchChampions();
    } catch (error) {
      console.error("Error saving champion", error);
      alert("Error saving champion");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (champ) => {
    setEditingId(champ.id);
    setFormData({
      name: champ.name,
      weightLost: champ.weightLost,
      duration: champ.duration,
      image: null,
      existingImage: champ.image
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm(i18n.language === 'ar' ? 'متأكد إنك عايز تمسح البطل ده؟' : 'Are you sure you want to delete this?')) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "champions", id));
        fetchChampions();
      } catch (error) {
        console.error("Error deleting", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm(i18n.language === 'ar' ? 'هل أنت متأكد من إضافة التحولات الافتراضية لقاعدة البيانات؟' : 'Are you sure you want to add default transformations to the database?')) return;
    
    setLoading(true);
    const defaultTransformations = [
      { 
        name: 'Mohammed Ali', 
        weightLost: '15kg', 
        duration: '3 Months', 
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
        createdAt: new Date().toISOString()
      },
      { 
        name: 'Omar Hassan', 
        weightLost: '20kg', 
        duration: '5 Months', 
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop',
        createdAt: new Date().toISOString()
      }
    ];

    try {
      for (const champ of defaultTransformations) {
        await addDoc(collection(db, "champions"), champ);
      }
      fetchChampions();
    } catch (error) {
      console.error("Error adding default transformations", error);
      alert("Error adding default transformations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-packages">
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="admin-card-title">{editingId ? (i18n.language === 'ar' ? 'تعديل التحول' : 'Edit Transformation') : (i18n.language === 'ar' ? 'إضافة تحول جديد' : 'Add New Transformation')}</h2>
          {editingId && (
            <button 
              type="button" 
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '', weightLost: '', duration: '', image: null, existingImage: '' });
                const fileInput = document.getElementById('championImageInput');
                if (fileInput) fileInput.value = '';
              }}
              style={{ padding: '0.4rem 1rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {i18n.language === 'ar' ? 'إلغاء التعديل' : 'Cancel Edit'}
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
          
          <div className="form-group">
            <label>{i18n.language === 'ar' ? 'الاسم' : 'Name'}</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} placeholder="Ahmed Ragab" />
          </div>

          <div className="form-group">
            <label>{i18n.language === 'ar' ? 'الوزن المفقود (مثلاً: 20kg)' : 'Weight Lost (e.g. 20kg)'}</label>
            <input type="text" name="weightLost" value={formData.weightLost} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} placeholder="20kg" />
          </div>

          <div className="form-group">
            <label>{i18n.language === 'ar' ? 'المدة (مثلاً: 3 Months)' : 'Duration (e.g. 3 Months)'}</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} placeholder="3 Months" />
          </div>

          <div className="form-group">
            <label>{i18n.language === 'ar' ? 'صورة التحول (قبل وبعد)' : 'Transformation Image'}</label>
            <input id="championImageInput" type="file" name="image" onChange={handleFileChange} accept="image/*" required={!editingId && !formData.existingImage} style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
            {editingId && formData.existingImage && (
              <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.5rem' }}>{i18n.language === 'ar' ? 'تم اختيار صورة مسبقاً. ارفع صورة جديدة لتغييرها.' : 'Image already exists. Upload a new one to replace.'}</p>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2rem' }} disabled={loading}>
              {loading ? (i18n.language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : editingId ? (i18n.language === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (i18n.language === 'ar' ? 'إضافة' : 'Add')}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="admin-card-title" style={{ marginBottom: 0 }}>{i18n.language === 'ar' ? 'الأبطال المتاحين' : 'Active Transformations'}</h2>
          <button 
            onClick={handleSeedDefaults} 
            style={{ padding: '0.6rem 1rem', background: '#f5a623', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {i18n.language === 'ar' ? 'استيراد التحولات الافتراضية' : 'Import Default Transformations'}
          </button>
        </div>
        {loading && champions.length === 0 ? (
          <p>{i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        ) : champions.length === 0 ? (
          <p className="text-muted">{i18n.language === 'ar' ? 'لا يوجد تحولات حالياً.' : 'No transformations found.'}</p>
        ) : (
          <>
            <div className="mobile-scroll-hint" style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem', textAlign: 'center' }}>
              {i18n.language === 'ar' ? 'اسحب الجدول لليمين أو اليسار لرؤية باقي التفاصيل ↔️' : 'Swipe table horizontally to see more ↔️'}
            </div>
            <div className="admin-table-container">
              <div className="admin-table-wrap">
                <table className="admin-table">
                <thead>
                  <tr>
                    <th>{i18n.language === 'ar' ? 'الصورة' : 'Image'}</th>
                    <th>{i18n.language === 'ar' ? 'الاسم' : 'Name'}</th>
                    <th>{i18n.language === 'ar' ? 'الوزن المفقود' : 'Weight Lost'}</th>
                    <th>{i18n.language === 'ar' ? 'المدة' : 'Duration'}</th>
                    <th>{i18n.language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {champions.map(champ => (
                    <tr key={champ.id}>
                      <td>
                        <img src={champ.image} alt={champ.name} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      </td>
                      <td>{champ.name}</td>
                      <td>{champ.weightLost}</td>
                      <td>{champ.duration}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-edit" onClick={() => handleEdit(champ)} title="Edit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                          <button className="btn-reject" onClick={() => handleDelete(champ.id)} title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminChampions;
