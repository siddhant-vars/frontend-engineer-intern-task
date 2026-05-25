import { useEffect, useMemo, useState } from "react";

const usersData = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  age: 18 + (i % 40),
}));

export default function Dashboard() {
  const [users, setUsers] = useState(usersData);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const increment = () => {
    setTimeout(() => {
      setCount(count + 1);
    }, 1000);
  };

  const filteredUsers = users.filter((user) => {
    console.log("Filtering...");
    return user.name.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
      console.log(window.innerWidth);
    });
  }, []);

  return (
    <div className="p-10">
      <div className="flex gap-10 border p-6">
        {/* Sidebar */}
        <div className="w-[300px] border-r pr-6">
          <h2 className="text-2xl font-bold mb-4">Users</h2>

          <input
            type="text"
            placeholder="Search user..."
            className="border p-2 w-full mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="h-[500px] overflow-y-scroll">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="p-2 border mb-2 cursor-pointer hover:bg-gray-100"
              >
                {user.name}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

          <div className="flex gap-6">
            <div className="border p-6 w-[250px]">
              <h3 className="text-lg font-semibold">Counter</h3>

              <p className="text-3xl mt-4">{count}</p>

              <button
                onClick={increment}
                className="bg-black text-white px-4 py-2 mt-4"
              >
                Increment
              </button>
            </div>

            <div className="border p-6 flex-1">
              <h3 className="text-lg font-semibold mb-4">Selected User</h3>

              {selectedUser ? (
                <div>
                  <p>Name: {selectedUser.name}</p>
                  <p>Age: {selectedUser.age}</p>
                </div>
              ) : (
                <p>No user selected</p>
              )}
            </div>
          </div>

          <div className="mt-10">
            <Component users={filteredUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Component({ users }: any) {
  console.log("Heavy component rerendered");

  const totalAge = users.reduce((acc: number, user: any) => acc + user.age, 0);

  return (
    <div className="border p-6">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>

      <p>Total Users: {users.length}</p>
      <p>Total Age Sum: {totalAge}</p>
    </div>
  );
}
