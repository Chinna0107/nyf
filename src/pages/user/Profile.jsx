import React from 'react';

const Profile = () => {
  const userName = localStorage.getItem('userName') || 'User';
  const firstName = localStorage.getItem('userFirstName') || userName;
  const lastName = localStorage.getItem('userLastName') || '';
  const userEmail = localStorage.getItem('userEmail') || 'Not available';
  const role = localStorage.getItem('userRole') || 'user';
  const initial = userName.trim().charAt(0).toUpperCase() || 'U';

  return (
    <main className="min-h-screen bg-[#fbfbfc] px-4 py-14 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37]">Account</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#0c0c0e]">Profile</h1>
          <p className="mt-2 text-sm text-gray-500">Manage the details connected to your NYF TOTH account.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-[#0c0c0e] text-4xl font-bold text-[#d4af37]">
                {initial}
              </div>
              <h2 className="mt-5 text-2xl font-bold text-[#0c0c0e]">{userName}</h2>
              <p className="mt-1 text-sm text-gray-500">{userEmail}</p>
              <span className="mt-5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8a6a12]">
                {role}
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#0c0c0e]">Personal Details</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ['First Name', firstName],
                ['Last Name', lastName || 'Not available'],
                ['Email', userEmail],
                ['Account Type', role],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-[#fbfbfc] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#0c0c0e]">{value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Profile;
