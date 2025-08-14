import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemoStorage } from '../hooks/useMemoStorage';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { MemoType } from '../types';
import TemplateSelector from '../components/TemplateSelector';
import { Template } from '../utils/templates';

function NewMemo() {
  const navigate = useNavigate();
  const { addMemo } = useMemoStorage();
  const [isSaving, setIsSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  
  // キーボードナビゲーションを有効化
  useKeyboardNavigation();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    images: [] as string[],
    type: 'memo' as MemoType,
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-focus title input
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Add shake animation to form on validation error
      const form = e.currentTarget as HTMLFormElement;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      return;
    }

    setIsSaving(true);
    
    const memoData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags: formData.tags,
      images: formData.images,
      type: formData.type,
    };

    try {
      addMemo(memoData);
      
      // Success animation before navigation
      const form = e.currentTarget as HTMLFormElement;
      form.classList.add('bounce-in');
      
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 200);
    } catch (error) {
      console.error('Failed to save memo:', error);
      setErrors({ submit: 'メモの保存に失敗しました' });
      setIsSaving(false);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, result]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const applyTemplate = (template: Template) => {
    setFormData(prev => ({
      ...prev,
      content: template.content
    }));
  };

  return (
    <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          margin: '0 0 0.5rem 0',
          color: 'var(--text-primary)'
        }}>
          新規メモ作成
        </h1>
        <p className="text-secondary" style={{ margin: 0 }}>
          アイデアや思考を記録しましょう
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card slide-in-right" style={{ 
        padding: '2rem',
        animationDelay: '0.2s'
      }}>
        {/* Type Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            タイプ *
          </label>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            {(['memo', 'note', 'wiki'] as MemoType[]).map((type) => (
              <label
                key={type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  border: `2px solid ${formData.type === type ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: '8px',
                  backgroundColor: formData.type === type ? 'var(--primary-light)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '80px',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (formData.type !== type) {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.type !== type) {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={formData.type === type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MemoType }))}
                  style={{ display: 'none' }}
                />
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: type === 'memo' ? '#3B82F6' : type === 'note' ? '#10B981' : '#F59E0B'
                }}></div>
                <span style={{
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  textTransform: 'capitalize'
                }}>
                  {type === 'memo' ? 'メモ' : type === 'note' ? 'ノート' : 'Wiki'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            タイトル *
          </label>
          <input
            ref={titleRef}
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={`input ${errors.title ? 'shake' : ''}`}
            placeholder="メモのタイトルを入力"
            style={{
              borderColor: errors.title ? 'var(--error)' : undefined
            }}
            maxLength={100}
          />
          {errors.title && (
            <div style={{
              color: 'var(--error)',
              fontSize: '0.875rem',
              marginTop: '0.25rem'
            }}>
              {errors.title}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            内容
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="input textarea"
            placeholder="詳細な内容を入力（任意）"
            rows={8}
            maxLength={5000}
          />
          <div style={{
            textAlign: 'right',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.25rem'
          }}>
            {formData.content.length}/5000
          </div>

          {/* Template Selector for Note/Wiki */}
          {(formData.type === 'note' || formData.type === 'wiki') && (
            <div style={{ marginTop: '1rem' }}>
              <TemplateSelector 
                type={formData.type}
                onApplyTemplate={applyTemplate}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            タグ
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            className="input"
            placeholder="タグを入力してEnterキーで追加"
          />
          {formData.tags.length > 0 && (
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '0.75rem'
            }}>
              {formData.tags.map((tag, index) => (
                <div 
                  key={tag}
                  className="tag bounce-in"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'currentColor',
                      cursor: 'pointer',
                      padding: '0',
                      fontSize: '1rem',
                      lineHeight: 1,
                      opacity: 0.7,
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.7';
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            画像
          </label>
          
          <div style={{
            border: '2px dashed var(--border)',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center',
            background: 'var(--background)',
            transition: 'all 0.2s ease'
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.background = 'var(--primary-light)';
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.background = 'var(--background)';
          }}
          >
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="image-upload"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span style={{ fontSize: '0.875rem' }}>
                クリックまたはドラッグして画像をアップロード
              </span>
            </label>
          </div>

          {formData.images.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="bounce-in"
                  style={{
                    position: 'relative',
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '1px solid var(--border)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--error)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      lineHeight: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div style={{
            color: 'var(--error)',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {errors.submit}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border)'
        }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            disabled={isSaving}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSaving}
            style={{
              minWidth: '120px',
              position: 'relative'
            }}
          >
            {isSaving ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <div className="spinner" style={{
                  width: '16px',
                  height: '16px',
                  borderWidth: '2px'
                }}></div>
                保存中...
              </div>
            ) : (
              '作成する'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewMemo;