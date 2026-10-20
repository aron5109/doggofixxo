'use client';
import { useState } from 'react';
import { ArrowRight, ArrowLeft, Heart, Check, Upload, PawPrint } from 'lucide-react';
import { categories, profileSchema, type Profile } from '@/lib/model';
import { DogArt, avatarNames } from './dog-art';
import { Button } from './ui/button';
export const newProfile = (): Profile => ({
  id: crypto.randomUUID(),
  name: '',
  breed: '',
  age: 2,
  weight: 10,
  unit: 'kg',
  sex: 'Unknown',
  neutered: 'Unknown',
  avatar: 0,
  concerns: ['Barking'],
});
export function ProfileFields({
  value,
  onChange,
}: {
  value: Profile;
  onChange: (value: Profile) => void;
}) {
  const [photoError, setPhotoError] = useState('');
  const patch = (update: Partial<Profile>) => onChange({ ...value, ...update });
  async function photo(file?: File) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10_000_000) {
      setPhotoError('Choose a JPG, PNG or WebP image under 10 MB.');
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 400 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      patch({ photo: canvas.toDataURL('image/jpeg', 0.8) });
      setPhotoError('');
    } catch {
      setPhotoError('That image could not be opened. Please choose another.');
    }
  }
  return (
    <>
      <div className="field-grid">
        <label>
          Dog’s name
          <input
            required
            maxLength={40}
            autoComplete="off"
            placeholder="e.g. Maple"
            value={value.name}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </label>
        <label>
          Breed or mixed breed
          <input
            required
            maxLength={80}
            placeholder="e.g. Golden mix"
            value={value.breed}
            onChange={(e) => patch({ breed: e.target.value })}
          />
        </label>
        <label>
          Age in years
          <input
            type="number"
            required
            min="0"
            max="30"
            step="0.1"
            value={value.age}
            onChange={(e) => patch({ age: Number(e.target.value) })}
          />
        </label>
        <div className="weight-field">
          <label>
            Weight
            <input
              type="number"
              required
              min="0.1"
              max="300"
              step="0.1"
              value={value.weight}
              onChange={(e) => patch({ weight: Number(e.target.value) })}
            />
          </label>
          <label>
            Unit
            <select
              value={value.unit}
              onChange={(e) => patch({ unit: e.target.value as Profile['unit'] })}
            >
              <option>kg</option>
              <option>lb</option>
            </select>
          </label>
        </div>
        <label>
          Sex
          <select
            value={value.sex}
            onChange={(e) => patch({ sex: e.target.value as Profile['sex'] })}
          >
            <option>Unknown</option>
            <option>Female</option>
            <option>Male</option>
          </select>
        </label>
        <label>
          Neutered / spayed (optional)
          <select
            value={value.neutered}
            onChange={(e) => patch({ neutered: e.target.value as Profile['neutered'] })}
          >
            <option>Unknown</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Pick your pup’s look</legend>
        <div className="avatar-grid">
          {avatarNames.map((name, i) => (
            <button
              type="button"
              key={name}
              className={`avatar-choice ${value.avatar === i ? 'selected' : ''}`}
              aria-label={name}
              aria-pressed={value.avatar === i}
              onClick={() => patch({ avatar: i })}
            >
              <DogArt avatar={i} decorative />
              {value.avatar === i && <Check size={14} />}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="upload">
        <Upload size={18} />{' '}
        {value.photo ? 'Photo added · choose another' : 'Add a photo (optional)'}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => void photo(e.target.files?.[0])}
        />
      </label>
      {value.photo && (
        <div className="row">
          <span>Photo will appear on your profile.</span>
          <Button
            type="button"
            variant="ghost"
            size="small"
            onClick={() => patch({ photo: undefined })}
          >
            Remove photo
          </Button>
        </div>
      )}
      {photoError && (
        <p role="alert" className="error-text">
          {photoError}
        </p>
      )}
    </>
  );
}
export function ConcernFields({
  value,
  onChange,
}: {
  value: Profile;
  onChange: (value: Profile) => void;
}) {
  return (
    <fieldset>
      <legend>What would you like a little help with?</legend>
      <p className="muted">Choose any that fit. You can change these later.</p>
      <div className="concern-grid">
        {categories.map((category, i) => (
          <button
            type="button"
            className={`concern ${value.concerns.includes(category) ? 'selected' : ''}`}
            key={category}
            aria-pressed={value.concerns.includes(category)}
            onClick={() =>
              onChange({
                ...value,
                concerns: value.concerns.includes(category)
                  ? value.concerns.filter((c) => c !== category)
                  : [...value.concerns, category],
              })
            }
          >
            <span className="concern-emoji">{['🔔', '🏡', '🦴', '🌿', '🫧'][i]}</span>
            {category}
            <span className="check-circle">
              {value.concerns.includes(category) && <Check size={15} />}
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
export function Onboarding({
  onConfirm,
  onCancel,
}: {
  onConfirm: (profile: Profile) => void;
  onCancel?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>(newProfile);
  const [error, setError] = useState('');
  function reset() {
    setProfile(newProfile());
    setStep(0);
    setError('');
  }
  return (
    <main id="main" className="welcome">
      <div className="welcome-brand">
        <PawPrint size={28} fill="currentColor" /> mellowoof
        <span>Little steps. Happier tails.</span>
      </div>
      <section className={`onboarding-card ${step === 0 || step === 3 ? 'centered' : ''}`}>
        {step > 0 && (
          <div className="onboarding-top">
            <Button variant="ghost" size="small" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={17} /> Back
            </Button>
            <span className="eyebrow">STEP {step} OF 3</span>
          </div>
        )}
        {step === 0 && (
          <>
            <div className="welcome-art">
              <span className="floating-heart">♡</span>
              <DogArt avatar={0} mood="worried" />
              <span className="sparkle">✧</span>
            </div>
            <span className="eyebrow">A LITTLE CARE GOES A LONG WAY</span>
            <h1>Is your dog feeling okay?</h1>
            <p className="intro-copy">
              Let’s make everyday life a little calmer,
              <br />
              one tiny step at a time.
            </p>
            <Button onClick={() => setStep(1)}>
              Let’s find out <ArrowRight size={19} />
            </Button>
            <p className="small muted">Kind training. Real connection. Happier tails.</p>
            {onCancel && (
              <Button variant="ghost" onClick={onCancel}>
                Back to my dogs
              </Button>
            )}
          </>
        )}
        {step === 1 && (
          <>
            <h1>First, meet your little friend.</h1>
            <p className="muted">Every dog has their own wonderful story.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
            >
              <ProfileFields value={profile} onChange={setProfile} />
              <Button type="submit" className="full">
                Continue <ArrowRight size={18} />
              </Button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h1>Little worries. Gentle steps.</h1>
            <ConcernFields value={profile} onChange={setProfile} />
            <Button className="full" disabled={!profile.concerns.length} onClick={() => setStep(3)}>
              Find our path <ArrowRight size={18} />
            </Button>
          </>
        )}
        {step === 3 && (
          <>
            <DogArt avatar={profile.avatar} className="confirmation-dog" />
            <span className="eyebrow">YOUR NEXT CHAPTER, TOGETHER</span>
            <h1>Ready to help {profile.name} feel happier?</h1>
            <p className="intro-copy">
              No perfect pups. No perfect people.
              <br />
              Just small steps in the right direction.
            </p>
            <Button
              className="full"
              onClick={() => {
                const result = profileSchema.safeParse(profile);
                if (result.success) onConfirm(result.data);
                else setError('Please go back and check your dog’s details.');
              }}
            >
              <Heart size={18} /> Yes, let’s do this!
            </Button>
            <Button className="full" variant="ghost" onClick={reset}>
              Not right now
            </Button>
            {error && <p role="alert">{error}</p>}
          </>
        )}
      </section>
      <p className="welcome-footer">
        Made for the love of dogs <Heart size={14} />
      </p>
    </main>
  );
}
