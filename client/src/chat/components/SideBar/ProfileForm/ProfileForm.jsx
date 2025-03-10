const ProfileForm = ({ formData, setFormData }) => {
    const handleInputChange = (key, value) => {
      setFormData(prev => ({ ...prev, [key]: value }));
    };
  
    return (
      <>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className='settings__input'>
            <div className='settings__input-value'>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </div>
            {key === 'description' ? (
              <textarea
                placeholder={`${key} (description)`}
                value={value}
                onChange={(e) => handleInputChange(key, e.target.value)}
                required
              />
            ) : (
              <input
                placeholder={key}
                type="text"
                value={value}
                onChange={(e) => handleInputChange(key, e.target.value)}
                required
              />
            )}
          </div>
        ))}
      </>
    );
  };

export default ProfileForm