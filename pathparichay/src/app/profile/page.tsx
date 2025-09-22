'use client';

import { useState } from 'react';

type EducationStage = '10th' | '12th' | 'College';

export default function ProfilePage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('user@example.com'); // Autofilled email
  const [educationStage, setEducationStage] = useState<EducationStage>('10th');
  const [stream, setStream] = useState('');
  const [year, setYear] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile form submission
    console.log({
      fullName,
      email,
      educationStage,
      stream,
      year,
      collegeName,
      state,
      city,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Create Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              readOnly
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="educationStage" className="block text-sm font-medium">Education Stage</label>
            <select
              id="educationStage"
              value={educationStage}
              onChange={(e) => setEducationStage(e.target.value as EducationStage)}
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md"
            >
              <option value="10th">10th Grade</option>
              <option value="12th">12th Grade</option>
              <option value="College">College</option>
            </select>
          </div>
          {(educationStage === '12th' || educationStage === 'College') && (
            <div>
              <label htmlFor="stream" className="block text-sm font-medium">Stream</label>
              <input
                id="stream"
                type="text"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                placeholder="e.g., BTech, BE"
                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md"
              />
            </div>
          )}
          {educationStage === 'College' && (
            <>
              <div>
                <label htmlFor="collegeName" className="block text-sm font-medium">College Name</label>
                <input
                  id="collegeName"
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium">Year/Semester</label>
                <input
                  id="year"
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md"
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="state" className="block text-sm font-medium">State</label>
            <input
              id="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium">City</label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md"
            />
          </div>
          <button type="submit" className="w-full p-2 mt-4 bg-blue-600 rounded-md hover:bg-blue-700">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
