import { useEffect, useState } from 'react';
// eslint-disable-next-line
import { motion } from 'framer-motion';
import { Upload, Loader, Save } from 'lucide-react';
import { useUserManagementStore } from '../stores/useUserManagementStore';

const UserSetting = () => {
  const { fetchUserProfile, updateUserProfile, userProfile, loading } =
    useUserManagementStore();

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    sex: '',
    dob: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
    },
    image: '',
  });

  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const loadProfile = async () => await fetchUserProfile();
    loadProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.name || '',
        phone: userProfile.phone?.replace('+234', '') || '',
        sex: userProfile.sex || '',
        dob: userProfile.dob || '',
        image: userProfile.image || '',
        billingAddress: {
          street: userProfile.billingAddress?.street || '',
          city: userProfile.billingAddress?.city || '',
          state: userProfile.billingAddress?.state || '',
          country: userProfile.billingAddress?.country || '',
          postal_code: userProfile.billingAddress?.postal_code || '',
        },
      });
    }
  }, [userProfile]);

  const handlePhoneChange = (value) => {
    const regex = /^[0-9]{0,10}$/;
    if (regex.test(value)) {
      setProfile((prev) => ({ ...prev, phone: value }));
      setPhoneError('');
    } else {
      setPhoneError('Enter a valid 10-digit Nigerian phone number.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBillingChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (profile.phone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits after +234');
      return;
    }
    const fullPhone = '+234' + profile.phone;
    await updateUserProfile({ ...profile, phone: fullPhone });
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Avatar Preview */}
      {profile.image ? (
        <div className="flex justify-center mb-4">
          <img
            src={profile.image}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-lg"
          />
        </div>
      ) : (
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm border-4 border-gray-500 shadow-lg">
            No Image
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-6 text-emerald-300 text-center">
        User Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-white mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Full Name"
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-white mb-1">
            Phone Number
          </label>
          <div className="flex items-center gap-2">
            <span className="text-white">+234</span>
            <input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="8012345678"
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
              required
            />
          </div>
          {phoneError && (
            <p className="text-red-400 text-sm mt-1">{phoneError}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="sex" className="block text-white mb-1">
            Gender
          </label>
          <select
            id="sex"
            value={profile.sex}
            onChange={(e) => setProfile({ ...profile, sex: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob" className="block text-white mb-1">
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            value={profile.dob ? profile.dob.split('T')[0] : ''}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
            required
          />
        </div>

        {/* Billing Address */}
        <fieldset className="space-y-2 border border-gray-600 rounded-md p-4">
          <legend className="text-sm text-gray-300 mb-2">
            Billing Address
          </legend>

          <div>
            <label htmlFor="street" className="block text-white mb-1">
              Street
            </label>
            <input
              id="street"
              type="text"
              placeholder="Street"
              value={profile.billingAddress.street}
              onChange={(e) => handleBillingChange('street', e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-white mb-1">
              City
            </label>
            <input
              id="city"
              type="text"
              placeholder="City"
              value={profile.billingAddress.city}
              onChange={(e) => handleBillingChange('city', e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-white mb-1">
              State
            </label>
            <input
              id="state"
              type="text"
              placeholder="State"
              value={profile.billingAddress.state}
              onChange={(e) => handleBillingChange('state', e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-white mb-1">
              Country
            </label>
            <input
              id="country"
              type="text"
              placeholder="Country"
              value={profile.billingAddress.country}
              onChange={(e) => handleBillingChange('country', e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="postal_code" className="block text-white mb-1">
              Postal Code
            </label>
            <input
              id="postal_code"
              type="text"
              placeholder="Postal Code"
              value={profile.billingAddress.postal_code}
              onChange={(e) =>
                handleBillingChange('postal_code', e.target.value)
              }
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
            />
          </div>
        </fieldset>

        {/* Upload Image */}
        <div className="flex items-center gap-4">
          <input
            type="file"
            id="imageUpload"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="imageUpload"
            className="cursor-pointer bg-gray-700 py-2 px-3 rounded-md text-sm text-gray-300 hover:bg-gray-600 flex items-center"
          >
            <Upload className="inline w-5 h-5 mr-1" />
            Upload Image
          </label>
          {profile.image && (
            <span className="text-sm text-gray-400">Image selected</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center items-center py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default UserSetting;
