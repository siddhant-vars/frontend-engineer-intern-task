import { memo, useCallback, useEffect, useMemo, useState } from "react";

type User = {
  id: number;
  name: string;
  age: number;
};

/**
 * Static data does not need to live inside state
 * because we are not mutating/updating users.
 */
const usersData: User[] = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  age: 18 + (i % 40),
}));

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  /**
   * Fix:
   * Avoid stale closure issue inside setTimeout.
   *
   * Previous issue:
   * Multiple rapid clicks captured old count value.
   *
   * Solution:
   * Functional state update always receives latest state.
   */
  const increment = useCallback(() => {
    setTimeout(() => {
      setCount((prev) => prev + 1);
    }, 1000);
  }, []);

  /**
   * Fix:
   * Expensive filtering should not run on every render.
   *
   * Now filtering only recalculates when search changes.
   */
  const filteredUsers = useMemo(() => {
    console.log("Filtering users...");

    return usersData.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  /**
   * Fix:
   * Proper cleanup for event listeners to avoid memory leaks.
   */
  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /**
   * Fix:
   * Stable function reference to reduce unnecessary rerenders.
   */
  const handleSelectUser = useCallback((user: User) => {
    setSelectedUser((prev) => (prev?.id === user.id ? null : user));
  }, []);

  return (
    <div className="min-h-screen bg-[#eae6f3] text-gray-800 font-sans antialiased p-4 md:p-8">
      {/* Main Container */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {/* SIDEBAR: Users List */}
        <aside className="md:col-span-1 bg-[#0f3d59]/40 p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-112.5 md:h-[calc(100vh-4rem)] md:sticky md:top-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 tracking-tight">
            Users
          </h2>

          {/* Enhanced Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search user..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Smooth Scrollable Container for User Items */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onSelect={handleSelectUser}
                  isSelected={selectedUser?.id === user.id}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-sm font-medium text-gray-700">
                  No users found
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Try searching with another name
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT: Dashboard & Cards */}
        <main className="md:col-span-2 space-y-6">
          {/* Dashboard Header Banner */}
          <div className=" p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage and view system overview data
              </p>
            </div>
          </div>

          {/* Stats & Actions Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {/* Counter Card Component */}
            <section className="sm:col-span-2 bg-linear-to-br from-[#ffd3b6] to-[#ffa384] p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center group hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-black">
                Counter
              </h3>
              <p className="text-6xl font-black bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent my-4">
                {count}
              </p>
              <button
                onClick={increment}
                className="w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium rounded-xl shadow-sm shadow-blue-500/10 transition-all duration-150"
              >
                Increment
              </button>
            </section>

            {/* Selected User Overview Card */}
            <section className="sm:col-span-3 bg-[#c2b6da] p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between group hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4c3a6f] mb-4">
                Selected Status
              </h3>

              {selectedUser ? (
                <div className="bg-[#decff5] border-[#4c3a6f] text-[#4c3a6f] p-4 rounded-xl space-y-3 transition-all duration-300">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-semibold  w-14 uppercase text-[11px] tracking-wider">
                      Name:
                    </span>
                    <span className="font-semibold ">{selectedUser.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-semibold  w-14 uppercase text-[11px] tracking-wider">
                      Age:
                    </span>
                    <span className="font-medium bg-gray-200/60 px-2 py-0.5 rounded text-xs">
                      {selectedUser.age} years old
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-[#2b1f45]">
                    No active user selection
                  </p>
                  <p className="text-xs text-[#65538e] mt-1">
                    Click any user to view details
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Analytics Modular Component Container */}
          <div className="bg-linear-to-t from-sky-500 to-indigo-500 p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Analytics & Metrics
            </h3>
            <Analytics users={filteredUsers} />
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * Memoized card component.
 *
 * Prevents unnecessary rerenders
 * when parent rerenders.
 */
const UserCard = memo(
  ({
    user,
    onSelect,
    isSelected,
  }: {
    user: User;
    onSelect: (user: User) => void;
    isSelected: boolean;
  }) => {
    return (
      <div
        onClick={() => onSelect(user)}
        className={`p-3 rounded-xl cursor-pointer border transition-all duration-200 backdrop-blur-xs ${
          isSelected
            ? "bg-slate-400 text-white border-black shadow-md scale-[1.01]"
            : "bg-white/40 border-white/20 hover:bg-white/70 hover:shadow-sm"
        }`}
      >
        <p className="text-sm sm:text-base font-medium">{user.name}</p>
      </div>
    );
  }
);

UserCard.displayName = "UserCard";

/**
 * Heavy analytics component.
 *
 * Memoized to avoid rerendering
 * unless users prop changes.
 */
const Analytics = memo(({ users }: { users: User[] }) => {
  console.log("Analytics rerendered");

  /**
   * Expensive computation memoized.
   */
  const totalAge = useMemo(() => {
    return users.reduce((acc, user) => acc + user.age, 0);
  }, [users]);

  return (
    <div className="border rounded-2xl p-5 shadow-sm bg-[#0f3d59]/40 border-black/10">
      <h2 className="text-2xl font-bold mb-5 text-white">Analytics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-blue-100 bg-[#E2E8F0] rounded-xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02] cursor-pointer">
          <p className="text-sm text-[#1b4d4a]">Total Users</p>

          <p className="text-2xl font-bold mt-2">{users.length}</p>
        </div>

        <div className="border border-emerald-100 bg-linear-to-br from-[#ffcd94] to-[#ea7349] rounded-xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02] cursor-pointer">
          <p className="text-sm text-[#5c1d06]">Total Age Sum</p>

          <p className="text-2xl font-bold mt-2">{totalAge}</p>
        </div>
      </div>
    </div>
  );
});

Analytics.displayName = "Analytics";
