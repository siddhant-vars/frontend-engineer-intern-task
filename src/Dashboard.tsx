import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

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
    const term = search.toLowerCase().trim();
    if (!term) return usersData;

    return usersData.filter((user) =>
      //user.name.toLowerCase().includes(search.toLowerCase())
      user.name.toLowerCase() === `user ${term}`
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
    setSelectedUser((prev) => prev?.id === user.id ? null : user);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased p-4 md:p-8">
      {/* Main Container: Sets up a 3-column grid structure on medium screens and up */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {/* =========================================================
            SIDEBAR: Users List (Takes 1 column width on md+)
           ========================================================= */}
        <aside className="md:col-span-1 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[450px] md:h-[calc(100vh-4rem)] sticky top-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 tracking-tight">
            Users
          </h2>

          {/* Enhanced Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search user..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm placeholder-gray-400 transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Smooth Scrollable Container for User Items */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-200">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} onSelect={handleSelectUser} isSelected = {selectedUser?.id === user.id} />
            ))}
          </div>
        </aside>

        {/* =========================================================
            MAIN CONTENT: Dashboard & Cards (Takes 2 columns width on md+)
           ========================================================= */}
        <main className="md:col-span-2 space-y-6">
          {/* Dashboard Header Banner */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
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
            <section className="sm:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center group hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Counter
              </h3>
              <p className="text-5xl font-black text-gray-900 my-4 tracking-tight">
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
            <section className="sm:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between group hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                Selected Status
              </h3>

              {selectedUser ? (
                /* Clean Gray Box Highlighted Area for Selected User Profile */
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-3 transition-all duration-300">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-gray-400 w-14 uppercase text-[11px] tracking-wider">
                      Name:
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selectedUser.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-gray-400 w-14 uppercase text-[11px] tracking-wider">
                      Age:
                    </span>
                    <span className="font-medium text-gray-700 bg-gray-200/60 px-2 py-0.5 rounded text-xs">
                      {selectedUser.age} years old
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 my-auto">
                  <p className="text-sm text-gray-400 italic">
                    No active user selection
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Analytics Modular Component Container */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
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
  ({ user, onSelect, isSelected }: { user: User; onSelect: (user: User) => void; isSelected : boolean; }) => {
    return (
      <div
        onClick={() => onSelect(user)}
        className={`p-3 border rounded-lg cursor-pointer transition ${
          isSelected
          ? "bg-blue-50 border-blue-500"
          : "hover:bg-gray-100"
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
    <div className="border rounded-2xl p-5 shadow-sm">
      <h2 className="text-2xl font-bold mb-5">Analytics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-blue-100 bg-blue-50/40 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Users</p>

          <p className="text-2xl font-bold mt-2">{users.length}</p>
        </div>

        <div className="border border-emerald-100 bg-emerald-50/40 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Age Sum</p>

          <p className="text-2xl font-bold mt-2">{totalAge}</p>
        </div>
      </div>
    </div>
  );
});

Analytics.displayName = "Analytics";
