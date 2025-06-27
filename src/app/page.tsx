'use client';

import React, { useEffect, useState } from 'react';

// --- UserCard Component ---
type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  department: string;
  image: string;
  rating: number;
};

type UserCardProps = {
  user: User;
};

const UserCard: React.FC<UserCardProps> = ({ user }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg">
    <img
      src={user.image}
      alt={user.firstName}
      className="w-20 h-20 rounded-full mb-3 border-4 border-blue-200 dark:border-blue-900 object-cover"
    />
    <h2 className="font-bold text-lg mb-1 text-center">
      {user.firstName} {user.lastName}
    </h2>
    <p className="text-gray-500 text-sm mb-1">{user.email}</p>
    <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
      Age: {user.age}
    </p>
    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 mb-2">
      {user.department}
    </span>
    <div className="flex items-center mb-3">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < user.rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
    <div className="flex gap-2 mt-auto">
      <button className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition">View</button>
      <button className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition">Bookmark</button>
      <button className="bg-purple-500 text-white px-4 py-1 rounded-lg hover:bg-purple-600 transition">Promote</button>
    </div>
  </div>
);

// --- Main Page Component ---
const departments = ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance', 'Support'];

function getRandomDepartment() {
  return departments[Math.floor(Math.random() * departments.length)];
}

function getRandomRating() {
  return Math.floor(Math.random() * 5) + 1;
}

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  useEffect(() => {
    fetch('https://dummyjson.com/users?limit=20')
      .then(res => res.json())
      .then(data => {
        const usersWithExtras = data.users.map((user: any) => ({
          ...user,
          department: getRandomDepartment(),
          rating: getRandomRating(),
        }));
        setUsers(usersWithExtras);
        setLoading(false);
      });
  }, []);

  const toggleDepartment = (dep: string) => {
    setSelectedDepartments(prev =>
      prev.includes(dep) ? prev.filter(d => d !== dep) : [...prev, dep]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.department.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      selectedDepartments.length === 0 || selectedDepartments.includes(user.department);

    const matchesRating =
      selectedRatings.length === 0 || selectedRatings.includes(user.rating);

    return matchesSearch && matchesDepartment && matchesRating;
  });

  if (loading) return <div className="text-center mt-10 text-white">Loading users...</div>;

  return (
    <main className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Employee Performance Dashboard
      </h1>

      {/* Search */}
      <div className="mb-6 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search by name, email, or department"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {/* Department Filter */}
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-600">
          <h2 className="text-white font-semibold mb-3">Filter by Department</h2>
          <div className="flex flex-wrap gap-2">
            {departments.map(dep => (
              <button
                key={dep}
                onClick={() => toggleDepartment(dep)}
                className={`px-4 py-2 rounded-md transition ${
                  selectedDepartments.includes(dep)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {dep}
              </button>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-600">
          <h2 className="text-white font-semibold mb-3">Filter by Rating</h2>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onClick={() => toggleRating(rating)}
                className={`w-10 h-10 rounded-md text-white font-semibold transition ${
                  selectedRatings.includes(rating)
                    ? 'bg-blue-500'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </main>
  );
}
